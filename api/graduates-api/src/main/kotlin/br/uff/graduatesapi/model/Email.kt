package br.uff.graduatesapi.model

import br.uff.graduatesapi.enum.RoleEnum
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.LocalDateTime
import java.util.*
import javax.persistence.*

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "email")
class Email(
    @Column(name = "title", nullable = false, updatable = true)
    var title: String,

    @Column(name = "name", nullable = false, updatable = false, unique = true)
    var name: String,

    @Column(name = "content", nullable = false, updatable = true)
    var content: String,

    @Column(name = "button_text", nullable = false, updatable = true)
    var buttonText: String,

    @Column(name = "button_url", nullable = false, updatable = true)
    var buttonURL: String,

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role", nullable = false, updatable = true, columnDefinition = "VARCHAR(10) DEFAULT 'GRADUATE'")
    val userRole: RoleEnum,

    @Column(name = "active", nullable = false, updatable = true)
    var active: Boolean = true,

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = true, updatable = true)
    var updatedAt: LocalDateTime? = null,
) {
    @Id
    @Column(name = "id", nullable = false, unique = true)
    var id: UUID = UUID.randomUUID()

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    lateinit var createdAt: LocalDateTime
}