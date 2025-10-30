package com.unipar.rinhaRatos.DTOandBASIC

data class ClasseDTO(
    val idClasse: Long,
    val nomeClasse: String,
    val apelido: String?,
    val strMin: Int,
    val strMax: Int,
    val agiMin: Int,
    val agiMax: Int,
    val hpsMin: Int,
    val hpsMax: Int,
    val intMin: Int,
    val intMax: Int,
    val defMin: Int,
    val defMax: Int,
    val habilidades: List<HabilidadeDTO> = emptyList(),
    val ratos: List<RatoDTO> = emptyList()
)