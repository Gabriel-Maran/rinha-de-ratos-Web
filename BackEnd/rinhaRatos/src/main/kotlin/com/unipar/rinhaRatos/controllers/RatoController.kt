package com.unipar.rinhaRatos.controllers

import com.unipar.rinhaRatos.DTOs.ErrorResponse
import com.unipar.rinhaRatos.DTOs.RatoDTO
import com.unipar.rinhaRatos.frontConnection.ConnectionFront
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
    private val ratoService: RatoService,
) {
    @GetMapping("/todos")
    fun findAllUsuarios(): ResponseEntity<List<Rato>> =
        ResponseEntity.ok(ratoService.getAllRatos())

    @GetMapping("/{id}")
    fun findUsuarioById(@PathVariable id: Long): ResponseEntity<Any> {
        val ratoOpt = ratoService.getRatoById(id)
        return if (ratoOpt.isPresent) ResponseEntity.ok(ratoOpt.get())
        else buildError(HttpStatus.NOT_FOUND, "Rato não encontrado", "RATO_NOT_FOUND")
    }

    @PostMapping("/cadastro")
    fun cadastrarRato(@RequestBody ratoDTO: RatoDTO): ResponseEntity<Any> {
        val result = ratoService.cadastrarRato(ratoDTO)
        val status = result["Status"]?.toString() ?: "UNKNOWN"

        if (status == "CREATED") {
            val ratoSalvo = result["Rato"]
            return ResponseEntity.status(HttpStatus.CREATED).body(ratoSalvo)
        }

        return mapStatusToResponse(status)
    }


    @PostMapping("/deletar/{id}")
    fun removeRato(@PathVariable("id") id: Long): ResponseEntity<Any> {
        val result = ratoService.removeRato(id)
        val status = result["Status"]?.toString() ?: "UNKNOWN"
        return when (status) {
            "NO_CONTENT" -> ResponseEntity.noContent().build()
            else -> mapStatusToResponse(status)
        }
    }

    @PostMapping("/sairBatalha")
    fun sairDoTorneio(@RequestBody payload: Map<String, Long>): ResponseEntity<Any> {
        val usuarioId = payload["usuarioId"]
        val batalhaId = payload["batalhaId"]
        if (usuarioId == null || batalhaId == null) {
            return buildError(HttpStatus.BAD_REQUEST, "Parametros ausentes: usuarioId e batalhaId são obrigatórios", "BAD_REQUEST")
        }
        val result = ratoService.sairDoTorneio(usuarioId, batalhaId)
        val status = result["Status"]?.toString() ?: "UNKNOWN"
        return when (status) {
            "NO_CONTENT" -> ResponseEntity.noContent().build()
            else -> mapStatusToResponse(status)
        }
    }

    @PostMapping("/entrarBatalha")
    fun entrarBatalha(@RequestBody payload: Map<String, Long>): ResponseEntity<Any> {
        val ratoId = payload["ratoId"]
        val batalhaId = payload["batalhaId"]
        if (ratoId == null || batalhaId == null) {
            return buildError(HttpStatus.BAD_REQUEST, "Parametros ausentes: ratoId e batalhaId são obrigatórios", "BAD_REQUEST")
        }

        val result = ratoService.cadastrarRatoNaBatalha(ratoId, batalhaId)
        val status = result["Status"]?.toString() ?: "UNKNOWN"
        return when (status) {
            "OK" -> ResponseEntity.ok(mapOf("message" to "Rato inscrito na batalha"))
            "BATALHA_FULL" -> buildError(HttpStatus.CONFLICT, "Batalha cheia ou inscrições fechadas", "BATALHA_FULL")
            "BATALHA_NOT_FOUND" -> buildError(HttpStatus.NOT_FOUND, "Batalha não encontrada", "BATALHA_NOT_FOUND")
            "RATO_NOT_FOUND" -> buildError(HttpStatus.NOT_FOUND, "Rato não encontrado", "RATO_NOT_FOUND")
            "RATO_NOT_ELIGIBLE" -> buildError(HttpStatus.UNPROCESSABLE_ENTITY, "Rato não elegível (morto ou já em torneio)", "RATO_NOT_ELIGIBLE")
            "BAD_REQUEST" -> buildError(HttpStatus.BAD_REQUEST, "Requisição inválida", "BAD_REQUEST")
            else -> buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Erro desconhecido", "UNKNOWN")
        }
    }

    @DeleteMapping("/deletarPermanentemente/{id}")
    fun deletarRatoPermanentemente(@PathVariable id: Long): ResponseEntity<Any> {
        val result = ratoService.deletarRatoPermanentemente(id)
        val status = result["Status"]?.toString() ?: "UNKNOWN"
        return when (status) {
            "NO_CONTENT" -> ResponseEntity.noContent().build()
            "RATO_NOT_FOUND" -> buildError(HttpStatus.NOT_FOUND, "Rato não encontrado", "RATO_NOT_FOUND")
            "USER_NOT_FOUND" -> buildError(HttpStatus.NOT_FOUND, "Usuário não encontrado", "USER_NOT_FOUND")
            "USER_DONT_HAS_THISRATO" -> buildError(HttpStatus.UNPROCESSABLE_ENTITY, "Rato não pertence a este usuário", "USER_DONT_HAS_THISRATO")
            else -> buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Erro desconhecido", "UNKNOWN")
        }
    }

    private fun mapStatusToResponse(status: String): ResponseEntity<Any> {
        return when (status) {
            "USER_NOT_FOUND" -> buildError(HttpStatus.NOT_FOUND, "Usuário não encontrado", "USER_NOT_FOUND")
            "RATO_NOT_FOUND" -> buildError(HttpStatus.NOT_FOUND, "Rato não encontrado", "RATO_NOT_FOUND")
            "USER_ALREADY_HAS_3_RATOS" -> buildError(HttpStatus.CONFLICT, "Usuário já possui 3 ratos", "USER_ALREADY_HAS_3_RATOS")
            "NON_EXISTENT_CLASS_OR_HABILIDADE" -> buildError(HttpStatus.BAD_REQUEST, "Classe ou habilidade inexistente", "NON_EXISTENT_CLASS_OR_HABILIDADE")
            "USER_DONT_HAS_THISRATO" -> buildError(HttpStatus.UNPROCESSABLE_ENTITY, "Rato não pertence a este usuário", "USER_DONT_HAS_THISRATO")
            "BATALHA_NOT_FOUND" -> buildError(HttpStatus.NOT_FOUND, "Batalha não encontrada", "BATALHA_NOT_FOUND")
            "BATALHA_FULL" -> buildError(HttpStatus.CONFLICT, "Batalha cheia ou inscrições fechadas", "BATALHA_FULL")
            "BATALHA_ALREADY_STARTED" -> buildError(HttpStatus.CONFLICT, "Batalha já iniciada", "BATALHA_ALREADY_STARTED")
            "RATO_NOT_ELIGIBLE" -> buildError(HttpStatus.UNPROCESSABLE_ENTITY, "Rato não elegível (morto ou já em torneio)", "RATO_NOT_ELIGIBLE")
            "BAD_REQUEST" -> buildError(HttpStatus.BAD_REQUEST, "Requisição inválida", "BAD_REQUEST")
            else -> buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Erro desconhecido", "UNKNOWN")
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
