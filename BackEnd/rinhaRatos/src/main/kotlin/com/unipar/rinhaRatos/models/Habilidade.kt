package com.unipar.rinhaRatos.models

import jakarta.persistence.*

@Entity
@Table(name = "habilidades")
class Habilidade(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id_habilidade: Long = 0,

    // Relação com Classe
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_classe", nullable = false)
    var classe: Classe,

    @Column(nullable = false)
    var nome_habilidade: String,

    @Column(columnDefinition = "TEXT")
    var descricao: String? = null,

    @Column(nullable = false)
    var chance_sucesso: Int = 100,

    @Column(nullable = false)
    var cooldown: Int = 0,

    @Column(nullable = true)
    var efeito_sucesso_str: String? = null,

    @Column(nullable = true)
    var efeito_falha_str: String? = null,

    @Column(nullable = true)
    var efetivo_txt: String? = null,

    @Column(nullable = true)
    var falha_txt: String? = null,

    @OneToMany(mappedBy = "habilidadeEscolhida", cascade = [CascadeType.ALL])
    val ratos: MutableList<Rato> = mutableListOf()
)
