package com.unipar.rinhaRatos.DTOandBASIC

// Guarda todos os modelos mais SINMPLES da batalha, usuario e rato
// Eles são usados para retornas e realizar operações super simples de cada um deles

data class RatoBasic(
    val nomeCustomizado: String?,
    val idUsuario: Long,
    val idHabilidade: Long,
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