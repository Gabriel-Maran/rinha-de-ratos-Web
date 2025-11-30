package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.DTOandBASIC.BatalhaBasic
import com.unipar.rinhaRatos.DTOandBASIC.BatalhaSummary
import com.unipar.rinhaRatos.enums.StatusBatalha
import com.unipar.rinhaRatos.enums.TipoConta
import com.unipar.rinhaRatos.models.Batalha
import com.unipar.rinhaRatos.models.Rato
import com.unipar.rinhaRatos.repositorys.BatalhaRepository
import com.unipar.rinhaRatos.repositorys.RatoRepository
import com.unipar.rinhaRatos.repositorys.UsuarioRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException
import java.util.Optional
import kotlin.random.Random
import kotlin.random.nextLong

// Service Principal da batalha
// Comentado apenas em partes essenciais, as outras se auto descrevem

@Service
@Transactional
class BatalhaService(
    private val batalhaRepository: BatalhaRepository,
    private val usuarioRepository: UsuarioRepository,
    private val ratoRepository: RatoRepository,
    private val battleManager: GerenciadorBatalhasAutomatica,
) {
    // Pega ISO para fazer parse da data e hora para o formato ISO
    // Utiliza de log para informações
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

    fun pegarTodasAsBatalhasAcabadasSemBot(): List<Batalha> {
        val todasBatalhas = batalhaRepository.pegarTodasAsBatalhasAcabadas()
        val batalhasSemBot = todasBatalhas.filter { battle ->
            (battle.jogador1?.tipoConta ?: TipoConta.ADM) == TipoConta.JOGADOR && (battle.jogador2?.tipoConta
                ?: TipoConta.ADM) == TipoConta.JOGADOR
        }
        return batalhasSemBot
    }

    fun pegarTodasBatalhasDoUsuarioConcluidas(idUsuario: Long): List<Batalha> =
        batalhaRepository.pegarTodasBatalhasDoUsuarioConcluidas(idUsuario)

    fun pegarTodasBatalhasDoUsuarioConcluidasSemBot(idUsuario: Long): List<Batalha> {
        val batalhas = batalhaRepository.pegarTodasBatalhasDoUsuarioConcluidas(idUsuario)
        val batalhasSemBot = mutableListOf<Batalha>()
        for (batalha in batalhas) {
            if (batalha.custoInscricao > 0) {
                batalhasSemBot.add(batalha)
            }
        }
        return batalhasSemBot
    }

    fun pegarTodasAsBatalhasAbertasQueOUserNParticipa(idUsuario: Long): MutableList<Batalha> {
        val batalhas = pegarTodasAsBatalhasAbertas()
        val batalhasParaUser = mutableListOf<Batalha>()
        for (batalha in batalhas) {
            val player1 = batalha.jogador1?.idUsuario ?: -100
            val player2 = batalha.jogador2?.idUsuario ?: -100
            if (player1 != idUsuario && player2 != idUsuario) {
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

    fun getById(idBatalha: Long): Optional<Batalha> {
        val batalha = batalhaRepository.findById(idBatalha)
        if (batalha.isEmpty) {
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
        if (basic.nomeBatalha.trim().length > 40) throw IllegalArgumentException("NAME_LIMIT_EXCEPTED")
        if (basic.custoInscricao.toString().length > 4) throw IllegalArgumentException("COINS_LIMIT_EXCEPTED")
        if (adm.tipoConta != TipoConta.ADM) throw IllegalArgumentException("USER_IS_NOT_ADM")
        val parsedDate = try {
            parseIsoToLocalDateTime(basic.dataHorarioInicio)
        } catch (e: IllegalArgumentException) {
            throw IllegalArgumentException("BAD_DATE_FORMAT: ${e.message}")
        }

        val batalhaFinal = Batalha().apply {
            nomeBatalha = basic.nomeBatalha.trim().ifEmpty { "Sem nome" }
            dataHorarioInicio = parsedDate ?: LocalDateTime.now()
            custoInscricao = if (basic.custoInscricao <= 0) 5 else basic.custoInscricao
            premioTotal = if (basic.custoInscricao <= 0) 5 else basic.custoInscricao * 2
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
        if (admOpt.get().tipoConta != TipoConta.ADM) return "USER_IS_NOT_ADM"
        val batalhaOpt = batalhaRepository.findById(idBatalha)
        if (batalhaOpt.isEmpty) return "BATALHA_NOT_FOUND"
        val batalha = batalhaOpt.get()

        if (batalha.status == StatusBatalha.Concluida) {
            return "BATALHA_HAPPENING_OR_OVER"
        }

        val novoNome = summary.nomeBatalha.trim()
        if (novoNome.isNotEmpty()) {
            batalha.nomeBatalha = novoNome
        }

        // Salva a data e o tempo em que a batalha foi setada para acontecer
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

        // Valida de que batalhas entre player nunca terão saldo menor ou igual a 0
        // Porq -> Batalha que tem 0 de custo são batalhas de bots e batalhas com < 0 de custo são 100% invalidas, se increver e ganhar dinheiro? KKKKKKK
        if (summary.inscricaoMousecoin <= 0) {
            batalha.custoInscricao = 10 // Valor padrão para se increver em uma batalha
        } else {
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
        if (batalha.status == StatusBatalha.Concluida) return "BATALHA_HAPPENING_OR_OVER"
        //Retira ratos da batalha, por conta de exclusão
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

        val jogadorOpt = usuarioRepository.findById(idUsuario)
        if (jogadorOpt.isEmpty) return "USER_NOT_FOUND"
        val jogador = jogadorOpt.get()
        jogador.mousecoinSaldo += batalha.custoInscricao

        if (batalha.status != StatusBatalha.InscricoesAbertas) return "BATALHA_ALREADY_STARTED"

        val removed = removePlayerFromBattle(batalha, idUsuario)
        if (!removed) return "USER_NOT_IN_BATTLE"

        usuarioRepository.save(jogador)
        batalhaRepository.save(batalha)
        log.info("Usuário $idUsuario saiu/removido da batalha $idBatalha")
        return "OK"
    }
    // Remove o rato da batalha
    // Garante que o rato possa se incrrever em outras batalhas, caso seja removido da batalha, ou a batalha seja excluida
    private fun safeUnsetRatoTorneio(ratoRef: Rato) {
        val ropt = ratoRepository.findById(ratoRef.idRato)
        if (ropt.isPresent) {
            val rdb = ropt.get()
            rdb.estaTorneio = false
            ratoRepository.save(rdb)
        }
    }
    //Remove o jogador da batalha
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

    fun iniciarBatalha(idBatalha: Long): String {
        val opt = batalhaRepository.findById(idBatalha)
        if (opt.isEmpty) return "BATALHA_NOT_FOUND"
        val batalha = opt.get()

        // só pode iniciar quando estiver em inscrições abertas
        if (batalha.status != StatusBatalha.InscricoesAbertas) {
            return "BATALHA_HAPPENING_OR_OVER" // usa mesmo código de erro já conhecido
        }

        // marca como em andamento e salva imediatamente para sinalizar que começou
        if (batalha.jogador1 == null || batalha.jogador2 == null) return "NOT_ENOUGH_USERS"

        // delega ao gerenciador: ele retorna false se já estiver rodando
        val iniciou = battleManager.iniciarSimulacaoBatalha(idBatalha)
        if(!iniciou) return "BATALHA_HAPPENING_OR_OVER"
        batalha.status = StatusBatalha.Concluida
        batalhaRepository.save(batalha)
        return "OK"
    }

    // Cria batalha padrão contra um BOT, como explicado, sem custo e sem perder ou ganhar nada
    fun criarBatalhaComBot(idUsuario: Long, idRato: Long): Map<String, String> {
        val usuarioOpt = usuarioRepository.findById(idUsuario)
        val ratoOpt = ratoRepository.findById(idRato)
        if (usuarioOpt.isEmpty || ratoOpt.isEmpty) return mapOf(
            "message" to "Usuário ou rato não existente",
            "error" to "USER_OR_RATO_NOT_FOUND"
        )
        val rato = ratoOpt.get()
        val usuario = usuarioOpt.get()
        if (rato.usuario!!.idUsuario != usuario.idUsuario) return mapOf(
            "message" to "Rato não pertence a este usuário",
            "error" to "RATO_DONT_BELONG_THIS_PLAYER"
        )
        if (!rato.estaVivo) return mapOf("message" to "Rato está morto", "error" to "RATO_IS_DEAD")
        val botUser = usuarioRepository.findById(-2).get()
        val randomLong = Random.nextLong(1L..18L) * -1
        val botRato = ratoRepository.findById(randomLong).get()

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

    // Parser do LocalDateTime da batalha, salvando em formato da ISO
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
