package com.unipar.rinhaRatos.repositorys

import com.unipar.rinhaRatos.models.Classe
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.Optional

// Repositorio das Classes
// SQL auto descritivos

@Repository
interface ClasseRepository : JpaRepository<Classe, Long> {

    @EntityGraph(attributePaths = ["habilidades"])
    @Query("select c from Classe c where c.nomeClasse = :nomeClasse")
    fun findByNomeClasseWithHabilidades(@Param("nomeClasse") nomeClasse: String): Optional<Classe>

    @EntityGraph(attributePaths = ["habilidades"])
    @Query("select distinct c from Classe c")
    fun findAllWithHabilidades(): List<Classe>

    @EntityGraph(attributePaths = ["habilidades"])
    @Query("select c from Classe c where c.idClasse = :id")
    fun findByIdWithHabilidades(@Param("id") id: Long): Optional<Classe>
}
