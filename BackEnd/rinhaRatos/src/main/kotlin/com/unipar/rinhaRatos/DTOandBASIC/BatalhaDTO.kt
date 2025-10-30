package com.unipar.rinhaRatos.DTOandBASIC

import com.unipar.rinhaRatos.enums.StatusBatalha

data class BatalhaDTO(
    val idBatalha: Long,
    val admCriador: UsuarioSummaryDTO,
    val nomeBatalha: String,
    val dataHorarioInicio: String,
    val custoInscricao: Int,
    val premioTotal: Int,
    val status: StatusBatalha,
    val jogador1: UsuarioSummaryDTO? = null,
    val rato1: RatoDTO? = null,
    val jogador2: UsuarioSummaryDTO? = null,
    val rato2: RatoDTO? = null,
    val vencedor: UsuarioSummaryDTO? = null,
    val perdedor: UsuarioSummaryDTO? = null
)
