package com.unipar.rinhaRatos.models

import jakarta.persistence.*

@Entity
@Table(name = "batalhas")
class Batalha(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id_batalha: Long = 0,
) {
}