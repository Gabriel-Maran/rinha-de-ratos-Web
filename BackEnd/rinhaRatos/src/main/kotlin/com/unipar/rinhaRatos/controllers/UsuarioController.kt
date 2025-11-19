package com.unipar.rinhaRatos.controllers

import com.unipar.rinhaRatos.DTOandBASIC.*
import com.unipar.rinhaRatos.enums.TipoConta
import com.unipar.rinhaRatos.mapper.toDto
import com.unipar.rinhaRatos.models.Usuario
import com.unipar.rinhaRatos.service.UsuarioService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.Instant

@CrossOrigin(origins = ["http://localhost:5173"])
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

    @GetMapping("/podeCriarMaisRatos/{id}")
    fun findPodeCriarMaisRatos(@PathVariable id: Long): ResponseEntity<Any> {
        val usuarioPode = usuarioService.getUserPodeCriarNewRato(id)
        if (usuarioPode == "SIM") {
            return ResponseEntity.ok(
                mapOf(
                    "message" to "Usuário pode criar mais ratos",
                    "status" to true
                )
            )
        }
        if (usuarioPode == "NAO") {

            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                mapOf(
                    "Error" to ErrorResponse(
                        timestamp = Instant.now().toString(),
                        status = HttpStatus.CONFLICT.value(),
                        error = "Conflict",
                        message = "Não pode criar mais ratos",
                        code = "USER_ALREADY_HAS_3_RATOS"
                    ),
                    "status" to true
                )

            )
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ErrorResponse(
                timestamp = Instant.now().toString(),
                status = HttpStatus.NOT_FOUND.value(),
                error = "Not Found",
                message = "Usuário não encontrado",
                code = "USER_NOT_FOUND"
            )
        )
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

    @PostMapping("/changeFoto/{idUsuario}/{idFoto}")
    fun changeFotoPerfil(@PathVariable("idUsuario") idUsuario:Long, @PathVariable("idFoto") idFoto:Long  ): ResponseEntity<Any> {
        val retornoChangeFoto = usuarioService.changeFotoPerfil(idUsuario = idUsuario, idFoto = idFoto)
        if(retornoChangeFoto == HttpStatus.BAD_REQUEST){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ErrorResponse(
                    timestamp = Instant.now().toString(),
                    status = HttpStatus.BAD_REQUEST.value(),
                    error = "Bad Request",
                    message = "Sem permissão para tal foto",
                    code = "FOTO_NOT_FOUND"
                )
            )
        }else if(retornoChangeFoto == HttpStatus.NOT_FOUND){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ErrorResponse(
                    timestamp = Instant.now().toString(),
                    status = HttpStatus.NOT_FOUND.value(),
                    error = "Not Found",
                    message = "Usuário não encontrado",
                    code = "USER_NOT_FOUND"
                )
            )
        }
        return ResponseEntity.ok().build()
    }

    @PostMapping("/cadastro")
    fun cadastrarUsuario(@RequestBody usuario: Usuario): ResponseEntity<Any> {
        val saved = usuarioService.cadastrarUsuario(usuario)
        if (saved["error"] == "EMAIL_ALREADY_EXISTS") {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                ErrorResponse(
                    timestamp = Instant.now().toString(),
                    status = HttpStatus.CONFLICT.value(),
                    error = "Conflict",
                    message = "Email já está registrado em outro usuário",
                    code = "EMAIL_EXISTS"
                )
            )
        } else if (saved["error"] == "PREENCHA_CAMPOS") {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ErrorResponse(
                    timestamp = Instant.now().toString(),
                    status = HttpStatus.BAD_REQUEST.value(),
                    error = "Bad Request",
                    message = "Preencha os campos necessários",
                    code = "PREENCHA_CAMPOS"
                )
            )
        }
        val usuario: Usuario = saved["user"] as Usuario
        return ResponseEntity(usuario.toDto(), HttpStatus.CREATED)

    }

    @PostMapping("/login")
    fun login(@RequestBody loginRequest: UsuarioBasic): ResponseEntity<Any> {
        val nome = loginRequest.nome.trim()
        val email = loginRequest.email.trim()
        val senha = loginRequest.senha.trim()
        if (email.isEmpty() || senha.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ErrorResponse(
                    timestamp = Instant.now().toString(),
                    status = HttpStatus.UNAUTHORIZED.value(),
                    error = HttpStatus.UNAUTHORIZED.reasonPhrase,
                    message = "Preencha os campos necessários",
                    code = "LOGIN_FAILED"
                )
            )
        val usuario = usuarioService.validaUsuarioLogin(loginRequest.email, loginRequest.senha)
        if (usuario.isPresent) {
            if(usuario.get().tipoConta == TipoConta.BOT){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ErrorResponse(
                        timestamp = Instant.now().toString(),
                        status = HttpStatus.UNAUTHORIZED.value(),
                        error = HttpStatus.UNAUTHORIZED.reasonPhrase,
                        message = "Não é possível acessar esta conta",
                        code = "LOGIN_FAILED"
                    )
                )
            }
            return ResponseEntity.ok(
                mapOf(
                    "message" to "Login realizado com sucesso",
                    "id" to usuario.get().idUsuario,
                    "tipo_conta" to usuario.get().tipoConta
                )
            )
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            ErrorResponse(
                timestamp = Instant.now().toString(),
                status = HttpStatus.UNAUTHORIZED.value(),
                error = HttpStatus.UNAUTHORIZED.reasonPhrase,
                message = "Email ou senha inválidos",
                code = "LOGIN_FAILED"
            )
        )

    }

    @PostMapping("/changeUser/password")
    fun changePassWord(@RequestBody loginRequest: UsuarioBasic): ResponseEntity<Any> {
        val senhaTrocada = usuarioService.redefinirUsuarioSenha(loginRequest.email, loginRequest.senha)
        if (senhaTrocada == "OK") {
            return ResponseEntity.ok(mapOf("message" to "Senha trocada com sucesso"))
        }
        if (senhaTrocada == "EMAIL_NOT_FOUND") {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ErrorResponse(
                    timestamp = Instant.now().toString(),
                    status = HttpStatus.NOT_FOUND.value(),
                    error = HttpStatus.NOT_FOUND.reasonPhrase,
                    message = "Email inválido",
                    code = "EMAIL_NOT_FOUND"
                )
            )
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            ErrorResponse(
                timestamp = Instant.now().toString(),
                status = HttpStatus.BAD_REQUEST.value(),
                error = HttpStatus.BAD_REQUEST.reasonPhrase,
                message = "Preencha os campos necessário",
                code = "PREENCHA_CAMPOS"
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

                HttpStatus.NOT_ACCEPTABLE -> ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(
                    ErrorResponse(
                        timestamp = Instant.now().toString(),
                        status = HttpStatus.NOT_ACCEPTABLE.value(),
                        error = "Not Acceptable",
                        message = "Preencha todos os campos",
                        code = "PREENCHA_CAMPOS"
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