package com.unipar.rinhaRatos.repositorys

import com.unipar.rinhaRatos.models.Usuario
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface UsuarioRepository: JpaRepository<Usuario, Long> {
    fun findByEmail(email: String): Optional<Usuario>
    fun existsByEmail(email: String): Boolean

    @EntityGraph(attributePaths = ["ratos"])
    @Query("select distinct u from Usuario u where u.tipoConta = 'JOGADOR' order by u.vitorias desc")
    fun findTop10WithRatosOrderByVitoriasDesc(pageable: Pageable): List<Usuario>

    @Query("select distinct u from Usuario u left join fetch u.ratos")
    fun findAllWithRatos(): List<Usuario>

    @Query("select u from Usuario u left join fetch u.ratos where u.idUsuario = :id")
    fun findByIdWithRatos(@Param("id") id: Long): Optional<Usuario>
}
