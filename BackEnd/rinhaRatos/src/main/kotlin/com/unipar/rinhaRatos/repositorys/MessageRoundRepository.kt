package com.unipar.rinhaRatos.repositorys

import com.unipar.rinhaRatos.models.MessageRound
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MessageRoundRepository: JpaRepository<MessageRound, Long>  {
    fun findAllById_batalha(idBatalha: Long): List<MessageRound>
}