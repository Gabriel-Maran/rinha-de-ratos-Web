package com.unipar.rinhaRatos.controllers

import com.unipar.rinhaRatos.service.PDFGenerateService
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@CrossOrigin(origins = ["http://localhost:5173"])
@RestController
@RequestMapping("/pdf")
class PDFController(
    private val pdfService: PDFGenerateService
) {
    @GetMapping("/user/{idUsuario}")
    fun teste(@PathVariable("idUsuario") idUsuario: Long): ResponseEntity<ByteArray?> {

        val pdfBytes = pdfService.getUserHistorico(idUsuario) // retorna ByteArray do PDF
        return ResponseEntity
            .ok()
            .header("Content-Disposition", "attachment; filename=\"relatorio.pdf\"")
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdfBytes)
    }

}