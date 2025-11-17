package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.repositorys.ResultsRepository
import org.springframework.stereotype.Service

@Service
class HistoryService(
    private val messageService: MessageService,
    private val resultsService: ResultsService
) {
    fun getAllBattleHistoryByIdBatalha(id: Long): List<Any>{
        val mensagens =  messageService.pegarTodasAsMensagensPorBatalha(id)
        val resultado = resultsService.pegarTodasAsMensagensPorBatalha(id)
        if(mensagens.isEmpty || resultado.isEmpty) return listOf("NO_HISTORY_TO_SHOW")
        val lista = listOf(mensagens, resultado)
        return lista
    }

}