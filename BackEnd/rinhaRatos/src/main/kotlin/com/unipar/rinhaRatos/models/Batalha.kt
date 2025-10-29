package com.unipar.rinhaRatos.models

import com.unipar.rinhaRatos.enums.StatusBatalha
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "batalhas")
class Batalha(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id_batalha: Long = 0,

    // ADM criador da sala
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_adm_criador", nullable = false)
    var admCriador: Usuario,

    @Column(nullable = false)
    var nome_batalha: String,

    @Column(nullable = false)
    var data_horario_inicio: LocalDateTime,

    @Column(nullable = false)
    var custo_inscricao: Int,

    @Column(nullable = false)
    var premio_total: Int,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: StatusBatalha = StatusBatalha.InscricoesAbertas,

    @ManyToOne
    @JoinColumn(name = "id_jogador1")
    var jogador1: Usuario? = null,

    @ManyToOne
    @JoinColumn(name = "id_rato1")
    var rato1: Rato? = null,

    @ManyToOne
    @JoinColumn(name = "id_jogador2")
    var jogador2: Usuario? = null,

    @ManyToOne
    @JoinColumn(name = "id_rato2")
    var rato2: Rato? = null,

    @ManyToOne
    @JoinColumn(name = "id_vencedor")
    var vencedor: Usuario? = null,

    @ManyToOne
    @JoinColumn(name = "id_perdedor")
    var perdedor: Usuario? = null
)
