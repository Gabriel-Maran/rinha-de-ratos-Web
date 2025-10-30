package com.unipar.rinhaRatos.mapper

import com.unipar.rinhaRatos.DTOandBASIC.*
import com.unipar.rinhaRatos.models.*

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

fun Usuario.toSummaryDto(): UsuarioSummaryDTO {
    return UsuarioSummaryDTO(
        idUsuario = this.idUsuario,
        nome = this.nome
    )
}

fun LojaPacotes.toDto(): LojaPacotesDTO {
    return LojaPacotesDTO(
        idPacote = this.idPacote,
        nomePacote = this.nomePacote,
        mousecoinQuantidade = this.mousecoinQuantidade,
        precoBrl = this.precoBrl
    )
}

fun Habilidade.toDto(): HabilidadeDTO {
    val classeId = this.classe?.idClasse
    val classeNome = this.classe?.nomeClasse
    return HabilidadeDTO(
        idHabilidade = this.idHabilidade,
        classeId = classeId,
        classeNome = classeNome,
        nomeHabilidade = this.nomeHabilidade,
        descricao = this.descricao,
        chanceSucesso = this.chanceSucesso,
        cooldown = this.cooldown,
        efeitoSucessoStr = this.efeitoSucessoStr,
        efeitoFalhaStr = this.efeitoFalhaStr,
        efetivoTxt = this.efetivoTxt,
        falhaTxt = this.falhaTxt
    )
}

fun Classe.toDto(): ClasseDTO {
    val habilidadesDto = this.habilidades.map { it.toDto() }
    val ratosDto = this.ratos.map { it.toDto() }
    return ClasseDTO(
        idClasse = this.idClasse,
        nomeClasse = this.nomeClasse,
        apelido = this.apelido,
        strMin = this.strMin,
        strMax = this.strMax,
        agiMin = this.agiMin,
        agiMax = this.agiMax,
        hpsMin = this.hpsMin,
        hpsMax = this.hpsMax,
        intMin = this.intMin,
        intMax = this.intMax,
        defMin = this.defMin,
        defMax = this.defMax,
        habilidades = habilidadesDto,
        ratos = ratosDto
    )
}

fun Batalha.toDto(): BatalhaDTO {
    // formatador simples (pode ajustar para ISO se quiser)
    val dataStr = this.dataHorarioInicio.toString()

    return BatalhaDTO(
        idBatalha = this.idBatalha,
        admCriador = this.admCriador.toSummaryDto(),
        nomeBatalha = this.nomeBatalha,
        dataHorarioInicio = dataStr,
        custoInscricao = this.custoInscricao,
        premioTotal = this.premioTotal,
        status = this.status,
        jogador1 = this.jogador1?.toSummaryDto(),
        rato1 = this.rato1?.toDto(),
        jogador2 = this.jogador2?.toSummaryDto(),
        rato2 = this.rato2?.toDto(),
        vencedor = this.vencedor?.toSummaryDto(),
        perdedor = this.perdedor?.toSummaryDto()
    )
}
