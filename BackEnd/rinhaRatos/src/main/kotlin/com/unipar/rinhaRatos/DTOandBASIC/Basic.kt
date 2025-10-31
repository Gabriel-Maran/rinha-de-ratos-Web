package com.unipar.rinhaRatos.DTOandBASIC

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