package br.uff.graduatesapi.controller

import br.uff.graduatesapi.dto.CreateWorkHistoriesDTO
import br.uff.graduatesapi.error.ResponseResult
import br.uff.graduatesapi.error.toResponseEntity
import br.uff.graduatesapi.service.WorkHistoryService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("api/v1")
class WorkHistoryController(
  private val workHistoryService: WorkHistoryService,
) {

  @PreAuthorize("isAuthenticated()")
  @GetMapping("work-history")
  fun getWorkHistoriesByGraduate(@RequestParam("userId") userId: UUID): ResponseEntity<Any> {
    return when (val result = workHistoryService.getWorkHistoriesByGraduate(userId)) {
      is ResponseResult.Success -> ResponseEntity.ok(result.data)
      is ResponseResult.Error -> result.toResponseEntity()
    }
  }

  @PreAuthorize("isAuthenticated()")
  @PostMapping("work-history")
  fun createGraduateWorkHistories(
    @RequestParam("graduateId") graduateId: UUID,
    @RequestBody worksDTO: CreateWorkHistoriesDTO
  ): ResponseEntity<Any> {
    return when (val result = workHistoryService.createGraduateHistories(worksDTO, graduateId)) {
      is ResponseResult.Success -> ResponseEntity.status(HttpStatus.CREATED).build()
      is ResponseResult.Error -> result.toResponseEntity()
    }
  }
}