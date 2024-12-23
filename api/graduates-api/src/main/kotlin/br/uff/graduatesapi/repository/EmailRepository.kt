package br.uff.graduatesapi.repository

import br.uff.graduatesapi.enum.RoleEnum
import br.uff.graduatesapi.model.Email
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.lang.Nullable
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Repository
interface EmailRepository : JpaRepository<Email, UUID>, EmailRepositoryCustom {
  @Modifying
  @Transactional
  @Query("update Email email set email.active = false where email.active = true and email.userRole= :role")
  fun deactivateEmails(role: RoleEnum)

  @Nullable
  fun findByActiveIsAndUserRoleIs(active: Boolean, role: RoleEnum): Email?
}