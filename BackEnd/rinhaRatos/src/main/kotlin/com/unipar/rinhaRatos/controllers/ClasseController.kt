package com.unipar.rinhaRatos.controllers

import com.unipar.rinhaRatos.DTOandBASIC.ClasseDTO
import com.unipar.rinhaRatos.DTOandBASIC.ErrorResponse
import com.unipar.rinhaRatos.mapper.toDto
import com.unipar.rinhaRatos.models.Classe
import com.unipar.rinhaRatos.service.ClasseService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.Instant


//////////////////////////////////////////////////////////////////
// CONTROLLER GERAL DAS CLASSES
// As funções fazem LITERALMENTE oq está no nome delas KKKKKKKKKKK
//////////////////////////////////////////////////////////////////

@CrossOrigin(origins = ["http://localhost:5173"])
@RestController
@RequestMapping("/classe")
class ClasseController(
    private val classeService: ClasseService
) {
    @GetMapping("/todos")
    fun getAllClasse(): ResponseEntity<List<ClasseDTO>> {
        val classe = classeService.getAllClasse()
        return ResponseEntity.ok(classe)
    }

    @GetMapping("/{id}")
    fun getClasseById(@PathVariable("id") id: Long): ResponseEntity<Any> {
        val classeOpt = classeService.getClassePorId(id)
        if (classeOpt.isEmpty) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ErrorResponse(
                    timestamp = Instant.now().toString(),
                    status = HttpStatus.NOT_FOUND.value(),
                    error = "Not Found",
                    message = "Classe não encontrada",
                    code = "CLASSE_NOT_FOUND"
                )
            )
        }
        return ResponseEntity.ok(classeOpt.get())
    }

    @GetMapping("/searchByname/{nomeClasse}")
    fun getClassePorNome(@PathVariable("nomeClasse") nomeClasse: String): ResponseEntity<Any> {
        val classeOpt = classeService.getClassePorNome(nomeClasse)
        if (classeOpt.isEmpty) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ErrorResponse(
                    timestamp = Instant.now().toString(),
                    status = HttpStatus.NOT_FOUND.value(),
                    error = "Not Found",
                    message = "Classe não encontrada",
                    code = "CLASSE_NOT_FOUND"
                )
            )
        }
        return ResponseEntity.ok(classeOpt.get())
    }

    @GetMapping("/searchHabilidades/{idClasse}")
    fun getHabilidadesPorId(@PathVariable("idClasse") id: Long): ResponseEntity<Any> {
        val habilidadesOpt = classeService.getHabilidadePorIdClasse(id)
        if (habilidadesOpt.isEmpty) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ErrorResponse(
                    timestamp = Instant.now().toString(),
                    status = HttpStatus.NOT_FOUND.value(),
                    error = "Not Found",
                    message = "Habilidades não encontrada",
                    code = "HABILIDADE_NOT_FOUND"
                )
            )
        }
        return ResponseEntity.ok(habilidadesOpt.get().map{ it.toDto() })
    }
}
