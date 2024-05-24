package br.uff.graduatesapi.dto

import br.uff.graduatesapi.enum.RoleEnum

data class CreateEmailDTO(
  val title: String,
  val name: String,
  val content: String,
  val buttonText: String,
  val buttonURL: String,
  val active: Boolean = false,
  val userRole: RoleEnum,
  )
