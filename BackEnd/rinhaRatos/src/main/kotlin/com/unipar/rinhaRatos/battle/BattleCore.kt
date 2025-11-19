package com.unipar.rinhaRatos.battle

import com.unipar.rinhaRatos.enums.AlvoEfeito
import com.unipar.rinhaRatos.enums.AtributoEfeito
import com.unipar.rinhaRatos.models.Rato
import org.slf4j.LoggerFactory
import kotlin.math.roundToInt
import kotlin.random.Random

private val log = LoggerFactory.getLogger("MotorBatalha")

//Representa um efeito (ex: "+18%PASSEU", "-8%HPSADV").
data class Efeito(
    val sinal: Int,
    val valor: Double,
    val ehPercentual: Boolean,
    val atributo: AtributoEfeito,
    val alvo: AlvoEfeito,
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
    val absolutos: MutableMap<AtributoEfeito, Double> = mutableMapOf(),
)

// Regex para pegar token do que a habilidade faz
private val tokenRegex = Regex("""^([+-])(\d+(?:\.\d+)?)(%?)([A-Za-z0-9]+)(SEU|ADV)?$""", RegexOption.IGNORE_CASE)


// Converte strings como "+8%HPSSEU", "-14%AGIADV", "+300%PASSEU", "+300PASSEU" em lista de Efeito.
fun parseEfeitos(strEfeitos: String?): List<Efeito> {
    if (strEfeitos.isNullOrBlank()) return emptyList()

    val tokens = strEfeitos.split(";")
        .map { it.trim() }
        .filter { it.isNotEmpty() }

    val lista = mutableListOf<Efeito>()

    for (token in tokens) {
        val m = tokenRegex.matchEntire(token)
        if (m == null) {
            log.warn("Token de efeito inválido e ignorado: '$token'")
            continue
        }

        // grupos: 1 = sinal, 2 = numero, 3 = '%' opcional, 4 = codigo atributo, 5 = SEU/ADV opcional
        val sinal = if (m.groupValues[1] == "-") -1 else 1
        val numRaw = m.groupValues[2]
        val ehPercent = m.groupValues[3] == "%"
        val codigoAtributo = m.groupValues[4].uppercase()
        val quemRaw = m.groupValues.getOrNull(5)?.uppercase().orEmpty().ifEmpty { "SEU" } // default SEU

        val num = numRaw.toDoubleOrNull()
        if (num == null) {
            log.warn("Número inválido no token '$token' — ignorando")
            continue
        }

        val valor = if (ehPercent) (num / 100.0) else num // percent => fração (ex 18% -> 0.18)

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

        val alvo = if (quemRaw == "ADV") AlvoEfeito.ADV else AlvoEfeito.SEU

        if (atributo == AtributoEfeito.DESCONHECIDO) {
            log.warn("Atributo desconhecido no token '$token' (código '$codigoAtributo') — adicionando como DESCONHECIDO para inspeção")
        }

        lista.add(Efeito(sinal, valor, ehPercent, atributo, alvo))
    }

    return lista
}


// Aplica um único efeito no estado (apenas para o round corrente). Gera mensagens explicativas.
fun aplicarEfeito(efeito: Efeito, fonte: EstadoRato, alvoEstado: EstadoRato, mensagens: MutableList<String>) {
    val destino = if (efeito.alvo == AlvoEfeito.SEU) fonte else alvoEstado

    when (efeito.atributo) {
        AtributoEfeito.HPS -> {
            // aplica alteração de HP (instantânea) — NÃO adiciona mensagem aqui
            val delta = if (efeito.ehPercentual) {
                (destino.hpMaximo * efeito.valor * efeito.sinal).roundToInt()
            } else {
                (efeito.valor * efeito.sinal).roundToInt()
            }
            destino.hpAtual = (destino.hpAtual + delta).coerceIn(0, destino.hpMaximo)
        }
        AtributoEfeito.STR, AtributoEfeito.AGI, AtributoEfeito.INT, AtributoEfeito.DEF, AtributoEfeito.PAS,
        AtributoEfeito.PDS, AtributoEfeito.CRI,
            -> {
            // aplica modificadores percentuais ou absolutos ao destino (válidos apenas para o round atual)
            if (efeito.ehPercentual) {
                val anterior = destino.percentuais.getOrDefault(efeito.atributo, 0.0)
                destino.percentuais[efeito.atributo] = anterior + efeito.valor * efeito.sinal
            } else {
                val anterior = destino.absolutos.getOrDefault(efeito.atributo, 0.0)
                destino.absolutos[efeito.atributo] = anterior + efeito.valor * efeito.sinal
            }
            // sem mensagem aqui — histórico será apenas uso/erro de habilidade, danos e HPs finais
        }

        else -> {
            log.warn("aplicarEfeito: atributo desconhecido. Ignorando -> $efeito")
            // não adiciona mensagem no histórico do round
        }
    }
}

//Estrutura de estatísticas de combate usadas no cálculo de dano:
data class EstatisticasCombate(val potencialAtaque: Double, val potencialDefesa: Double, val chanceCritico: Double)


//Calcula PAS, PDS e CRI a partir do EstadoRato (levando em conta percentuais e absolutos).
fun calcularEstatisticasCombate(estado: EstadoRato, chanceCriticoBase: Double = 0.10): EstatisticasCombate {
    // atributos efetivos (após percentuais/flat)
    val forca = (estado.forcaBase * (1.0 + estado.percentuais.getOrDefault(AtributoEfeito.STR, 0.0))
            + estado.absolutos.getOrDefault(AtributoEfeito.STR, 0.0)).coerceAtLeast(0.0)
    val agi = (estado.agilidadeBase * (1.0 + estado.percentuais.getOrDefault(AtributoEfeito.AGI, 0.0))
            + estado.absolutos.getOrDefault(AtributoEfeito.AGI, 0.0)).coerceAtLeast(0.0)
    val intel = (estado.inteligenciaBase * (1.0 + estado.percentuais.getOrDefault(AtributoEfeito.INT, 0.0))
            + estado.absolutos.getOrDefault(AtributoEfeito.INT, 0.0)).coerceAtLeast(0.0)
    val def = (estado.defesaBase * (1.0 + estado.percentuais.getOrDefault(AtributoEfeito.DEF, 0.0))
            + estado.absolutos.getOrDefault(AtributoEfeito.DEF, 0.0)).coerceAtLeast(0.0)

    //val basePas = forca * (1.0 + agi / 300.0 + intel / 500.0)
    val basePas = (forca * (1.0 + agi / 200.0 + intel / 400.0)) * 1.1

    val basePds = def * (1.0 + agi / 200.0 + intel / 400.0)

    // efeitos de habilidade (percentuais / flat) aplicados em PAS/PDS/CRI
    val pctPas = estado.percentuais.getOrDefault(AtributoEfeito.PAS, 0.0)
    val pctPds = estado.percentuais.getOrDefault(AtributoEfeito.PDS, 0.0)
    val pctCri = estado.percentuais.getOrDefault(AtributoEfeito.CRI, 0.0)

    val flatPas = estado.absolutos.getOrDefault(AtributoEfeito.PAS, 0.0)
    val flatPds = estado.absolutos.getOrDefault(AtributoEfeito.PDS, 0.0)

    // cálculo base
    val pasRaw = (basePas * (1.0 + pctPas) + flatPas).coerceAtLeast(0.0)
    val pdsRaw = (basePds * (1.0 + pctPds) + flatPds).coerceAtLeast(0.0)

    val pas = (pasRaw * (1.0 + kotlin.random.Random.nextDouble(-0.05, 0.05))).coerceAtLeast(1.0)
    val pds = (pdsRaw * (1.0 + kotlin.random.Random.nextDouble(-0.05, 0.05))).coerceAtLeast(1.0)

    // CRI: soma percentual de habilidade ao crítico base, limitando a um máximo razoável (ex.: 0.75)
    val cri = (chanceCriticoBase + pctCri).coerceIn(0.0, 0.75)

    return EstatisticasCombate(pas, pds, cri)
}


//Calcula dano dado PAS, PDS e chanceCritico;
fun calcularDano(pasAtacante: Double, pdsDefensor: Double, chanceCritico: Double): Int {
    var dano = (pasAtacante - pdsDefensor * 0.8).roundToInt() // antes 0.6
    if (dano < 1) dano = 1
    val roll = Random.nextDouble()
    val ehCritico = roll < chanceCritico
    if (ehCritico) dano = (dano * 2.0).roundToInt()
    return dano
}
