package com.unipar.rinhaRatos.controllers

import com.unipar.rinhaRatos.DTOandBASIC.BatalhaDTO
import com.unipar.rinhaRatos.frontConnection.ConnectionFront
import com.unipar.rinhaRatos.mapper.toDto
import com.unipar.rinhaRatos.models.Batalha
import com.unipar.rinhaRatos.service.BatalhaService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@CrossOrigin(origins = [ConnectionFront.URL_ATUAL])
@RestController
@RequestMapping("/batalha")
class BatalhaController(
    private val batalhaService: BatalhaService
) {
    @GetMapping("/adm/{idADM}")
    fun pegarBatalhasFeitasPelaADMPorId(@PathVariable("idADM") idADM: Long): ResponseEntity<List<BatalhaDTO>> {
        val batalhasADM = batalhaService.pegarBatalhasFeitasPelaADMPorId(idADM)
        val batalhasMapped = batalhasADM.map { it.toDto() }
        return ResponseEntity.ok(batalhasMapped)
    }

    @GetMapping("/user/{idUsuario}")
    fun pegarTodasAsBatalhasDoUsuario(@PathVariable("idUsuario") idUsuario: Long) : ResponseEntity<List<BatalhaDTO>>{
        val batalhasUser = batalhaService.pegarTodasAsBatalhasDoUsuario(idUsuario)
        val batalhasMapped = batalhasUser.map{ it.toDto() }
        return ResponseEntity.ok(batalhasMapped)
    }

    // GET batalhaCheia

    // GET usuarioEstaBatalhandoPeloRato

    @PostMapping("/cadastro")
    fun cadastrarBatalha(@RequestBody batalha: Batalha): ResponseEntity<Any>{
        return ResponseEntity.ok(batalhaService.criarBatalha(batalha))
    }

    // PUT atualizarInfomacoesBatalha

    // POST excluirUsuarioDaBatalhaPorId
    
    // DELETE excluirBatalhaPorId

}