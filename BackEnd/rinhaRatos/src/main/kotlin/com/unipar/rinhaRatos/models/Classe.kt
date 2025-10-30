package com.unipar.rinhaRatos.models

import jakarta.persistence.*

@Entity
@Table(name = "classes")
class Classe(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val idClasse: Long = 0,

    @Column(nullable = false)
    var nomeClasse: String,

    @Column(nullable = true)
    var apelido: String? = null,

    @Column(nullable = false)
    var strMin: Int,

    @Column(nullable = false)
    var strMax: Int,

    @Column(nullable = false)
    var agiMin: Int,

    @Column(nullable = false)
    var agiMax: Int,

    @Column(nullable = false)
    var hpsMin: Int,

    @Column(nullable = false)
    var hpsMax: Int,

    @Column(nullable = false)
    var intMin: Int,

    @Column(nullable = false)
    var intMax: Int,

    @Column(nullable = false)
    var defMin: Int,

    @Column(nullable = false)
    var defMax: Int,

    // Relação: uma Classe possui várias Habilidades (mapeamento inverso)
    @OneToMany(mappedBy = "classe", cascade = [CascadeType.ALL])
    val habilidades: MutableList<Habilidade> = mutableListOf(),

    // Relação: uma Classe pode ser a "classe base" de vários ratos
    @OneToMany(mappedBy = "classe", cascade = [CascadeType.ALL])
    val ratos: MutableList<Rato> = mutableListOf()
)
