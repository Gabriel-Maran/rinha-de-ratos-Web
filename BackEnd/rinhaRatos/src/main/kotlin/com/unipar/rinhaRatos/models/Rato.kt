package com.unipar.rinhaRatos.models

import com.fasterxml.jackson.annotation.JsonBackReference
import jakarta.persistence.*
import java.io.Serializable

@Entity
@Table(name = "ratos")
class Rato(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var idRato: Long = 0L,

    @Column(nullable = false)
    var nomeCustomizado: String = "",

    @Column(columnDefinition = "text")
    var descricao: String = "",

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    @JsonBackReference
    var usuario: Usuario? = null,

    // Exemplo de referências à classe/habilidade — ajuste nomes conforme suas entities
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "classe_id")
    var classe: Classe? = null,

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "habilidade_id")
    var habilidadeEscolhida: Habilidade? = null,

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
    constructor() : this(0L, "", "", null, null, null, 0, 0, 0, 0, 0, false, true)
}
