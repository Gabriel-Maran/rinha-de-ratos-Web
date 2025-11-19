package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.DTOandBASIC.RatoBasic
import com.unipar.rinhaRatos.DTOandBASIC.RatoDTO
import com.unipar.rinhaRatos.enums.TipoConta
import com.unipar.rinhaRatos.mapper.toDto
import com.unipar.rinhaRatos.models.Classe
import com.unipar.rinhaRatos.models.Rato
import com.unipar.rinhaRatos.repositorys.HabilidadeRepository
import com.unipar.rinhaRatos.repositorys.RatoRepository
import com.unipar.rinhaRatos.repositorys.UsuarioRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.Optional

@Service
class RatoService(
    private val ratoRepository: RatoRepository,
    private val habilidadeRepository: HabilidadeRepository,
    private val usuarioRepository: UsuarioRepository,
) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun getAllRatos(): List<RatoDTO> =
        ratoRepository.findAll().map { it.toDto() }


    fun getRatoById(id: Long): Optional<RatoDTO> {
        val ratoOpt = ratoRepository.findByIdWithUsuario(id)
        return if (ratoOpt.isPresent) Optional.of(ratoOpt.get().toDto()) else Optional.empty()
    }

    fun getAllRatosByUserId(id: Long): Optional<List<RatoDTO>>{
        if(usuarioRepository.findById(id).isEmpty) return Optional.empty()
        return Optional.of(ratoRepository.findAllByUsuario_IdUsuario(id).map { it.toDto() })
    }

    fun cadastrarRato(ratoBasic: RatoBasic): Map<String, String> {
        val donoDoRatoOpt = usuarioRepository.findByIdWithRatos(ratoBasic.idUsuario)
        if (donoDoRatoOpt.isEmpty) return mapOf("Status" to "USER_NOT_FOUND")
        val donoDoRato = donoDoRatoOpt.get()
        if(donoDoRato.tipoConta != TipoConta.BOT){
            if (donoDoRato.ratos.size >= 3) return mapOf("Status" to "USER_ALREADY_HAS_3_RATOS")
            if (donoDoRato.mousecoinSaldo < 5) return mapOf("Status" to "USER_HAS_NOT_ENOUGH_MONEY" )
            donoDoRato.mousecoinSaldo -= 5
        }
        val habilidadeOpt = habilidadeRepository.findById(ratoBasic.idHabilidade)
        if (habilidadeOpt.isEmpty) return mapOf("Status" to "NON_EXISTENT_CLASS_OR_HABILIDADE")
        val habilidade = habilidadeOpt.get()
        val classe = habilidade.classe

        val descricao = classe.descricao ?: "Sem descrição"
        var nome = ratoBasic.nomeCustomizado?.trim() ?: ""
        if(nome.isEmpty()){
            nome = classe.apelido.toString()
        }
        val rato = Rato(
            nomeCustomizado = nome,
            descricao = descricao,
            usuario = donoDoRato,
            classe = classe,
            habilidadeEscolhida = habilidade
        )

        val ratoAtualizado = auxSortRatoAtributos(rato, classe)
        val ratoSalvo = ratoRepository.save(ratoAtualizado)

        donoDoRato.ratos.add(ratoSalvo)
        usuarioRepository.save(donoDoRato)

        log.info("Rato ${ratoSalvo.idRato} cadastrado para usuário ${donoDoRato.idUsuario}")
        return mapOf("Status" to "CREATED", "idRato" to ratoSalvo.idRato.toString())
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
        val ratoOpt = ratoRepository.findByIdWithUsuario(ratoId)
        if (ratoOpt.isEmpty) return mapOf("Status" to "RATO_NOT_FOUND")
        val rato = ratoOpt.get()

        val usuarioRef = rato.usuario ?: return mapOf("Status" to "USER_NOT_FOUND")
        val usuarioOpt = usuarioRepository.findByIdWithRatos(usuarioRef.idUsuario)
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

    fun deletarRatoPermanentemente(ratoId: Long): Map<String, Any> {
        val ratoOpt = ratoRepository.findByIdWithUsuario(ratoId)
        if (ratoOpt.isEmpty) return mapOf("Status" to "RATO_NOT_FOUND")
        val rato = ratoOpt.get()

        val usuarioRef = rato.usuario ?: return mapOf("Status" to "USER_NOT_FOUND")
        val usuarioOpt = usuarioRepository.findByIdWithRatos(usuarioRef.idUsuario)
        if (usuarioOpt.isEmpty) return mapOf("Status" to "USER_NOT_FOUND")
        val usuario = usuarioOpt.get()

        val pertence = usuario.ratos.any { it.idRato == rato.idRato }
        if (!pertence) return mapOf("Status" to "USER_DONT_HAS_THISRATO")

        usuario.ratos.removeIf { it.idRato == rato.idRato }
        usuarioRepository.save(usuario)

        ratoRepository.deleteById(ratoId)

        log.info("Rato ${ratoId} deletado permanentemente do usuário ${usuario.idUsuario}")
        return mapOf("Status" to "NO_CONTENT")
    }
}