package com.unipar.rinhaRatos.repositorys

import com.unipar.rinhaRatos.models.Rato
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface RatoRepository: JpaRepository<Rato, Long> {

    // fun para contar quantos ratos um usuário já tem (consulta direta no DB)
    @Query("select count(r) from Rato r where r.usuario.idUsuario = :usuarioId")
    fun countByUsuarioId(@Param("usuarioId") usuarioId: Long): Int

}