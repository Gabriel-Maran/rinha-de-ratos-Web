package com.unipar.rinhaRatos.models

import com.unipar.rinhaRatos.models.Habilidade
import jakarta.persistence.*
import java.io.Serializable

@Entity
@Table(name = "messageround")
class MessageRound (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var idmessage: Long = 0L,

    @Column(columnDefinition = "TEXT", nullable = false)
    var descricao: String = "",

    @Column(nullable = false)
    var id_batalha: Long =  0L,

    @Column()
    var round: Long =  -1,

    @Column()
    var player: Long =  0, // ou é player 1 ou é player 2
): Serializable{
    constructor() : this(
        0L,
        "",
        0L,
        -1,
        0
    )
}