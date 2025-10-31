package com.unipar.rinhaRatos.mapper

import com.unipar.rinhaRatos.DTOandBASIC.*
import com.unipar.rinhaRatos.models.*

fun Usuario.toSummaryDto(): UsuarioSummaryDTO {
    return UsuarioSummaryDTO(
        idUsuario = this.idUsuario,
        nome = this.nome,
        email = this.email
    )
}

fun Rato.toSummaryDto(): RatoSummaryDTO {
    return RatoSummaryDTO(
        idRato = this.idRato,
        nomeCustomizado = this.nomeCustomizado
    )
}

fun Classe.toSummaryDto(): ClasseSummaryDTO {
    return ClasseSummaryDTO(
        idClasse = this.idClasse,
        nomeClasse = this.nomeClasse
    )
}

fun Habilidade.toSummaryDto(): HabilidadeSummaryDTO {
    return HabilidadeSummaryDTO(
        idHabilidade = this.idHabilidade,
        nomeHabilidade = this.nomeHabilidade
    )
}

fun Usuario.toDto(): UsuarioDTO {
    val ratosSummary = this.ratos.map { it.toSummaryDto() }
    return UsuarioDTO(
        idUsuario = this.idUsuario,
        nome = this.nome,
        email = this.email,
        tipoConta = this.tipoConta.name,
        mousecoinSaldo = this.mousecoinSaldo,
        vitorias = this.vitorias,
        ratos = ratosSummary
    )
}

fun Rato.toDto(): RatoDTO {
    return RatoDTO(
        idRato = this.idRato,
        nomeCustomizado = this.nomeCustomizado,
        descricao = this.descricao,
        usuario = this.usuario?.toSummaryDto(),
        classe = this.classe?.toSummaryDto(),
        habilidade = this.habilidadeEscolhida?.toSummaryDto(),
        strBase = this.strBase,
        agiBase = this.agiBase,
        hpsBase = this.hpsBase,
        intBase = this.intBase,
        defBase = this.defBase,
        estaTorneio = this.estaTorneio,
        estaVivo = this.estaVivo
    )
}

fun Classe.toDto(): ClasseDTO {
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
        habilidades = this.habilidades.map { it.toSummaryDto() } // summaries
    )
}

fun Habilidade.toDto(): HabilidadeDTO {
    return HabilidadeDTO(
        idHabilidade = this.idHabilidade,
        classe = this.classe?.toSummaryDto(),
        nomeHabilidade = this.nomeHabilidade,
        descricao = this.descricao,
        chanceSucesso = this.chanceSucesso,
        cooldown = this.cooldown,
        efeitoSucessoStr = this.efeitoSucessoStr,
        efeitoFalhaStr = this.efeitoFalhaStr,
        efetivoTxt = this.efetivoTxt,
        falhaTxt = this.falhaTxt,
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

fun Batalha.toDto(): BatalhaDTO {
    return BatalhaDTO(
        idBatalha = this.idBatalha,
        admCriador = this.admCriador.toSummaryDto(),
        nomeBatalha = this.nomeBatalha,
        dataHorarioInicio = this.dataHorarioInicio,
        custoInscricao = this.custoInscricao,
        premioTotal = this.premioTotal,
        status = this.status,
        jogador1 = this.jogador1?.toSummaryDto(),
        rato1 = this.rato1?.toSummaryDto(),
        jogador2 = this.jogador2?.toSummaryDto(),
        rato2 = this.rato2?.toSummaryDto(),
        vencedor = this.vencedor?.toSummaryDto(),
        perdedor = this.perdedor?.toSummaryDto()
    )
}
