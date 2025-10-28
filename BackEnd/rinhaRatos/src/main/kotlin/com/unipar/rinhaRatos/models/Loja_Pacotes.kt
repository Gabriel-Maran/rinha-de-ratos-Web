package com.unipar.rinhaRatos.models

import jakarta.persistence.*


@Entity
@Table(name = "loja_Pacotes")
class Loja_Pacotes(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id_batalha: Long = 0,
) {
}