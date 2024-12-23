package br.uff.graduatesapi.repository

import br.uff.graduatesapi.entity.EmailFilters
import br.uff.graduatesapi.entity.OffsetLimit
import br.uff.graduatesapi.model.Email
import com.linecorp.kotlinjdsl.querydsl.expression.column
import com.linecorp.kotlinjdsl.spring.data.SpringDataQueryFactory
import com.linecorp.kotlinjdsl.spring.data.listQuery
import com.linecorp.kotlinjdsl.spring.data.singleQuery
import org.springframework.stereotype.Repository
import java.util.*

@Repository
class EmailRepositoryImpl(
  private val queryFactory: SpringDataQueryFactory,
) : EmailRepositoryCustom {

  override fun getAllCount(emailFilters: EmailFilters, pageConfig: OffsetLimit): Long {
    return queryFactory.singleQuery {
      select(count(column(Email::id)))
      from(entity(Email::class))
      where(
        or(
          emailFilters.name?.run { column(Email::name).like("%${this}") },
          emailFilters.userRole?.run { column(Email::userRole).equal(this) },
          emailFilters.id?.run { column(Email::id).equal(this) }
        )
      )
    }
  }

  override fun getAll(emailFilters: EmailFilters, pageConfig: OffsetLimit): List<Email> {
    return queryFactory.listQuery {
      select(entity(Email::class))
      from(entity(Email::class))
      where(
        or(
          emailFilters.name?.run { column(Email::name).like("%${this.lowercase()}%") },
          emailFilters.userRole?.run { column(Email::userRole).equal(this) },
          emailFilters.id?.run { column(Email::id).equal(this) }
        )
      )
      orderBy(column(Email::active).desc(),column(Email::createdAt).desc())
      limit(
        pageConfig.offset,
        pageConfig.limit,
      )
    }
  }

  override fun getEmailById(id: UUID): Email? {
    return queryFactory.singleQuery {
      select(entity(Email::class))
      from(entity(Email::class))
      where(
        column(Email::id).equal(id)
      )
    }
  }
}