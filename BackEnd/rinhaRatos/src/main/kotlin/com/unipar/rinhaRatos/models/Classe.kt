package com.unipar.rinhaRatos.models

import jakarta.persistence.*
import java.io.Serializable

@Entity
@Table(name = "classes")
class Classe(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var idClasse: Long = 0L,

    @Column(nullable = false)
    var nomeClasse: String = "",

    @Column(nullable = true)
    var apelido: String? = null,

    @Column(nullable = false)
    var strMin: Int = 0,

    @Column(nullable = false)
    var strMax: Int = 0,

    @Column(nullable = false)
    var agiMin: Int = 0,

    @Column(nullable = false)
    var agiMax: Int = 0,

    @Column(nullable = false)
    var hpsMin: Int = 0,

    @Column(nullable = false)
    var hpsMax: Int = 0,

    @Column(nullable = false)
    var intMin: Int = 0,

    @Column(nullable = false)
    var intMax: Int = 0,

    @Column(nullable = false)
    var defMin: Int = 0,

    @Column(nullable = false)
    var defMax: Int = 0,

    @OneToMany(mappedBy = "classe", cascade = [CascadeType.ALL])
    var habilidades: MutableList<Habilidade> = mutableListOf(),

    @OneToMany(mappedBy = "classe", cascade = [CascadeType.ALL])
    var ratos: MutableList<Rato> = mutableListOf()
)