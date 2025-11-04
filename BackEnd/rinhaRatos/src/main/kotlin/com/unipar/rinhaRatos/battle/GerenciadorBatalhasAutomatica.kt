package com.unipar.rinhaRatos.service

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.concurrent.*

@Service
class GerenciadorBatalhasAutomatica(
    private val servicoBatalhaAutomatica: ServicoBatalhaAutomatica
) {
    private val log = LoggerFactory.getLogger(javaClass)
    private val executor: ExecutorService = Executors.newCachedThreadPool()
    private val futuros = ConcurrentHashMap<Long, Future<*>>() // idBatalha -> future

    /** Inicia execução assíncrona da simulação; retorna false se já estiver rodando */
    fun iniciarSimulacaoBatalhaAsync(idBatalha: Long): Boolean {
        if (futuros.containsKey(idBatalha)) {
            log.warn("Batalha $idBatalha já está em execução")
            return false
        }
        val f = executor.submit {
            try {
                log.info("Iniciando simulação da batalha $idBatalha")
                val resultado = servicoBatalhaAutomatica.executarBatalhaSincrona(idBatalha)
                log.info("Batalha ${resultado.idBatalha} finalizada. vencedorRato=${resultado.idRatoVencedor}")
            } catch (ex: Exception) {
                log.error("Erro na simulação da batalha $idBatalha: ${ex.message}", ex)
            } finally {
                futuros.remove(idBatalha)
            }
        }
        futuros[idBatalha] = f
        return true
    }

    fun estaExecutando(idBatalha: Long): Boolean {
        val f = futuros[idBatalha] ?: return false
        return !f.isDone && !f.isCancelled
    }

    fun pararSimulacao(idBatalha: Long): Boolean {
        val f = futuros.remove(idBatalha) ?: return false
        val cancelado = f.cancel(true)
        log.info("Solicitado cancelamento da batalha $idBatalha -> $cancelado")
        return cancelado
    }
}
