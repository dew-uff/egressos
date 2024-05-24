package br.uff.graduatesapi.entity

import br.uff.graduatesapi.enum.RoleEnum
import java.util.*

data class EmailFilters(
  val name: String? = null,
  val userRole: RoleEnum? = null,
  val id: UUID? = null,
)
