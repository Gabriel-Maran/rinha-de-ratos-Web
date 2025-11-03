package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.repositorys.BatalhaRepository


class AutoBattleService(
    val idBatalha: Long,
    private val batalhaRepository: BatalhaRepository
) {
    // private val batalha = batalhaRepository.findById(idBatalha)
    // private var jogador1 = null
    // private var jogador2 = null
    // private var rato1 = null
    // private var rato2 = null
    //
    // fun defineValues(): Boolean{
    //     if(batalha.isEmpty) return false
    //     val batalhaPresent = batalha.get()
    //     jogador1 = batalhaPresent.jogador1
    // }
    // Recebe ID da batalha
}