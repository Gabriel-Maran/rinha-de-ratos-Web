package com.unipar.rinhaRatos.service

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

///////////////////////////////////////////////////////////////
//
// GERENCIADOR DE TODAS AS BATALHAS
// RESPONSAVEL POR RECEBER REQUISIÇÃO DO SERVICE DA BATALHA
// Pq separar assim? ORGANIZAÇÃO, MAIS SIMPLES DE DAR SUPORTE
//
///////////////////////////////////////////////////////////////

@Service
class GerenciadorBatalhasAutomatica(
    private val servicoBatalhaAutomatica: ServicoBatalhaAutomatica
) {
    private val log = LoggerFactory.getLogger(javaClass)

    // Inicia execução da simulação; retorna false se já estiver rodando ou tiver rodado
    fun iniciarSimulacaoBatalha(idBatalha: Long): Boolean {
        val resultado = servicoBatalhaAutomatica.executaBatalha(idBatalha)
        return resultado.isPresent
    }
}
