package com.unipar.rinhaRatos.repositorys

import com.unipar.rinhaRatos.models.LojaPacotes
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

// Repositorio da Loja de Pacotes

@Repository
interface LojaPacotesRepository: JpaRepository<LojaPacotes, Long>