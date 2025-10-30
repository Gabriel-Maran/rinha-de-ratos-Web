package com.unipar.rinhaRatos.DTOandBASIC

import java.math.BigDecimal

data class LojaPacotesDTO(
    val idPacote: Long,
    val nomePacote: String,
    val mousecoinQuantidade: Int,
    val precoBrl: BigDecimal
)