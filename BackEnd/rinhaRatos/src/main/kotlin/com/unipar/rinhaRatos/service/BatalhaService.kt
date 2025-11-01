package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.models.Batalha
import com.unipar.rinhaRatos.repositorys.BatalhaRepository
import org.springframework.stereotype.Service
import com.unipar.rinhaRatos.DTOandBASIC.BatalhaBasic

@Service
class BatalhaService(
    private var batalhaRepository: BatalhaRepository
) {
    fun pegarBatalhasFeitasPelaADMPorId(idAdm : Long): List<Batalha>{
        return batalhaRepository.findAllByAdmCriador(idAdm)
    }

    fun pegarTodasAsBatalhasDoUsuario(idUsuario:Long): List<Batalha>{
        return batalhaRepository.pegarTodasBatalhasDoUsuario(idUsuario)
    }

    fun criarBatalha( batalhaBasic: BatalhaBasic ): String{
        
    }
}