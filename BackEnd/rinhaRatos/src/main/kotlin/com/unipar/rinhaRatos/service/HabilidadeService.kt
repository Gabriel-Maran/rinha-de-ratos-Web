package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.DTOandBASIC.*
import com.unipar.rinhaRatos.mapper.toDto
import com.unipar.rinhaRatos.repositorys.HabilidadeRepository
import org.springframework.stereotype.Service
import java.util.Optional

// Service da Habilidade
// Comentado apenas em partes essenciais, as outras se auto descrevem

@Service
class HabilidadeService(
    private val habilidadeRepository: HabilidadeRepository
) {

    fun getAllHabilidade(): List<HabilidadeDTO> {
        return habilidadeRepository.findAll().map { it.toDto() }
    }

    fun getHabilidadePorId(id: Long): Optional<HabilidadeDTO> {
        val habilidadeOpt = habilidadeRepository.findByIdWithClasse(id)
        return habilidadeOpt.map { it.toDto() }
    }

    fun getHabilidadePorNome(nomeHabilidade: String): Optional<HabilidadeDTO> {
        val habilidadeOpt = habilidadeRepository.findByNomeHabilidade(nomeHabilidade)
        return habilidadeOpt.map { it.toDto() }
    }
}
