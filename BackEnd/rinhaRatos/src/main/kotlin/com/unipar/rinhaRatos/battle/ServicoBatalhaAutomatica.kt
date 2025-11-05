package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.battle.*
import com.unipar.rinhaRatos.models.Batalha
import com.unipar.rinhaRatos.models.Rato
import com.unipar.rinhaRatos.models.MessageRound
import com.unipar.rinhaRatos.models.Results
import com.unipar.rinhaRatos.enums.ClassesRato
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

    /**
     * Executa a simulação de forma síncrona e persiste somente no final.
     * Retorna um objeto com todo o histórico em memória.
     */
    fun executarBatalhaSincrona(idBatalha: Long): ResultadoBatalha {
        val optB = repositorioBatalha.findById(idBatalha)
        if (optB.isEmpty) throw IllegalArgumentException("BATALHA_NAO_ENCONTRADA")
        val batalha = optB.get()

        val rato1 = batalha.rato1 ?: throw IllegalArgumentException("RATO1_NAO_CONFIGURADO")
        val rato2 = batalha.rato2 ?: throw IllegalArgumentException("RATO2_NAO_CONFIGURADO")

        val estadoRato1 = criarEstadoDoRato(rato1)
        val estadoRato2 = criarEstadoDoRato(rato2)

        val historicoRounds = mutableListOf<ResultadoRound>()
        var numeroRound = 0

        while (estadoRato1.hpAtual > 0 && estadoRato2.hpAtual > 0) {
            numeroRound += 1
            val mensagens = mutableListOf<String>()

            // limpa modifiers do round anterior
            estadoRato1.percentuais.clear(); estadoRato1.absolutos.clear()
            estadoRato2.percentuais.clear(); estadoRato2.absolutos.clear()

            // 35% de chance de usar habilidade (sorte automática)
            val usouHabilidade1 = decidirUsarHabilidade()
            val usouHabilidade2 = decidirUsarHabilidade()

            if (usouHabilidade1) processarHabilidadeDoRato(
                rato1,
                estadoRato1,
                estadoRato2,
                mensagens
            ) else mensagens.add("Rato ${rato1.nomeCustomizado} não usou habilidade")
            if (usouHabilidade2) processarHabilidadeDoRato(
                rato2,
                estadoRato2,
                estadoRato1,
                mensagens
            ) else mensagens.add("Rato ${rato2.nomeCustomizado} não usou habilidade")

            // cada rato tem sua chance crítica base (tenta ler da entidade; se não existir usa 10%)
            val chanceCritico1 = obterChanceCriticaDoRato(rato1)
            val chanceCritico2 = obterChanceCriticaDoRato(rato2)

            val stats1 = calcularEstatisticasCombate(estadoRato1, chanceCritico1)
            val stats2 = calcularEstatisticasCombate(estadoRato2, chanceCritico2)

            val danoParaRato2 = calcularDano(stats1.potencialAtaque, stats2.potencialDefesa, stats1.chanceCritico)
            val danoParaRato1 = calcularDano(stats2.potencialAtaque, stats1.potencialDefesa, stats2.chanceCritico)

            estadoRato2.hpAtual = (estadoRato2.hpAtual - danoParaRato2).coerceAtLeast(0)
            if (estadoRato2.hpAtual > 0) {
                estadoRato1.hpAtual = (estadoRato1.hpAtual - danoParaRato1).coerceAtLeast(0)
            }
            mensagens.add(
                "${rato1.nomeCustomizado} causou $danoParaRato2 ao ${rato2.nomeCustomizado}" +
                        if (estadoRato2.hpAtual <= 0) {
                            ", ganhando a partida!"
                        } else {
                            "!"
                        }
            )
            if (estadoRato2.hpAtual >= 0) {
                mensagens.add(
                    "${rato2.nomeCustomizado} causou $danoParaRato1 ao ${rato1.nomeCustomizado}" +
                            if (estadoRato1.hpAtual <= 0) {
                                ", ganhando a partida!"
                            } else {
                                "!"
                            }

                )
            }
            mensagens.add("HPs após round: ${rato1.idRato}=${estadoRato1.hpAtual} | ${rato2.idRato}=${estadoRato2.hpAtual}")

            // SALVA mensagens deste round no banco usando MessageService
            salvarMensagensDoRound(batalha, numeroRound, mensagens, rato1.idRato, rato2.idRato)

            historicoRounds.add(
                ResultadoRound(
                    numeroRound,
                    mensagens.toList(),
                    mapOf(rato1.idRato to estadoRato1.hpAtual, rato2.idRato to estadoRato2.hpAtual)
                )
            )

            if (estadoRato1.hpAtual <= 0 || estadoRato2.hpAtual <= 0) break
        }

        val idVencedor = when {
            estadoRato2.hpAtual <= 0 -> rato1.idRato
            else -> rato2.idRato
        }
        val idPerdedor = when (idVencedor) {
            rato1.idRato -> {
                rato2.idRato
            }

            rato2.idRato -> {
                rato1.idRato
            }

            else -> null
        }
        if (idPerdedor == rato1.idRato) {
            atualizarRatos(vencedorId = rato2.idRato, perdedorId = rato1.idRato)
        } else if (idPerdedor == rato2.idRato) {
            atualizarRatos(vencedorId = rato1.idRato, perdedorId = rato2.idRato)
        }

        // persiste resultado no banco (status, vencedor/perdedor e flags dos ratos) e salva Results
        persistirResultadoFinal(batalha, idVencedor, idPerdedor, estadoRato1, estadoRato2)

        return ResultadoBatalha(idBatalha, idVencedor, idPerdedor, historicoRounds.toList())
    }

    private fun atualizarRatos(vencedorId: Long, perdedorId: Long) {
        try {
            try {
                serviceRato.removeRato(perdedorId) // soft delete
            } catch (ex: Exception) {
                log.warn("Falha ao remover rato perdedor (id=$perdedorId): ${ex.message}")
                // não interrompe o fluxo: seguimos atualizando vencedor
            }

            repositorioRato.findById(vencedorId).ifPresent { ratoVencedor ->
                ratoVencedor.estaTorneio = false
                ratoVencedor.estaVivo = true
                repositorioRato.save(ratoVencedor)
            }
        } catch (ex: Exception) {
            log.error("Erro em atualizarRatos(vencedor=$vencedorId, perdedor=$perdedorId): ${ex.message}", ex)
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
     * Procura habilidade do rato (pelo relacionamento da entidade).
     * Faz roll de sucesso pelo campo chanceSucesso; aplica efeitos (sucesso ou falha).
     * Usa parseEfeitos e aplicarEfeito.
     */
    private fun processarHabilidadeDoRato(
        r: Rato,
        estadoFonte: EstadoRato,
        estadoAlvo: EstadoRato,
        mensagens: MutableList<String>,
    ) {
        // tenta obter id da habilidade associada ao rato; você pode adaptar se seu model for diferente.
        val habilidade = repositorioHabilidade.findById(r.habilidadeEscolhida?.idHabilidade ?: 0)
        val idHabilidade = try {
            // tenta campo 'habilidade' na entidade Rato (ajuste se necessário)
            val f = r.javaClass.getDeclaredField("habilidade")
            f.isAccessible = true
            val obj = f.get(r) ?: run {
                mensagens.add("Rato ${r.nomeCustomizado} não tem habilidade vinculada")
                return
            }
            val idField = obj.javaClass.getDeclaredField("idHabilidade")
            idField.isAccessible = true
            (idField.get(obj) as Number).toLong()
        } catch (ex: Exception) {
            mensagens.add("Não foi possível recuperar habilidade do rato ${r.nomeCustomizado}: ${ex.message}")
            return
        }

        val optHab = repositorioHabilidade.findByIdWithClasse(idHabilidade)
        if (optHab.isEmpty) {
            mensagens.add("Habilidade id=$idHabilidade não encontrada no banco")
            return
        }
        val hab = optHab.get()

        val roll = ThreadLocalRandom.current().nextInt(100)
        val sucesso = roll < hab.chanceSucesso

        mensagens.add(
            if (sucesso) ("${r.nomeCustomizado} usou a habilidade ${habilidade.get().efetivoTxt}" )
            else ("${r.nomeCustomizado} falhou durante o usou da habilidade. ${habilidade.get().falhaTxt} ")
        )
        val efeitosStr = if (sucesso) hab.efeitoSucessoStr else hab.efeitoFalhaStr
        val listaEfeitos = parseEfeitos(efeitosStr)

        for (ef in listaEfeitos) aplicarEfeito(ef, estadoFonte, estadoAlvo, mensagens)
    }

    /**
     * Persiste o resultado final: seta status da batalha como CONCLUIDA, define vencedor/perdedor,
     * atualiza flags dos ratos (estaTorneio = false, estaVivo conforme hp) e salva Results.
     */
    private fun persistirResultadoFinal(
        batalha: Batalha,
        idRatoVencedor: Long?,
        idRatoPerdedor: Long?,
        e1: EstadoRato,
        e2: EstadoRato,
    ) {
        try {
            if (idRatoVencedor != null) {
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
            }
            batalha.status = com.unipar.rinhaRatos.enums.StatusBatalha.Concluida
            repositorioBatalha.save(batalha)

            // atualiza ratos no banco
            val r1Opt = repositorioRato.findById(e1.idRato)
            if (r1Opt.isPresent) {
                val rdb = r1Opt.get()
                rdb.estaTorneio = false
                rdb.estaVivo = e1.hpAtual > 0
                repositorioRato.save(rdb)
            }
            val r2Opt = repositorioRato.findById(e2.idRato)
            if (r2Opt.isPresent) {
                val rdb = r2Opt.get()
                rdb.estaTorneio = false
                rdb.estaVivo = e2.hpAtual > 0
                repositorioRato.save(rdb)
            }
            log.info("Batalha ${batalha.idBatalha} persistida: vencedorRato=$idRatoVencedor")

            // salva Results (resumo final)
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

                val results: Results = Results(
                    vencedorUserName = vencedorNomeUsuario,
                    perdedorUserName = perdedorNomeUsuario,
                    vencedorRatoName = vencedorRatoName,
                    perdedorRatoName = perdedorRatoName,
                    vencedorRatoType = vencedorTipo,
                    perdedorRatoType = perdedorTipo,
                    vencedorRatoHP = (if (idRatoVencedor == e1.idRato) e1.hpAtual else e2.hpAtual).toFloat(),
                    perdedorRatoHP = (if (idRatoPerdedor == e1.idRato) e1.hpAtual else e2.hpAtual).toFloat(),
                    id_batalha = batalha.idBatalha
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

    /**
     * Tenta obter a chance crítica base do rato (campo na entidade). Se não existir, retorna 0.10 (10%).
     * Aceita nomes de campo comuns: 'chanceCritico', 'criBase', 'chanceCritica' — adaptável.
     */
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
                // ignora e tenta próximo nome
            }
        }
        return 0.10 // default se não achar campo
    }

    // ----------------- funções auxiliares para salvar mensagens e mapear classe -----------------

    private fun salvarMensagensDoRound(
        batalha: Batalha,
        numeroRound: Int,
        mensagens: List<String>,
        idRato1: Long,
        idRato2: Long,
    ) {
        for (msg in mensagens) {
            val attacker = extrairAtacanteDeMensagem(msg, idRato1, idRato2) ?: 0L
            val mr = MessageRound().apply {
                descricao = msg
                id_batalha = batalha.idBatalha
                round = numeroRound.toLong()
                player = attacker
            }
            try {
                messageService.criarMensagem(mr)
            } catch (ex: Exception) {
                log.warn("Falha ao salvar MessageRound (batalha ${batalha.idBatalha}, round $numeroRound): ${ex.message}")
            }
        }
    }

    private fun extrairAtacanteDeMensagem(msg: String, idRato1: Long, idRato2: Long): Long? {
        return when {
            msg.contains("Rato $idRato1") -> idRato1
            msg.contains("Rato $idRato2") -> idRato2
            else -> null
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

            val n = nomeClasse.lowercase()
            return when {
                "esgoto" in n -> ClassesRato.ESGOTO
                "hospital" in n -> ClassesRato.HOSPITAL
                "laboratorio" in n || "laboratório" in n -> ClassesRato.LABORATORIO
                "fazenda" in n -> ClassesRato.FAZENDA
                "cassino" in n -> ClassesRato.CASSINO
                "biblioteca" in n -> ClassesRato.BIBLIOTECA
                else -> ClassesRato.ESGOTO
            }
        } catch (_: Exception) {
            return ClassesRato.ESGOTO
        }
    }
}
