package br.uff.graduatesapi

import br.uff.graduatesapi.entity.OffsetLimit
import br.uff.graduatesapi.enum.HistoryStatusEnum
import br.uff.graduatesapi.enum.NamePendingFieldsEnum
import br.uff.graduatesapi.model.Graduate
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

class Utils {
	companion object {

		fun getBearerToken(bearer: String) = bearer.replace("Bearer ", "")
		fun convertPagination(page: Int?, pageSize: Int?): OffsetLimit {
			if (page != null && pageSize != null) {
				val offset = page * pageSize
				return OffsetLimit(offset = offset, limit = pageSize, page = page, pageSize = pageSize)
			}
			return OffsetLimit(offset = 0, limit = 100000000)
		}

		fun getRandomString(length: Int): String {
			val allowedChars = ('A'..'Z') + ('a'..'z') + ('0'..'9')
			return (1..length)
				.map { allowedChars.random() }
				.joinToString("")
		}

		fun checkIfPasswordIsValid(password: String): Boolean {
			val regex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+\$).{8,}\$".toRegex()
			return regex.matches(password)
		}

		fun parseUTCToLocalDateTime(utc: String): LocalDateTime {
			val formatters = listOf(
				DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"), // ISO-8601
				DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'"), // ISO-8601
				DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm") // UTC
			)

			for (formatter in formatters) {
				try {
					return LocalDateTime.parse(utc, formatter).atOffset(ZoneOffset.UTC).toLocalDateTime()
				} catch (e: DateTimeParseException) {
					// Ignore and try the next formatter
				}
			}

			throw DateTimeParseException("Could not parse date-time string", utc, 0)
		}

		fun getHistoryStatus(
			graduate: Graduate,
			hasCurrentWorkHistory: Boolean?,
			hasCurrentCNPQScholarship: Boolean?,
			hasPostDoctorate: Boolean?,
		): Triple<HistoryStatusEnum, MutableList<String>, MutableList<String>> {

			val newPendingFields: MutableList<String> = mutableListOf()

			val newEmptyFields: MutableList<String> = mutableListOf()


			val isPositionPending = graduate.workHistories.any { it.position == null }

			isPositionPending && newPendingFields.add(NamePendingFieldsEnum.POSITION.value)

			val isWorkHistoryPending = hasCurrentWorkHistory == null

			isWorkHistoryPending && newPendingFields.add(NamePendingFieldsEnum.WORK_HISTORY.value)

			val isCNPQScholarshipPending = hasCurrentCNPQScholarship == null

			isCNPQScholarshipPending && newPendingFields.add(NamePendingFieldsEnum.CNPQ_SCHOLARSHIP.value)

			val isPostDoctoratePending = hasPostDoctorate == null

			isPostDoctoratePending && newPendingFields.add(NamePendingFieldsEnum.POST_DOCTORATE.value)

			val isFinishedDoctorateOnUFFPending = graduate.hasFinishedDoctorateOnUFF == null

			isFinishedDoctorateOnUFFPending && newPendingFields.add(NamePendingFieldsEnum.FINISHED_DOCTORATE_ON_UFF.value)

			val isFinishedMasterDegreeOnUFFPending = graduate.hasFinishedMasterDegreeOnUFF == null

			isFinishedMasterDegreeOnUFFPending && newPendingFields.add(NamePendingFieldsEnum.FINISHED_MASTER_DEGREE_ON_UFF.value)

			val pendingItems = listOf(
				isPositionPending,
				isWorkHistoryPending,
				isCNPQScholarshipPending,
				isFinishedDoctorateOnUFFPending,
				isPostDoctoratePending,
				isFinishedMasterDegreeOnUFFPending,
			)


			hasCurrentWorkHistory == false && newEmptyFields.add(NamePendingFieldsEnum.WORK_HISTORY.value)
			hasCurrentCNPQScholarship == false && newEmptyFields.add(NamePendingFieldsEnum.CNPQ_SCHOLARSHIP.value)
			hasPostDoctorate == false && newEmptyFields.add(NamePendingFieldsEnum.POST_DOCTORATE.value)


			val status = if (pendingItems.all { !it }) HistoryStatusEnum.UPDATED
			else if (pendingItems.any { !it }) HistoryStatusEnum.UPDATED_PARTIALLY
			else HistoryStatusEnum.PENDING

			return Triple(status, newPendingFields, newEmptyFields)
		}
	}
}