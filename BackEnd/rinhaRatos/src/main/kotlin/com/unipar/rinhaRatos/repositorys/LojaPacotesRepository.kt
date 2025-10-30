package com.unipar.rinhaRatos.repositorys

import com.unipar.rinhaRatos.models.LojaPacotes
import org.springframework.data.jpa.repository.JpaRepository

interface LojaPacotesRepository: JpaRepository<LojaPacotes, Long> {
}