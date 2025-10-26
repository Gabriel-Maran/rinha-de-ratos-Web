package com.unipar.rinhaRatos.models

import jakarta.persistence.*

@Entity
@Table(name = "Ratos")
class RatoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id_rato: Long = 0
}