package com.unipar.rinhaRatos.controllers

import com.unipar.rinhaRatos.DTOandBASIC.ErrorResponse
import com.unipar.rinhaRatos.DTOandBASIC.RatoBasic
import com.unipar.rinhaRatos.DTOandBASIC.RatoDTO
import com.unipar.rinhaRatos.frontConnection.ConnectionFront
import com.unipar.rinhaRatos.mapper.toDto
import com.unipar.rinhaRatos.models.Rato
import com.unipar.rinhaRatos.service.RatoService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.Instant

@CrossOrigin(origins = [ConnectionFront.URL_ATUAL])
@RestController
@RequestMapping("/rato")
class RatoController(
    private val ratoService: RatoService
) {

    @GetMapping("/todos")
    fun findAllRatos(): ResponseEntity<List<RatoDTO>> {
        val ratos = ratoService.getAllRatos()
        return ResponseEntity.ok(ratos)
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

        if (status == "CREATED") {
            val ratoObj = result["Rato"]
            if (ratoObj == null) {
                return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Rato criado mas objeto ausente", "UNKNOWN")
            }

            if (ratoObj is Rato) {
                val bodyDto = ratoObj.toDto()
                return ResponseEntity.status(HttpStatus.CREATED).body(bodyDto)
            }

            if (ratoObj is RatoDTO) {
                return ResponseEntity.status(HttpStatus.CREATED).body(ratoObj)
            }

            return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Objeto Rato com tipo inesperado", "UNKNOWN")
        }

        return mapStatusToResponse(status)
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

        when (status) {
            "NO_CONTENT" -> {
                return ResponseEntity.noContent().build()
            }
            "RATO_NOT_FOUND" -> {
                return buildError(HttpStatus.NOT_FOUND, "Rato não encontrado", "RATO_NOT_FOUND")
            }
            "USER_NOT_FOUND" -> {
                return buildError(HttpStatus.NOT_FOUND, "Usuário não encontrado", "USER_NOT_FOUND")
            }
            "USER_DONT_HAS_THISRATO" -> {
                return buildError(HttpStatus.UNPROCESSABLE_ENTITY, "Rato não pertence a este usuário", "USER_DONT_HAS_THISRATO")
            }
            else -> {
                return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Erro desconhecido", "UNKNOWN")
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
