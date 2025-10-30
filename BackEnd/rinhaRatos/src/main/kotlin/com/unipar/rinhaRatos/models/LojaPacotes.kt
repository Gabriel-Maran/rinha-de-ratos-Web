package com.unipar.rinhaRatos.models

import jakarta.persistence.*
import java.math.BigDecimal
import java.io.Serializable

@Entity
@Table(name = "lojaPacotes")
class LojaPacotes(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var idPacote: Long = 0L,

    @Column(nullable = false, length = 100)
    var nomePacote: String = "",

    @Column(nullable = false)
    var mousecoinQuantidade: Int = 0,

    @Column(nullable = false, precision = 10, scale = 2)
    var precoBrl: BigDecimal = BigDecimal.ZERO
) : Serializable {
    // construtor padrão necessário pelo Hibernate/JPA
    constructor() : this(0L, "", 0, BigDecimal.ZERO)
}
