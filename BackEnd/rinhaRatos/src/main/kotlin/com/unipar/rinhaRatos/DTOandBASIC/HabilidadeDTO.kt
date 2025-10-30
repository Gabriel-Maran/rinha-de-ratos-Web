package com.unipar.rinhaRatos.DTOandBASIC

data class HabilidadeDTO(
    val idHabilidade: Long,
    val classeId: Long?,
    val classeNome: String?,
    val nomeHabilidade: String,
    val descricao: String?,
    val chanceSucesso: Int,
    val cooldown: Int,
    val efeitoSucessoStr: String?,
    val efeitoFalhaStr: String?,
    val efetivoTxt: String?,
    val falhaTxt: String?
)