package br.uff.graduatesapi.service

import br.uff.graduatesapi.enum.RoleEnum
import br.uff.graduatesapi.error.Errors
import br.uff.graduatesapi.error.ResponseResult
import br.uff.graduatesapi.error.passError
import br.uff.graduatesapi.model.Email
import org.springframework.http.HttpStatus
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import org.thymeleaf.context.Context
import org.thymeleaf.spring5.SpringTemplateEngine
import java.nio.charset.StandardCharsets
import java.util.*
import javax.mail.internet.MimeMessage

@Service
class EmailSenderService(
	private val emailSender: JavaMailSender,
	private val emailService: EmailService,
	private val userService: UserService,
	private val templateEngine: SpringTemplateEngine,

	) {
	fun sendEmail(subject: String, text: String, targetEmail: String): ResponseResult<Nothing?> {
		return try {
			val message = SimpleMailMessage()

			message.setSubject(subject)
			message.setText(text)
			message.setTo(targetEmail)

			emailSender.send(message)
			ResponseResult.Success(null)
		} catch (e: Exception) {
			ResponseResult.Error(Errors.EMAIL_NOT_SENT)
		}
	}

	private fun setupEmailTemplate(
		emailContentId: UUID? = null,
		email: Email? = null
	): ResponseResult<Triple<MimeMessageHelper, MimeMessage, RoleEnum>> {
		if (emailContentId == null && email == null) {
			return ResponseResult.Error(Errors.EMAIL_NOT_FOUND, errorCode = HttpStatus.UNPROCESSABLE_ENTITY)
		}

		val emailContent = if (emailContentId != null) when (val result = emailService.findEmailById(emailContentId)) {
			is ResponseResult.Success -> result.data!!
			is ResponseResult.Error -> return ResponseResult.Error(
				Errors.EMAIL_NOT_FOUND,
				errorCode = HttpStatus.UNPROCESSABLE_ENTITY,
			)
		} else email!!

		val emailFields = mapOf(
			"content" to emailContent.content,
			"buttonText" to emailContent.buttonText,
			"buttonLink" to emailContent.buttonURL
		)

		val message = emailSender.createMimeMessage()
		val helper =
			MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name())
		helper.setSubject(emailContent.title)
		val context = Context()
		context.setVariables(emailFields)
		val html = templateEngine.process("email.html", context)
		helper.setText(html, true)

		return ResponseResult.Success(
			Triple(
				helper,
				message,
				emailContent.userRole
			)
		)
	}

	fun sendEmailsHtmlTemplate(
		userIds: List<UUID>,
		emailContentId: UUID,
		sendToPendingHistories: Boolean = false
	): ResponseResult<Nothing?> {

		val (helper, message, role) = when (val result = setupEmailTemplate(emailContentId)) {
			is ResponseResult.Success -> result.data!!
			is ResponseResult.Error -> return result.passError(HttpStatus.UNPROCESSABLE_ENTITY)
		}

		val users =
			if (!sendToPendingHistories)
				when (val result = userService.findByIds(userIds)) {
					is ResponseResult.Success -> result.data!!
					is ResponseResult.Error -> return result.passError(HttpStatus.UNPROCESSABLE_ENTITY)
				}
			else {
				if (role == RoleEnum.GRADUATE) {
					when (val result = userService.findGraduateUsersByWorkHistoryStatusNotUpdated()) {
						is ResponseResult.Success -> result.data!!
						is ResponseResult.Error -> return result.passError(HttpStatus.UNPROCESSABLE_ENTITY)
					}
				} else {
					when (val result = userService.findProfessorUsersByWorkHistoryStatusNotUpdated()) {
						is ResponseResult.Success -> result.data!!
						is ResponseResult.Error -> return result.passError(HttpStatus.UNPROCESSABLE_ENTITY)
					}
				}
			}


		val emails = users.map { it.email }.toTypedArray()

		try {
			helper.setBcc(emails)
			emailSender.send(message)
		} catch (e: Exception) {
			return ResponseResult.Error(Errors.EMAIL_NOT_SENT)
		}

		return ResponseResult.Success(null)

	}

	fun sendEmailHtmlTemplate(subject: String, targetEmail: String, emailContentId: UUID): ResponseResult<Nothing?> {
		val (helper, message) = when (val result = setupEmailTemplate(emailContentId)) {
			is ResponseResult.Success -> result.data!!
			is ResponseResult.Error -> return result.passError(HttpStatus.UNPROCESSABLE_ENTITY)
		}
		helper.setTo(targetEmail)
		emailSender.send(message)
		return ResponseResult.Success(null)
	}

	private fun replaceUserFields(field: String, userId: UUID, userName: String): String {
		return field.replace("{{user.name}}", userName).replace("{{user.id}}", userId.toString())
	}

	fun sendEmailToAdmins(userId: UUID, userName: String): ResponseResult<Nothing?> {
		val adminsToSendEmail = when (val result = userService.findAdminsToSendWorkHistoryEmail()) {
			is ResponseResult.Success -> result.data!!
			is ResponseResult.Error -> listOf()
		}

		if (adminsToSendEmail.isEmpty()) {
			return ResponseResult.Success(null)
		}

		val email = when (val resultActiveEmail = emailService.findActiveAdminEmail()) {
			is ResponseResult.Success -> resultActiveEmail.data!!
			is ResponseResult.Error -> return resultActiveEmail.passError(HttpStatus.UNPROCESSABLE_ENTITY)
		}

		email.buttonURL = replaceUserFields(email.buttonURL, userId, userName)
		email.buttonText = replaceUserFields(email.buttonText, userId, userName)
		email.content = replaceUserFields(email.content, userId, userName)
		email.title = replaceUserFields(email.title, userId, userName)

		val (helper, message) = when (val resultSetupEmail = setupEmailTemplate(email = email)) {
			is ResponseResult.Success -> resultSetupEmail.data!!
			is ResponseResult.Error -> return resultSetupEmail.passError(HttpStatus.UNPROCESSABLE_ENTITY)
		}

		val emails = adminsToSendEmail.map { it.email }.toTypedArray()

		try {
			helper.setBcc(emails)
			emailSender.send(message)
			return ResponseResult.Success(null)
		} catch (e: Exception) {
			return ResponseResult.Error(Errors.EMAIL_NOT_SENT)
		}
	}
}