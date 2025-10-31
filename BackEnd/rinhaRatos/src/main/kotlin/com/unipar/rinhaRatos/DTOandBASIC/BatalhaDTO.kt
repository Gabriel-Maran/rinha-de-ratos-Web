package com.unipar.rinhaRatos.DTOandBASIC

import com.unipar.rinhaRatos.enums.StatusBatalha
import java.math.BigDecimal
import java.time.LocalDateTime

data class UsuarioSummaryDTO(
    val idUsuario: Long,
    val nome: String,
    val email: String? = null
)

data class RatoSummaryDTO(
    val idRato: Long,
    val nomeCustomizado: String
)

data class ClasseSummaryDTO(
    val idClasse: Long,
    val nomeClasse: String
)

data class HabilidadeSummaryDTO(
    val idHabilidade: Long,
    val nomeHabilidade: String
)

data class UsuarioDTO(
    val idUsuario: Long,
    val nome: String,
    val email: String,
    val senha: String?,
    val tipoConta: String,
    val mousecoinSaldo: Int,
    val vitorias: Int,
    val ratos: List<RatoSummaryDTO> = emptyList()
)

data class RatoDTO(
    val idRato: Long,
    val nomeCustomizado: String,
    val descricao: String,
    val usuario: UsuarioSummaryDTO?,
    val classe: ClasseDTO?,
    val habilidade: HabilidadeDTO?,
    val strBase: Int,
    val agiBase: Int,
    val hpsBase: Int,
    val intBase: Int,
    val defBase: Int,
    val estaTorneio: Boolean,
    val estaVivo: Boolean
)

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
    val habilidades: List<HabilidadeSummaryDTO> = emptyList(),
    val ratos: List<RatoSummaryDTO> = emptyList()
)

data class HabilidadeDTO(
    val idHabilidade: Long,
    val classe: ClasseSummaryDTO?,
    val nomeHabilidade: String,
    val descricao: String?,
    val chanceSucesso: Int,
    val cooldown: Int,
    val efeitoSucessoStr: String?,
    val efeitoFalhaStr: String?,
    val efetivoTxt: String?,
    val falhaTxt: String?,
    val ratos: List<RatoSummaryDTO> = emptyList()
)

data class LojaPacotesDTO(
    val idPacote: Long,
    val nomePacote: String,
    val mousecoinQuantidade: Int,
    val precoBrl: BigDecimal
)

data class BatalhaDTO(
    val idBatalha: Long,
    val admCriador: UsuarioSummaryDTO,
    val nomeBatalha: String,
    val dataHorarioInicio: LocalDateTime,
    val custoInscricao: Int,
    val premioTotal: Int,
    val status: StatusBatalha,
    val jogador1: UsuarioSummaryDTO?,
    val rato1: RatoSummaryDTO?,
    val jogador2: UsuarioSummaryDTO?,
    val rato2: RatoSummaryDTO?,
    val vencedor: UsuarioSummaryDTO?,
    val perdedor: UsuarioSummaryDTO?
)

data class ErrorResponse(
    val timestamp: String,
    val status: Int,
    val error: String,
    val message: String?,
    val code: String
)