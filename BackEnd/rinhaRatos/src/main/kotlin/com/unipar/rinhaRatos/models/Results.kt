package com.unipar.rinhaRatos.models

import com.unipar.rinhaRatos.enums.ClassesRato
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.io.Serializable

@Entity
@Table(name = "resultsbattle")
class Results(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var idresult: Long = 0L,

    @Column(nullable = false)
    var vencedorUserName: String = "",

    @Column(nullable = false)
    var perdedorUserName: String = "",

    @Column(nullable = false)
    var vencedorRatoName: String = "",

    @Column(nullable = false)
    var perdedorRatoName: String = "",

    @Column(nullable = false)
    var vencedorRatoType: ClassesRato = ClassesRato.ESGOTO,

    @Column(nullable = false)
    var perdedorRatoType: ClassesRato = ClassesRato.ESGOTO,

    @Column(nullable = false)
    var vencedorRatoHP: Float = 0.0F,

    @Column(nullable = false)
    var perdedorRatoHP: Float = 0.0F,

    @Column(nullable = false)
    var id_batalha: Long = 0L,

    @Column(nullable = false)
    var id_vencedor: Long = 0L,

    @Column(nullable = false)
    var id_perdedor: Long = 0L,

    ) : Serializable {
    constructor() : this(
        0L,
        "",
        "",
        "",
        "",
        ClassesRato.ESGOTO,
        ClassesRato.ESGOTO,
        0.0F,
        0.0F,
        0L,
        0L,
        0L
    )
}