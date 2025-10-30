package com.unipar.rinhaRatos.repositorys

import com.unipar.rinhaRatos.models.Habilidade
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface HabilidadeRepository : JpaRepository<Habilidade, Long> {
    fun findByNomeHabilidade(nomeClasse: String): Optional<Habilidade>
}