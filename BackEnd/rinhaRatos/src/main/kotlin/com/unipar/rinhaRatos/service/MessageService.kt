package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.DTOandBASIC.MessageRoundDTO
import com.unipar.rinhaRatos.mapper.toDto
import com.unipar.rinhaRatos.models.MessageRound
import com.unipar.rinhaRatos.repositorys.MessageRoundRepository
import com.unipar.rinhaRatos.repositorys.ResultsRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.Optional

@Service
class MessageService(
    private val messageRoundRepository: MessageRoundRepository,
    private val batalhaRepository: ResultsRepository
) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun criarMensagem(mensagem: MessageRound): Optional<MessageRound> {
        if (mensagem.id_batalha == 0L || mensagem.round == -1L) return Optional.empty()
        if (mensagem.descricao.isEmpty()) mensagem.descricao = "Sen ação"
        val mensagemPront = messageRoundRepository.save(mensagem)
        return Optional.of(mensagemPront)
    }

    fun pegarTodasAsMensagensPorBatalha(idBatalha: Long): Optional<List<MessageRoundDTO>> {
        val batalha = batalhaRepository.findById(idBatalha)
        log.warn(batalha.toString())
        return Optional.of(messageRoundRepository.findByIdBatalha(idBatalha).map { it.toDto() })
    }
}