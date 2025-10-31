package com.unipar.rinhaRatos.controllers

import com.unipar.rinhaRatos.DTOandBASIC.ErrorResponse
import com.unipar.rinhaRatos.DTOandBASIC.LojaPacotesDTO
import com.unipar.rinhaRatos.enums.PurchaseResult
import com.unipar.rinhaRatos.frontConnection.ConnectionFront
import com.unipar.rinhaRatos.service.LojaPacotesService
import com.unipar.rinhaRatos.service.RatoService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Instant

@CrossOrigin(origins = [ConnectionFront.URL_ATUAL])
@RestController
@RequestMapping("/lojapacotes")
class LojaPacotesController(
    private val lojaPacotesService: LojaPacotesService
){
    @GetMapping("/todos")
    fun pegaTodosPacotes(): ResponseEntity<List<LojaPacotesDTO>>{
        return ResponseEntity.ok(lojaPacotesService.pegaTodosPacotes())
    }


    @GetMapping("/{id}")
    fun pegaPacoteById(@PathVariable("id") id: Long): ResponseEntity<Any>{
        val pacoteOpt = lojaPacotesService.pegaPacoteById(id)
        if(pacoteOpt.isEmpty)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ErrorResponse(
                    timestamp = Instant.now().toString(),
                    status = HttpStatus.NOT_FOUND.value(),
                    error = "Not Found",
                    message = "Pacote não encontrado",
                    code = "PACOTE_NOT_FOUND"
                )
            )
        return ResponseEntity.ok(
            pacoteOpt.get()
        )
    }

    @PostMapping("/comprar/{idPacote}/{idUsuario}")
    fun comprarPacote(@PathVariable("idPacote") idPacote: Long, @PathVariable("idUsuario") idUsuario:Long ) : ResponseEntity<Any> {
        val resp = lojaPacotesService.comprarPacote(idPacote, idUsuario)
        return when (resp) {
            PurchaseResult.USER_NOT_FOUND -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ErrorResponse(
                    timestamp = Instant.now().toString(),
                    status = HttpStatus.NOT_FOUND.value(),
                    error = "Not Found",
                    message = "Usuário não encontrado",
                    code = "USER_NOT_FOUND"
                )
            )
            PurchaseResult.PACOTE_NOT_FOUND -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ErrorResponse(
                    timestamp = Instant.now().toString(),
                    status = HttpStatus.NOT_FOUND.value(),
                    error = "Not Found",
                    message = "Pacote não encontrado",
                    code = "PACOTE_NOT_FOUND"
                )
            )
            PurchaseResult.OK -> ResponseEntity.ok(mapOf("message" to "Compra realizada com sucesso"))
        }
    }
}

