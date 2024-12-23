package br.uff.graduatesapi.controller

import br.uff.graduatesapi.Utils
import br.uff.graduatesapi.dto.CreateEmailDTO
import br.uff.graduatesapi.dto.EmailSendDTO
import br.uff.graduatesapi.dto.EmailsSendDTO
import br.uff.graduatesapi.dto.UpdateEmailDTO
import br.uff.graduatesapi.entity.EmailFilters
import br.uff.graduatesapi.enum.RoleEnum
import br.uff.graduatesapi.error.ResponseResult
import br.uff.graduatesapi.error.toResponseEntity
import br.uff.graduatesapi.service.EmailSenderService
import br.uff.graduatesapi.service.EmailService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("api/v1")
class EmailController(
	private val emailService: EmailService,
	private val emailSenderService: EmailSenderService,
) {
	@PreAuthorize("isAuthenticated()")
	@PostMapping("/email/send")
	fun sendSimpleEmail(
		@RequestBody request: EmailSendDTO
	): ResponseEntity<Any> {
		val (subject, targetEmail, emailContentId) = request
		if (subject == null || targetEmail == null) {
			return ResponseEntity.unprocessableEntity().build()
		}
		emailSenderService.sendEmailHtmlTemplate(
			subject = subject,
			targetEmail = targetEmail,
			emailContentId = emailContentId
		)
		return ResponseEntity.noContent().build()
	}

	@PreAuthorize("isAuthenticated()")
	@PostMapping("/emails/send")
	fun sendEmails(
		@RequestBody request: EmailsSendDTO
	): ResponseEntity<Any> {
		val (usersId, emailContentId, sendToPendingHistories) = request
		if (usersId.isEmpty() && !sendToPendingHistories) {
			return ResponseEntity.unprocessableEntity().build()
		}
		return when (val result = emailSenderService.sendEmailsHtmlTemplate(
			userIds = usersId,
			emailContentId = emailContentId,
			sendToPendingHistories = sendToPendingHistories
		)) {
			is ResponseResult.Success -> ResponseEntity.noContent().build()
			is ResponseResult.Error -> result.toResponseEntity()
		}
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping("emails")
	fun getEmails(
		@RequestParam(value = "name", required = false) name: String?,
		@RequestParam(value = "userRole", required = false) userRole: RoleEnum?,
		@RequestParam(value = "page", required = false, defaultValue = "0") page: Int,
		@RequestParam(value = "pageSize", required = false, defaultValue = "10") pageSize: Int,

		): ResponseEntity<Any> {
		val filters = EmailFilters(name = name, userRole = userRole)
		val pageSetting = Utils.convertPagination(page, pageSize)
		return when (val result = this.emailService.findAll(filters, pageSetting)) {
			is ResponseResult.Success -> ResponseEntity.ok(result.data)
			is ResponseResult.Error -> result.toResponseEntity()
		}
	}

	@PreAuthorize("isAuthenticated()")
	@DeleteMapping("email/{id}")
	@ResponseBody
	fun deleteEmail(@PathVariable id: UUID): ResponseEntity<Any> =
		when (val result = this.emailService.deleteEmail(id)) {
			is ResponseResult.Success -> ResponseEntity.noContent().build()
			is ResponseResult.Error -> result.toResponseEntity()
		}

	@PreAuthorize("isAuthenticated()")
	@GetMapping("email/{id}")
	fun getEmail(@PathVariable id: UUID): ResponseEntity<Any> =
		when (val result = this.emailService.findEmail(id)) {
			is ResponseResult.Success -> ResponseEntity.ok(result.data)
			is ResponseResult.Error -> result.toResponseEntity()
		}

	@PreAuthorize("isAuthenticated()")
	@PostMapping("email")
	fun createEmail(@RequestBody createEmailDTO: CreateEmailDTO): ResponseEntity<Any> =
		when (val result = this.emailService.createEmail(createEmailDTO)) {
			is ResponseResult.Success -> ResponseEntity.status(HttpStatus.CREATED).body("Email criado com sucesso!")
			is ResponseResult.Error -> result.toResponseEntity()
		}

	@PreAuthorize("isAuthenticated()")
	@PutMapping("email/{id}")
	fun editEmail(@RequestBody updateEmailDTO: UpdateEmailDTO, @PathVariable id: UUID): ResponseEntity<Any> =
		when (val result = this.emailService.editEmail(updateEmailDTO, id)) {
			is ResponseResult.Success -> ResponseEntity.noContent().build()
			is ResponseResult.Error -> result.toResponseEntity()
		}
}