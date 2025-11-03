package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.models.MessageRound
import com.unipar.rinhaRatos.repositorys.MessageRoundRepository
import com.unipar.rinhaRatos.repositorys.ResultsRepository
import org.springframework.stereotype.Service
import java.util.Optional
import javax.swing.text.html.Option

@Service
class MessageService(
    private val messageRoundRepository: MessageRoundRepository,
    private val batalhaRepository: ResultsRepository
) {
    fun criarMensagem(mensagem: MessageRound): Boolean {
        if (mensagem.id_batalha == 0L || mensagem.round == -1L) return false
        if (mensagem.descricao.isEmpty()) mensagem.descricao = "Sen ação"
        messageRoundRepository.save(mensagem)
        return true
    }

    fun pegarTodasAsMensagensPorBatalha(idBatalha: Long): Optional<List<MessageRound>> {
        val batalha = batalhaRepository.findById(idBatalha)
        if (batalha.isEmpty) return Optional.empty()
        return Optional.of(messageRoundRepository.findAllById_batalha(idBatalha))
    }

}