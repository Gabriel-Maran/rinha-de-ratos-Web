package com.unipar.rinhaRatos.models

import com.unipar.rinhaRatos.enums.TipoConta
import jakarta.persistence.*

@Entity
@Table(name = "usuarios")
class Usuario(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id_usuario: Long = 0,

    @Column(nullable = false)
    var nome: String,

    @Column(nullable = false, unique = true)
    var email: String,

    @Column(name = "senha", nullable = false) // 'senha' no DDL
    var senhaHash: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var tipo_conta: TipoConta = TipoConta.JOGADOR,

    @Column(nullable = false)
    var mousecoin_saldo: Int = 30, // Default do seu DDL

    // Esta é a "outra ponta" da relação
    // 'mappedBy = "usuario"' diz ao Spring que a entidade 'Rato' gerencia esta relação
    @OneToMany(
        mappedBy = "usuario",
        cascade = [CascadeType.ALL], // Se deletar um usuário, deleta seus ratos
        orphanRemoval = true
    )
    val ratos: MutableList<Rato> = mutableListOf()
)