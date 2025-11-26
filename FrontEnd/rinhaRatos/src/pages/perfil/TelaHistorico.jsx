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

  const [vidaRatoJ1, setVidaRatoJ1] = useState(0);
  const [vidaRatoJ2, setVidaRatoJ2] = useState(0);
  const [valorVidaPorRound, setValorVidaPorRound] = useState([]);

  useEffect(() => {
    if (logs.length < 4) return;

    const regexDano = /causou\s+(\d+)\s+ao/i;

    const reg2 = logs[2].descricao;
    const matchReg2 = reg2.match(regexDano);
    const primeiroDanoFeitoAoP2 = Number(matchReg2?.[1] ?? 0);

    const reg3 = logs[3].descricao;
    const matchReg3 = reg3.match(regexDano);
    const primeiroDanoFeitoAoP1 = Number(matchReg3?.[1] ?? 0);

    const regexRound =
      /HPs após round:\s*([\wÀ-ÖØ-öø-ÿ]+)=(\d+)\s*\|\s*([\wÀ-ÖØ-öø-ÿ]+)=(\d+)/;

    const finaisDeRound = logs.filter((r) => r.player === 0);

    let novasVidas = [];

    finaisDeRound.map((regTerminouRound) => {
      const index = regTerminouRound.round - 1;

      const msgAcabouRound = regTerminouRound.descricao.match(regexRound);

      if (msgAcabouRound) {
        const vRJ1 = Number(msgAcabouRound[2]);
        const vRJ2 = Number(msgAcabouRound[4]);

        if (regTerminouRound.round === 1) {
          setVidaRatoJ1(vRJ1 + primeiroDanoFeitoAoP1);
          setVidaRatoJ2(vRJ2 + primeiroDanoFeitoAoP2);
        }
        novasVidas[index] = { vRJ1, vRJ2 };
      }
    });

    setValorVidaPorRound(novasVidas);
  }, [logs]);

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
                        const imgAvatar =
                          log.player === 1
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
                                </p>
                              )}
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
                                {(() => {
                                  const vidaAtual = valorVidaPorRound[
                                    log.round - 1
                                  ] || {
                                    vRJ1: vidaRatoJ1,
                                    vRJ2: vidaRatoJ2,
                                  };
                                  const maxJ1 = vidaRatoJ1 > 0 ? vidaRatoJ1 : 1;
                                  const maxJ2 = vidaRatoJ2 > 0 ? vidaRatoJ2 : 1;
                                  return (
                                    <div className="fotoEVidaRatos">
                                      <div className="ratoJ1">
                                        <div className="barraDeVida">
                                          <div
                                            className="qVidaRatoJ1"
                                            style={{
                                              transform: `translateX(${
                                                (vidaAtual.vRJ1 / maxJ1) * 100 -
                                                100
                                              }%)`,
                                            }}
                                          />
                                        </div>
                                        <img src={imgRato} />
                                      </div>
                                      <div className="ratoJ2">
                                        <div className="barraDeVida">
                                          <div
                                            className="qVidaRatoJ2"
                                            style={{
                                              transform: `translateX(${
                                                (vidaAtual.vRJ2 / maxJ2) * 100 -
                                                100
                                              }%)`,
                                            }}
                                          />
                                        </div>
                                        <img src={imgRato} />
                                      </div>
                                    </div>
                                  );
                                })()}
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
