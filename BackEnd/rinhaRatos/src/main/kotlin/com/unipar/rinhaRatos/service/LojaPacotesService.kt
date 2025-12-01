package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.DTOandBASIC.LojaPacotesDTO
import com.unipar.rinhaRatos.enums.PurchaseResult
import com.unipar.rinhaRatos.mapper.toDto
import com.unipar.rinhaRatos.repositorys.LojaPacotesRepository
import com.unipar.rinhaRatos.repositorys.UsuarioRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.Optional

// Service do Loja de Pacotes
// Comentado apenas em partes essenciais, as outras se auto descrevem

@Service
class LojaPacotesService(
    private val lojaPacotesRepository: LojaPacotesRepository,
    private val usuarioRepository: UsuarioRepository
) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun pegaTodosPacotes(): List<LojaPacotesDTO> {
        return lojaPacotesRepository.findAll().map { it.toDto() }
    }

    fun pegaPacoteById(id: Long): Optional<LojaPacotesDTO> {
        return lojaPacotesRepository.findById(id).map { it.toDto() }
    }

    @Transactional
    fun comprarPacote(idPacote: Long, idUsuario: Long): PurchaseResult {
        val usuarioOpt = usuarioRepository.findById(idUsuario)
        if (usuarioOpt.isEmpty) {
            log.warn("Compra falhou: usuário não encontrado idUsuario=$idUsuario")
            return PurchaseResult.USER_NOT_FOUND
        }

        val pacoteOpt = lojaPacotesRepository.findById(idPacote)
        if (pacoteOpt.isEmpty) {
            log.warn("Compra falhou: pacote não encontrado idPacote=$idPacote")
            return PurchaseResult.PACOTE_NOT_FOUND
        }

        val usuario = usuarioOpt.get()
        val pacote = pacoteOpt.get()

        // CORREÇÃO: somar apenas a quantidade do pacote
        usuario.mousecoinSaldo = usuario.mousecoinSaldo + pacote.mousecoinQuantidade

        usuarioRepository.save(usuario)

        log.info("Compra realizada: usuarioId=${usuario.idUsuario}, pacoteId=${pacote.idPacote}, saldoNovo=${usuario.mousecoinSaldo}")
        return PurchaseResult.OK
    }
}
