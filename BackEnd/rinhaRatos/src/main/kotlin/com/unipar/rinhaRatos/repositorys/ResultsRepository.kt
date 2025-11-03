package com.unipar.rinhaRatos.repositorys

import com.unipar.rinhaRatos.models.Results
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ResultsRepository: JpaRepository<Results, Long>  {
    fun findAllById_batalha(idBatalha: Long): List<Results>
}