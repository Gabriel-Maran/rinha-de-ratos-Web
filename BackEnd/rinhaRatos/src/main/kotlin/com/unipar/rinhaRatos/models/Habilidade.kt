package com.unipar.rinhaRatos.models

import jakarta.persistence.*
import java.io.Serializable


// Model da Habilidade, sem segredo

@Entity
@Table(name = "habilidades")
class Habilidade(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var idHabilidade: Long = 0L,

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

    @Column(nullable = true)
    var efeitoSucessoStr: String? = null,

    @Column(nullable = true)
    var efeitoFalhaStr: String? = null,

    @Column(nullable = true)
    var efetivoTxt: String? = null,

    @Column(nullable = true)
    var falhaTxt: String? = null,

) : Serializable {
    // construtor padrão (usa uma Classe "vazia" criada pelo no-arg da Classe)
    constructor() : this(
        0L,
        Classe(),          // depende do construtor no-arg da Classe
        "",
        null,
        100,
        null,
        null,
        null,
        null,
    )
}
