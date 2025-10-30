package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.DTOs.UsuarioDTO
import com.unipar.rinhaRatos.enums.TipoConta
import com.unipar.rinhaRatos.models.Usuario
import com.unipar.rinhaRatos.repositorys.UsuarioRepository
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import java.util.Optional

@Service
class UsuarioService(
    private val usuarioRepository: UsuarioRepository
) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun getAllUsuario(): List<Usuario> = usuarioRepository.findAll()

    fun getById(id: Long): Optional<Usuario> = usuarioRepository.findById(id)

    fun getByEmail(email: String): Optional<Usuario> = usuarioRepository.findByEmail(email)

    fun getTop10Vitorias(): List<Usuario> = usuarioRepository.findTop10ByOrderByVitoriasDesc()

    fun cadastrarUsuario(usuario: Usuario): Usuario {
        if (usuarioRepository.existsByEmail(usuario.email)) {
            throw IllegalArgumentException("Email já cadastrado")
        }
        return usuarioRepository.save(usuario)
    }

    fun deletarPessoaPorId(id: Long): Boolean {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id)
            log.info("Usuário $id deletado")
            return true
        }
        return false
    }

    fun atualizarTudo(usuario: Usuario): Optional<Usuario> {
        val existenteOpt = usuarioRepository.findById(usuario.idUsuario)
        if (existenteOpt.isEmpty) return Optional.empty()
        val existente = existenteOpt.get()

        existente.nome = usuario.nome

        if (usuario.email != existente.email) {
            if (usuarioRepository.existsByEmail(usuario.email)) {
                throw IllegalArgumentException("Email já em uso")
            }
            existente.email = usuario.email
        }

        existente.senha = usuario.senha
        existente.tipoConta = usuario.tipoConta
        existente.mousecoinSaldo = usuario.mousecoinSaldo
        usuarioRepository.save(existente)
        return Optional.of(existente)
    }

    fun validaUsuarioLogin(email: String, senha: String): Optional<TipoConta> {
        val usuario = usuarioRepository.findByEmail(email)
        if (usuario.isPresent && usuario.get().senha == senha) {
            // ideal: comparar hashes (BCrypt)
            return Optional.of(usuario.get().tipoConta)
        }
        return Optional.empty()
    }

    fun redefinirUsuarioSenha(email: String, novaSenha: String): Boolean {
        val usuarioOpt = usuarioRepository.findByEmail(email)
        if (usuarioOpt.isPresent) {
            val usuario = usuarioOpt.get()
            // TODO: hash novaSenha
            usuario.senha = novaSenha
            usuarioRepository.save(usuario)
            return true
        }
        return false
    }

    fun changeNomeEmailSenhaById(id: Long, usuarioDTO: UsuarioDTO): HttpStatus {
        val usuarioOpt = usuarioRepository.findById(id)
        if (usuarioOpt.isEmpty) return HttpStatus.NOT_FOUND
        val usuario = usuarioOpt.get()

        if (usuario.email != usuarioDTO.email) {
            if (usuarioRepository.existsByEmail(usuarioDTO.email)) return HttpStatus.BAD_REQUEST
        }

        usuario.nome = usuarioDTO.nome
        usuario.email = usuarioDTO.email
        usuario.senha = usuarioDTO.senha
        usuarioRepository.save(usuario)
        return HttpStatus.OK
    }

    fun compraDeMouseCoin(id: Long, quantidade: Int): Boolean {
        val usuarioOpt = usuarioRepository.findById(id)
        if (usuarioOpt.isEmpty) return false
        val usuario = usuarioOpt.get()
        usuario.mousecoinSaldo = usuario.mousecoinSaldo + quantidade
        usuarioRepository.save(usuario)
        return true
    }

    fun gastoDeMouseCoin(id: Long, quantidade: Int): Boolean {
        val usuarioOpt = usuarioRepository.findById(id)
        if (usuarioOpt.isEmpty) return false
        val usuario = usuarioOpt.get()
        if (usuario.mousecoinSaldo < quantidade) return false
        usuario.mousecoinSaldo = usuario.mousecoinSaldo - quantidade
        usuarioRepository.save(usuario)
        return true
    }

    fun aumentaUmaVitoriaById(id: Long): Boolean {
        val usuarioOpt = usuarioRepository.findById(id)
        if (usuarioOpt.isEmpty) return false
        val usuario = usuarioOpt.get()
        usuario.vitorias = usuario.vitorias + 1
        usuarioRepository.save(usuario)
        return true
    }
}
