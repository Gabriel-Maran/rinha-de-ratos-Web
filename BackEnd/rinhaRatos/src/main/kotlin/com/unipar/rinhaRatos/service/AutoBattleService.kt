package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.repositorys.BatalhaRepository


class AutoBattleService(
    val idBatalha: Long,
    private val batalhaRepository: BatalhaRepository
) {
}