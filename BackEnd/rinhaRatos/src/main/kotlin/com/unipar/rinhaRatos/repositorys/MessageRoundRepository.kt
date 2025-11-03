package com.unipar.rinhaRatos.repositorys

import com.unipar.rinhaRatos.models.MessageRound
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface MessageRoundRepository: JpaRepository<MessageRound, Long>  {
    @Query(
        value = "SELECT * FROM messageround WHERE id_batalha = :idBatalha",
        nativeQuery = true
    )
    fun findByIdBatalha(@Param("idBatalha") idBatalha: Long): List<MessageRound>
}
