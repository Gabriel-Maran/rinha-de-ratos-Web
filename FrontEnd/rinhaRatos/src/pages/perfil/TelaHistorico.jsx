import { useState, useEffect } from "react";
import { buscarHistorico, pegarUsuarioPorId } from "../../Api/Api";
import { useAuth } from "../../context/AuthContext";
import { getFotoUrlById } from "./ModalOpcFotosPerfil";
import ImgVitoria from "../../assets/icones/IconeVitoria.png";
import ImgDerrota from "../../assets/icones/IconeDerrota.png";
import RatoEsgoto from "../../assets/classeRatos/RatoEsgoto.png";
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

  const calculoVidaRestante = (vidaTotal, danoRecebido) => {
    const vidaRestante = vidaTotal - danoRecebido;
    return Math.max((vidaRestante / vidaTotal) * 100, 0);
  }

  const pegarDanoTurno = (log) => {
    const mensagem = log.descricao
    if (!mensagem.includes("causou")) return 0;
    const dano = parseInt(log.split("causou ")[1].split(" ")[0])
    /* if (log.player === 1) {
      return const danoEpic = dano
    } */

    console.log(danoCausadoP1)
    return danoCausadoP1;
  }

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
                if (
                  respInimigo.data &&
                  respInimigo.data.idFotoPerfil !== undefined
                ) {
                  console.log(
                    "Foto do inimigo encontrada:",
                    respInimigo.data.idFotoPerfil
                  );
                  setIdFotoInimigo(respInimigo.data.idFotoPerfil);
                }
              } catch (errInimigo) {
                console.warn(
                  `Não foi possível carregar foto do oponente ${idDoOponente}. Usando padrão.`,
                  errInimigo
                );
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
  const mensagemResultado = vitoria ? "Você venceu!!!" : "Você perdeu...";
  const [abaModal, setAbaModal] = useState("1");
  const botoesNavModal = ["1", "2"];

  let conteudoAba;

  switch (abaModal) {
    case "1":
      conteudoAba = (
        <>
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
            </>
          )}
        </>
      );
      break;
    default:
      conteudoAba = (
        <>
          {loading ? (
            <h2 className="loadingResultado">Carregando resultado...</h2>
          ) : (
            <>
              <div className="historicoBatalha">
                <h3>Histórico</h3>
                <div className="bgConteinerHist">
                  <div className="conteinerHistorico">
                    {logs.length > 0 ? (
                      logs.map((log, index) => {
                        const imgRato = RatoEsgoto;
                        const vidaP1 = 200;
                        const vidaP2 = 300;
                        const danoRoundP1 = pegarDanoTurno(log);
                        const danoRoundP2 = 0;
                        const vidaP1Atual = calculoVidaRestante(vidaP1, danoRoundP2)
                        const vidaP2Atual = calculoVidaRestante(vidaP2, danoRoundP1)
                        const imgAvatar = log.player === 1
                          ? getFotoUrlById(user?.idFotoPerfil || 0)
                          : getFotoUrlById(idFotoInimigo);
                        return (
                          <>
                            <div
                              className={
                                log.player === 1
                                  ? "regHistEsq"
                                  : log.player === 2
                                    ? "regHistDir"
                                    : ""
                              }
                              key={log.idmessage || index}
                            >
                              {log.player === 1 && (
                                <img
                                  className="imgEsquerda"
                                  src={imgAvatar}
                                  alt="Eu"
                                />
                              )}
                              {log.player !== 0 && (
                                <p>
                                  <strong>Round {log.round}:</strong>{" "}
                                  {log.descricao}
                                </p>)}
                              {log.player === 2 && (
                                <img
                                  className="imgDireita"
                                  src={imgAvatar}
                                  alt="Oponente"
                                />
                              )}
                            </div>
                            {log.player === 0 && (
                              <div className="regFinalRound">
                                <h1>Round {log.round} - Vida dos ratos</h1>
                                <p>
                                  <strong>Round {log.round}:</strong>{" "}
                                  {log.descricao}
                                </p>
                                <div className="fotoEVidaRatos">
                                  <div className="ratoJ1">
                                    <div className="barraDeVida">
                                      <div
                                        className="qVidaRatoJ1"
                                        style={{
                                          transform: `translateX(${vidaP1Atual - 100
                                            }%)`,
                                        }}
                                      />
                                      <p>{vidaP1Atual}</p>
                                    </div>
                                    <img src={imgRato} />
                                  </div>
                                  <div className="ratoJ2">
                                    <div className="barraDeVida">
                                      <div
                                        className="qVidaRatoJ2"
                                        style={{
                                          transform: `translateX(${vidaP2Atual - 100
                                            }%)`,
                                        }}
                                      />
                                    </div>
                                    <img src={imgRato} />
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
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
        </>
      );
  }

  return (
    <div className="bgEscuroOn">
      <div className="modalResultado">
        <div className="abasModalResultado">
          {botoesNavModal.map((textoBtn) => (
            <button
              onClick={() => setAbaModal(textoBtn)}
              className={
                textoBtn == abaModal ? "btnNavModalAtivado" : "btnNavModal"
              }
              key={textoBtn}
            >
              {textoBtn}
            </button>
          ))}
          <button className="fecharMdResultado" onClick={onClose}>
            ✖
          </button>
        </div>
        {conteudoAba}
      </div>
    </div>
  );
}
