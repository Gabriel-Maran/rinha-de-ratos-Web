package com.unipar.rinhaRatos.controllers

import com.unipar.rinhaRatos.DTOandBASIC.BatalhaBasic
import com.unipar.rinhaRatos.DTOandBASIC.BatalhaDTO
import com.unipar.rinhaRatos.DTOandBASIC.BatalhaSummary
import com.unipar.rinhaRatos.DTOandBASIC.ErrorResponse
import com.unipar.rinhaRatos.mapper.toDto
import com.unipar.rinhaRatos.repositorys.BatalhaRepository
import com.unipar.rinhaRatos.service.BatalhaService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.Instant

@CrossOrigin(origins = ["http://localhost:5173"])
@RestController
@RequestMapping("/batalha")
class BatalhaController(
    private val batalhaService: BatalhaService,
    private val batalhaRepository: BatalhaRepository,
) {

    @GetMapping("/adm/{idADM}")
    fun pegarBatalhasFeitasPelaADMPorId(@PathVariable idADM: Long): ResponseEntity<List<BatalhaDTO>> {
        val batalhas = batalhaService.pegarBatalhasFeitasPelaADMPorId(idADM)
        val dtoList = batalhas.map { it.toDto() }
        return ResponseEntity.ok(dtoList)
    }

    @GetMapping("/abertas")
    fun pegarTodasAsBatalhasAbertas(): ResponseEntity<List<BatalhaDTO>> {
        val batalhas = batalhaService.pegarTodasAsBatalhasAbertas()
        val dtoList = batalhas.map { it.toDto() }
        return ResponseEntity.ok(dtoList)
    }

    @GetMapping("/user/{idUsuario}")
    fun pegarTodasAsBatalhasDoUsuario(@PathVariable idUsuario: Long): ResponseEntity<List<BatalhaDTO>> {
        val batalhas = batalhaService.pegarTodasAsBatalhasDoUsuario(idUsuario)
        val dtoList = batalhas.map { it.toDto() }
        return ResponseEntity.ok(dtoList)
    }

    @GetMapping("/user/andamento/{idUsuario}")
    fun pegarTodasAsBatalhasDoUsuarioQueNaoAcabaram(@PathVariable idUsuario: Long): ResponseEntity<List<BatalhaDTO>> {
        val batalhas = batalhaService.pegarTodasAsBatalhasDoUsuarioQueNaoAcabaram(idUsuario)
        val dtoList = batalhas.map { it.toDto() }
        return ResponseEntity.ok(dtoList)
    }

    @GetMapping("/verificaplayer/{idBatalha}/{idUsuario}")
    fun usuarioEstaBatalha(
        @PathVariable idBatalha: Long,
        @PathVariable idUsuario: Long
    ): ResponseEntity<Any> {
        val result = batalhaService.usuarioEstaBatalha(idBatalha, idUsuario)
        return when (result) {
            "BATALHA_NOT_FOUND" -> buildError(HttpStatus.NOT_FOUND, "Batalha não encontrada", "BATALHA_NOT_FOUND")
            "USER_IS_IN_THIS_BATTLE" -> ResponseEntity.ok(mapOf("message" to "Usuário está nesta batalha", "status" to true))
            "USER_IS_NOT_IN_THIS_BATTLE" -> buildError(HttpStatus.FORBIDDEN, "Usuário não está nesta batalha", "USER_IS_NOT_IN_THIS_BATTLE")
            else -> buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Erro desconhecido", "UNKNOWN")
        }
    }

    @GetMapping("/{idBatalha}")
    fun pegaBatalha(@PathVariable("idBatalha") idBatalha: Long): ResponseEntity<Any> {
        val result = batalhaService.getById(idBatalha)
        if(result.isEmpty) return buildError(HttpStatus.NOT_FOUND, "Batalha não encontrada", "BATALHA_NOT_FOUND")
        return ResponseEntity.ok(result.get().toDto())
    }

    @GetMapping("/concluidas")
    fun pegaBatalhaAcabadas(): ResponseEntity<Any> {
        val result = batalhaService.pegarTodasAsBatalhasAcabadas()
        return ResponseEntity.ok(result.map{ it.toDto()})
    }

    @GetMapping("/user/disponiveispara/{idUsuario}")
    fun pegarBatalhasDisponiveisParaUsuario(@PathVariable("idUsuario") idUsuario: Long): ResponseEntity<Any> {
        val result = batalhaService.pegarTodasAsBatalhasAbertasQueOUserNParticipa(idUsuario)
        return ResponseEntity.ok(result.map{ it.toDto()})
    }

    @GetMapping("/user/concluidas/{idUsuario}")
    fun pegaBatalhaConcuildaIdUser(@PathVariable("idUsuario") idUsuario: Long): ResponseEntity<Any> {
        val result = batalhaService.pegarTodasBatalhasDoUsuarioConcluidas(idUsuario)
        return ResponseEntity.ok(result.map{ it.toDto()})
    }

    @GetMapping("/user/concluidas/sembot/{idUsuario}")
    fun pegaBatalhaConcuildaIdUserSemBot(@PathVariable("idUsuario") idUsuario: Long): ResponseEntity<Any> {
        val result = batalhaService.pegarTodasBatalhasDoUsuarioConcluidasSemBot(idUsuario)
        return ResponseEntity.ok(result.map{ it.toDto()})
    }

    @GetMapping("/batalhacheia/{idBatalha}")
    fun batalhaCheia(@PathVariable("idBatalha") idBatalha: Long): ResponseEntity<Any> {
        val result = batalhaService.batalhaCheia(idBatalha)
        return when (result) {
            "BATALHA_NOT_FOUND" -> buildError(HttpStatus.NOT_FOUND, "Batalha não encontrada", "BATALHA_NOT_FOUND")
            "BATALHA_CHEIA" -> ResponseEntity.status(HttpStatus.CONFLICT).body(mapOf("message" to "Batalha cheia", "status" to true))
            "BATALHA_NAO_CHEIA" -> ResponseEntity.ok(mapOf("message" to "Batalha com vagas", "status" to false))
            else -> buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Erro desconhecido", "UNKNOWN")
        }
    }

    @PostMapping("/cadastro")
    fun cadastrarBatalha(@RequestBody basic: BatalhaBasic): ResponseEntity<Any> {
        return try {
            val saved = batalhaService.criarBatalha(basic)
            ResponseEntity.status(HttpStatus.CREATED).body(saved.toDto())
        } catch (e: IllegalArgumentException) {
            // Service pode lançar IllegalArgumentException com mensagens específicas:
            val msg = e.message ?: "Requisição inválida"
            when {
                msg.contains("USER_NOT_FOUND") -> buildError(HttpStatus.NOT_FOUND, "Usuário (adm) não encontrado", "USER_NOT_FOUND")
                msg.contains("NAME_LIMIT_EXCEPTED") -> buildError(HttpStatus.BAD_REQUEST, "Ultrapassou o limite de caracteres para o nome da batalha", "NAME_LIMIT_EXCEPTED")
                msg.contains("COINS_LIMIT_EXCEPTED") -> buildError(HttpStatus.BAD_REQUEST, "Ultrapassou o limite de moedas para o cadastro da batalha", "COINS_LIMIT_EXCEPTED")
                msg.startsWith("BAD_DATE_FORMAT") -> {
                    // pode vir "BAD_DATE_FORMAT: detalhe..."
                    val detail = msg.removePrefix("BAD_DATE_FORMAT:").trim().ifEmpty { "Formato inválido para data/hora" }
                    buildError(HttpStatus.BAD_REQUEST, detail, "BAD_DATE_FORMAT")
                }
                else -> buildError(HttpStatus.BAD_REQUEST, msg, "BAD_REQUEST")
            }
        } catch (e: Exception) {
            buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Erro desconhecido", "UNKNOWN")
        }
    }


    @PutMapping("/atualizar/{idBatalha}")
    fun atualizarBatalha(
        @PathVariable idBatalha: Long,
        @RequestBody summary: BatalhaSummary
    ): ResponseEntity<Any> {
        val resp = batalhaService.atualizarInfomacoesBatalha(idBatalha, summary)
        return when (resp) {
            "BATALHA_NOT_FOUND" -> buildError(HttpStatus.NOT_FOUND, "Batalha não encontrada", "BATALHA_NOT_FOUND")
            "BATALHA_HAPPENING_OR_OVER" -> buildError(HttpStatus.FORBIDDEN, "Batalha já iniciada ou concluída", "BATALHA_HAPPENING_OR_OVER")
            "BAD_DATE_FORMAT" -> buildError(HttpStatus.BAD_REQUEST, "Formato inválido para data/hora. Use ISO-8601: yyyy-MM-dd'T'HH:mm:ss", "BAD_DATE_FORMAT")
            "USER_IS_NOT_ADM" -> buildError(HttpStatus.FORBIDDEN, "Usuário não é ADM", "USER_IS_NOT_ADM")
            "USER_NOT_FOUND" -> buildError(HttpStatus.NOT_FOUND, "Usuário não encontrado", "USER_NOT_FOUND")
            "OK" -> ResponseEntity.ok(mapOf("message" to "Batalha atualizada com sucesso"))
            else -> buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Erro desconhecido", "UNKNOWN")
        }
    }

    @PostMapping("/entrar")
    fun entrarNaBatalha(@RequestBody payload: Map<String, Long>): ResponseEntity<Any> {
        val idBatalha = payload["idBatalha"]
        val idUsuario = payload["idUsuario"]
        val idRato = payload["idRato"]
        if (idBatalha == null || idUsuario == null || idRato == null) {
            return buildError(HttpStatus.BAD_REQUEST, "Parâmetros faltando: idBatalha, idUsuario e idRato são obrigatórios", "BAD_REQUEST")
        }
        val resp = batalhaService.entrarNaBatalha(idBatalha, idUsuario, idRato)
        return when (resp) {
            "BATALHA_NOT_FOUND" -> buildError(HttpStatus.NOT_FOUND, "Batalha não encontrada", "BATALHA_NOT_FOUND")
            "CANNOT_PAY" -> buildError(HttpStatus.PAYMENT_REQUIRED, "Não possui saldo para entrar na batalha", "CANNOT_PAY")
            "USER_NOT_FOUND" -> buildError(HttpStatus.NOT_FOUND, "Usuário não encontrado", "USER_NOT_FOUND")
            "RATO_NOT_FOUND" -> buildError(HttpStatus.NOT_FOUND, "Rato não encontrado", "RATO_NOT_FOUND")
            "BATALHA_NOT_OPEN" -> buildError(HttpStatus.CONFLICT, "Inscrições fechadas", "BATALHA_NOT_OPEN")
            "RATO_NOT_ELIGIBLE" -> buildError(HttpStatus.UNPROCESSABLE_ENTITY, "Rato não elegível", "RATO_NOT_ELIGIBLE")
            "BAD_REQUEST" -> buildError(HttpStatus.BAD_REQUEST, "Requisição inválida", "BAD_REQUEST")
            "BATALHA_CHEIA" -> buildError(HttpStatus.CONFLICT, "Batalha cheia", "BATALHA_CHEIA")
            "OK" -> ResponseEntity.ok(mapOf("message" to "Rato inscrito na batalha"))
            else -> buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Erro desconhecido", "UNKNOWN")
        }
    }

    @PostMapping("/retirar/{idBatalha}/{idUsuario}")
    fun retirarUsuarioDaBatalha(
        @PathVariable idBatalha: Long,
        @PathVariable idUsuario: Long
    ): ResponseEntity<Any> {
        val resp = batalhaService.sairBatalha(idBatalha, idUsuario)
        return when (resp) {
            "BATALHA_NOT_FOUND" -> buildError(HttpStatus.NOT_FOUND, "Batalha não encontrada", "BATALHA_NOT_FOUND")
            "USER_NOT_IN_BATTLE" -> buildError(HttpStatus.FORBIDDEN, "Usuário não faz parte desta batalha", "USER_NOT_IN_BATTLE")
            "BATALHA_ALREADY_STARTED" -> buildError(HttpStatus.FORBIDDEN, "Batalha já iniciada", "BATALHA_ALREADY_STARTED")
            "OK" -> ResponseEntity.ok(mapOf("message" to "Usuário removido com sucesso", "status" to "excluido"))
            else -> buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Erro desconhecido", "UNKNOWN")
        }
    }

    @PostMapping("/iniciar/{idBatalha}")
    fun iniciarBatalha(@PathVariable idBatalha: Long): ResponseEntity<Any> {
        val resp = batalhaService.iniciarBatalhaAsync(idBatalha)
        return when (resp) {
            "NOT_ENOUGH_USERS" ->
                buildError(HttpStatus.BAD_REQUEST, "Sem usuários suficientes para iniciar a batalha", "NOT_ENOUGH_USERS")
            "BATALHA_NOT_FOUND" ->
                buildError(HttpStatus.NOT_FOUND, "Batalha não encontrada", "BATALHA_NOT_FOUND")
            "BATALHA_HAPPENING_OR_OVER" ->
                buildError(HttpStatus.FORBIDDEN, "Batalha já iniciada ou concluída", "BATALHA_HAPPENING_OR_OVER")
            "OK" ->
                ResponseEntity.ok(mapOf("message" to "Batalha iniciada com sucesso", "idBatalha" to idBatalha))
            else ->
                buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Erro desconhecido", "UNKNOWN")
        }
    }

    @PostMapping("/bot/{idUsuario}/{idRato}")
    fun batalhaSimuladoComBot(@PathVariable("idUsuario") idUsuario: Long, @PathVariable("idRato") idRato: Long ): ResponseEntity<Any>{
        val respCriacao =  batalhaService.criarBatalhaComBot(idUsuario,idRato)
        when (respCriacao["error"]) {
            "USER_OR_RATO_NOT_FOUND" ->
                return buildError(HttpStatus.NOT_FOUND, respCriacao["message"].toString(), "USER_OR_RATO_NOT_FOUND")
            "RATO_IS_DEAD" ->
                return buildError(HttpStatus.NOT_FOUND, respCriacao["message"].toString(), "RATO_IS_DEAD")
            "RATO_DONT_BELONG_THIS_PLAYER" ->
                return buildError(HttpStatus.BAD_REQUEST, respCriacao["message"].toString(), "RATO_DONT_BELONG_THIS_PLAYER")
        }

        val respInicio = batalhaService.iniciarBatalhaAsync(respCriacao["idBatalha"]!!.toLong())
        return when (respInicio) {
            "NOT_ENOUGH_USERS" ->
                buildError(HttpStatus.BAD_REQUEST, "Sem usuários suficientes para iniciar a batalha", "NOT_ENOUGH_USERS")
            "BATALHA_NOT_FOUND" ->
                buildError(HttpStatus.NOT_FOUND, "Batalha não encontrada", "BATALHA_NOT_FOUND")
            "BATALHA_HAPPENING_OR_OVER" ->
                buildError(HttpStatus.FORBIDDEN, "Batalha já iniciada ou concluída", "BATALHA_HAPPENING_OR_OVER")
            "OK" ->
                ResponseEntity.ok(mapOf("message" to "Batalha iniciada com sucesso", "idBatalha" to respCriacao["idBatalha"]!!.toLong()))
            else ->
                buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Erro desconhecido", "UNKNOWN")
        }
    }

    @DeleteMapping("/deletar/{idBatalha}")
    fun deletarBatalha(@PathVariable idBatalha: Long): ResponseEntity<Any> {
        val resp = batalhaService.excluirBatalhaPorId(idBatalha)
        return when (resp) {
            "BATALHA_NOT_FOUND" -> buildError(HttpStatus.NOT_FOUND, "Batalha não encontrada", "BATALHA_NOT_FOUND")
            "BATALHA_HAPPENING_OR_OVER" -> buildError(HttpStatus.FORBIDDEN, "Batalha está em andamento ou já concluída", "BATALHA_HAPPENING_OR_OVER")
            "OK" -> ResponseEntity.noContent().build()
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
