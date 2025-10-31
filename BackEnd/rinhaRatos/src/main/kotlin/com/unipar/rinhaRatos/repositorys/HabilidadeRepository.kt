package com.unipar.rinhaRatos.repositorys

import com.unipar.rinhaRatos.models.Habilidade
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface HabilidadeRepository : JpaRepository<Habilidade, Long> {

    // Quando precisar da classe junto (fetch da classe)
    @EntityGraph(attributePaths = ["classe"])
    fun findByNomeHabilidade(nomeHabilidade: String): Optional<Habilidade>

    @EntityGraph(attributePaths = ["classe"])
    @Query("select h from Habilidade h where h.idHabilidade = :id")
    fun findByIdWithClasse(@Param("id") id: Long): Optional<Habilidade>
}
