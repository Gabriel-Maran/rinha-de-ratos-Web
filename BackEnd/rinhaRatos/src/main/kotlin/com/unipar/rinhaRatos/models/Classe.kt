package com.unipar.rinhaRatos.models

import jakarta.persistence.*

@Entity
@Table(name = "classes")
class Classe(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id_classe: Long = 0,

    @Column(nullable = false)
    var nome_classe: String,

    @Column(nullable = true)
    var apelido: String? = null,

    @Column(nullable = false)
    var str_min: Int,

    @Column(nullable = false)
    var str_max: Int,

    @Column(nullable = false)
    var agi_min: Int,

    @Column(nullable = false)
    var agi_max: Int,

    @Column(nullable = false)
    var hps_min: Int,

    @Column(nullable = false)
    var hps_max: Int,

    @Column(nullable = false)
    var int_min: Int,

    @Column(nullable = false)
    var int_max: Int,

    @Column(nullable = false)
    var def_min: Int,

    @Column(nullable = false)
    var def_max: Int,

    // Relação: uma Classe possui várias Habilidades (mapeamento inverso)
    @OneToMany(mappedBy = "classe", cascade = [CascadeType.ALL])
    val habilidades: MutableList<Habilidade> = mutableListOf(),

    // Relação: uma Classe pode ser a "classe base" de vários ratos
    @OneToMany(mappedBy = "classe", cascade = [CascadeType.ALL])
    val ratos: MutableList<Rato> = mutableListOf()
)
