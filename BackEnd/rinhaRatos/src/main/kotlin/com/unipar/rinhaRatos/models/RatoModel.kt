package com.unipar.rinhaRatos.models

import jakarta.persistence.*

@Entity
@Table(name = "ratos")
class RatoModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id_rato: Long = 0,
    @Column(nullable = false)
    val nome_customizado: String,

    val descricao: String ? = null,

) {

}