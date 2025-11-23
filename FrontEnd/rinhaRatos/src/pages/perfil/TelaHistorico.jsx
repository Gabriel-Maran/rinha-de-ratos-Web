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
  dadosBatalhaBot, // <--- NOVA PROP
}) {
  const [logs, setLogs] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // CASO 1: Batalha de Bot (Dados já vieram prontos)
    if (dadosBatalhaBot) {
      setLoading(true);
      const dados = dadosBatalhaBot;
      
      // Validação simples para evitar erros se o formato vier diferente
      if (dados) {
         // Se o back mandar direto logs e resultado:
         if (Array.isArray(dados) && dados.length >= 2) {
            setLogs(dados[0]);
            setResultado(dados[1][0]);
         } 
         // Se o back mandar um objeto estruturado (ajuste conforme seu console.log anterior)
         else if (dados.logs && dados.resultado) {
            setLogs(dados.logs);
            setResultado(dados.resultado);
         }
      }
      setLoading(false);
      return; 
    }

    // CASO 2: Batalha Normal (Busca no banco)
    if (!idBatalha) return;

    const carregarDetalhes = async () => {
      setLoading(true);
      try {
        const resposta = await buscarHistorico(idBatalha);
        const dados = resposta.data;

        if (Array.isArray(dados) && dados.length >= 2) {
          setLogs(dados[0]);
          setResultado(dados[1][0]);
        }
      } catch (erro) {
        console.error("Erro ao carregar histórico:", erro);
      } finally {
        setLoading(false);
      }
    };

    carregarDetalhes();
  }, [idBatalha, dadosBatalhaBot]);

  // --- LÓGICA DO TEXTO E BANNER ---
  let imagemBanner = null;
  let mensagemResultado = "";

  // Lógica defensiva para evitar erro se resultado for null
  if (resultado && usuarioLogado) {
    // Tenta comparar pelo ID ou pelo Nome, dependendo do que o Bot retorna
    const souVencedor = 
        resultado.vencedorUserName === usuarioLogado.nome || 
        resultado.vencedorId === usuarioLogado.id;
    
    if (souVencedor) {
        imagemBanner = ImgVitoria;
        mensagemResultado = "Você venceu!";
    } else {
        imagemBanner = ImgDerrota;
        mensagemResultado = "Você perdeu...";
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
          <h2 style={{ color: "white", marginTop: "15rem", textAlign: "center" }}>
            Carregando resultado...
          </h2>
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
                      // AQUI ESTAVA O ERRO: Removi o comentário de dentro da tag
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
                    <p style={{ textAlign: "center", padding: "1rem" }}>
                      Nenhum registro de combate.
                    </p>
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