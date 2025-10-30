package com.unipar.rinhaRatos.repositorys

import com.unipar.rinhaRatos.models.Classe
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface ClasseRepository: JpaRepository<Classe, Long> {
    fun findByNomeClasse(nomeClasse: String): Optional<Classe>
}