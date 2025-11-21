package com.unipar.rinhaRatos.repositorys

import com.unipar.rinhaRatos.enums.StatusBatalha
import com.unipar.rinhaRatos.models.Batalha
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface BatalhaRepository: JpaRepository<Batalha, Long> {
    fun findAllByAdmCriador_IdUsuario(admCriador: Long): List<Batalha>

    @Query("""
        SELECT b FROM Batalha b 
        WHERE b.jogador1.idUsuario = :userId 
        OR b.jogador2.idUsuario = :userId
    """)
    fun pegarTodasBatalhasDoUsuario(@Param("userId") idUsuario: Long): List<Batalha>

    @Query("""
        SELECT b FROM Batalha b 
        WHERE (b.jogador1.idUsuario = :userId 
        OR b.jogador2.idUsuario = :userId)
        AND b.status = "InscricoesAbertas"
    """)
    fun pegarTodasBatalhasDoUsuarioComInscricaoAberta(@Param("userId") idUsuario: Long): List<Batalha>

    @Query("""
        SELECT b FROM Batalha b 
        WHERE b.status = "Concluida"
    """)
    fun pegarTodasAsBatalhasAcabadas(): List<Batalha>

    fun findAllByStatusIs(statusBatalha: StatusBatalha): List<Batalha>
}
