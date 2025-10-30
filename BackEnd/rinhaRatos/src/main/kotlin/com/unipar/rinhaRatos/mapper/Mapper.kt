package com.unipar.rinhaRatos.mapper

import com.unipar.rinhaRatos.DTOandBASIC.RatoDTO
import com.unipar.rinhaRatos.DTOandBASIC.UsuarioDTO
import com.unipar.rinhaRatos.models.Rato
import com.unipar.rinhaRatos.models.Usuario

fun Rato.toDto(): RatoDTO {
    return RatoDTO(
        idRato = this.idRato,
        nomeCustomizado = this.nomeCustomizado,
        descricao = this.descricao,
        strBase = this.strBase,
        agiBase = this.agiBase,
        hpsBase = this.hpsBase,
        intBase = this.intBase,
        defBase = this.defBase,
        estaTorneio = this.estaTorneio,
        estaVivo = this.estaVivo
    )
}

fun Usuario.toDto(): UsuarioDTO {
    val ratosDto = this.ratos.map { it.toDto() }

    return UsuarioDTO(
        idUsuario = this.idUsuario,
        nome = this.nome,
        email = this.email,
        tipoConta = this.tipoConta,
        mousecoinSaldo = this.mousecoinSaldo,
        vitorias = this.vitorias,
        ratos = ratosDto
    )
}
