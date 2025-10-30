package com.unipar.rinhaRatos.models

import jakarta.persistence.*

@Entity
@Table(name = "habilidades")
class Habilidade(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val idHabilidade: Long = 0,

    // Relação com Classe
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_classe", nullable = false)
    var classe: Classe,

    @Column(nullable = false)
    var nomeHabilidade: String,

    @Column(columnDefinition = "TEXT")
    var descricao: String? = null,

    @Column(nullable = false)
    var chanceSucesso: Int = 100,

    @Column(nullable = false)
    var cooldown: Int = 0,

    @Column(nullable = true)
    var efeitoSucessoStr: String? = null,

    @Column(nullable = true)
    var efeitoFalhaStr: String? = null,

    @Column(nullable = true)
    var efetivoTxt: String? = null,

    @Column(nullable = true)
    var falhaTxt: String? = null,

    @OneToMany(mappedBy = "habilidadeEscolhida", cascade = [CascadeType.ALL])
    val ratos: MutableList<Rato> = mutableListOf()
)
