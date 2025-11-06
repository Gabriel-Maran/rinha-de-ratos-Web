package com.unipar.rinhaRatos.controllers

import com.unipar.rinhaRatos.DTOandBASIC.ErrorResponse
import com.unipar.rinhaRatos.service.HistoryService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Instant

@CrossOrigin(origins = ["http://localhost:5173"])
@RestController
@RequestMapping("/history")
class HistoryController(
    private val historyService: HistoryService
) {
    @GetMapping("/{id}")
    fun getHistoryBattleById(@PathVariable("id")idBatalha: Long): ResponseEntity<Any>{
        val batalhaHistorico = historyService.getAllBattleHistoryByIdBatalha(idBatalha)
        if(batalhaHistorico.get(0) == "NO_HISTORY_TO_SHOW"){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ErrorResponse(
                    timestamp = Instant.now().toString(),
                    status = HttpStatus.NOT_FOUND.value(),
                    error = "Not Found",
                    message = "Histórico não encontrada",
                    code = "NO_HISTORY_TO_SHOW"
                )
            )
        }
        return ResponseEntity.ok(batalhaHistorico)
    }

}