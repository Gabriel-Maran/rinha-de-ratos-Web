package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.DTOandBASIC.UsuarioBasic
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import com.unipar.rinhaRatos.enums.TipoConta
import com.unipar.rinhaRatos.models.Usuario
import com.unipar.rinhaRatos.repositorys.UsuarioRepository
import org.slf4j.LoggerFactory
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import java.util.Optional

@Service
class UsuarioService(
    private val usuarioRepository: UsuarioRepository
) {
    private val log = LoggerFactory.getLogger(javaClass)

    // --- Observação: esses métodos usam queries que já fazem fetch join em "ratos".
    // Assegure-se de ter findAllWithRatos() e findByIdWithRatos(id) no UsuarioRepository.
    fun getAllUsuario(): List<Usuario> {
        log.debug("Buscando todos usuários (com ratos) - iniciando")
        val list = usuarioRepository.findAllWithRatos()
        log.debug("Buscando todos usuários - retornados ${list.size}")
        return list
    }

    fun getById(id: Long): Optional<Usuario> {
        log.debug("Buscando usuário por id: $id (com ratos)")
        return usuarioRepository.findByIdWithRatos(id)
    }

    fun getTop10Vitorias(): List<Usuario> {
        log.debug("Buscando top 10 usuários por vitórias")
        val page = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "vitorias"))
        return usuarioRepository.findTop10WithRatosOrderByVitoriasDesc(page)
    }

    fun getUserPodeCriarNewRato(id: Long): String {
        val usuarioOpt = getById(id)
        if (usuarioOpt.isEmpty) return "SEM_USER"
        val usuario = usuarioOpt.get()
        if (usuario.ratos.size == 3) return "NAO"
        return "SIM"
    }

    fun cadastrarUsuario(usuario: Usuario): Map<String, Any> {
        val emailNormalized = usuario.email.trim()
        if (emailNormalized.isEmpty() || usuario.nome.isEmpty() || usuario.senha.isEmpty())
            return mapOf(
                        "user" to "",
                        "error" to "PREENCHA_CAMPOS"
                    )
        if (usuarioRepository.existsByEmail(emailNormalized)) {
            log.warn("Tentativa de cadastro com email já existente: $emailNormalized")
            return mapOf("user" to "", "error" to "EMAIL_ALREADY_EXISTS")
        }
        usuario.email = emailNormalized
        val saved = usuarioRepository.saveAndFlush(usuario)
        log.info("Usuário cadastrado id=${saved.idUsuario}, email=${saved.email}")
        return mapOf("user" to saved, "error" to "")
    }


    fun deletarPessoaPorId(id: Long): Boolean {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id)
            log.info("Usuário $id deletado")
            return true
        }
        log.warn("Tentativa de deletar usuário não-existente id=$id")
        return false
    }

    fun validaUsuarioLogin(email: String, senha: String): Optional<Usuario> {
        val usuario = usuarioRepository.findByEmail(email)
        if (email.isEmpty() || senha.isEmpty()) return Optional.empty()
        if (usuario.isPresent && usuario.get().senha == senha) {
            return Optional.of(usuario.get())
        }
        return Optional.empty()
    }

    fun redefinirUsuarioSenha(email: String, novaSenha: String): String {
        if(email.trim().isEmpty() || novaSenha.trim().isEmpty()) return "PREENCHA_CAMPOS"
        val usuarioOpt = usuarioRepository.findByEmail(email)
        if (usuarioOpt.isEmpty) {
            log.warn("Redefinir senha: email não encontrado $email")
            return "EMAIL_NOT_FOUND"
        }
        val usuario = usuarioOpt.get()

        usuario.senha = novaSenha
        usuarioRepository.save(usuario)
        log.info("Senha redefinida para o email $email")
        return "OK"
    }

    fun changeNomeEmailSenhaById(id: Long, usuarioDTO: UsuarioBasic): HttpStatus {
        val usuarioOpt = usuarioRepository.findById(id)
        if (usuarioOpt.isEmpty) {
            log.warn("changeNomeEmailSenhaById: usuário não encontrado id=$id")
            return HttpStatus.NOT_FOUND
        }
        val usuario = usuarioOpt.get()

        if (usuario.email != usuarioDTO.email) {
            if (usuarioRepository.existsByEmail(usuarioDTO.email)) {
                log.warn("changeNomeEmailSenhaById: email já em uso ${usuarioDTO.email}")
                return HttpStatus.BAD_REQUEST
            }
        }
        if(usuario.email.isEmpty() || usuario.nome.isEmpty() || usuario.senha.isEmpty()) return HttpStatus.NOT_ACCEPTABLE
        usuario.nome = usuarioDTO.nome
        usuario.email = usuarioDTO.email
        usuario.senha = usuarioDTO.senha
        usuarioRepository.save(usuario)
        log.info("Dados básicos atualizados para usuário id=$id")
        return HttpStatus.OK
    }

    fun changeFotoPerfil(idUsuario: Long, idFoto: Long): HttpStatus{
        if(idFoto < 0 || idFoto > 10) return HttpStatus.BAD_REQUEST
        val usuario: Optional<Usuario> = usuarioRepository.findById(idUsuario)
        if(usuario.isEmpty) return HttpStatus.NOT_FOUND
        usuario.get().idFotoPerfil = idFoto
        usuarioRepository.save(usuario.get())
        log.info("Deu certo")
        return HttpStatus.OK
    }
}
