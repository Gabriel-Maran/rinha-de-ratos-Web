package com.unipar.rinhaRatos.DTOandBASIC

import java.time.LocalDateTime

data class RatoBasic (
    val nomeCustomizado: String?,
    val idUsuario: Long,
    val nomeHabilidade: String,
)

data class UsuarioBasic(
    val email: String,
    val senha: String,
    val nome : String
)

data class BatalhaBasic(
    val nome: String,
    val dataInicio:LocalDateTime,
    val custoInscricao: Int
)