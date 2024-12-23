package br.uff.graduatesapi.controller

import br.uff.graduatesapi.Utils
import br.uff.graduatesapi.dto.toDTO
import br.uff.graduatesapi.entity.GraduateFilters
import br.uff.graduatesapi.enum.RoleEnum
import br.uff.graduatesapi.error.ResponseResult
import br.uff.graduatesapi.error.toResponseEntity
import br.uff.graduatesapi.security.UserDetailsImpl
import br.uff.graduatesapi.service.GraduateService
import org.springframework.data.domain.PageRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.*


@RestController
@RequestMapping("api/v1")
class GraduateController(private val graduateService: GraduateService) {

	@PreAuthorize("isAuthenticated()")
	@GetMapping("graduates-lean")
	fun getGraduatesLeanFiltered(
		@AuthenticationPrincipal user: UserDetailsImpl,
		@RequestParam(value = "page", required = false, defaultValue = "0") page: Int,
		@RequestParam(value = "pageSize", required = false, defaultValue = "10") pageSize: Int,
		@RequestParam(value = "name", required = false) name: String,
	): ResponseEntity<Any>? {
		return when (val result =
			graduateService.findGraduateByNameLikeAndPaged(
				name, page, pageSize
			)) {
			is ResponseResult.Success -> ResponseEntity.ok(result.data)
			is ResponseResult.Error -> result.toResponseEntity()
		}
	}
	@PreAuthorize("isAuthenticated()")
	@GetMapping("graduates")
	fun getGraduatesByAdvisor(
		@AuthenticationPrincipal user: UserDetailsImpl,
		@RequestParam(value = "page", required = false, defaultValue = "0") page: Int,
		@RequestParam(value = "pageSize", required = false, defaultValue = "10") pageSize: Int,
		@RequestParam(value = "name", required = false) name: String?,
		@RequestParam(value = "institutionType", required = false) institutionType: UUID?,
		@RequestParam(value = "institutionName", required = false) institutionName: String?,
		@RequestParam(value = "advisorName", required = false) advisorName: String?,
		@RequestParam(value = "position", required = false) position: String?,
		@RequestParam(value = "cnpqLevel", required = false) cnpqLevel: UUID?,
		@RequestParam(value = "successCase", required = false) successCase: String?,
	): ResponseEntity<Any>? {
		val filters = GraduateFilters(
			name = name,
			institutionName = institutionName,
			institutionType = institutionType,
			advisorName = advisorName,
			position = position,
			cnpqLevel = cnpqLevel,
			successCase = successCase,
		)

		val pageSetting = Utils.convertPagination(page, pageSize)

		val role = user.authorities[0].authority
		return when (val result =
			graduateService.getGraduatesByAdvisor(
				UUID.fromString(user.username),
				RoleEnum.valueOf(role),
				pageSetting,
				filters
			)) {
			is ResponseResult.Success -> ResponseEntity.ok(result.data)
			is ResponseResult.Error -> result.toResponseEntity()
		}
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping("allgraduates")
	fun getAllGraduate(
		@RequestParam(value = "page", required = false, defaultValue = "0") page: Int,
		@RequestParam(value = "pageSize", required = false, defaultValue = "10") pageSize: Int,
	): ResponseEntity<Any>? {
		val pageSetting = PageRequest.of(page, pageSize)
		return when (val result = graduateService.getAllGraduates(pageSetting)) {
			is ResponseResult.Success -> ResponseEntity.ok(result.data)
			is ResponseResult.Error -> result.toResponseEntity()
		}
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping("graduate/{id}")
	fun getGraduateById(@PathVariable id: UUID): ResponseEntity<Any>? {
		return when (val result = graduateService.getGraduateById(id)) {
			is ResponseResult.Success -> ResponseEntity.ok(result.data!!.toDTO())
			is ResponseResult.Error -> result.toResponseEntity()
		}
	}

	@PostMapping("graduates/csv")
	fun createGraduatesByCSV(
		@RequestParam("file") file: MultipartFile, @RequestParam("isDoctorateGraduates") isDoctorateGraduates: Boolean
	): ResponseEntity<Any>? {
		return when (val result = graduateService.createGraduateByCSV(file, isDoctorateGraduates)) {
			is ResponseResult.Success -> ResponseEntity.status(HttpStatus.CREATED).build()
			is ResponseResult.Error -> {
				val errorDataMessage =
					if (result.errorData != null) "Verifique as informações relacionadas ao campo de valor \"${result.errorData}\"." else ""
				result.toResponseEntity("${result.errorReason?.responseMessage} $errorDataMessage")
			}
		}
	}
}