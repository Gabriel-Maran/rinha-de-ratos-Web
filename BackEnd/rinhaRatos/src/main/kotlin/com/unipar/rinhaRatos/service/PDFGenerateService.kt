package com.unipar.rinhaRatos.service

import com.unipar.rinhaRatos.enums.StatusBatalha
import com.unipar.rinhaRatos.repositorys.BatalhaRepository
import com.unipar.rinhaRatos.repositorys.MessageRoundRepository
import com.unipar.rinhaRatos.repositorys.UsuarioRepository
import org.springframework.stereotype.Service
import java.io.ByteArrayOutputStream
import org.apache.pdfbox.pdmodel.PDDocument
import org.apache.pdfbox.pdmodel.PDPage
import org.apache.pdfbox.pdmodel.PDPageContentStream
import org.apache.pdfbox.pdmodel.font.PDType1Font
import org.apache.pdfbox.pdmodel.font.Standard14Fonts
import org.slf4j.LoggerFactory

// Service do Gerador de PDF
// Comentado apenas em partes essenciais, as outras se auto descrevem

@Service
class PDFGenerateService(
    private val usuarioRepository: UsuarioRepository,
    private val batalhaRepository: BatalhaRepository,
    private val batalhaService: BatalhaService,
    private val messageRoundRepository: MessageRoundRepository,
) {
    private val log = LoggerFactory.getLogger(javaClass)
    val font = PDType1Font(Standard14Fonts.FontName.HELVETICA)
    val fontBold = PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD)
    val fontObliqueBold = PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD_OBLIQUE)

    //------------------------------------------------
    // Faz o documento de todas as batalhas do usuário
    //------------------------------------------------
    fun getUserHistorico(idUsuario: Long): ByteArray {
        val userOpt = usuarioRepository.findById(idUsuario)
        if (userOpt.isEmpty) throw NoSuchElementException("Usuário não encontrado")
        val batalhasUser = batalhaService.pegarTodasAsBatalhasDoUsuario(idUsuario)
        val user = userOpt.get()
        val pdfByte = ByteArrayOutputStream()
        var vitorias = 0
        var derrotas = 0
        var saldoBatalhasSomadas = 0

        //------------------------------------------------
        // Inicia docx
        //------------------------------------------------
        PDDocument().use { docx ->
            var page = PDPage()
            docx.addPage(page)
            val pageWidth = page.mediaBox.width // Salva a largura da tela
            val textSameLine: Array<String> = arrayOf("", "", "") // Auxiliar para centralizar textos, criei pq é mais pratico as vezes
            var y = 750f // Contral a altura que está sendo realizado a mudança
            var cs = PDPageContentStream(docx, page) // Permite adicionar coisas a pagina
            var r: Float = 0F // Controla o red da cor (RGB)
            var g: Float = 0F // Controla o green da cor (RGB)
            var b: Float = 0F // Controla o blue da cor (RGB)
            val marginTop: Float = 56f // Margin top padrão da página
            val marginBottom: Float = 76f // Margin bottom padrão da página

            // Tudo aqui é baseado em plano cartesiano simples, x e y

            //------------------------------------------------
            // Função que cria uma nova pagina
            //------------------------------------------------
            fun newPage() {
                cs.close()
                page = PDPage()
                docx.addPage(page)
                cs = PDPageContentStream(docx, page)
                y = 750f - marginTop
            }

            //------------------------------------------------
            // Função que verifica verticalmente o espaço
            // Verifica se é necessario criar uma pagina nova
            //------------------------------------------------
            fun ensureSpace() {
                if (y - marginBottom < 10) {
                    newPage()
                }
            }

            try {
                // Título ---------------------------------------------
                y -= marginTop
                textSameLine[0] = "Relatório de batalhas - "
                textSameLine[1] = user.nome

                cs.beginText()
                cs.setFont(font, 25f)
                cs.newLineAtOffset(textAllignCenter(textSameLine[0] + textSameLine[1], 25f, pageWidth), y)
                cs.showText(textSameLine[0])
                cs.endText()

                cs.beginText()
                cs.setFont(fontBold, 25f)
                cs.newLineAtOffset(
                    textAllignCenter(textSameLine[0] + textSameLine[1], 25f, pageWidth)
                            + (font.getStringWidth(textSameLine[0]) / 1000 * 25f), y
                )
                cs.showText(textSameLine[1])
                cs.endText()

                textSameLine[0] = ""
                textSameLine[1] = ""
                // ----------------------------------------------------
                y -= 80

                if (batalhasUser.isNotEmpty()) {
                    // Registra resultados de cada batalha com o for each
                    batalhasUser.forEach { battle ->
                        ensureSpace()
                        if (battle.vencedor != null) {
                            if (battle.premioTotal > 0) {

                                val ganhou = battle.vencedor!!.idUsuario == user.idUsuario
                                if (ganhou) {
                                    vitorias += 1
                                    saldoBatalhasSomadas += battle.premioTotal
                                } else {
                                    derrotas += 1
                                    saldoBatalhasSomadas -= battle.custoInscricao
                                }
                                r = (if (ganhou) 0 else 255).toFloat()
                                g = (if (ganhou) 180 else 0).toFloat()
                                b = 0F
                                textSameLine[0] =
                                    if (ganhou) "Ganhou a batalha: "
                                    else "Perdeu a batalha: "
                                textSameLine[1] =
                                    if (ganhou) "${battle.nomeBatalha} (id = ${battle.idBatalha})"
                                    else "${battle.nomeBatalha} (id = ${battle.idBatalha})"

                                cs.beginText()
                                cs.setNonStrokingColor(r / 255f, g / 255f, b / 255f)
                                cs.setFont(font, 15f)
                                cs.newLineAtOffset(50f, y)
                                cs.showText(textSameLine[0])
                                cs.endText()

                                r = 0F
                                g = 0F
                                b = 0F
                                cs.beginText()
                                cs.setNonStrokingColor(r / 255f, g / 255f, b / 255f)
                                cs.setFont(font, 15f)
                                cs.newLineAtOffset(50f + (font.getStringWidth(textSameLine[0]) / 1000 * 15f), y)
                                cs.showText(textSameLine[1])
                                cs.endText()

                                y -= 16f
                            }
                        }
                    }
                    // --------------------------------------------------

                    //Responsavel por salvar no documento se o resultado final de todas as batalhas
                    // Se participou de alguma salva
                    //  - Total de vitorioas (em verde)
                    //  - Total de derrotas (em vermelho)
                    //  - Total de batalhas
                    //  - Total ganho(verde) ou perdido(vermelho) de mousecoins
                    if(vitorias + derrotas == 0){
                        textSameLine[0] = "${user.nome} não participou de nenhuma batalha ainda"
                        cs.beginText()
                        cs.setFont(fontBold, 16f)
                        cs.newLineAtOffset(textAllignCenter(textSameLine[0], 16f, pageWidth), y)
                        cs.showText(textSameLine[0])
                        cs.endText()
                        y -= 36f
                    }else{
                        y -= 20f
                        ensureSpace()
                        textSameLine[0] = "Total de vitórias:   "
                        cs.beginText()
                        cs.setNonStrokingColor(0 / 255f, 180 / 255f, 0 / 255f)
                        cs.setFont(font, 17f)
                        cs.newLineAtOffset(400F, y)
                        cs.showText(textSameLine[0])
                        cs.endText()

                        cs.beginText()
                        cs.setNonStrokingColor(0 / 255f, 0 / 255f, 0 / 255f)
                        cs.setFont(font, 17f)
                        cs.newLineAtOffset(402F + (font.getStringWidth(textSameLine[0]) / 1000 * 17f), y)
                        cs.showText(vitorias.toString())
                        cs.endText()
                        y -= 20f

                        ensureSpace()
                        textSameLine[0] = "Total de derrotas: "
                        cs.beginText()
                        cs.setNonStrokingColor(255 / 255f, 0 / 255f, 0 / 255f)
                        cs.setFont(font, 17f)
                        cs.newLineAtOffset(400F, y)
                        cs.showText(textSameLine[0])
                        cs.endText()

                        cs.beginText()
                        cs.setNonStrokingColor(0 / 255f, 0 / 255f, 0 / 255f)
                        cs.setFont(font, 17f)
                        cs.newLineAtOffset(402F + (font.getStringWidth(textSameLine[0]) / 1000 * 17f), y)
                        cs.showText(derrotas.toString())
                        cs.endText()
                        y -= 20f

                        ensureSpace()
                        textSameLine[0] = "Total de batalhas: "
                        textSameLine[1] = "${vitorias + derrotas} "
                        cs.beginText()
                        cs.setNonStrokingColor(0 / 255f, 0 / 255f, 0 / 255f)
                        cs.setFont(font, 17f)
                        cs.newLineAtOffset(400F, y)
                        cs.showText(textSameLine[0])
                        cs.endText()

                        cs.beginText()
                        cs.setNonStrokingColor(0 / 255f, 0 / 255f, 0 / 255f)
                        cs.setFont(font, 17f)
                        cs.newLineAtOffset(400F + (font.getStringWidth(textSameLine[0]) / 1000 * 17f), y)
                        cs.showText(textSameLine[1])
                        cs.endText()
                        y -= 20f

                        var tempTextTotalSaldo = ""

                        if (saldoBatalhasSomadas >= 0) {
                            tempTextTotalSaldo = "Saldo ganho: "
                            r = 0f
                            g = 180f
                            b = 0f
                        } else {
                            tempTextTotalSaldo = "Saldo perdido: "
                            r = 255f
                            g = 0f
                            b = 0f
                            saldoBatalhasSomadas *= -1
                        }

                        ensureSpace()
                        textSameLine[0] = tempTextTotalSaldo
                        textSameLine[1] = saldoBatalhasSomadas.toString()
                        cs.beginText()
                        cs.setNonStrokingColor(r / 255f, g / 255f, b / 255f)
                        cs.setFont(font, 17f)
                        cs.newLineAtOffset(400F, y)
                        cs.showText(textSameLine[0])
                        cs.endText()

                        cs.beginText()
                        cs.setNonStrokingColor(0 / 255f, 0 / 255f, 0 / 255f)
                        cs.setFont(font, 17f)
                        cs.newLineAtOffset(426F + (font.getStringWidth(textSameLine[0]) / 1000 * 17f), y)
                        cs.showText(textSameLine[1])
                        cs.endText()

                    }
                }
            } finally {
                // Termina o update do documento
                cs.close()
            }
            // Salva o documento final
            docx.save(pdfByte)
        }
        // Retorna o pdf em um byte array para o controller
        return pdfByte.toByteArray()
    }


    //------------------------------------------------
    // Faz o documento por batalha  do usuário
    //------------------------------------------------
    fun getUserBatalhaHistorico(idUsuario: Long, idBatalha: Long): ByteArray {
        val userOpt = usuarioRepository.findById(idUsuario)
        val batalhaOpt = batalhaRepository.findById(idBatalha)

        if (userOpt.isEmpty) throw NoSuchElementException("USER_NOT_FOUND")
        if (batalhaOpt.isEmpty) throw NoSuchElementException("BATALHA_NOT_FOUND")
        if (batalhaOpt.get().status == StatusBatalha.InscricoesAbertas) throw NoSuchElementException("BATALHA_DONT_BE_INITIALIZED")
        if (
            batalhaOpt.get().jogador1!!.idUsuario != userOpt.get().idUsuario
            &&
            batalhaOpt.get().jogador2!!.idUsuario != userOpt.get().idUsuario
        ) throw NoSuchElementException("USER_ISNT_THIS_BATTLE")

        val pdfByte = ByteArrayOutputStream()
        var saldoBatalhasSomadas = 0

        //------------------------------------------------
        // Inicia o documento
        //------------------------------------------------
        PDDocument().use { docx ->
            var page = PDPage()
            docx.addPage(page)
            val pageWidth = page.mediaBox.width // Salva a largura da tela
            val textSameLine: Array<String> = arrayOf("", "", "") // Auxiliar para centralizar textos, criei pq é mais pratico as vezes
            var y = 750f // Contrala a altura que está sendo realizado a mudança
            var cs = PDPageContentStream(docx, page)  // Permite adicionar coisas a pagina
            var r: Float = 0F // Controla o red da cor (RGB)
            var g: Float = 0F // Controla o green da cor (RGB)
            var b: Float = 0F // Controla o blue da cor (RGB)
            val marginTop: Float = 56f // Margin top padrão da página
            val marginBottom: Float = 76f // Margin bottom padrão da página

            //------------------------------------------------
            // Função que cria uma nova pagina
            //------------------------------------------------
            fun newPage() {
                cs.close()
                page = PDPage()
                docx.addPage(page)
                cs = PDPageContentStream(docx, page)
                y = 750f - marginTop
            }

            //------------------------------------------------
            // Função que verifica verticalmente o espaço
            // Verifica se é necessario criar uma pagina nova
            //------------------------------------------------
            fun ensureSpace() {
                if (y - marginBottom < 10) {
                    newPage()
                }
            }

            //---------------------------------------------------------------
            // Busca os dados da batalha e os salva
            // Contem Historico Geral, ratos, mousecoins ganhadas ou perdidas
            //---------------------------------------------------------------
            try {
                //Dados da batalha
                val user = userOpt.get()
                val historico = messageRoundRepository.findByIdBatalha(idBatalha)

                if (batalhaOpt.isPresent) {
                    val battle = batalhaOpt.get()

                    //Título ---------------------------------------------
                    y -= marginTop
                    textSameLine[0] = "Relatório da batalha - "
                    textSameLine[1] = battle.nomeBatalha

                    cs.beginText()
                    cs.setFont(font, 25f)
                    cs.newLineAtOffset(textAllignCenter(textSameLine[0] + textSameLine[1], 25f, pageWidth), y)
                    cs.showText(textSameLine[0])
                    cs.endText()

                    cs.beginText()
                    cs.setFont(fontBold, 25f)
                    cs.newLineAtOffset(
                        textAllignCenter(textSameLine[0] + textSameLine[1], 25f, pageWidth)
                                + (font.getStringWidth(textSameLine[0]) / 1000 * 25f), y
                    )
                    cs.showText(textSameLine[1])
                    cs.endText()

                    textSameLine[0] = ""
                    textSameLine[1] = ""
                    // ----------------------------------------------------
                    y -= 45

                    //------------------------------------------------------
                    // Registra se o usuario ganhouu ou perdeu
                    // Registra os ratos
                    // Registra quanto o usuario ganhou ou perdeu na batalha
                    // Verifica se o espaço é o suficiente verticalmente
                    //------------------------------------------------------
                    ensureSpace()
                    if (battle.vencedor != null) {
                        val ganhou = battle.vencedor!!.idUsuario == user.idUsuario
                        r = (if (ganhou) 0 else 255).toFloat()
                        g = (if (ganhou) 180 else 0).toFloat()
                        b = 0F
                        textSameLine[0] =
                            if (ganhou) "${user.nome} ganhou a batalha"
                            else "${user.nome} perdeu a batalha"

                        cs.beginText()
                        cs.setNonStrokingColor(r / 255f, g / 255f, b / 255f)
                        cs.setFont(font, 21f)
                        cs.newLineAtOffset(textAllignCenter(textSameLine[0], 21f, pageWidth), y)
                        cs.showText(textSameLine[0])
                        cs.endText()

                        y -= 60f


                        ensureSpace()
                        textSameLine[0] = "Ratos: "
                        cs.beginText()
                        cs.setNonStrokingColor(0 / 255f, 0 / 255f, 0 / 255f)
                        cs.setFont(fontBold, 17f)
                        cs.newLineAtOffset(50F, y)
                        cs.showText(textSameLine[0])
                        cs.endText()

                        y -= 20f

                        ensureSpace()
                        textSameLine[0] = " - ${battle.rato1?.nomeCustomizado ?: "Sem nome"}"
                        cs.beginText()
                        cs.setNonStrokingColor(0 / 255f, 0 / 255f, 0 / 255f)
                        cs.setFont(font, 15f)
                        cs.newLineAtOffset(50F, y)
                        cs.showText(textSameLine[0])
                        cs.endText()

                        y -= 20f

                        ensureSpace()
                        textSameLine[0] = " - ${battle.rato2?.nomeCustomizado ?: "Sem nome"}"
                        cs.beginText()
                        cs.setNonStrokingColor(0 / 255f, 0 / 255f, 0 / 255f)
                        cs.setFont(font, 15f)
                        cs.newLineAtOffset(50F, y)
                        cs.showText(textSameLine[0])
                        cs.endText()

                        y -= 35f

                        saldoBatalhasSomadas = battle.premioTotal
                        var tempTextTotalSaldo = ""

                        if (saldoBatalhasSomadas >= 0) {
                            tempTextTotalSaldo = "Saldo ganho: "
                            r = 0f
                            g = 180f
                            b = 0f
                        } else {
                            tempTextTotalSaldo = "Saldo perdido: "
                            r = 255f
                            g = 0f
                            b = 0f
                            saldoBatalhasSomadas *= -1
                        }

                        ensureSpace()
                        textSameLine[0] = tempTextTotalSaldo
                        textSameLine[1] = saldoBatalhasSomadas.toString()
                        cs.beginText()
                        cs.setNonStrokingColor(r / 255f, g / 255f, b / 255f)
                        cs.setFont(font, 17f)
                        cs.newLineAtOffset(50F, y)
                        cs.showText(textSameLine[0])
                        cs.endText()

                        cs.beginText()
                        cs.setNonStrokingColor(0 / 255f, 0 / 255f, 0 / 255f)
                        cs.setFont(font, 17f)
                        cs.newLineAtOffset(50F + (font.getStringWidth(textSameLine[0]) / 1000 * 17f), y)
                        cs.showText(textSameLine[1])
                        cs.endText()



                        y -= 45f
                    }

                    //------------------------------
                    //Iniciando histórico da batalha
                    //------------------------------
                    r = 0F
                    g = 0F
                    b = 0F
                    textSameLine[0] = "Histórico de ${battle.nomeBatalha}: "
                    textSameLine[1] = ""
                    cs.beginText()
                    cs.setNonStrokingColor(r / 255f, g / 255f, b / 255f)
                    cs.setFont(fontBold, 18F)
                    cs.newLineAtOffset(50F, y)
                    cs.showText(textSameLine[0])
                    cs.endText()

                    if (historico.isEmpty()) {
                        ensureSpace()
                        textSameLine[0] = "Sem histórico da batalha"
                        cs.beginText()
                        cs.setNonStrokingColor(r / 255f, g / 255f, b / 255f)
                        cs.setFont(font, 14F)
                        cs.newLineAtOffset(textAllignCenter(textSameLine[0], 14f, pageWidth), y)
                        cs.showText(textSameLine[0])
                        cs.endText()

                        y -= 20f
                    } else {
                        textSameLine[0] = ""
                        textSameLine[1] = ""
                        var round = -1L
                        for (turno in historico) {
                            if (turno.round != round) {
                                y -= 40f
                                round = turno.round
                                textSameLine[0] = "Round $round"
                                ensureSpace()
                                cs.beginText()
                                cs.setNonStrokingColor(r / 255f, g / 255f, b / 255f)
                                cs.setFont(fontBold, 14F)
                                cs.newLineAtOffset(50F, y)
                                cs.showText(textSameLine[0])
                                cs.endText()
                            }
                            y -= 20f
                            ensureSpace()
                            textSameLine[0] = ""
                            textSameLine[1] = turno.descricao
                            cs.beginText()
                            cs.setNonStrokingColor(r / 255f, g / 255f, b / 255f)
                            if (turno.descricao.contains("HPs após round")) {
                                cs.setFont(fontObliqueBold, 12F)

                            } else {
                                cs.setFont(font, 12F)
                            }
                            cs.newLineAtOffset(50F, y)
                            cs.showText(textSameLine[1])
                            cs.endText()
                        }
                    }
                }
                y -= 20f
            } finally {
                // Termina o update do documento
                cs.close()
            }
            // Salva o documento
            docx.save(pdfByte)
        }
        // Retorna o pdf em um byte array para o controller
        return pdfByte.toByteArray()

    }

    // Função para centralizar texto em X
     fun textAllignCenter(text: String, fontSize: Float, pageWidth: Float): Float {
        return (pageWidth - font.getStringWidth(text) / 1000 * fontSize) / 2
    }
}