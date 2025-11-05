package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.DTOandBASIC.ClasseDTO
import com.unipar.rinhaRatos.DTOandBASIC.HabilidadeDTO
import com.unipar.rinhaRatos.mapper.toDto
import com.unipar.rinhaRatos.models.Habilidade
import com.unipar.rinhaRatos.repositorys.ClasseRepository
import com.unipar.rinhaRatos.repositorys.HabilidadeRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.Optional

@Service
class ClasseService(
    private val classeRepository: ClasseRepository,
    private val habilidadeRepository: HabilidadeRepository
) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun getAllClasse(): List<ClasseDTO> {
        val classes = classeRepository.findAllWithHabilidades()
        return classes.map { it.toDto() }
    }

    fun getClassePorId(id: Long): Optional<ClasseDTO> {
        val classeOpt = classeRepository.findByIdWithHabilidades(id)
        return classeOpt.map {
            it.toDto()
        }
    }

    fun getClassePorNome(nomeClasse: String): Optional<ClasseDTO> {
        val classeOpt = classeRepository.findByNomeClasseWithHabilidades(nomeClasse)
        return classeOpt.map { it.toDto() }
    }

    fun getHabilidadePorIdClasse(id: Long): Optional<List<Habilidade>> {
        val habilidades = habilidadeRepository.findByIdClasse(id)
        return habilidades
    }
}

