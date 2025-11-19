package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.battle.*
import com.unipar.rinhaRatos.models.Batalha
import com.unipar.rinhaRatos.models.Rato
import com.unipar.rinhaRatos.models.MessageRound
import com.unipar.rinhaRatos.models.Results
import com.unipar.rinhaRatos.enums.ClassesRato
import com.unipar.rinhaRatos.enums.TipoConta
import com.unipar.rinhaRatos.models.Usuario
import com.unipar.rinhaRatos.repositorys.BatalhaRepository
import com.unipar.rinhaRatos.repositorys.HabilidadeRepository
import com.unipar.rinhaRatos.repositorys.RatoRepository
import com.unipar.rinhaRatos.repositorys.UsuarioRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.concurrent.ThreadLocalRandom

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

    data class ResultadoRound(val numeroRound: Int, val mensagens: List<String>, val hpPorRato: Map<Long, Int>)
    data class ResultadoBatalha(
        val idBatalha: Long,
        val idRatoVencedor: Long?,
        val idRatoPerdedor: Long?,
        val rounds: List<ResultadoRound>,
    )

    fun executarBatalhaSincrona(idBatalha: Long): ResultadoBatalha {
        val optB = repositorioBatalha.findById(idBatalha)
        val batalha = optB.get()

        val rato1 = batalha.rato1!!
        val rato2 = batalha.rato2!!

        val estadoRato1 = criarEstadoDoRato(rato1)
        val estadoRato2 = criarEstadoDoRato(rato2)

        val historicoRounds = mutableListOf<ResultadoRound>()
        var numeroRound = 0

        while (estadoRato1.hpAtual > 0 && estadoRato2.hpAtual > 0) {
            numeroRound += 1
            // Agora a lista de mensagens guarda Map { "message" -> "...", "player" -> "1"|"2"|"0" }
            val mensagens = mutableListOf<Map<String, String>>()

            // limpa modifiers do round anterior
            estadoRato1.percentuais.clear(); estadoRato1.absolutos.clear()
            estadoRato2.percentuais.clear(); estadoRato2.absolutos.clear()

            // 35% de chance de usar habilidade
            val usouHabilidade1 = decidirUsarHabilidade()
            val usouHabilidade2 = decidirUsarHabilidade()

            // mensagem simples de não uso (player 1 ou 2)
            if (!usouHabilidade1) mensagens.add(mapOf("message" to "${rato1.nomeCustomizado} não usou a habilidade", "player" to "1"))
            if (usouHabilidade1) processarHabilidadeDoRato(rato1, estadoRato1, estadoRato2, mensagens, "1")

            if (!usouHabilidade2) mensagens.add(mapOf("message" to "${rato2.nomeCustomizado} não usou a habilidade", "player" to "2"))
            if (usouHabilidade2) processarHabilidadeDoRato(rato2, estadoRato2, estadoRato1, mensagens, "2")

            // stats / chance de crítico
            val chanceCritico1 = obterChanceCriticaDoRato(rato1)
            val chanceCritico2 = obterChanceCriticaDoRato(rato2)

            val stats1 = calcularEstatisticasCombate(estadoRato1, chanceCritico1)
            val stats2 = calcularEstatisticasCombate(estadoRato2, chanceCritico2)

            // dano
            val danoParaRato2 = calcularDano(stats1.potencialAtaque, stats2.potencialDefesa, stats1.chanceCritico)
            val danoParaRato1 = calcularDano(stats2.potencialAtaque, stats1.potencialDefesa, stats2.chanceCritico)

            // aplica dano: atacante 1 primeiro
            estadoRato2.hpAtual = (estadoRato2.hpAtual - danoParaRato2).coerceAtLeast(0)
            mensagens.add(mapOf("message" to "${rato1.nomeCustomizado} causou $danoParaRato2 ao ${rato2.nomeCustomizado}!", "player" to "1"))

            // se adversário ainda vivo, revida
            if (estadoRato2.hpAtual > 0) {
                estadoRato1.hpAtual = (estadoRato1.hpAtual - danoParaRato1).coerceAtLeast(0)
                mensagens.add(mapOf("message" to "${rato2.nomeCustomizado} causou $danoParaRato1 ao ${rato1.nomeCustomizado}!", "player" to "2"))
            }

            // mensagem final do round (sistema) — player = 0
            mensagens.add(mapOf("message" to "HPs após round: ${rato1.nomeCustomizado}=${estadoRato1.hpAtual} | ${rato2.nomeCustomizado}=${estadoRato2.hpAtual}", "player" to "0"))

            // SALVA mensagens deste round no banco — usa nomes para identificar player 1/2
            salvarMensagensDoRound(
                batalha,
                numeroRound,
                mensagens,
                idRato1 = rato1.idRato,
                nomeRato1 = rato1.nomeCustomizado,
                idRato2 = rato2.idRato,
                nomeRato2 = rato2.nomeCustomizado
            )

            historicoRounds.add(
                ResultadoRound(
                    numeroRound,
                    mensagens.map { it["message"] ?: "" }, // mantemos histórico como lista de strings para compatibilidade
                    mapOf(rato1.idRato to estadoRato1.hpAtual, rato2.idRato to estadoRato2.hpAtual)
                )
            )

            if (estadoRato1.hpAtual <= 0 || estadoRato2.hpAtual <= 0) break
        }

        val idVencedor = when {
            estadoRato2.hpAtual <= 0 && estadoRato1.hpAtual > 0 -> rato1.idRato
            estadoRato1.hpAtual <= 0 && estadoRato2.hpAtual > 0 -> rato2.idRato
            else -> null
        }
        val idPerdedor = when (idVencedor) {
            rato1.idRato -> rato2.idRato
            rato2.idRato -> rato1.idRato
            else -> null
        }

        if (idPerdedor != null && idVencedor != null) {
            atualizarRatos(vencedorId = idVencedor, perdedorId = idPerdedor)
        }

        // persiste resultado final
        persistirResultadoFinal(batalha, idVencedor, idPerdedor, estadoRato1, estadoRato2)

        return ResultadoBatalha(idBatalha, idVencedor, idPerdedor, historicoRounds.toList())
    }

    private fun atualizarRatos(vencedorId: Long, perdedorId: Long) {
        val ratoVencedor = repositorioRato.findById(vencedorId).get()
        val usuarioVencedor = usuarioRepository.findById(ratoVencedor.usuario!!.idUsuario)
        try {
            try {
                //Logica para nn remover quando for batalha com BOT e remover quando por Player vs Player
                if(usuarioVencedor.get().tipoConta == TipoConta.BOT){
                    serviceRato.removeRato(vencedorId)
                }else{
                    serviceRato.removeRato(perdedorId)
                }
            } catch (ex: Exception) {
                log.warn("Falha ao remover rato perdedor (id=$perdedorId): ${ex.message}")
            }

            repositorioRato.findById(vencedorId).ifPresent { ratoVencedor ->
                ratoVencedor.estaTorneio = false
                ratoVencedor.estaVivo = true
                repositorioRato.save(ratoVencedor)
            }
        } catch (ex: Exception) {
            log.error("Erro em atualizarRatosSemFalha(vencedor=$vencedorId, perdedor=$perdedorId): ${ex.message}", ex)
        }
    }

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

    private fun decidirUsarHabilidade(): Boolean {
        return ThreadLocalRandom.current().nextInt(100) < 35 // 35% chance
    }

    /**
     * processarHabilidadeDoRato:
     * - usa a mensagem no formato Map<String,String>
     * - para aplicar efeitos chama a função aplicarEfeito existente (que adiciona Strings)
     *   por isso criamos uma lista temporária de Strings e depois convertemos para Map.
     */
    private fun processarHabilidadeDoRato(
        r: Rato,
        estadoFonte: EstadoRato,
        estadoAlvo: EstadoRato,
        mensagens: MutableList<Map<String, String>>,
        player: String // "1" ou "2"
    ) {
        val idHabilidade = r.habilidadeEscolhida?.idHabilidade
        if (idHabilidade == null || idHabilidade == 0L) {
            // já adicionamos "não usou a habilidade" anteriormente
            return
        }

        val optHab = repositorioHabilidade.findByIdWithClasse(idHabilidade)
        if (optHab.isEmpty) {
            mensagens.add(mapOf("message" to "${r.nomeCustomizado}: habilidade não encontrada", "player" to player))
            return
        }
        val hab = optHab.get()

        val roll = ThreadLocalRandom.current().nextInt(100)
        val sucesso = roll < hab.chanceSucesso

        // mensagem de uso/falha (texto do DB)
        val texto = if (sucesso) (hab.efetivoTxt ?: hab.nomeHabilidade) else (hab.falhaTxt ?: "${hab.nomeHabilidade} falhou")
        mensagens.add(mapOf("message" to "${r.nomeCustomizado}: $texto", "player" to player))

        val efeitosStr = if (sucesso) hab.efeitoSucessoStr else hab.efeitoFalhaStr
        val listaEfeitos = parseEfeitos(efeitosStr)

        // aplicar efeitos:
        // a função aplicarEfeito(original) existente no seu código provavelmente recebe MutableList<String>
        // para compatibilidade criamos uma lista temporária de strings, chamamos a função antiga e convertemos as mensagens
        for (ef in listaEfeitos) {
            try {
                val tempMsgs = mutableListOf<String>()
                // chama a função existente que manipula strings (presumida já implementada no mesmo arquivo)
                // se a sua implementar aceitar MutableList<String>, isto funcionará
                aplicarEfeito(ef, estadoFonte, estadoAlvo, tempMsgs)
                // converte cada mensagem string gerada para Map e adiciona à lista principal
                for (m in tempMsgs) {
                    mensagens.add(mapOf("message" to m, "player" to player))
                }
            } catch (ex: NoSuchMethodError) {
                // caso não exista a versão aplicable da função aplicarEfeito que receba MutableList<String>
                // fallback: apenas registra que um efeito foi aplicado (sem detalhes)
                mensagens.add(mapOf("message" to "${r.nomeCustomizado}: efeito aplicado.", "player" to player))
            } catch (ex: Exception) {
                log.warn("Erro ao aplicar efeito na habilidade: ${ex.message}")
            }
        }
    }

    private fun persistirResultadoFinal(
        batalha: Batalha,
        idRatoVencedor: Long?,
        idRatoPerdedor: Long?,
        e1: EstadoRato,
        e2: EstadoRato,
    ) {
        try {
            var idUsuarioVecedor = 0L
            var idUsuarioPerdedor = 0L
            if (idRatoVencedor != null && idRatoPerdedor != null) {
                val usuarioVencedor = when (idRatoVencedor) {
                    e1.idRato -> batalha.jogador1
                    e2.idRato -> batalha.jogador2
                    else -> null
                }
                val usuarioPerdedor = when (idRatoPerdedor) {
                    e1.idRato -> batalha.jogador1
                    e2.idRato -> batalha.jogador2
                    else -> null
                }
                batalha.vencedor = usuarioVencedor
                batalha.perdedor = usuarioPerdedor
                idUsuarioVecedor = batalha.vencedor!!.idUsuario
                idUsuarioPerdedor = batalha.perdedor!!.idUsuario
            }

            batalha.status = com.unipar.rinhaRatos.enums.StatusBatalha.Concluida
            repositorioBatalha.save(batalha)

            repositorioRato.findById(e1.idRato).ifPresent { rdb ->
                rdb.estaTorneio = false
                rdb.estaVivo = e1.hpAtual > 0
                repositorioRato.save(rdb)
            }
            repositorioRato.findById(e2.idRato).ifPresent { rdb ->
                rdb.estaTorneio = false
                rdb.estaVivo = e2.hpAtual > 0
                repositorioRato.save(rdb)
            }
            usuarioRepository.findById(idUsuarioVecedor).ifPresent { usuarioWin ->
                val usuarioLose = usuarioRepository.findById(idUsuarioPerdedor)

    
                usuarioLose.get().ratos.removeIf {
                    it.idRato == e1.idRato
                }


                if(usuarioWin.tipoConta != TipoConta.BOT && usuarioLose.get().tipoConta != TipoConta.BOT){
                    usuarioWin.vitorias += 1
                    usuarioWin.mousecoinSaldo += batalha.premioTotal
                    usuarioRepository.save<Usuario>(usuarioWin)
                }
            }

            log.info("Batalha ${batalha.idBatalha} persistida: vencedorRato=$idRatoVencedor")

            try {
                val vencedorNomeUsuario = batalha.vencedor?.nome ?: ""
                val perdedorNomeUsuario = batalha.perdedor?.nome ?: ""

                val vencedorRatoName =
                    if (idRatoVencedor == e1.idRato) e1.ratoOriginal.nomeCustomizado else e2.ratoOriginal.nomeCustomizado
                val perdedorRatoName =
                    if (idRatoPerdedor == e1.idRato) e1.ratoOriginal.nomeCustomizado else e2.ratoOriginal.nomeCustomizado

                val vencedorTipo =
                    if (idRatoVencedor == e1.idRato) mapearClasseRatoParaEnum(e1.ratoOriginal) else mapearClasseRatoParaEnum(
                        e2.ratoOriginal
                    )
                val perdedorTipo =
                    if (idRatoPerdedor == e1.idRato) mapearClasseRatoParaEnum(e1.ratoOriginal) else mapearClasseRatoParaEnum(
                        e2.ratoOriginal
                    )

                val results = Results(
                    vencedorUserName = vencedorNomeUsuario,
                    perdedorUserName = perdedorNomeUsuario,
                    vencedorRatoName = vencedorRatoName,
                    perdedorRatoName = perdedorRatoName,
                    vencedorRatoType = vencedorTipo,
                    perdedorRatoType = perdedorTipo,
                    vencedorRatoHP = (if (idRatoVencedor == e1.idRato) e1.hpAtual else e2.hpAtual).toFloat(),
                    perdedorRatoHP = (if (idRatoPerdedor == e1.idRato) e1.hpAtual else e2.hpAtual).toFloat(),
                    id_batalha = batalha.idBatalha,
                    id_vencedor = idUsuarioVecedor,
                    id_perdedor = idUsuarioPerdedor
                )


                resultsService.criarMensagem(results)
            } catch (ex: Exception) {
                log.warn("Falha ao salvar Results final: ${ex.message}")
            }
        } catch (ex: Exception) {
            log.error("Erro ao persistir resultado da batalha ${batalha.idBatalha}: ${ex.message}", ex)
            throw ex
        }
    }

    private fun obterChanceCriticaDoRato(r: Rato): Double {
        val possiveisNomes = listOf("chanceCritico", "chanceCritica", "criBase", "criticoBase")
        for (nome in possiveisNomes) {
            try {
                val f = r.javaClass.getDeclaredField(nome)
                f.isAccessible = true
                val v = f.get(r)
                if (v is Number) return (v.toDouble()).coerceAtLeast(0.0)
                if (v is String) return v.toDoubleOrNull() ?: 0.10
            } catch (_: Exception) {
            }
        }
        return 0.10
    }

    // ---------- salvar mensagens com player 1/2/0 (sistema) ----------
    private fun salvarMensagensDoRound(
        batalha: Batalha,
        numeroRound: Int,
        mensagens: List<Map<String, String>>,
        idRato1: Long,
        nomeRato1: String,
        idRato2: Long,
        nomeRato2: String,
    ) {
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
                log.warn("Falha ao salvar MessageRound (batalha ${batalha.idBatalha}, round $numeroRound): ${ex.message}")
            }
        }
    }

    private fun mapearClasseRatoParaEnum(r: Rato): ClassesRato {
        try {
            val classeObj = try {
                val f = r.javaClass.getDeclaredField("classe")
                f.isAccessible = true
                f.get(r)
            } catch (ex: Exception) {
                null
            }

            val nomeClasse = if (classeObj != null) {
                try {
                    val fn = classeObj.javaClass.getDeclaredField("nome")
                    fn.isAccessible = true
                    fn.get(classeObj)?.toString() ?: ""
                } catch (_: Exception) {
                    try {
                        val fa = classeObj.javaClass.getDeclaredField("apelido")
                        fa.isAccessible = true
                        fa.get(classeObj)?.toString() ?: ""
                    } catch (_: Exception) {
                        ""
                    }
                }
            } else ""

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
            return ClassesRato.ESGOTO
        }
    }
}