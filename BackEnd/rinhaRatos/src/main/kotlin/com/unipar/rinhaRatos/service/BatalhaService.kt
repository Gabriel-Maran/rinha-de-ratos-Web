package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.DTOandBASIC.BatalhaBasic
import com.unipar.rinhaRatos.models.Batalha
import com.unipar.rinhaRatos.repositorys.BatalhaRepository
import org.springframework.stereotype.Service
import com.unipar.rinhaRatos.enums.StatusBatalha
import com.unipar.rinhaRatos.repositorys.RatoRepository
import com.unipar.rinhaRatos.repositorys.UsuarioRepository
import org.slf4j.LoggerFactory

@Service
class BatalhaService(
    private var batalhaRepository: BatalhaRepository,
    private var usuarioRepository: UsuarioRepository,
    private var ratoRepository: RatoRepository
) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun pegarBatalhasFeitasPelaADMPorId(idAdm: Long): List<Batalha> =
        batalhaRepository.findAllByAdmCriador_IdUsuario(idAdm)


    fun pegarTodasAsBatalhasDoUsuario(idUsuario: Long): List<Batalha> =
        batalhaRepository.pegarTodasBatalhasDoUsuario(idUsuario)

    fun batalhaCheia(idBatalha: Long): String {
        val batalhaOpt = batalhaRepository.findById(idBatalha)
        if (batalhaOpt.isEmpty) return "BATALHA_NOT_FOUND"
        val batalha = batalhaOpt.get()
        return if (batalha.jogador1 != null && batalha.jogador2 != null) "BATALHA_CHEIA" else "BATALHA_NAO_CHEIA"
    }

    fun usuarioEstaBatalhandoPeloRato(idBatalha: Long, idUsuario: Long): String {
        val batalhaOpt = batalhaRepository.findById(idBatalha)
        if (batalhaOpt.isEmpty) return "BATALHA_NOT_FOUND"
        val batalha = batalhaOpt.get()

        if (batalha.jogador1?.idUsuario == idUsuario ||
            batalha.jogador2?.idUsuario == idUsuario) {
            return "USER_IS_IN_THIS_BATTLE"
        }

        if (batalha.rato1?.usuario?.idUsuario == idUsuario ||
            batalha.rato2?.usuario?.idUsuario == idUsuario) {
            return "USER_IS_IN_THIS_BATTLE"
        }

        return "USER_IS_NOT_IN_THIS_BATTLE"
    }


    fun criarBatalha(batalha: Batalha): Batalha {
        batalha.nomeBatalha = batalha.nomeBatalha.trim()
        if(batalha.nomeBatalha.isEmpty()) batalha.nomeBatalha = "Sem nome"
        batalha.status = StatusBatalha.InscricoesAbertas
        val saved = batalhaRepository.save<Batalha>(batalha)
        log.info("Batalha criada id=${saved.idBatalha}, nome='${saved.nomeBatalha}'")
        return saved
    }

    fun atualizarInfomacoesBatalha(idBatalha: Long, batalhaBasic: BatalhaBasic): String {
        val batalhaOpt = batalhaRepository.findById(idBatalha)
        if (batalhaOpt.isEmpty) return "BATALHA_NOT_FOUND"
        val batalha = batalhaOpt.get()
        if (batalha.status == StatusBatalha.EmAndamento ||
            batalha.status == StatusBatalha.Concluida)
            return "BATALHA_HAPPENING_OR_OVER"

        batalha.nomeBatalha = batalhaBasic.nomeBatalha.trim()
        batalha.dataHorarioInicio = batalhaBasic.dataHorarioInicio
        batalhaRepository.save(batalha)
        log.info("Batalha $idBatalha atualizada (nome/data).")
        return "OK"
    }

    fun excluirBatalhaPorId(idBatalha: Long): String {
        val batalhaOpt = batalhaRepository.findById(idBatalha)
        if (batalhaOpt.isEmpty) return "BATALHA_NOT_FOUND"
        val batalha = batalhaOpt.get()
        if (batalha.status == StatusBatalha.EmAndamento || batalha.status == StatusBatalha.Concluida) return "BATALHA_HAPPENING_OR_OVER"
        batalha.rato1?.let {
            it.estaTorneio = false
            ratoRepository.save(it)
        }
        batalha.rato2?.let {
            it.estaTorneio = false
            ratoRepository.save(it)
        }
        batalhaRepository.deleteById(idBatalha)
        log.info("Batalha $idBatalha excluída pelo sistema")
        return "OK"
    }

    fun excluirUsuarioDaBatalhaPorId(idBatalha: Long, idUsuario: Long): String {
        val batalhaOpt = batalhaRepository.findById(idBatalha)
        if (batalhaOpt.isEmpty) return "BATALHA_NOT_FOUND"

        val usuarioOpt = usuarioRepository.findById(idUsuario)
        if (usuarioOpt.isEmpty) return "USUARIO_NOT_FOUND"
        val usuario = usuarioOpt.get()
        val batalha = batalhaOpt.get()

        if (batalha.status == StatusBatalha.EmAndamento || batalha.status == StatusBatalha.Concluida) return "BATALHA_HAPPENING_OR_OVER"

        var removed = false

        if (batalha.jogador1?.idUsuario == usuario.idUsuario) {
            batalha.rato1?.let { rato ->
                val ratoDbOpt = ratoRepository.findById(rato.idRato)
                if (ratoDbOpt.isEmpty) return "RATO_NOT_FOUND"
                val ratoDb = ratoDbOpt.get()
                ratoDb.estaTorneio = false
                ratoRepository.save(ratoDb)
            }
            batalha.jogador1 = null
            batalha.rato1 = null
            removed = true
        }

        if (batalha.jogador2?.idUsuario == usuario.idUsuario) {
            batalha.rato2?.let { rato ->
                val ratoDbOpt = ratoRepository.findById(rato.idRato)
                if (ratoDbOpt.isEmpty) return "RATO_NOT_FOUND"
                val ratoDb = ratoDbOpt.get()
                ratoDb.estaTorneio = false
                ratoRepository.save(ratoDb)
            }
            batalha.jogador2 = null
            batalha.rato2 = null
            removed = true
        }

        if (!removed) return "USER_NOT_IN_BATTLE"

        batalhaRepository.save(batalha) // salvar alteração (não deletar a batalha inteira)
        log.info("Usuário ${usuario.idUsuario} removido da batalha $idBatalha")
        return "OK"
    }
}