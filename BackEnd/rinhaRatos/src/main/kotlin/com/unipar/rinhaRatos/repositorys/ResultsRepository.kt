package com.unipar.rinhaRatos.repositorys

import com.unipar.rinhaRatos.models.MessageRound
import com.unipar.rinhaRatos.models.Results
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface ResultsRepository : JpaRepository<Results, Long> {
    @Query(
        value = "SELECT * FROM resultsbattle r WHERE r.id_batalha = :idBatalha",
        nativeQuery = true
    )
    fun findAllIdBatalha(@Param("idBatalha") idBatalha: Long): List<Results>
}

