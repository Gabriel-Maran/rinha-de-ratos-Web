package com.unipar.rinhaRatos.DTOandBASIC

import com.unipar.rinhaRatos.enums.ClassesRato
import com.unipar.rinhaRatos.enums.StatusBatalha
import com.unipar.rinhaRatos.mapper.toSummaryDto
import jakarta.persistence.Column
import java.math.BigDecimal
import java.time.LocalDateTime

data class UsuarioSummaryDTO(
    val idUsuario: Long,
    val idFotoPerfil: Long? = 0,
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

data class BatalhaSummary(
    val idAdm : Long = 0L,
    val nomeBatalha: String = "",
    val dataHorarioInicio: String = "",
)

data class UsuarioDTO(
    val idUsuario: Long,
    val idFotoPerfil: Long? = 0,
    val nome: String,
    val email: String,
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
    val classe: ClasseSummaryDTO?,
    val habilidade: HabilidadeSummaryDTO?,
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
    val descricao: String,
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
    val habilidades: List<HabilidadeSummaryDTO> = emptyList()
)

data class HabilidadeDTO(
    val idHabilidade: Long,
    val classe: ClasseSummaryDTO?,
    val nomeHabilidade: String,
    val descricao: String?,
    val chanceSucesso: Int,
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

data class MessageRoundDTO(
    val idmessage: Long,
    val descricao: String,
    val id_batalha: Long,
    val round: Long,
    val player: Long
)

data class ResultsDTO(
    var idresult: Long = 0L,
    var vencedorUserName: String,
    var perdedorUserName: String,
    var vencedorRatoName: String,
    var perdedorRatoName: String,
    var vencedorRatoType: ClassesRato,
    var perdedorRatoType: ClassesRato,
    var vencedorRatoHP: Float,
    var perdedorRatoHP: Float
)
