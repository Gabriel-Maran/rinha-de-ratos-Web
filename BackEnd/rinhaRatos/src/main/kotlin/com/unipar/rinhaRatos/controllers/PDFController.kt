package com.unipar.rinhaRatos.controllers

import com.unipar.rinhaRatos.DTOandBASIC.ErrorResponse
import com.unipar.rinhaRatos.service.PDFGenerateService
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Instant

@CrossOrigin(origins = ["http://localhost:5173"])
@RestController
@RequestMapping("/pdf")
class PDFController(
    private val pdfService: PDFGenerateService
) {
    @GetMapping("/user/{idUsuario}")
    fun historicoDeBatalhasPorUserId(@PathVariable("idUsuario") idUsuario: Long): ResponseEntity<Any> {
        try {
            val pdfBytes = pdfService.getUserHistorico(idUsuario) // retorna ByteArray do PDF
            return ResponseEntity
                .ok()
                .header("Content-Disposition", "attachment; filename=\"relatorio.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes)
        }catch(e: NoSuchElementException){
            return buildError(HttpStatus.NOT_FOUND, "Usuário (adm) não encontrado", "USER_NOT_FOUND")
        }
    }

    @GetMapping("/user/{idUsuario}/{idBatalha}")
    fun historicoDaBatalhasPorUserId(
        @PathVariable("idUsuario") idUsuario: Long,
        @PathVariable("idBatalha") idBatalha: Long)
    : ResponseEntity<Any> {
        try {
            val pdfBytes = pdfService.getUserBatalhaHistorico(idUsuario, idBatalha) // retorna ByteArray do PDF
            return ResponseEntity
                .ok()
                .header("Content-Disposition", "attachment; filename=\"relatorio.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes)
        }catch(e: NoSuchElementException){
            val msg = e.message ?: "Requisição inválida"
            return when {
                msg.contains("USER_NOT_FOUND") -> buildError(HttpStatus.NOT_FOUND, "Usuário não encontrado", "USER_NOT_FOUND")
                msg.contains("BATALHA_NOT_FOUND") -> buildError(HttpStatus.NOT_FOUND, "Batalha não encontrada", "BATALHA_NOT_FOUND")
                else -> buildError(HttpStatus.BAD_REQUEST, msg, "BAD_REQUEST")
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