package com.unipar.rinhaRatos.controllers

import com.unipar.rinhaRatos.DTOandBASIC.ErrorResponse
import com.unipar.rinhaRatos.DTOandBASIC.RatoBasic
import com.unipar.rinhaRatos.DTOandBASIC.RatoDTO
import com.unipar.rinhaRatos.mapper.toDto
import com.unipar.rinhaRatos.repositorys.RatoRepository
import com.unipar.rinhaRatos.service.RatoService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.Instant

@CrossOrigin(origins = ["http://localhost:5173"])
@RestController
@RequestMapping("/rato")
class RatoController(
    private val ratoService: RatoService,
    private val ratoRepository: RatoRepository
) {

    @GetMapping("/todos")
    fun findAllRatos(): ResponseEntity<List<RatoDTO>> {
        val ratos = ratoService.getAllRatos()
        return ResponseEntity.ok(ratos)
    }

    @GetMapping("/rato/dousuario/{id}")
    fun findAllRatos(@PathVariable("id") id: Long): ResponseEntity<List<RatoDTO>> {
        val ratos = ratoRepository.pegaRatosDoUsuario(id)
        return ResponseEntity.ok(ratos.map { it -> it.toDto() })
    }

    @GetMapping("/{id}")
    fun findRatoById(@PathVariable id: Long): ResponseEntity<Any> {
        val ratoOpt = ratoService.getRatoById(id)
        if (ratoOpt.isEmpty) {
            return buildError(HttpStatus.NOT_FOUND, "Rato não encontrado", "RATO_NOT_FOUND")
        }

        val ratoEntity = ratoOpt.get()
        return ResponseEntity.ok(ratoEntity)
    }

    @GetMapping("/dousuario/{id}")
    fun findAllRatosByUserId(@PathVariable id: Long): ResponseEntity<Any> {
        val ratos = ratoService.getAllRatosByUserId(id)
        if(ratos.isEmpty) return buildError(HttpStatus.NOT_FOUND, "Usuário não encontrado", "USER_NOT_FOUND")
        return ResponseEntity.ok(ratos.get())
    }

    @PostMapping("/cadastro")
    fun cadastrarRato(@RequestBody ratoDTO: RatoBasic): ResponseEntity<Any> {
        val result: Map<String, Any> = ratoService.cadastrarRato(ratoDTO)
        val status = result["Status"]?.toString() ?: "UNKNOWN"

        when (status) {
            "CREATED" -> {
                val ratoCompleto = ratoService.getRatoById(result["idRato"].toString().toLong())
                return ResponseEntity(ratoCompleto, HttpStatus.CREATED)
            }
            "USER_NOT_FOUND" -> {
                return buildError(HttpStatus.NOT_FOUND, "Usuário não encontrado", "USER_NOT_FOUND")
            }
            "USER_ALREADY_HAS_3_RATOS" -> {
                return buildError(HttpStatus.CONFLICT, "Você já possui 3 ratos", "USER_ALREADY_HAS_3_RATOS")
            }
            "USER_HAS_NOT_ENOUGH_MONEY" -> {
                return buildError(HttpStatus.BAD_REQUEST, "Você não possui mousecoins suficiente", "USER_HAS_NOT_ENOUGH_MONEY")
            }
            "NON_EXISTENT_CLASS_OR_HABILIDADE" -> {
                return buildError(HttpStatus.BAD_REQUEST, "Classe ou habilidade não existente", "NON_EXISTENT_CLASS_OR_HABILIDADE")
            }
            "NAME_LIMIT_EXCEPTED" -> {
                return buildError(HttpStatus.BAD_REQUEST, "Limite maximo de caracteres para o nome", "NAME_LIMIT_EXCEPTED")
            }
            else -> {
                return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Erro desconhecido", "UNKNOWN")
            }
        }
    }

    @PostMapping("/deletar/{id}")
    fun removeRato(@PathVariable("id") id: Long): ResponseEntity<Any> {
        val result = ratoService.removeRato(id)
        val status = result["Status"]?.toString() ?: "UNKNOWN"

        when (status) {
            "NO_CONTENT" -> {
                return ResponseEntity.noContent().build()
            }
            else -> {
                return mapStatusToResponse(status)
            }
        }
    }

    @DeleteMapping("/deletarPermanentemente/{id}")
    fun deletarRatoPermanentemente(@PathVariable id: Long): ResponseEntity<Any> {
        val result = ratoService.deletarRatoPermanentemente(id)
        val status = result["Status"]?.toString() ?: "UNKNOWN"

        return when (status) {
            "NO_CONTENT" -> {
                ResponseEntity.noContent().build()
            }

            "RATO_NOT_FOUND" -> {
                buildError(HttpStatus.NOT_FOUND, "Rato não encontrado", "RATO_NOT_FOUND")
            }

            else -> {
                buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Erro desconhecido", "UNKNOWN")
            }
        }
    }

    private fun mapStatusToResponse(status: String): ResponseEntity<Any> {
        when (status) {
            "USER_NOT_FOUND" -> {
                return buildError(HttpStatus.NOT_FOUND, "Usuário não encontrado", "USER_NOT_FOUND")
            }
            "RATO_NOT_FOUND" -> {
                return buildError(HttpStatus.NOT_FOUND, "Rato não encontrado", "RATO_NOT_FOUND")
            }
            "NON_EXISTENT_CLASS_OR_HABILIDADE" -> {
                return buildError(HttpStatus.BAD_REQUEST, "Classe ou habilidade inexistente", "NON_EXISTENT_CLASS_OR_HABILIDADE")
            }
            "USER_DONT_HAS_THISRATO" -> {
                return buildError(HttpStatus.UNPROCESSABLE_ENTITY, "Rato não pertence a este usuário", "USER_DONT_HAS_THISRATO")
            }
            "BAD_REQUEST" -> {
                return buildError(HttpStatus.BAD_REQUEST, "Requisição inválida", "BAD_REQUEST")
            }
            "USER_HAS_NOT_ENOUGH_MONEY" -> {
                return buildError(HttpStatus.PAYMENT_REQUIRED, "Não possui mouseCoin suficiente para criação do rato", "PAYMENT_REQUIRED")
            }
            else -> {
                return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Erro desconhecido", "UNKNOWN")
            }
        }
    }

    private fun buildError(status: HttpStatus, message: String, code: String): ResponseEntity<Any> {
        val body = ErrorResponse(
            timestamp = Instant.now().toString(),
            status = status.value(),
            error = status.reasonPhrase,
            message = message,
            code = code
        )
        return ResponseEntity.status(status).body(body)
    }
}
