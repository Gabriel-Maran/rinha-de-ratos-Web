package com.unipar.rinhaRatos.repositorys

import com.unipar.rinhaRatos.models.Rato
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

@Repository
interface RatoRepository: JpaRepository<Rato, Long> {
    @Query("select r from Rato r left join fetch r.usuario where r.idRato = :id")
    fun findByIdWithUsuario(@Param("id") id: Long): Optional<Rato>
}
