package com.unipar.rinhaRatos.battle

import com.unipar.rinhaRatos.models.Rato
import org.slf4j.LoggerFactory
import kotlin.math.roundToInt
import kotlin.random.Random

private val log = LoggerFactory.getLogger("MotorBatalha")

// Alvo do efeito: aplica ao próprio (SEU) ou ao adversário (ADV)
enum class AlvoEfeito { SEU, ADV }
// Atributos que uma string de efeito pode referenciar
enum class AtributoEfeito { HPS, STR, AGI, INT, DEF, PAS, PDS, CRI, DESCONHECIDO }

//Representa um efeito (ex: "+18%PASSEU", "-8%HPSADV").
data class Efeito(
    val sinal: Int,
    val valor: Double,
    val ehPercentual: Boolean,
    val atributo: AtributoEfeito,
    val alvo: AlvoEfeito
)


//Estado de um rato durante a simulação (em memória).
data class EstadoRato(
    val idRato: Long,
    val hpMaximo: Int,
    var hpAtual: Int,
    val forcaBase: Int,
    val agilidadeBase: Int,
    val inteligenciaBase: Int,
    val defesaBase: Int,
    val ratoOriginal: Rato,
    val percentuais: MutableMap<AtributoEfeito, Double> = mutableMapOf(),
    val absolutos: MutableMap<AtributoEfeito, Double> = mutableMapOf()
)

//Regex que captura tokens: "+18%PASSEU" ou "-8%HPSADV" ou "+300%PASSEU"
private val tokenRegex = Regex("""^([+-])(\d+(?:\.\d+)?)(%?)([A-Z0-9]+?)(SEU|ADV)?$""")

//Converte string de efeitos em lista de Efeito
fun parseEfeitos(strEfeitos: String?): List<Efeito> {
    if (strEfeitos.isNullOrBlank()) return emptyList()
    val tokens = strEfeitos.split(";").map { it.trim() }.filter { it.isNotEmpty() }
    val lista = mutableListOf<Efeito>()
    for (t in tokens) {
        val m = tokenRegex.matchEntire(t)
        if (m == null) {
            log.warn("Token de efeito inválido e ignorado: '$t'")
            continue
        }
        val sinal = if (m.groupValues[1] == "-") -1 else 1
        val numRaw = m.groupValues[2]
        val ehPercent = m.groupValues[3] == "%"
        val codigoAtributo = m.groupValues[4]
        val quem = m.groupValues.getOrNull(5) ?: "SEU"
        val num = numRaw.toDoubleOrNull() ?: continue
        val valor = if (ehPercent) num / 100.0 else num
        val atributo = when {
            codigoAtributo.startsWith("HPS") -> AtributoEfeito.HPS
            codigoAtributo.startsWith("STR") -> AtributoEfeito.STR
            codigoAtributo.startsWith("AGI") -> AtributoEfeito.AGI
            codigoAtributo.startsWith("INT") -> AtributoEfeito.INT
            codigoAtributo.startsWith("DEF") -> AtributoEfeito.DEF
            codigoAtributo.startsWith("PA") || codigoAtributo.contains("PAS") -> AtributoEfeito.PAS
            codigoAtributo.startsWith("PD") || codigoAtributo.contains("PDS") -> AtributoEfeito.PDS
            codigoAtributo.startsWith("CRI") -> AtributoEfeito.CRI
            else -> AtributoEfeito.DESCONHECIDO
        }
        val alvo = if (quem == "ADV") AlvoEfeito.ADV else AlvoEfeito.SEU
        lista.add(Efeito(sinal, valor, ehPercent, atributo, alvo))
    }
    return lista
}

// Aplica um único efeito no estado (apenas para o round corrente). Gera mensagens explicativas.
fun aplicarEfeito(efeito: Efeito, fonte: EstadoRato, alvoEstado: EstadoRato, mensagens: MutableList<String>) {
    val destino = if (efeito.alvo == AlvoEfeito.SEU) fonte else alvoEstado
    when (efeito.atributo) {
        AtributoEfeito.HPS -> {
            val delta = if (efeito.ehPercentual) (destino.hpMaximo * efeito.valor * efeito.sinal).roundToInt()
            else (efeito.valor * efeito.sinal).roundToInt()
            destino.hpAtual = (destino.hpAtual + delta).coerceIn(0, destino.hpMaximo)
            mensagens.add("${if (destino === fonte) "Seu rato" else "Oponente"} ${if (delta >= 0) "recuperou" else "sofreu"} ${kilo(delta)} HP")
        }
        AtributoEfeito.STR, AtributoEfeito.AGI, AtributoEfeito.INT, AtributoEfeito.DEF,
        AtributoEfeito.PAS, AtributoEfeito.PDS, AtributoEfeito.CRI -> {
            if (efeito.ehPercentual) {
                val prev = destino.percentuais.getOrDefault(efeito.atributo, 0.0)
                destino.percentuais[efeito.atributo] = prev + efeito.valor * efeito.sinal
            } else {
                val prev = destino.absolutos.getOrDefault(efeito.atributo, 0.0)
                destino.absolutos[efeito.atributo] = prev + efeito.valor * efeito.sinal
            }
            val texto = if (efeito.ehPercentual) "${(efeito.valor*100).roundToInt()}%" else "${efeito.valor.roundToInt()}"
            mensagens.add("${if (destino === fonte) "Seu rato" else "Oponente"} recebeu ${if (efeito.sinal>0) "+" else "-"}$texto em ${efeito.atributo}")
        }
        else -> mensagens.add("Efeito desconhecido ignorado")
    }
}

private fun kilo(n: Int) = "$n"

/**
 * Estrutura de estatísticas de combate usadas no cálculo de dano:
 * - potencialAtaque (PAS)
 * - potencialDefesa  (PDS)
 * - chanceCritico    (CRI) valor entre 0.0 e 1.0
 */
data class EstatisticasCombate(val potencialAtaque: Double, val potencialDefesa: Double, val chanceCritico: Double)

/**
 * Calcula PAS, PDS e CRI a partir do EstadoRato (levando em conta percentuais e absolutos).
 * A fórmula é simples e ajustável — serve como ponto inicial.
 */
fun calcularEstatisticasCombate(estado: EstadoRato, chanceCriticoBase: Double = 0.10): EstatisticasCombate {
    val forca = estado.forcaBase * (1.0 + estado.percentuais.getOrDefault(AtributoEfeito.STR, 0.0)) + estado.absolutos.getOrDefault(AtributoEfeito.STR, 0.0)
    val agi = estado.agilidadeBase * (1.0 + estado.percentuais.getOrDefault(AtributoEfeito.AGI, 0.0)) + estado.absolutos.getOrDefault(AtributoEfeito.AGI, 0.0)
    val intel = estado.inteligenciaBase * (1.0 + estado.percentuais.getOrDefault(AtributoEfeito.INT, 0.0)) + estado.absolutos.getOrDefault(AtributoEfeito.INT, 0.0)
    val def = estado.defesaBase * (1.0 + estado.percentuais.getOrDefault(AtributoEfeito.DEF, 0.0)) + estado.absolutos.getOrDefault(AtributoEfeito.DEF, 0.0)

    val basePas = forca * (1.0 + agi / 200.0 + intel / 400.0)
    val basePds = def * (1.0 + agi / 300.0 + intel / 600.0)

    val pctPas = estado.percentuais.getOrDefault(AtributoEfeito.PAS, 0.0)
    val pctPds = estado.percentuais.getOrDefault(AtributoEfeito.PDS, 0.0)
    val pctCri = estado.percentuais.getOrDefault(AtributoEfeito.CRI, 0.0)

    val flatPas = estado.absolutos.getOrDefault(AtributoEfeito.PAS, 0.0)
    val flatPds = estado.absolutos.getOrDefault(AtributoEfeito.PDS, 0.0)

    val pas = basePas * (1.0 + pctPas) + flatPas
    val pds = basePds * (1.0 + pctPds) + flatPds
    val cri = (chanceCriticoBase + pctCri).coerceAtLeast(0.0)

    return EstatisticasCombate(pas, pds, cri)
}

// Calcula dano dado PAS, PDS e chanceCritico; crítico multiplica por 1.8
fun calcularDano(pasAtacante: Double, pdsDefensor: Double, chanceCritico: Double): Int {
    var dano = (pasAtacante - pdsDefensor * 0.6).roundToInt()
    if (dano < 1) dano = 1
    val roll = Random.nextDouble()
    val ehCritico = roll < chanceCritico
    if (ehCritico) dano = (dano * 1.8).roundToInt()
    return dano
}
