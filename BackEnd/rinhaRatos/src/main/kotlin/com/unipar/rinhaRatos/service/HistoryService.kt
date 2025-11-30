package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.repositorys.ResultsRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

// Service do Historico
// Comentado apenas em partes essenciais, as outras se auto descrevem

@Service
class HistoryService(
    private val messageService: MessageService,
    private val resultsService: ResultsService
) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun getAllBattleHistoryByIdBatalha(id: Long): List<Any>{
        val mensagens =  messageService.pegarTodasAsMensagensPorBatalha(id)
        val resultado = resultsService.pegarTodasAsMensagensPorBatalha(id)
        if(mensagens.isEmpty || resultado.isEmpty) return listOf("NO_HISTORY_TO_SHOW")
        val lista = listOf(mensagens, resultado)
        return lista
    }

}