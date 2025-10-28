package com.unipar.rinhaRatos.models

import jakarta.persistence.*

@Entity
    @Table(name = "classes")
class Classe (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id_classe: Long = 0,
){
}