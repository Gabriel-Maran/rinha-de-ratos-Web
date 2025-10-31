package com.unipar.rinhaRatos.controllers

import com.unipar.rinhaRatos.DTOandBASIC.ErrorResponse
import com.unipar.rinhaRatos.DTOandBASIC.HabilidadeDTO
import com.unipar.rinhaRatos.frontConnection.ConnectionFront
import com.unipar.rinhaRatos.service.HabilidadeService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.Instant

@CrossOrigin(origins = [ConnectionFront.URL_ATUAL])
@RestController
@RequestMapping("/habilidade")
class HabilidadeController(
    private val habilidadeService: HabilidadeService
) {
    @GetMapping("/todos")
    fun getAllHabilidade(): ResponseEntity<List<HabilidadeDTO>> {
        val habilidade = habilidadeService.getAllHabilidade()
        return ResponseEntity.ok(habilidade)
    }

    @GetMapping("/{id}")
    fun getHabilidadeById(@PathVariable("id") id: Long): ResponseEntity<Any> {
        val habilidadeOpt = habilidadeService.getHabilidadePorId(id)
        if (habilidadeOpt.isEmpty) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ErrorResponse(
                    timestamp = Instant.now().toString(),
                    status = HttpStatus.NOT_FOUND.value(),
                    error = "Not Found",
                    message = "Habilidade não encontrada",
                    code = "HABILIDADE_NOT_FOUND"
                )
            )
        }
        return ResponseEntity.ok(habilidadeOpt.get())
    }

    @GetMapping("/searchByname/{nomeHabilidade}")
    fun getHabilidadePorNome(@PathVariable("nomeHabilidade") nomeHabilidade: String): ResponseEntity<Any> {
        val habilidadeOpt = habilidadeService.getHabilidadePorNome(nomeHabilidade)
        if (habilidadeOpt.isEmpty) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ErrorResponse(
                    timestamp = Instant.now().toString(),
                    status = HttpStatus.NOT_FOUND.value(),
                    error = "Not Found",
                    message = "Habilidade não encontrada",
                    code = "HABILIDADE_NOT_FOUND"
                )
            )
        }
        return ResponseEntity.ok(habilidadeOpt.get())
    }
}
