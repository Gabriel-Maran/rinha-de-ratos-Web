package com.unipar.rinhaRatos.DTOandBASIC

import java.time.LocalDateTime

data class RatoBasic(
    val nomeCustomizado: String?,
    val idUsuario: Long,
    val nomeHabilidade: String,
)

data class UsuarioBasic(
    val email: String,
    val senha: String,
    val nome: String
)

data class BatalhaBasic(
    val nomeBatalha: String = "",
    val dataHorarioInicio: String = "",
    val idAdmCriador: Long,
    val custoInscricao: Int = 0
)

data class MessageRoundBasic(
    var descricao: String = "",
    var id_batalha: Long = 0L,
    var round: Long = -1,
)