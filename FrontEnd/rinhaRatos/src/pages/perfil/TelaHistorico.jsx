import { useState, useEffect } from "react";
import { buscarHistorico } from "../../Api/Api";
import RE from "../../assets/classeRatos/RatoEsgoto.png";
import ImgVitoria from "../../assets/icones/IconeVitoria.png";
import ImgDerrota from "../../assets/icones/IconeDerrota.png";
import "../../pages/perfil/TelaHistorico.css";

export default function TelaHistorico({
  onClose,
  mostrarHistorico,
  idBatalha,
  usuarioLogado,
  dadosBatalhaBot,
}) {
  const [logs, setLogs] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lógica Unificada de Carregamento
    const carregarDados = async (idParaBuscar) => {
      if (!idParaBuscar) return;
      setLoading(true);
      try {
        const resposta = await buscarHistorico(idParaBuscar);
        const dados = resposta.data;

        // O Backend retorna [ [logs...], [resultado...] ]
        if (Array.isArray(dados) && dados.length >= 2) {
          setLogs(dados[0]);
          // Pega o primeiro item do array de resultados
          setResultado(dados[1][0]);
        }
      } catch (err) {
        console.error("Erro ao carregar histórico:", err);
      } finally {
        setLoading(false);
      }
    };

    // Se for Bot (dadosBatalhaBot) tem prioridade, senão usa idBatalha
    const idFinal = dadosBatalhaBot || idBatalha;
    carregarDados(idFinal);

  }, [idBatalha, dadosBatalhaBot]);

  // --- LÓGICA DO TEXTO E BANNER (VERSÃO ROBUSTA) ---
  let imagemBanner = null;
  let mensagemResultado = "";

  if (resultado && usuarioLogado) {
    // 1. Normaliza o ID do Usuário Logado (Aceita .id ou .idUsuario e tenta localizar em localStorage como fallback)
    const storedUser = (() => {
      try {
        return JSON.parse(localStorage.getItem("user") || "{}");
      } catch {
        return {};
      }
    })();
    const meuId = Number(
      usuarioLogado?.id ??
      usuarioLogado?.idUsuario ??
      storedUser?.idUsuario ??
      storedUser?.id
    );

    // 2. Normaliza o ID do Vencedor (varias possibilidades)
    let idVencedor = resultado?.vencedorId ??
                     resultado?.vencedor?.idUsuario ??
                     resultado?.vencedor?.id ??
                     resultado?.vencedor ??
                     resultado?.vencedor_usuario_id; // caso snake_case do backend

    idVencedor = Number(idVencedor);

    // Comparação segura: se não for possível determinar, setamos indeterminado (null)
    const souVencedor =
      Number.isFinite(idVencedor) ? idVencedor === meuId : null;

    if (souVencedor === true) {
      imagemBanner = ImgVitoria;
      mensagemResultado = "Você venceu!";
    } else if (souVencedor === false) {
      imagemBanner = ImgDerrota;
      mensagemResultado = "Você perdeu...";
    } else {
      // Indeterminado: se vier de uma batalha contra bot e não há idVencedor,
      // tentamos inferir pelo resultado (ex.: resultado.jogadorVencedor, resultado.ratoVencedorId, etc.)
      // Aqui fazemos checagens adicionais seguras:
      const possiveisVencedores = [
        resultado?.jogadorVencedor,
        resultado?.jogadorVencedorId,
        resultado?.ratoVencedorId,
      ];
      const qualquerVencedor = possiveisVencedores.find((v) => v != null);
      if (qualquerVencedor != null) {
        const vNum = Number(qualquerVencedor);
        if (Number.isFinite(vNum) && vNum === meuId) {
          imagemBanner = ImgVitoria;
          mensagemResultado = "Você venceu!";
        } else {
          imagemBanner = ImgDerrota;
          mensagemResultado = "Você perdeu...";
        }
      } else {
        // fallback neutro
        imagemBanner = ImgDerrota;
        mensagemResultado = resultado?.mensagem || "Resultado indisponível.";
      }
    }
  }

  if (!mostrarHistorico) return null;

  return (
    <div className={mostrarHistorico ? "bgEscuroOn" : "bgEscuroOff"}>
      <div className="modalResultado">
        <button className="fecharMdResultado" onClick={onClose}>
          ✖
        </button>

        {loading ? (
          <h2 className="loadingResultado">Carregando resultado...</h2>
        ) : (
          <>
            <h1 className="tituloResultado">Resultado da Batalha:</h1>

            <div className="area-banner-central">
              {imagemBanner && (
                <img
                  src={imagemBanner}
                  alt="Resultado"
                  className="img-banner-final"
                />
              )}
              <h2 className="texto-resultado-final">{mensagemResultado}</h2>
            </div>

            <div className="historicoBatalha">
              <h3>Histórico</h3>
              <div className="bgConteinerHist">
                <div className="conteinerHistorico">
                  {logs && logs.length > 0 ? (
                    logs.map((log, index) => {
                      const esquerda = log.player === 1;
                      return (
                        <div
                          className={esquerda ? "regHistEsq" : "regHistDir"}
                          key={log.idmessage || index}
                        >
                          {esquerda && (
                            <img className="imgEsquerda" src={RE} alt="rato" />
                          )}
                          <p>
                            <strong>Round {log.round}:</strong> {log.descricao}
                          </p>
                          {!esquerda && (
                            <img className="imgDireita" src={RE} alt="rato" />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="nenhumRegistro">Nenhum registro de combate.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
