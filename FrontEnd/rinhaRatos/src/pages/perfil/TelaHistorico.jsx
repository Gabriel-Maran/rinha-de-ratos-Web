import { useState, useEffect } from "react";
import { buscarHistorico, pegarUsuarioPorId } from "../../Api/Api";
import { useAuth } from "../../context/AuthContext";
import { getFotoUrlById } from "./ModalOpcFotosPerfil";
import ImgVitoria from "../../assets/icones/IconeVitoria.png";
import ImgDerrota from "../../assets/icones/IconeDerrota.png";
import "../../pages/perfil/TelaHistorico.css";

export default function TelaHistorico({
  onClose,
  mostrarHistorico,
  idBatalha,
  dadosBatalhaBot,
}) {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [idVencedor, setIdVencedor] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Começamos com 0. Se a API achar a foto, atualizamos.
  const [idFotoInimigo, setIdFotoInimigo] = useState(0);

  const idUsuarioLogado = user?.idUsuario || user?.id;

  useEffect(() => {
    if (!mostrarHistorico) return;

    const carregarDados = async () => {
      const idFinal = dadosBatalhaBot || idBatalha;
      if (!idFinal) return;

      setLoading(true);
      // Reseta a foto do inimigo para padrão ao abrir nova batalha
      setIdFotoInimigo(0); 

      try {
        const resposta = await buscarHistorico(idFinal);
        const dados = resposta.data;

        if (Array.isArray(dados) && dados.length >= 2) {
          setLogs(dados[0]); // Gaveta 1: Logs

          const infoResultado = dados[1]?.[0]; // Gaveta 2: Resultado

          if (infoResultado) {
            setIdVencedor(infoResultado.id_vencedor);

            let idDoOponente = null;

            if (infoResultado.id_vencedor === idUsuarioLogado) {
              idDoOponente = infoResultado.id_perdedor;
            } else if (infoResultado.id_perdedor === idUsuarioLogado) {
              idDoOponente = infoResultado.id_vencedor;
            } else {
              idDoOponente = infoResultado.id_vencedor;
            }
            if (idDoOponente && idDoOponente > 0) {
              try {
                const respInimigo = await pegarUsuarioPorId(idDoOponente);
                if (respInimigo.data && respInimigo.data.idFotoPerfil !== undefined) {
                   console.log("Foto do inimigo encontrada:", respInimigo.data.idFotoPerfil);
                   setIdFotoInimigo(respInimigo.data.idFotoPerfil);
                }
              } catch (errInimigo) {
                console.warn(`Não foi possível carregar foto do oponente ${idDoOponente}. Usando padrão.`, errInimigo);
              }
            }
          }
        }
      } catch (err) {
        console.error("Erro ao carregar histórico:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [idBatalha, dadosBatalhaBot, mostrarHistorico, idUsuarioLogado]);

  if (!mostrarHistorico) return null;

  const vitoria = idVencedor === idUsuarioLogado;
  const imagemBanner = vitoria ? ImgVitoria : ImgDerrota;
  const mensagemResultado = vitoria ? "Vitória!" : "Derrota!";

  return (
    <div className="bgEscuroOn">
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
              <img
                src={imagemBanner}
                alt="Resultado"
                className="img-banner-final"
              />
              <h2 className="texto-resultado-final">{mensagemResultado}</h2>
            </div>

            <div className="historicoBatalha">
              <h3>Histórico</h3>
              <div className="bgConteinerHist">
                <div className="conteinerHistorico">
                  {logs.length > 0 ? (
                    logs.map((log, index) => {
                      const isPlayer1 = log.player === 1;
                      const imgAvatar = isPlayer1
                        ? getFotoUrlById(user?.idFotoPerfil || 0)
                        : getFotoUrlById(idFotoInimigo);

                      return (
                        <div
                          className={isPlayer1 ? "regHistEsq" : "regHistDir"}
                          key={log.idmessage || index}
                        >
                          {isPlayer1 && (
                            <img
                              className="imgEsquerda"
                              src={imgAvatar}
                              alt="Eu"
                            />
                          )}

                          <p>
                            <strong>Round {log.round}:</strong> {log.descricao}
                          </p>

                          {!isPlayer1 && (
                            <img
                              className="imgDireita"
                              src={imgAvatar}
                              alt="Oponente"
                            />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="nenhumRegistro">
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