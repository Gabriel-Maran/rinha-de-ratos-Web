package com.unipar.rinhaRatos.repositorys

import com.unipar.rinhaRatos.models.Batalha
import org.springframework.data.jpa.repository.JpaRepository

interface BatalhaRepository: JpaRepository<Batalha, Long> {
}