package com.unipar.rinhaRatos.models

import com.fasterxml.jackson.annotation.JsonBackReference
import jakarta.persistence.*
import java.io.Serializable


// Model do Rato, sem segredo

@Entity
@Table(name = "ratos")
open class Rato(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var idRato: Long = 0L,

    @Column(nullable = false)
    var nomeCustomizado: String = "",

    @Column(columnDefinition = "text")
    var descricao: String = "",

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @JsonBackReference
    var usuario: Usuario? = null,

    // referências às outras entidades (nullable)
    @ManyToOne
    @JoinColumn(name = "classe_id")
    var classe: Classe,

    @ManyToOne
    @JoinColumn(name = "habilidade_id")
    var habilidadeEscolhida: Habilidade,

    @Column(nullable = false)
    var strBase: Int = 0,

    @Column(nullable = false)
    var agiBase: Int = 0,

    @Column(nullable = false)
    var hpsBase: Int = 0,

    @Column(nullable = false)
    var intBase: Int = 0,

    @Column(nullable = false)
    var defBase: Int = 0,

    @Column(nullable = false)
    var estaTorneio: Boolean = false,

    @Column(nullable = false)
    var estaVivo: Boolean = true
) : Serializable {

    // construtor no-arg necessário para JPA/Hibernate
    constructor() : this(
        0L,
        "",
        "",
        null,
        Classe(),
        Habilidade(),
        0,
        0,
        0,
        0,
        0,
        false,
        true
    )
}
