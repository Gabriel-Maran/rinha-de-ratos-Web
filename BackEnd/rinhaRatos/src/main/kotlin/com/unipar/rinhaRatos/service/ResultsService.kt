package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.models.MessageRound
import com.unipar.rinhaRatos.models.Results
import com.unipar.rinhaRatos.repositorys.ResultsRepository
import org.springframework.stereotype.Service
import java.util.Optional

@Service
class ResultsService(
    private val resultsRepository: ResultsRepository,
    private val batalhaRepository: ResultsRepository
) {
    fun criarMensagem(mensagem: Results): Optional<Results> {
        if (mensagem.id_batalha == 0L
            || mensagem.perdedorRatoHP < 0
            || mensagem.vencedorRatoHP <= 0
            || mensagem.perdedorRatoName.isEmpty()
            || mensagem.vencedorRatoName.isEmpty()
            || mensagem.perdedorUserName.isEmpty()
            || mensagem.vencedorUserName.isEmpty()
            )
            return Optional.empty()
        return Optional.of(resultsRepository.save(mensagem))
    }

    fun pegarTodasAsMensagensPorBatalha(idBatalha: Long): Optional<List<Results>> {
        val batalha = batalhaRepository.findById(idBatalha)
        return Optional.of(resultsRepository.findAllIdBatalha(idBatalha))
    }
}