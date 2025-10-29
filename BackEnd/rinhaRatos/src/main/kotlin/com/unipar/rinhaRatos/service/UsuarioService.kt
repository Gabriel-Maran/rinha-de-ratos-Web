package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.DTOs.UsuarioEmailSenha
import com.unipar.rinhaRatos.enums.TipoConta
import com.unipar.rinhaRatos.models.Rato
import com.unipar.rinhaRatos.models.Usuario
import com.unipar.rinhaRatos.repositorys.UsuarioRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
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
        val existenteOpt = usuarioRepository.findById(usuario.id_usuario)
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
        existente.tipo_conta = usuario.tipo_conta
        existente.mousecoin_saldo = usuario.mousecoin_saldo
        usuarioRepository.save(existente)
        return Optional.of(existente)
    }

    fun validaUsuarioLogin(email: String, senha: String): Optional<TipoConta> {
        val usuario = usuarioRepository.findByEmail(email)
        if (usuario.isPresent && usuario.get().senha == senha) {
            return Optional.of(usuario.get().tipo_conta)
        }
        return Optional.empty()
    }


    fun redefinirUsuarioSenha(email: String, novaSenha: String): Boolean {
        val usuarioOpt = usuarioRepository.findByEmail(email)
        if (usuarioOpt.isPresent) {
            val usuario = usuarioOpt.get()
            usuario.senha = novaSenha
            usuarioRepository.save(usuario)
            return true
        }
        return false
    }

    //Função será usada pelo RatosController, na hora de registrar um novo rato
    fun addNewRatoByUserId(id: Long, rato: Rato): Boolean {
        val usuarioOpt = usuarioRepository.findById(id)
        if (usuarioOpt.isEmpty) return false
        val usuario = usuarioOpt.get()
        if (usuario.ratos.size >= 3) return false
        usuario.ratos.add(rato)
        usuarioRepository.save(usuario)
        return true
    }

    fun removeRatoByUserId(idUsuario: Long, rato: Rato): Boolean {
        val usuarioOpt = getById(idUsuario)
        if(usuarioOpt.isEmpty || TODO()) return false
        if(!(usuarioOpt.get().ratos.contains(rato))) return false
        usuarioOpt.get().ratos.remove(rato)
        usuarioRepository.save<Usuario>(usuarioOpt.get())
        return true
    }

    fun changeNomeEmailSenhaById(id: Long, usuarioDTO: UsuarioEmailSenha): Boolean {
        val usuarioOpt = usuarioRepository.findById(id)
        if (usuarioOpt.isEmpty) return false
        val usuario = usuarioOpt.get()
        if(usuarioOpt.get().email != usuarioDTO.email){
            if (usuarioRepository.existsByEmail(usuarioDTO.email)) return false
        }
        usuario.nome = usuarioDTO.nome;
        usuario.email = usuarioDTO.email;
        usuario.senha = usuarioDTO.senha;
        usuarioRepository.save(usuario)
        return true
    }

    fun compraDeMouseCoin(id: Long, quantidade: Int): Boolean {
        val usuarioOpt = usuarioRepository.findById(id)
        if (usuarioOpt.isEmpty) return false
        val usuario = usuarioOpt.get()
        usuario.mousecoin_saldo = usuario.mousecoin_saldo + quantidade
        usuarioRepository.save(usuario)
        return true
    }

    fun gastoDeMouseCoin(id: Long, quantidade: Int): Boolean {
        val usuarioOpt = usuarioRepository.findById(id)
        if (usuarioOpt.isEmpty) return false
        val usuario = usuarioOpt.get()
        if (usuario.mousecoin_saldo < quantidade) return false
        usuario.mousecoin_saldo = usuario.mousecoin_saldo - quantidade
        usuarioRepository.save(usuario)
        return true
    }

    fun aumentaUmaVitoriaById(id: Long): Boolean{
        val usuarioOpt = usuarioRepository.findById(id)
        if (usuarioOpt.isEmpty) return false
        val usuario = usuarioOpt.get()
        usuario.vitorias = usuario.vitorias + 1
        usuarioRepository.save(usuario)
        return true
    }

}
