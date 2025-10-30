package com.unipar.rinhaRatos.service

import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import com.unipar.rinhaRatos.DTOandBASIC.UsuarioBasic
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

    fun cadastrarUsuario(usuario: Usuario): Usuario {
        // Normaliza o e-mail (trim + lowercase opcional)
        val emailNormalized = usuario.email.trim() // .lowercase(Locale.ROOT) se quiser case-insensitive
        if (usuarioRepository.existsByEmail(emailNormalized)) {
            log.warn("Tentativa de cadastro com email já existente: $emailNormalized")
            throw IllegalArgumentException("Email já cadastrado")
        }

        usuario.email = emailNormalized

        // Garantir que salvamos como nova entidade (evita merges inesperados)
        usuario.idUsuario = 0L

        try {
            // saveAndFlush força o flush para que violações de constraint (unique) sejam lançadas aqui
            val saved = usuarioRepository.saveAndFlush(usuario)
            log.info("Usuário cadastrado id=${saved.idUsuario}, email=${saved.email}")
            return saved
        } catch (ex: DataIntegrityViolationException) {
            // Trata condição de corrida: duas requisições checaram existsByEmail ao mesmo tempo
            log.warn("Falha ao salvar usuário (provável e-mail duplicado): ${usuario.email} - ${ex.message}")
            throw IllegalArgumentException("Email já cadastrado")
        }
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

    fun validaUsuarioLogin(email: String, senha: String): Optional<TipoConta> {
        val usuario = usuarioRepository.findByEmail(email)
        if (usuario.isPresent && usuario.get().senha == senha) {
            return Optional.of(usuario.get().tipoConta)
        }
        return Optional.empty()
    }

    fun redefinirUsuarioSenha(email: String, novaSenha: String): Boolean {
        val usuarioOpt = usuarioRepository.findByEmail(email)
        if (usuarioOpt.isPresent) {
            val usuario = usuarioOpt.get()
            usuario.senha = novaSenha
            usuarioRepository.save(usuario)
            log.info("Senha redefinida para o email $email")
            return true
        }
        log.warn("Redefinir senha: email não encontrado $email")
        return false
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

        usuario.nome = usuarioDTO.nome
        usuario.email = usuarioDTO.email
        usuario.senha = usuarioDTO.senha
        usuarioRepository.save(usuario)
        log.info("Dados básicos atualizados para usuário id=$id")
        return HttpStatus.OK
    }

    fun compraDeMouseCoin(id: Long, quantidade: Int): Boolean {
        val usuarioOpt = usuarioRepository.findById(id)
        if (usuarioOpt.isEmpty) {
            log.warn("compraDeMouseCoin: usuário não encontrado id=$id")
            return false
        }
        val usuario = usuarioOpt.get()
        usuario.mousecoinSaldo = usuario.mousecoinSaldo + quantidade
        usuarioRepository.save(usuario)
        log.info("Usuário id=$id comprou $quantidade mousecoins (novo saldo=${usuario.mousecoinSaldo})")
        return true
    }

    fun gastoDeMouseCoin(id: Long, quantidade: Int): Boolean {
        val usuarioOpt = usuarioRepository.findById(id)
        if (usuarioOpt.isEmpty) {
            log.warn("gastoDeMouseCoin: usuário não encontrado id=$id")
            return false
        }
        val usuario = usuarioOpt.get()
        if (usuario.mousecoinSaldo < quantidade) {
            log.warn("gastoDeMouseCoin: saldo insuficiente id=$id, saldo=${usuario.mousecoinSaldo}, tentado=$quantidade")
            return false
        }
        usuario.mousecoinSaldo = usuario.mousecoinSaldo - quantidade
        usuarioRepository.save(usuario)
        log.info("Usuário id=$id gastou $quantidade mousecoins (novo saldo=${usuario.mousecoinSaldo})")
        return true
    }

    fun aumentaUmaVitoriaById(id: Long): Boolean {
        val usuarioOpt = usuarioRepository.findById(id)
        if (usuarioOpt.isEmpty) {
            log.warn("aumentaUmaVitoriaById: usuário não encontrado id=$id")
            return false
        }
        val usuario = usuarioOpt.get()
        usuario.vitorias = usuario.vitorias + 1
        usuarioRepository.save(usuario)
        log.info("Vitória incrementada para usuário id=$id (vitorias=${usuario.vitorias})")
        return true
    }
}
