package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.DTOs.RatoDTO
import com.unipar.rinhaRatos.enums.StatusBatalha
import com.unipar.rinhaRatos.models.Classe
import com.unipar.rinhaRatos.models.Rato
import com.unipar.rinhaRatos.models.Usuario
import com.unipar.rinhaRatos.repositorys.BatalhaRepository
import com.unipar.rinhaRatos.repositorys.ClasseRepository
import com.unipar.rinhaRatos.repositorys.HabilidadeRepository
import com.unipar.rinhaRatos.repositorys.RatoRepository
import com.unipar.rinhaRatos.repositorys.UsuarioRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.Optional

@Service
class RatoService(
    private val ratoRepository: RatoRepository,
    private val classeRepository: ClasseRepository,
    private val habilidadeRepository: HabilidadeRepository,
    private val usuarioRepository: UsuarioRepository,
    private val batalhaRepository: BatalhaRepository
) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun getAllRatos(): List<Rato> = ratoRepository.findAll()

    fun getRatoById(id: Long): Optional<Rato> = ratoRepository.findById(id)

    fun cadastrarRato(ratoDTO: RatoDTO): Map<String, Any> {
        val donoDoRatoOpt = usuarioRepository.findById(ratoDTO.idUsuario)
        if (donoDoRatoOpt.isEmpty) return mapOf("Status" to "USER_NOT_FOUND")
        val donoDoRato = donoDoRatoOpt.get()

        if (donoDoRato.ratos.size >= 3) return mapOf("Status" to "USER_ALREADY_HAS_3_RATOS")

        val classeOpt = classeRepository.findByNomeClasse(ratoDTO.nomeClasse)
        val habilidadeOpt = habilidadeRepository.findByNomeHabilidade(ratoDTO.nomeHabilidade)
        if (classeOpt.isEmpty || habilidadeOpt.isEmpty) return mapOf("Status" to "NON_EXISTENT_CLASS_OR_HABILIDADE")

        val classe = classeOpt.get()
        val habilidade = habilidadeOpt.get()

        val rato = Rato(
            nomeCustomizado = ratoDTO.nome_customizado,
            descricao = ratoDTO.descricao!!,
            usuario = donoDoRato,
            classe = classe,
            habilidadeEscolhida = habilidade
        )

        val ratoAtualizado = auxSortRatoAtributos(rato, classe)
        val ratoSalvo = ratoRepository.save(ratoAtualizado)

        donoDoRato.ratos.add(ratoSalvo)
        usuarioRepository.save(donoDoRato)

        log.info("Rato ${ratoSalvo.idRato} cadastrado para usuário ${donoDoRato.idUsuario}")
        return mapOf("Status" to "CREATED", "Rato" to ratoSalvo)
    }

    private fun auxSortRatoAtributos(rato: Rato, classe: Classe): Rato {
        rato.strBase = (classe.strMin..classe.strMax).random()
        rato.agiBase = (classe.agiMin..classe.agiMax).random()
        rato.hpsBase = (classe.hpsMin..classe.hpsMax).random()
        rato.intBase = (classe.intMin..classe.intMax).random()
        rato.defBase = (classe.defMin..classe.defMax).random()

        rato.estaVivo = true
        rato.estaTorneio = false
        return rato
    }

    fun removeRato(ratoId: Long): Map<String, Any> {
        val ratoOpt = ratoRepository.findById(ratoId)
        if (ratoOpt.isEmpty) return mapOf("Status" to "RATO_NOT_FOUND")
        val rato = ratoOpt.get()

        val usuarioOpt = usuarioRepository.findById(rato.usuario!!.idUsuario)
        if (usuarioOpt.isEmpty) return mapOf("Status" to "USER_NOT_FOUND")
        val usuario = usuarioOpt.get()

        val pertence = usuario.ratos.any { it.idRato == rato.idRato }
        if (!pertence) return mapOf("Status" to "USER_DONT_HAS_THISRATO")

        rato.estaTorneio = false
        rato.estaVivo = false

        usuario.ratos.removeIf { it.idRato == rato.idRato }
        ratoRepository.save(rato)
        usuarioRepository.save(usuario)

        log.info("Rato ${rato.idRato} removido (soft) do usuário ${usuario.idUsuario}")
        return mapOf("Status" to "NO_CONTENT")
    }

    fun sairDoTorneio(usuarioId: Long, batalhaId: Long): Map<String, Any> {
        val batalhaOpt = batalhaRepository.findById(batalhaId)
        if (batalhaOpt.isEmpty) return mapOf("Status" to "BATALHA_NOT_FOUND")
        val batalha = batalhaOpt.get()

        if (batalha.status != StatusBatalha.InscricoesAbertas) return mapOf("Status" to "BATALHA_ALREADY_STARTED")

        var usuario: Usuario? = null
        var rato: Rato? = null
        if (batalha.jogador1?.idUsuario == usuarioId) {
            usuario = batalha.jogador1
            rato = batalha.rato1
        } else if (batalha.jogador2?.idUsuario == usuarioId) {
            usuario = batalha.jogador2
            rato = batalha.rato2
        }

        if (usuario == null) return mapOf("Status" to "USER_NOT_FOUND")
        if (rato == null) return mapOf("Status" to "RATO_NOT_FOUND")

        if (batalha.rato1 != null && batalha.rato1!!.idRato == rato.idRato) batalha.rato1 = null
        else if (batalha.rato2 != null && batalha.rato2!!.idRato == rato.idRato) batalha.rato2 = null

        rato.estaTorneio = false

        batalhaRepository.save(batalha)
        ratoRepository.save(rato)

        log.info("Usuário ${usuario.idUsuario} saiu da batalha ${batalha.idBatalha} com rato ${rato.idRato}")
        return mapOf("Status" to "NO_CONTENT")
    }

    fun cadastrarRatoNaBatalha(ratoId: Long, batalhaId: Long): Map<String, Any> {
        val ratoOpt = ratoRepository.findById(ratoId)
        if (ratoOpt.isEmpty) return mapOf("Status" to "RATO_NOT_FOUND")
        val batalhaOpt = batalhaRepository.findById(batalhaId)
        if (batalhaOpt.isEmpty) return mapOf("Status" to "BATALHA_NOT_FOUND")

        val rato = ratoOpt.get()
        val batalha = batalhaOpt.get()

        if (batalha.status == StatusBatalha.InscricoesFechadas) return mapOf("Status" to "BATALHA_FULL")
        if (batalha.rato1 != null && batalha.rato2 != null) return mapOf("Status" to "BATALHA_FULL")

        if (!rato.estaVivo || rato.estaTorneio) return mapOf("Status" to "RATO_NOT_ELIGIBLE")

        val donoId = rato.usuario?.idUsuario
        if ((batalha.jogador1 != null && batalha.jogador1!!.idUsuario == donoId)
            || (batalha.jogador2 != null && batalha.jogador2!!.idUsuario == donoId)
        ) {
            return mapOf("Status" to "BAD_REQUEST")
        }

        if (batalha.rato1 == null) {
            batalha.rato1 = rato
            batalha.jogador1 = rato.usuario
        } else {
            batalha.rato2 = rato
            batalha.jogador2 = rato.usuario
        }

        rato.estaTorneio = true

        batalhaRepository.save(batalha)
        ratoRepository.save(rato)

        log.info("Rato ${rato.idRato} entrou na batalha ${batalha.idBatalha}")
        return mapOf("Status" to "OK")
    }

    fun deletarRatoPermanentemente(ratoId: Long): Map<String, Any> {
        val ratoOpt = ratoRepository.findById(ratoId)
        if (ratoOpt.isEmpty) return mapOf("Status" to "RATO_NOT_FOUND")
        val rato = ratoOpt.get()

        val usuarioOpt = usuarioRepository.findById(rato.usuario!!.idUsuario)
        if (usuarioOpt.isEmpty) return mapOf("Status" to "USER_NOT_FOUND")
        val usuario = usuarioOpt.get()

        val pertence = usuario.ratos.any { it.idRato == rato.idRato }
        if (!pertence) return mapOf("Status" to "USER_DONT_HAS_THISRATO")

        usuario.ratos.removeIf { it.idRato == rato.idRato }
        usuarioRepository.save(usuario)

        // delete definitivo
        ratoRepository.deleteById(ratoId)

        log.info("Rato ${ratoId} deletado permanentemente do usuário ${usuario.idUsuario}")
        return mapOf("Status" to "NO_CONTENT")
    }
}
