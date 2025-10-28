package com.unipar.rinhaRatos.repositorys

import com.unipar.rinhaRatos.models.Rato
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface RatoRepository: JpaRepository<Rato, Long> {
}