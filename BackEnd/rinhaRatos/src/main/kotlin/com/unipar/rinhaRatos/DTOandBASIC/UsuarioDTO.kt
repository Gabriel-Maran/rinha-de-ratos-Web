package com.unipar.rinhaRatos.DTOandBASIC
import com.unipar.rinhaRatos.enums.TipoConta

data class UsuarioDTO(
    val idUsuario: Long,
    val nome: String,
    val email: String,
    val tipoConta: TipoConta,
    val mousecoinSaldo: Int,
    val vitorias: Int,
    val ratos: List<RatoDTO>
)
