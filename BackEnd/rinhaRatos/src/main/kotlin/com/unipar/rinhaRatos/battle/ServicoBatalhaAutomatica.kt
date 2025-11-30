package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.battle.*
import com.unipar.rinhaRatos.models.Batalha
import com.unipar.rinhaRatos.models.Rato
import com.unipar.rinhaRatos.models.MessageRound
import com.unipar.rinhaRatos.models.Results
import com.unipar.rinhaRatos.enums.ClassesRato
import com.unipar.rinhaRatos.enums.StatusBatalha
import com.unipar.rinhaRatos.enums.TipoConta
import com.unipar.rinhaRatos.models.Usuario
import com.unipar.rinhaRatos.repositorys.BatalhaRepository
import com.unipar.rinhaRatos.repositorys.HabilidadeRepository
import com.unipar.rinhaRatos.repositorys.RatoRepository
import com.unipar.rinhaRatos.repositorys.UsuarioRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.Optional
import java.util.Random
import java.util.concurrent.ThreadLocalRandom


///////////////////////////////////////////////////////////////
//
// SERVICE PRINCIPAL DA BATALHA
// INICIA A BATALHA, SALVA MENSAGENS, GRAVA FINAIS....
//
///////////////////////////////////////////////////////////////


@Service
class ServicoBatalhaAutomatica(
    private val repositorioBatalha: BatalhaRepository,
    private val repositorioRato: RatoRepository,
    private val repositorioHabilidade: HabilidadeRepository,
    private val usuarioRepository: UsuarioRepository,
    private val serviceRato: RatoService,
    private val messageService: MessageService,
    private val resultsService: ResultsService,
) {
    private val log = LoggerFactory.getLogger(javaClass)

    //Guarda Resultados de Rounds e Finais da batalha
    data class ResultadoRound(val numeroRound: Int, val mensagens: List<String>, val hpPorRato: Map<Long, Int>)
    data class ResultadoBatalha(
        val idBatalha: Long,
        val idRatoVencedor: Long?,
        val idRatoPerdedor: Long?,
        val rounds: List<ResultadoRound>
    )

    fun executaBatalha(idBatalha: Long): Optional<ResultadoBatalha> {
        val optB = repositorioBatalha.findById(idBatalha)
        val batalha = optB.get()

        val rato1 = batalha.rato1!!
        val rato2 = batalha.rato2!!

        val estadoRato1 = criarEstadoDoRato(rato1)
        val estadoRato2 = criarEstadoDoRato(rato2)

        val historicoRounds = mutableListOf<ResultadoRound>()
        var numeroRound = 0

        //Inicia a batalha (while é perfeito pra isso)
        while (estadoRato1.hpAtual > 0 && estadoRato2.hpAtual > 0) {
            //Logica de players:
            // Player 1 e 2 é auto explicativo
            // Player 0 é o 'Narrador', ele da resultados por round e anuncios
            numeroRound += 1
            // Agora a lista de mensagens guarda Map { "message" -> "...", "player" -> "1"|"2"|"0" }
            val mensagens = mutableListOf<Map<String, String>>()

            // limpa modificadores do round anterior
            // Absoluto é o base do player, percentual é o bônus pela habilidade
            estadoRato1.percentuais.clear(); estadoRato1.absolutos.clear()
            estadoRato2.percentuais.clear(); estadoRato2.absolutos.clear()

            // 35% de chance de usar habilidade (rato é independente na batalha! kkkkkkkk)
            val usouHabilidade1 = decidirUsarHabilidade()
            val usouHabilidade2 = decidirUsarHabilidade()

            //////////////////////////////////////////////
            // mensagem simples de não uso (player 1 ou 2)
            if (!usouHabilidade1) mensagens.add(
                mapOf(
                    "message" to "${rato1.nomeCustomizado} não usou a habilidade",
                    "player" to "1"
                )
            )
            if (usouHabilidade1) processarHabilidadeDoRato(rato1, estadoRato1, estadoRato2, mensagens, "1")

            if (!usouHabilidade2) mensagens.add(
                mapOf(
                    "message" to "${rato2.nomeCustomizado} não usou a habilidade",
                    "player" to "2"
                )
            )
            if (usouHabilidade2) processarHabilidadeDoRato(rato2, estadoRato2, estadoRato1, mensagens, "2")
            //////////////////////////////////////////////

            //////////////////////////////////////////////
            // status dos ratos e  chance de crítico
            val chanceCritico1 = obterChanceCriticaDoRato(rato1)
            val chanceCritico2 = obterChanceCriticaDoRato(rato2)

            val stats1 = calcularEstatisticasCombate(estadoRato1, chanceCritico1)
            val stats2 = calcularEstatisticasCombate(estadoRato2, chanceCritico2)

            // dano
            val danoParaRato2 = calcularDano(stats1.potencialAtaque, stats2.potencialDefesa, stats1.chanceCritico)
            val danoParaRato1 = calcularDano(stats2.potencialAtaque, stats1.potencialDefesa, stats2.chanceCritico)
            //////////////////////////////////////////////

            //////////////////////////////////////////////
            // player 1 da dano aqui
            estadoRato2.hpAtual = (estadoRato2.hpAtual - danoParaRato2).coerceAtLeast(0)
            mensagens.add(
                mapOf(
                    "message" to "${rato1.nomeCustomizado} causou $danoParaRato2 de dano ao ${rato2.nomeCustomizado}!",
                    "player" to "1"
                )
            )
            //////////////////////////////////////////////
            // player 2 da dano aqui
            if (estadoRato2.hpAtual > 0) {
                estadoRato1.hpAtual = (estadoRato1.hpAtual - danoParaRato1).coerceAtLeast(0)
                mensagens.add(
                    mapOf(
                        "message" to "${rato2.nomeCustomizado} causou $danoParaRato1 de dano ao ${rato1.nomeCustomizado}!",
                        "player" to "2"
                    )
                )
            }
            //////////////////////////////////////////////

            /////////////////////////////////////////////////////////////////////////////////
            // mensagem final do round (sistema) — player = 0 (conforme expliquei lá em cima)
            mensagens.add(
                mapOf(
                    "message" to "HPs após round: ${rato1.nomeCustomizado}=${estadoRato1.hpAtual} | ${rato2.nomeCustomizado}=${estadoRato2.hpAtual}",
                    "player" to "0"
                )
            )
            /////////////////////////////////////////////////////////////////////////////////
            // SALVA mensagens deste round no banco — usa nomes para identificar player 1/2
            salvarMensagensDoRound(
                batalha,
                numeroRound,
                mensagens,
                nomeRato1 = rato1.nomeCustomizado,
                nomeRato2 = rato2.nomeCustomizado
            )
            /////////////////////////////////////////////////////////////////////////////////
            historicoRounds.add(
                ResultadoRound(
                    numeroRound,
                    mensagens.map {
                        it["message"] ?: ""
                    }, // mantemos histórico como lista de strings
                    mapOf(rato1.idRato to estadoRato1.hpAtual, rato2.idRato to estadoRato2.hpAtual)
                )
            )
            /////////////////////////////////////////////////////////////////////////////////

            // Se um dos ratos morre, acaba aq com o break
            if (estadoRato1.hpAtual <= 0 || estadoRato2.hpAtual <= 0) break
        }

        //Decide VENCEDOR e PERDEDOR ao fim da batalha
        val idVencedor = when {
            estadoRato2.hpAtual <= 0 && estadoRato1.hpAtual > 0 -> rato1.idRato
            else -> rato2.idRato
        }
        val idPerdedor = when (idVencedor) {
            rato1.idRato -> rato2.idRato
            else -> rato1.idRato
        }

        // persiste resultado final
        persistirResultadoFinal(batalha, idVencedor, idPerdedor, estadoRato1, estadoRato2)

        //Retorna a batalha final, podendo estar vazia caso já tenha ocorrido
        return Optional.of(ResultadoBatalha(idBatalha, idVencedor, idPerdedor, historicoRounds.toList()))
    }

    // Persiste dados em memoria do rato, para não precisar ficar salvando no banco
    private fun criarEstadoDoRato(r: Rato): EstadoRato {
        return EstadoRato(
            idRato = r.idRato,
            hpMaximo = r.hpsBase,
            hpAtual = r.hpsBase,
            forcaBase = r.strBase,
            agilidadeBase = r.agiBase,
            inteligenciaBase = r.intBase,
            defesaBase = r.defBase,
            ratoOriginal = r
        )
    }

    // Bem simples, como comentado, apenas decide se o rato usa a habilidade ou não (35% de chance)
    private fun decidirUsarHabilidade(): Boolean {
        return ThreadLocalRandom.current().nextInt(100) < 35 // 35% chance
    }

    // Processa a habilidade dentro do serviço da batalha automática
    private fun processarHabilidadeDoRato(
        r: Rato,
        estadoFonte: EstadoRato,
        estadoAlvo: EstadoRato,
        mensagens: MutableList<Map<String, String>>,
        player: String // "1" ou "2"
    ) {
        val idHabilidade = r.habilidadeEscolhida.idHabilidade
        // garantia que nn vai dar cagada kkkkkk
        if (idHabilidade == 0L) {
            return
        }

        // Pega a habilidade e valida
        val optHab = repositorioHabilidade.findByIdWithClasse(idHabilidade)
        if (optHab.isEmpty) {
            mensagens.add(mapOf("message" to "${r.nomeCustomizado}: habilidade não encontrada", "player" to player))
            return
        }
        val hab = optHab.get()

        // Sim, outro random, esse decide se a habilidade vai ter sucesso ou erro
        val roll = Random().nextInt(100)
        val sucesso = roll < hab.chanceSucesso

        // mensagem de uso ou falha
        val texto =
            if (sucesso) (hab.efetivoTxt ?: hab.nomeHabilidade) else (hab.falhaTxt ?: "${hab.nomeHabilidade} falhou")
        mensagens.add(mapOf("message" to "${r.nomeCustomizado}: $texto", "player" to player))

        val efeitosStr = if (sucesso) hab.efeitoSucessoStr else hab.efeitoFalhaStr
        val listaEfeitos = parseEfeitos(efeitosStr)

        // aplica efeitos
        for (ef in listaEfeitos) {
            try {
                val tempMsgs = mutableListOf<String>()
                //chama função que aplica os efeitos
                aplicarEfeito(ef, estadoFonte, estadoAlvo, tempMsgs)
                for (mes in tempMsgs) {
                    mensagens.add(mapOf("message" to mes, "player" to player))
                }
            } catch (ex: Exception) {
                log.warn("Erro ao aplicar efeito na habilidade: ${ex.message}")
            }
        }
    }

    // Manipula resultado final da batalha e cria um results para o front manipular o resultado
    private fun persistirResultadoFinal(
        batalha: Batalha,
        idRatoVencedor: Long?,
        idRatoPerdedor: Long?,
        eRato1: EstadoRato,
        eRato2: EstadoRato,
    ) {
        ////////////////////////////////
        //Define vencedores e perdedores
        val usuarioVencedor = when (idRatoVencedor) {
            eRato1.idRato -> usuarioRepository.findById(batalha.jogador1!!.idUsuario).get()
            else -> usuarioRepository.findById(batalha.jogador2!!.idUsuario).get()
        }
        val usuarioPerdedor = when (idRatoPerdedor) {
            eRato1.idRato -> usuarioRepository.findById(batalha.jogador1!!.idUsuario).get()
            else -> usuarioRepository.findById(batalha.jogador2!!.idUsuario).get()
        }
        batalha.vencedor = usuarioVencedor
        batalha.perdedor = usuarioPerdedor

        batalha.status = StatusBatalha.Concluida
        repositorioBatalha.save(batalha)
        ////////////////////////////////

        // Bom, de forma simples, valida se o user não é bot
        // Caso um deles seja bot(garantia, dupla validação) não salva os ratos
        if (usuarioVencedor.tipoConta != TipoConta.BOT && usuarioPerdedor.tipoConta != TipoConta.BOT) {
            repositorioRato.findById(eRato1.idRato).ifPresent { rdb ->
                rdb.estaTorneio = false
                rdb.estaVivo = eRato1.hpAtual > 0
                repositorioRato.save(rdb)
            }
            repositorioRato.findById(eRato2.idRato).ifPresent { rdb ->
                rdb.estaTorneio = false
                rdb.estaVivo = eRato2.hpAtual > 0
                repositorioRato.save(rdb)
            }

            usuarioVencedor.vitorias += 1
            usuarioVencedor.mousecoinSaldo += batalha.premioTotal
            usuarioRepository.save<Usuario>(usuarioVencedor)
        }

        // Salva o player (Teste, vamos ver, talvez não seja necessario isso)
        if (usuarioVencedor.tipoConta != TipoConta.BOT && usuarioPerdedor.tipoConta != TipoConta.BOT) {
            val ratosLoser = repositorioRato.pegaRatosVivosDoUsuario(usuarioPerdedor.idUsuario)
            usuarioPerdedor.ratos = ratosLoser
            if (ratosLoser.isEmpty()) {
                usuarioPerdedor.ratos = mutableListOf()
            } else {
                usuarioPerdedor.ratos = ratosLoser
            }
            usuarioRepository.save<Usuario>(usuarioPerdedor)
        }
        log.info("Batalha ${batalha.idBatalha} persistida: vencedorRato=$idRatoVencedor")

        //Pega os ratos, vencedor e perdedor
        val vencedorRato =
            if (idRatoVencedor == eRato1.idRato) eRato1.ratoOriginal else eRato2.ratoOriginal
        val perdedorRato =
            if (idRatoPerdedor == eRato1.idRato) eRato1.ratoOriginal else eRato2.ratoOriginal

        // Gera o result final da batalha
        val results = Results(
            vencedorUserName = usuarioVencedor.nome,
            perdedorUserName = usuarioPerdedor!!.nome,
            vencedorRatoName = vencedorRato.nomeCustomizado,
            perdedorRatoName = perdedorRato.nomeCustomizado,
            vencedorRatoType = mapearClasseRatoParaEnum(vencedorRato),
            perdedorRatoType = mapearClasseRatoParaEnum(perdedorRato),
            vencedorRatoHP = (if (idRatoVencedor == eRato1.idRato) eRato1.hpAtual else eRato2.hpAtual).toFloat(),
            perdedorRatoHP = (if (idRatoPerdedor == eRato1.idRato) eRato1.hpAtual else eRato2.hpAtual).toFloat(),
            id_batalha = batalha.idBatalha,
            id_vencedor = usuarioVencedor.idUsuario,
            id_perdedor = usuarioPerdedor.idUsuario
        )

        //Enfim, cria o results da batalha no final dela. O Gloria
        resultsService.criarMensagem(results)
    }

    // Pega a chance de critico do rato(padrão 0.10)
    // Sim, era só usar 0.10, mas caso seja mudado no futuro é só mudar aqui
    private fun obterChanceCriticaDoRato(r: Rato): Double {
        return 0.10
    }

    // salva mensagens com player 1/2/0
    private fun salvarMensagensDoRound(
        batalha: Batalha,
        numeroRound: Int,
        mensagens: List<Map<String, String>>,
        nomeRato1: String,
        nomeRato2: String,
    ) {
        // Seta de quem é a mensagem em cada uma das mensagens
        for (msgMap in mensagens) {
            val texto = msgMap["message"] ?: continue
            val playerStr = msgMap["player"]
            val playerNum = playerStr?.toLongOrNull() ?: when {
                texto.startsWith(nomeRato1) -> 1L
                texto.startsWith(nomeRato2) -> 2L
                else -> 0L
            }

            val mr = MessageRound().apply {
                descricao = texto
                id_batalha = batalha.idBatalha
                round = numeroRound.toLong()
                player = playerNum
            }
            try {
                messageService.criarMensagem(mr)
            } catch (ex: Exception) {
                log.warn("salvarMensagensDoRound: Falha ao salvar MessageRound (batalha ${batalha.idBatalha}, round $numeroRound): ${ex.message}")
            }
        }
    }

    // Mapeia a classe do rato para enum, para retornar para o front de forma mais simples e padrão
    private fun mapearClasseRatoParaEnum(rato: Rato): ClassesRato {
        try {
            val classeObj = rato.classe
            val nomeClasse = classeObj.nomeClasse
            val nomeClasseLower = nomeClasse.lowercase()
            return when {
                "esgoto" in nomeClasseLower -> ClassesRato.ESGOTO
                "hospital" in nomeClasseLower -> ClassesRato.HOSPITAL
                "laboratorio" in nomeClasseLower || "laboratório" in nomeClasseLower -> ClassesRato.LABORATORIO
                "fazenda" in nomeClasseLower -> ClassesRato.FAZENDA
                "cassino" in nomeClasseLower -> ClassesRato.CASSINO
                "biblioteca" in nomeClasseLower -> ClassesRato.BIBLIOTECA
                else -> ClassesRato.ESGOTO
            }
        } catch (ex: Exception) {
            log.warn("mapearClasseRatoParaEnum: Deu pau em ler a classe do rato kkkkkkkkkkk")
            return ClassesRato.ESGOTO //Retorna o padrão, caso necessario, a luta não para!!!!!! kkkkkk
        }
    }
}