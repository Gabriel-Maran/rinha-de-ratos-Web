package com.unipar.rinhaRatos.DTOs

import com.unipar.rinhaRatos.models.Classe
import com.unipar.rinhaRatos.models.Habilidade
import com.unipar.rinhaRatos.models.Usuario

class RatoDTO (
    val nome_customizado: String,
    val descricao: String? = null,
    val idUsuario: Long,
    val nomeClasse: String,
    val nomeHabilidade: String,
    )