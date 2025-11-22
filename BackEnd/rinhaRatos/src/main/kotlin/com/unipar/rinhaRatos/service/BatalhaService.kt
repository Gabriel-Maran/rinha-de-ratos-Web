package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.DTOandBASIC.BatalhaBasic
import com.unipar.rinhaRatos.DTOandBASIC.BatalhaDTO
import com.unipar.rinhaRatos.DTOandBASIC.BatalhaSummary
import com.unipar.rinhaRatos.DTOandBASIC.RatoBasic
import com.unipar.rinhaRatos.DTOandBASIC.RatoDTO
import com.unipar.rinhaRatos.DTOandBASIC.RatoSummaryDTO
import com.unipar.rinhaRatos.enums.StatusBatalha
import com.unipar.rinhaRatos.enums.TipoConta
import com.unipar.rinhaRatos.models.Batalha
import com.unipar.rinhaRatos.models.Rato
import com.unipar.rinhaRatos.models.Usuario
import com.unipar.rinhaRatos.repositorys.BatalhaRepository
import com.unipar.rinhaRatos.repositorys.RatoRepository
import com.unipar.rinhaRatos.repositorys.UsuarioRepository
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException
import java.util.Optional

@Service
@Transactional
class BatalhaService(
    private val batalhaRepository: BatalhaRepository,
    private val usuarioRepository: UsuarioRepository,
    private val ratoRepository: RatoRepository,
    private val battleManager : GerenciadorBatalhasAutomatica,
    private val ratoService: RatoService
) {
    private val ISO_FORMATTER: DateTimeFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME
    private val log = LoggerFactory.getLogger(javaClass)

    fun pegarTodasAsBatalhasAbertas(): List<Batalha> =
        batalhaRepository.findAllByStatusIs(StatusBatalha.InscricoesAbertas)

    fun pegarBatalhasFeitasPelaADMPorId(idAdm: Long): List<Batalha> =
        batalhaRepository.findAllByAdmCriador_IdUsuario(idAdm)

    fun pegarTodasAsBatalhasDoUsuario(idUsuario: Long): List<Batalha> =
        batalhaRepository.pegarTodasBatalhasDoUsuario(idUsuario)

    fun pegarTodasAsBatalhasDoUsuarioQueNaoAcabaram(idUsuario: Long): List<Batalha> =
        batalhaRepository.pegarTodasBatalhasDoUsuarioComInscricaoAberta(idUsuario)

    fun pegarTodasAsBatalhasAcabadas(): List<Batalha> =
        batalhaRepository.pegarTodasAsBatalhasAcabadas()

    fun pegarTodasBatalhasDoUsuarioConcluidas(idUsuario: Long): List<Batalha> =
        batalhaRepository.pegarTodasBatalhasDoUsuarioConcluidas(idUsuario)

    fun pegarTodasAsBatalhasAbertasQueOUserNParticipa(idUsuario: Long): MutableList<Batalha> {
        val batalhas = pegarTodasAsBatalhasAbertas()
        val batalhasParaUser = mutableListOf<Batalha>()
        for (batalha in batalhas) {
            val player1 = batalha.jogador1?.idUsuario ?: -100
            val player2 = batalha.jogador2?.idUsuario ?: -100
            if(player1 != idUsuario && player2 != idUsuario){
                batalhasParaUser.add(batalha)
            }
        }
        return batalhasParaUser
    }

    fun batalhaCheia(idBatalha: Long): String {
        val batalhaOpt = batalhaRepository.findById(idBatalha)
        if (batalhaOpt.isEmpty) return "BATALHA_NOT_FOUND"
        val batalha = batalhaOpt.get()
        return if (batalha.jogador1 != null && batalha.jogador2 != null) "BATALHA_CHEIA" else "BATALHA_NAO_CHEIA"
    }

    fun usuarioEstaBatalha(idBatalha: Long, idUsuario: Long): String {
        val batalhaOpt = batalhaRepository.findById(idBatalha)
        if (batalhaOpt.isEmpty) return "BATALHA_NOT_FOUND"
        val batalha = batalhaOpt.get()

        if (batalha.jogador1?.idUsuario == idUsuario || batalha.jogador2?.idUsuario == idUsuario) {
            return "USER_IS_IN_THIS_BATTLE"
        }

        if (batalha.rato1?.usuario?.idUsuario == idUsuario || batalha.rato2?.usuario?.idUsuario == idUsuario) {
            return "USER_IS_IN_THIS_BATTLE"
        }

        return "USER_IS_NOT_IN_THIS_BATTLE"
    }

    fun getById(idBatalha: Long, ): Optional<Batalha> {
        val batalha =  batalhaRepository.findById(idBatalha)
        if(batalha.isEmpty){
            log.warn("Batalha vazia no id $idBatalha")
        }
        return batalha
    }

    fun criarBatalha(basic: BatalhaBasic): Batalha {
        val admOpt = usuarioRepository.findById(basic.idAdmCriador)
        if (admOpt.isEmpty) {
            throw IllegalArgumentException("USER_NOT_FOUND")
        }
        val adm = admOpt.get()
        if(basic.nomeBatalha.trim().length > 40 ) throw IllegalArgumentException("NAME_LIMIT_EXCEPTED")
        if(adm.tipoConta != TipoConta.ADM) throw IllegalArgumentException("USER_IS_NOT_ADM")
        val parsedDate = try {
            parseIsoToLocalDateTime(basic.dataHorarioInicio)
        } catch (e: IllegalArgumentException) {
            throw IllegalArgumentException("BAD_DATE_FORMAT: ${e.message}")
        }

        val batalhaFinal = Batalha().apply {
            nomeBatalha = basic.nomeBatalha.trim().ifEmpty { "Sem nome" }
            dataHorarioInicio = parsedDate ?: LocalDateTime.now()
            custoInscricao = if(basic.custoInscricao <= 0) 5 else basic.custoInscricao
            premioTotal = if(basic.custoInscricao <= 0) 5 else basic.custoInscricao * 2
            admCriador = adm
            status = StatusBatalha.InscricoesAbertas
        }

        val saved = batalhaRepository.save(batalhaFinal)
        log.info("Batalha criada id=${saved.idBatalha}, nome='${saved.nomeBatalha}', data='${saved.dataHorarioInicio}'")
        return saved
    }

    fun atualizarInfomacoesBatalha(idBatalha: Long, summary: BatalhaSummary): String {
        val admOpt = usuarioRepository.findById(summary.idAdm)
        if (admOpt.isEmpty) return "USER_NOT_FOUND"
        if(admOpt.get().tipoConta != TipoConta.ADM) return "USER_IS_NOT_ADM"
        val batalhaOpt = batalhaRepository.findById(idBatalha)
        if (batalhaOpt.isEmpty) return "BATALHA_NOT_FOUND"
        val batalha = batalhaOpt.get()

        if (batalha.status == StatusBatalha.EmAndamento || batalha.status == StatusBatalha.Concluida) {
            return "BATALHA_HAPPENING_OR_OVER"
        }

        val novoNome = summary.nomeBatalha.trim()
        if (novoNome.isNotEmpty()) {
            batalha.nomeBatalha = novoNome
        }

        if (summary.dataHorarioInicio.isNotBlank()) {
            val parsed = try {
                parseIsoToLocalDateTime(summary.dataHorarioInicio)
            } catch (e: IllegalArgumentException) {
                return "BAD_DATE_FORMAT"
            }
            if (parsed != null) {
                batalha.dataHorarioInicio = parsed
            }
        }

        if (summary.inscricaoMousecoin <=0 ){
            batalha.custoInscricao = 10
        }else{
            batalha.custoInscricao = summary.inscricaoMousecoin
        }
        batalha.premioTotal = batalha.custoInscricao * 2

        batalhaRepository.save(batalha)
        log.info("Batalha $idBatalha atualizada (nome/data). Nova data: ${batalha.dataHorarioInicio}")
        return "OK"
    }


    fun excluirBatalhaPorId(idBatalha: Long): String {
        val batalhaOpt = batalhaRepository.findById(idBatalha)
        if (batalhaOpt.isEmpty) return "BATALHA_NOT_FOUND"
        val batalha = batalhaOpt.get()
        if (batalha.status == StatusBatalha.EmAndamento || batalha.status == StatusBatalha.Concluida) return "BATALHA_HAPPENING_OR_OVER"

        batalha.rato1?.let { r ->
            safeUnsetRatoTorneio(r)
        }
        batalha.rato2?.let { r ->
            safeUnsetRatoTorneio(r)
        }

        batalhaRepository.deleteById(idBatalha)
        log.info("Batalha $idBatalha excluída pelo sistema")
        return "OK"
    }

    fun entrarNaBatalha(idBatalha: Long, idUsuario: Long, idRato: Long): String {
        val batalhaOpt = batalhaRepository.findById(idBatalha)
        if (batalhaOpt.isEmpty) return "BATALHA_NOT_FOUND"
        val usuarioOpt = usuarioRepository.findById(idUsuario)
        if (usuarioOpt.isEmpty) return "USER_NOT_FOUND"
        val ratoOpt = ratoRepository.findById(idRato)
        if (ratoOpt.isEmpty) return "RATO_NOT_FOUND"

        val batalha = batalhaOpt.get()
        val usuario = usuarioOpt.get()
        val rato = ratoOpt.get()

        if (batalha.status != StatusBatalha.InscricoesAbertas) return "BATALHA_NOT_OPEN"
        if (usuario.mousecoinSaldo < batalha.custoInscricao) return "CANNOT_PAY"
        if (!rato.estaVivo) return "RATO_NOT_ELIGIBLE"
        if (rato.estaTorneio) return "RATO_NOT_ELIGIBLE"

        val dono = rato.usuario ?: return "USER_NOT_FOUND"
        if (dono.idUsuario != usuario.idUsuario) return "BAD_REQUEST"

        if (batalha.jogador1?.idUsuario == usuario.idUsuario || batalha.jogador2?.idUsuario == usuario.idUsuario) {
            return "BAD_REQUEST"
        }

        if (batalha.rato1 == null) {
            batalha.rato1 = rato
            batalha.jogador1 = usuario
        } else if (batalha.rato2 == null) {
            batalha.rato2 = rato
            batalha.jogador2 = usuario
        } else {
            return "BATALHA_CHEIA"
        }

        usuario.mousecoinSaldo -= batalha.custoInscricao
        rato.estaTorneio = true
        ratoRepository.save(rato)
        batalhaRepository.save(batalha)

        log.info("Usuário ${usuario.idUsuario} (rato ${rato.idRato}) entrou na batalha ${batalha.idBatalha}")
        return "OK"
    }

    fun sairBatalha(idBatalha: Long, idUsuario: Long): String {
        val batalhaOpt = batalhaRepository.findById(idBatalha)
        if (batalhaOpt.isEmpty) return "BATALHA_NOT_FOUND"
        val batalha = batalhaOpt.get()

        if (batalha.status != StatusBatalha.InscricoesAbertas) return "BATALHA_ALREADY_STARTED"

        val removed = removePlayerFromBattle(batalha, idUsuario)
        if (!removed) return "USER_NOT_IN_BATTLE"

        batalhaRepository.save(batalha)
        log.info("Usuário $idUsuario saiu/removido da batalha $idBatalha")
        return "OK"
    }

    private fun safeUnsetRatoTorneio(ratoRef: Rato) {
        val ropt = ratoRepository.findById(ratoRef.idRato)
        if (ropt.isPresent) {
            val rdb = ropt.get()
            rdb.estaTorneio = false
            ratoRepository.save(rdb)
        }
    }

    private fun removePlayerFromBattle(batalha: Batalha, usuarioId: Long): Boolean {
        if (batalha.jogador1?.idUsuario == usuarioId) {
            batalha.rato1?.let { r -> safeUnsetRatoTorneio(r) }
            batalha.jogador1 = null
            batalha.rato1 = null
            return true
        }

        if (batalha.jogador2?.idUsuario == usuarioId) {
            batalha.rato2?.let { r -> safeUnsetRatoTorneio(r) }
            batalha.jogador2 = null
            batalha.rato2 = null
            return true
        }

        return false
    }

    fun iniciarBatalhaAsync(idBatalha: Long): String {
        val opt = batalhaRepository.findById(idBatalha)
        if (opt.isEmpty) return "BATALHA_NOT_FOUND"
        val batalha = opt.get()

        // só pode iniciar quando estiver em inscrições abertas
        if (batalha.status != StatusBatalha.InscricoesAbertas) {
            return "BATALHA_HAPPENING_OR_OVER" // usa mesmo código de erro já conhecido
        }

        // marca como em andamento e salva imediatamente para sinalizar que começou
        batalha.status = StatusBatalha.EmAndamento
        batalhaRepository.save(batalha)
        if(batalha.jogador1 == null || batalha.jogador2 == null) return "NOT_ENOUGH_USERS"

        // delega ao gerenciador: ele retorna false se já estiver rodando
        val iniciou = battleManager.iniciarSimulacaoBatalhaAsync(idBatalha)
        return if (iniciou) "OK" else "ALREADY_RUNNING"
    }

    fun criarBatalhaComBot(idUsuario: Long, idRato: Long): Map<String, String>{
        val usuarioOpt = usuarioRepository.findById(idUsuario)
        val ratoOpt = ratoRepository.findById(idRato)
        if(usuarioOpt.isEmpty || ratoOpt.isEmpty) return mapOf("message" to "Usuário ou rato não existente", "error" to "USER_OR_RATO_NOT_FOUND")
        val rato = ratoOpt.get()
        val usuario = usuarioOpt.get()
        if(rato.usuario!!.idUsuario != usuario.idUsuario) return mapOf("message" to "Rato não pertence a este usuário", "error" to "RATO_DONT_BELONG_THIS_PLAYER")
        if(!rato.estaVivo) return mapOf("message" to "Rato está morto", "error" to "RATO_IS_DEAD")
        if(usuarioRepository.countBots() == 0L){
            usuarioRepository.save(
                Usuario(
                    email = "BOT@bot.rinhaderatos.com",
                    nome = "BOT",
                    senha =  "BOT",
                    tipoConta = TipoConta.BOT,
                    mousecoinSaldo = 0
                )
            )
        }
        val botUser = usuarioRepository.findByEmail("BOT@bot.rinhaderatos.com").get()

        val retorno = ratoService.cadastrarRato(
                RatoBasic(
                    idUsuario = botUser.idUsuario,
                    nomeCustomizado = "",
                    idHabilidade = (1..18).random().toLong()
                )
        )
        val botRato = ratoRepository.findById(retorno["idRato"]!!.toLong()).get()

        val criarBatalha = batalhaRepository.save<Batalha>(
            Batalha(
                nomeBatalha = "Bot Battle",
                dataHorarioInicio = LocalDateTime.now(),
                premioTotal = 0,
                admCriador = usuarioRepository.findById(-1).get(),
                status = StatusBatalha.InscricoesAbertas,
                custoInscricao = 0,
                jogador1 = usuario,
                rato1 = rato,
                jogador2 = botUser,
                rato2 = botRato
            )
        )
        return mapOf("idBatalha" to criarBatalha.idBatalha.toString())
    }

    fun estaSimulandoBatalha(idBatalha: Long): Boolean {
        return battleManager.estaExecutando(idBatalha)
    }

    fun parseIsoToLocalDateTime(value: String?): LocalDateTime? {
        if (value.isNullOrBlank()) return null
        val dataString = value.trim()
        return try {
            LocalDateTime.parse(dataString, ISO_FORMATTER)
        } catch (e: DateTimeParseException) {
            throw IllegalArgumentException("Formato inválido para data/hora. Use ISO-8601 sem offset: yyyy-MM-dd'T'HH:mm:ss (ex: 2025-11-10T20:00:00). Recebido: '$value'")
        }
    }
}
