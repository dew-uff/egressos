package br.uff.graduatesapi.repository

import br.uff.graduatesapi.enum.RoleEnum
import br.uff.graduatesapi.model.PlatformUser
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserRepository : JpaRepository<PlatformUser, UUID>, UserRepositoryCustom {
	fun findByEmail(email: String): PlatformUser?

	fun findByIdIn(userIds: List<UUID>): List<PlatformUser>?

	fun findByRolesContains(roleEnum: RoleEnum): List<PlatformUser>

	fun findAllByRolesContainsAndSendEmailToAdminOnSaveIs(roleEnum: RoleEnum, sendEmailToAdminOnSave: Boolean): List<PlatformUser>

	fun findByNameContainingIgnoreCaseAndRolesContainingOrderByName(
		name: String,
		role: RoleEnum,
		pageable: Pageable
	): Page<PlatformUser>

	@Query(
		"select distinct pu.* \n" +
				"from platform_user pu\n" +
				"    inner join advisor ad ON pu.id = ad.user_id\n" +
				"    inner join course c ON ad.id = c.advisor_id\n" +
				"    inner join graduate g ON g.id = c.graduate_id\n" +
				"    inner join platform_user_role pur ON pu.id = pur.platform_user_id\n" +
				"where pur.role = 'PROFESSOR' and (\n" +
				"    (SELECT COUNT(1)\n" +
				"     FROM history_status h\n" +
				"     WHERE h.graduate_id = g.id\n" +
				"       AND extract(year from h.created_at) = extract(year from now())) = 0\n" +
				"    OR\n" +
				"    (SELECT h1.status\n" +
				"        FROM history_status h1\n" +
				"        WHERE h1.graduate_id = g.id\n" +
				"          AND extract(year from h1.created_at) = extract(year from now())\n" +
				"        ORDER BY h1.created_at DESC limit 1) IN (0, 1) \n" +
				"    )", nativeQuery = true
	)
	fun findProfessorsWithGraduatesWithHistoryStatusNotUpdated(): List<PlatformUser>

	@Query(
		"select distinct pu.* \n" +
				"from platform_user pu\n" +
				"    inner join graduate g ON g.user_id = pu.id\n" +
				"    inner join platform_user_role pur ON pu.id = pur.platform_user_id\n" +
				"where pur.role = 'GRADUATE' and (\n" +
				"    (SELECT COUNT(1)\n" +
				"     FROM history_status h\n" +
				"     WHERE h.graduate_id = g.id\n" +
				"       AND extract(year from h.created_at) = extract(year from now())) = 0\n" +
				"    OR\n" +
				"    (SELECT h1.status\n" +
				"        FROM history_status h1\n" +
				"        WHERE h1.graduate_id = g.id\n" +
				"          AND extract(year from h1.created_at) = extract(year from now())\n" +
				"        ORDER BY h1.created_at DESC limit 1) IN (0, 1) \n" +
				"    )", nativeQuery = true
	)
	fun findGraduatesWithHistoryStatusNotUpdated(): List<PlatformUser>
}