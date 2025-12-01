package com.unipar.rinhaRatos.models

import jakarta.persistence.*
import java.io.Serializable


// Model das mensagens por round, sem segredo

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