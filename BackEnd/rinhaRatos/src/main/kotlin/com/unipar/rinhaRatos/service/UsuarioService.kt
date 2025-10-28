package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.models.Usuario
import com.unipar.rinhaRatos.repositorys.UsuarioRepository
import org.springframework.stereotype.Service
import java.util.NoSuchElementException
import java.util.Optional

@Service
class UsuarioService(
    private var usuarioRepository: UsuarioRepository
) {
    fun getAllUsuario(): List<Usuario>{
        return usuarioRepository.findAll();
    }

    fun getById(id: Long): Optional<Usuario>{
        return usuarioRepository.findById(id)
    }

    fun cadastrarUsuario(usuario: Usuario): Usuario {
        return usuarioRepository.save(usuario)
    }

    fun deletarPessoaPorId(id: Long){
        usuarioRepository.deleteById(id)
    }

    fun atualizarTudo(id:Long, usuario:Usuario): Optional<Usuario>{
         if (getById(id).isEmpty) return Optional.empty()
        usuarioRepository.save(usuario)
        return Optional.of(usuario)
    }

}