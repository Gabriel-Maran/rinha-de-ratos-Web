package com.unipar.rinhaRatos.service

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.concurrent.*

@Service
class GerenciadorBatalhasAutomatica(
    private val servicoBatalhaAutomatica: ServicoBatalhaAutomatica
) {
    private val log = LoggerFactory.getLogger(javaClass)

    // Inicia execução assíncrona da simulação; retorna false se já estiver rodando
    fun iniciarSimulacaoBatalhaAsync(idBatalha: Long): Boolean {
        val resultado = servicoBatalhaAutomatica.executarBatalhaSincrona(idBatalha)
        return resultado.isPresent
    }
}
