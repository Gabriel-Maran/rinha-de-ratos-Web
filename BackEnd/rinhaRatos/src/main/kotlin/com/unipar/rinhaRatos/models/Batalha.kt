package com.unipar.rinhaRatos.models

import com.unipar.rinhaRatos.enums.StatusBatalha
import jakarta.persistence.*
import java.time.LocalDateTime
import java.io.Serializable


// Model da batalha, sem segredo
@Entity
@Table(name = "batalhas")
open class Batalha(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var idBatalha: Long = 0L,

    // ADM criador da sala
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_adm_criador", nullable = false)
    var admCriador: Usuario,

    @Column(nullable = false)
    var nomeBatalha: String,

    @Column(nullable = false)
    var dataHorarioInicio: LocalDateTime,

    @Column(nullable = false)
    var custoInscricao: Int,

    @Column(nullable = false)
    var premioTotal: Int,

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
) : Serializable {
    // construtor padrão: cria Batalha "placeholder" (data = agora)
    constructor() : this(
        0L,
        Usuario(),                 // depende do no-arg do Usuario (você já tinha)
        "",
        LocalDateTime.now(),
        0,
        0,
        StatusBatalha.InscricoesAbertas,
        null,
        null,
        null,
        null,
        null,
        null
    )
}
