package com.unipar.rinhaRatos.controllers

import com.unipar.rinhaRatos.DTOandBASIC.*
import com.unipar.rinhaRatos.frontConnection.ConnectionFront
import com.unipar.rinhaRatos.mapper.toDto
import com.unipar.rinhaRatos.models.Usuario
import com.unipar.rinhaRatos.service.UsuarioService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.Instant

// @CrossOrigin(origins = [ConnectionFront.URL_ATUAL])
@RestController
@RequestMapping("/usuario")
class UsuarioController(
    private val usuarioService: UsuarioService,
) {

    @GetMapping("/todos")
    fun findAllUsuarios(): ResponseEntity<List<UsuarioDTO>> {
        val usuarios = usuarioService.getAllUsuario()
        val usuariosMapped = usuarios.map { it.toDto() }
        return ResponseEntity.ok(usuariosMapped)
    }

    @GetMapping("/{id}")
    fun findUsuarioById(@PathVariable id: Long): ResponseEntity<Any> {
        val usuarioOpt = usuarioService.getById(id)
        return if (usuarioOpt.isPresent) {
            ResponseEntity.ok(usuarioOpt.get().toDto())
        } else ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ErrorResponse(
                timestamp = Instant.now().toString(),
                status = HttpStatus.NOT_FOUND.value(),
                error = "Not Found",
                message = "Usuário não encontrado",
                code = "USER_NOT_FOUND"
            )
        )
    }

    @GetMapping("/top10Vitorias")
    fun findTop10Vitorias(): ResponseEntity<List<UsuarioDTO>> {
        val top = usuarioService.getTop10Vitorias()
        val topMapped = top.map { it.toDto() }
        return ResponseEntity.ok(topMapped)
    }

    @PostMapping("/cadastro")
    fun cadastrarUsuario(@RequestBody usuario: Usuario): ResponseEntity<Any> {
        return try {
            val saved = usuarioService.cadastrarUsuario(usuario)
            ResponseEntity(saved.toDto(), HttpStatus.CREATED)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.CONFLICT).body(
                ErrorResponse(
                    timestamp = Instant.now().toString(),
                    status = HttpStatus.CONFLICT.value(),
                    error = "Conflict",
                    message = e.message,
                    code = "EMAIL_EXISTS"
                )
            )
        }
    }

    @PostMapping("/login")
    fun login(@RequestBody loginRequest: UsuarioBasic): ResponseEntity<Any> {
        val tipoContaOpt = usuarioService.validaUsuarioLogin(loginRequest.email, loginRequest.senha)
        return if (tipoContaOpt.isPresent) {
            ResponseEntity.ok(
                mapOf(
                    "message" to "Login realizado com sucesso",
                    "tipo_conta" to tipoContaOpt.get()
                )
            )
        } else {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ErrorResponse(
                    timestamp = Instant.now().toString(),
                    status = HttpStatus.UNAUTHORIZED.value(),
                    error = HttpStatus.UNAUTHORIZED.reasonPhrase,
                    message = "Email ou senha inválidos",
                    code = "LOGIN_FAILED"
                )
            )
        }
    }

    @PostMapping("/changeUser/password")
    fun changePassWord(@RequestBody loginRequest: UsuarioBasic): ResponseEntity<Any> {
        val senhaTrocada = usuarioService.redefinirUsuarioSenha(loginRequest.email, loginRequest.senha)
        return if (senhaTrocada) ResponseEntity.ok(mapOf("message" to "Senha trocada com sucesso"))
        else ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ErrorResponse(
                timestamp = Instant.now().toString(),
                status = HttpStatus.NOT_FOUND.value(),
                error = HttpStatus.NOT_FOUND.reasonPhrase,
                message = "Email inválido",
                code = "EMAIL_NOT_FOUND"
            )
        )
    }

    @PostMapping("/{id}/compra")
    fun compraDeMouseCoin(@PathVariable id: Long, @RequestBody body: Map<String, Int>): ResponseEntity<Any> {
        val qtd = body["quantidade"] ?: return ResponseEntity.badRequest().body(mapOf("message" to "Campo 'quantidade' obrigatório"))
        val ok = usuarioService.compraDeMouseCoin(id, qtd)
        return if (ok) ResponseEntity.ok(mapOf("message" to "Compra realizada com sucesso"))
        else ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ErrorResponse(
                timestamp = Instant.now().toString(),
                status = HttpStatus.NOT_FOUND.value(),
                error = "Not Found",
                message = "Usuário não encontrado",
                code = "USER_NOT_FOUND"
            )
        )
    }

    @PostMapping("/{id}/gasto")
    fun gastoDeMouseCoin(@PathVariable id: Long, @RequestBody body: Map<String, Int>): ResponseEntity<Any> {
        val qtd = body["quantidade"] ?: return ResponseEntity.badRequest().body(mapOf("message" to "Campo 'quantidade' obrigatório"))
        val ok = usuarioService.gastoDeMouseCoin(id, qtd)
        return if (ok) ResponseEntity.ok(mapOf("message" to "Pagamento realizado com sucesso"))
        else ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            ErrorResponse(
                timestamp = Instant.now().toString(),
                status = HttpStatus.BAD_REQUEST.value(),
                error = "Bad Request",
                message = "Saldo insuficiente ou usuário não encontrado",
                code = "INSUFFICIENT_BALANCE_OR_USER_NOT_FOUND"
            )
        )
    }

    @PostMapping("/{id}/vitoria")
    fun aumentaUmaVitoriaById(@PathVariable id: Long): ResponseEntity<Any> {
        val ok = usuarioService.aumentaUmaVitoriaById(id)
        return if (ok) ResponseEntity.ok(mapOf("message" to "Vitória incrementada"))
        else ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ErrorResponse(
                timestamp = Instant.now().toString(),
                status = HttpStatus.NOT_FOUND.value(),
                error = "Not Found",
                message = "Usuário não encontrado",
                code = "USER_NOT_FOUND"
            )
        )
    }

    @PutMapping("/{id}/changeUser/basic")
    fun changeNomeEmailSenhaById(
        @PathVariable id: Long,
        @RequestBody usuarioDTO: UsuarioBasic
    ): ResponseEntity<Any> {
        val status = usuarioService.changeNomeEmailSenhaById(id, usuarioDTO)

        return when (status) {
            HttpStatus.OK -> ResponseEntity.ok(mapOf("message" to "Dados atualizados com sucesso"))

            HttpStatus.NOT_FOUND -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ErrorResponse(
                    timestamp = Instant.now().toString(),
                    status = HttpStatus.NOT_FOUND.value(),
                    error = "Not Found",
                    message = "Usuário não encontrado",
                    code = "USER_NOT_FOUND"
                )
            )

            HttpStatus.BAD_REQUEST -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ErrorResponse(
                    timestamp = Instant.now().toString(),
                    status = HttpStatus.BAD_REQUEST.value(),
                    error = "Bad Request",
                    message = "Email já em uso ou dados inválidos",
                    code = "EMAIL_IN_USE_OR_INVALID"
                )
            )

            else -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ErrorResponse(
                    timestamp = Instant.now().toString(),
                    status = HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    error = "Internal Server Error",
                    message = "Erro ao atualizar usuário",
                    code = "UPDATE_FAILED"
                )
            )
        }
    }

    @DeleteMapping("/{id}")
    fun deletarPessoaPorId(@PathVariable id: Long): ResponseEntity<Any> {
        val pessoaDeletada = usuarioService.deletarPessoaPorId(id)
        return if (pessoaDeletada) ResponseEntity.noContent().build()
        else ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ErrorResponse(
                timestamp = Instant.now().toString(),
                status = HttpStatus.NOT_FOUND.value(),
                error = "Not Found",
                message = "Usuário não encontrado",
                code = "USER_NOT_FOUND",
            )
        )
    }
}