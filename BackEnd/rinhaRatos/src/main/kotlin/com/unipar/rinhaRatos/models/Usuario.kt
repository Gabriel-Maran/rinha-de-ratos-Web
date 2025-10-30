package com.unipar.rinhaRatos.models

import com.unipar.rinhaRatos.enums.TipoConta
import jakarta.persistence.*
import java.io.Serializable

@Entity
@Table(name = "usuarios")
class Usuario(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var idUsuario: Long = 0L,

    @Column(nullable = false)
    var nome: String = "",

    @Column(nullable = false, unique = true)
    var email: String = "",

    @Column(name = "senha", nullable = false)
    var senha: String = "",

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var tipoConta: TipoConta = TipoConta.JOGADOR,

    @Column(nullable = false)
    var mousecoinSaldo: Int = 30,

    @Column(nullable = false)
    var vitorias: Int = 0,

    @OneToMany(
        mappedBy = "usuario",
        cascade = [CascadeType.ALL],
        orphanRemoval = true
    )
    var ratos: MutableList<Rato> = mutableListOf()
) : Serializable {

    // construtor no-arg exigido pelo JPA/Hibernate (delegando para o primário)
    constructor() : this(
        0L,
        "",
        "",
        "",
        TipoConta.JOGADOR,
        30,
        0,
        mutableListOf()
    )
}
