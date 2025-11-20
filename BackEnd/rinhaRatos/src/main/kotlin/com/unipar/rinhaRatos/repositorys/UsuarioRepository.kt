package com.unipar.rinhaRatos.repositorys

import com.unipar.rinhaRatos.DTOandBASIC.UsuarioDetailsDto
import com.unipar.rinhaRatos.DTOandBASIC.UsuarioSummaryDTO
import com.unipar.rinhaRatos.enums.TipoConta
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
    fun findByTipoContaOrderByVitoriasDesc(tipoConta: TipoConta, pageable: Pageable): List<Usuario>

    @Query("select COUNT(u) from Usuario u where u.tipoConta = 'BOT'")
    fun countBots(): Long

    @Query("select distinct u from Usuario u left join fetch u.ratos r where r.estaVivo = true or r is null")
    fun findAllWithRatos(): List<Usuario>

    @Query("select distinct u from Usuario u left join fetch u.ratos r where (u.idUsuario = :id and r.estaVivo = true")
    fun findByIdUsuarioWithRatosVivos(@Param("id") idUsuario: Long): Optional<Usuario>

    @Query("select count(r) from Usuario u join u.ratos r where u.idUsuario = :id and r.estaVivo = true")
    fun countRatosVivosByIdUsuario(@Param("id") idUsuario: Long): Long

    @Query(
        "SELECT new com.unipar.rinhaRatos.DTOandBASIC.UsuarioDetailsDto(" +
                "u.idUsuario, u.tipoConta, u.vitorias, u.email, u.idFotoPerfil, u.mousecoinSaldo, u.nome" +
                ") FROM Usuario u WHERE u.idUsuario = :idUsuario"
    )
    fun findByIdUsuarioWithoutRatos(@Param("idUsuario") idUsuario: Long): Optional<UsuarioDetailsDto>
}
