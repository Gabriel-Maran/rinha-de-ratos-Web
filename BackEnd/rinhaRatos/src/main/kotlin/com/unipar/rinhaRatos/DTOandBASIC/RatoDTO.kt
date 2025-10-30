package com.unipar.rinhaRatos.DTOandBASIC

data class RatoDTO(
    val idRato: Long,
    val nomeCustomizado: String,
    val descricao: String,
    val strBase: Int,
    val agiBase: Int,
    val hpsBase: Int,
    val intBase: Int,
    val defBase: Int,
    val estaTorneio: Boolean,
    val estaVivo: Boolean
)
