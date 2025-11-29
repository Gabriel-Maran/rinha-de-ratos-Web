import { useState, useEffect } from "react";
import {
  buscarHistorico,
  pegarUsuarioPorId,
  pegarJogadoresDaBatalha,
  pegarRatoPorID,
} from "../../Api/Api";
import { useAuth } from "../../context/AuthContext";
import { getFotoUrlById } from "./ModalOpcFotosPerfil";
import ImgVitoria from "../../assets/icones/IconeVitoria.png";
import ImgDerrota from "../../assets/icones/IconeDerrota.png";
import ImagensRato from "../../components/ImagensRato";
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

  const idUsuarioLogado = user?.idUsuario || user?.id;

  const [infoJogador1, setInfoJogador1] = useState(null);
  const [infoJogador2, setInfoJogador2] = useState(null);

  const [nomeRatoJ1, setNomeRatoJ1] = useState("");
  const [infoRatoJ1, setInfoRatoJ1] = useState(null);

  const [nomeRatoJ2, setNomeRatoJ2] = useState("");
  const [infoRatoJ2, setInfoRatoJ2] = useState(null);

  const [valorVidaPorRound, setValorVidaPorRound] = useState([]);

  useEffect(() => {
    /* Regex maroto pra pegar os valores das vidas */
    const regexRound = /(\d+)\s*\|\s*[\wÀ-ÖØ-öø-ÿ]+=(\d+)/;

    /* Serve pra filtrar pelos logs e pegar somente aqueles tem as vidas
       Ou seja, aqueles em que o id do player é 0 (narrador)
    */
    const finaisDeRound = logs.filter((r) => r.player === 0);

    let novasVidas = [];

    finaisDeRound.map((regTerminouRound) => {
      const index = regTerminouRound.round - 1;

      const msgAcabouRound = regTerminouRound.descricao.match(regexRound);

      if (msgAcabouRound) {
        const vRJ1 = Number(msgAcabouRound[1]);
        const vRJ2 = Number(msgAcabouRound[2]);

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

      try {
        const resposta = await buscarHistorico(idFinal);
        const dados = resposta.data;
        console.log(dados);

        if (Array.isArray(dados) && dados.length >= 2) {
          try {
            const respostaBatalha = await pegarJogadoresDaBatalha(idFinal);
            const dadosBatalha = respostaBatalha.data;
            const idJogador1 = dadosBatalha.jogador1.idUsuario;
            const idJogador2 = dadosBatalha.jogador2.idUsuario;
            setNomeRatoJ1(dadosBatalha.rato1.nomeCustomizado);
            setNomeRatoJ2(dadosBatalha.rato2.nomeCustomizado);
            const idRatoJ1 = dadosBatalha.rato1.idRato;
            const idRatoJ2 = dadosBatalha.rato2.idRato;
            try {
              const respostaJogador1 = await pegarUsuarioPorId(idJogador1);
              const dadosJogador1 = respostaJogador1.data;
              setInfoJogador1(dadosJogador1);

              const respostaJogador2 = await pegarUsuarioPorId(idJogador2);
              const dadosJogador2 = respostaJogador2.data;
              setInfoJogador2(dadosJogador2);
            } catch (err) {
              console.error(
                "Erro ao buscar dados dos usuários:",
                err.response?.data || err
              );
            }
            try {
              const ratoJ1 = await pegarRatoPorID(idRatoJ1);
              const dadosRatoJ1 = ratoJ1.data;
              setInfoRatoJ1(dadosRatoJ1);

              const ratoJ2 = await pegarRatoPorID(idRatoJ2);
              const dadosRatoJ2 = ratoJ2.data;
              setInfoRatoJ2(dadosRatoJ2);
            } catch (err) {
              console.error("Erro ao buscar ratos:", err.response?.data || err);
            }
          } catch (err) {
            console.error(
              "Erro ao pegar os jogadores da batalh:",
              err.response?.data || err
            );
          }

          setLogs(dados[0]); // Gaveta 1: Logs

          const infoResultado = dados[1]?.[0]; // Gaveta 2: Resultado

          if (infoResultado) {
            setIdVencedor(infoResultado.id_vencedor);
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
                        const imgAvatar =
                          log.player === 1
                            ? getFotoUrlById(infoJogador1.idFotoPerfil)
                            : log.player === 2
                            ? getFotoUrlById(infoJogador2.idFotoPerfil)
                            : getFotoUrlById(0);
                        return (
                          <>
                            {log.player !== 0 && (
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
                                  <p className="nomeJogador1">
                                    {infoJogador1.nome}
                                  </p>
                                )}
                                {log.player === 2 && (
                                  <p className="nomeJogador2">
                                    {infoJogador2.nome}
                                  </p>
                                )}
                                {log.player !== 0 && (
                                  <div className="fotoJogadorERegistro">
                                    {log.player === 1 && (
                                      <img
                                        className="imgEsquerda"
                                        src={imgAvatar}
                                        alt="Eu"
                                      />
                                    )}
                                    <p className="regRound">{log.descricao}</p>
                                    {log.player === 2 && (
                                      <img
                                        className="imgDireita"
                                        src={imgAvatar}
                                        alt="Oponente"
                                      />
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                            {log.player === 0 && (
                              <div className="regFinalRound">
                                <h1>Round {log.round} - Vida dos ratos</h1>
                                {(() => {
                                  const vidaAtual = valorVidaPorRound[
                                    log.round - 1
                                  ] || {
                                    vRJ1: infoRatoJ1.hpsBase,
                                    vRJ2: infoRatoJ2.hpsBase,
                                  };
                                  const maxJ1 =
                                    infoRatoJ1.hpsBase > 0
                                      ? infoRatoJ1.hpsBase
                                      : 0;
                                  const maxJ2 =
                                    infoRatoJ2.hpsBase > 0
                                      ? infoRatoJ2.hpsBase
                                      : 0;
                                  return (
                                    <div className="fotoEVidaRatos">
                                      <div className="ratoJ1">
                                        <p>
                                          {vidaAtual.vRJ1} /{" "}
                                          {infoRatoJ1.hpsBase}
                                        </p>
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
                                        <p>{nomeRatoJ1}</p>
                                        <img
                                          src={
                                            ImagensRato[
                                              infoRatoJ1.classe?.nomeClasse
                                            ]
                                          }
                                        />
                                      </div>
                                      <div className="ratoJ2">
                                        <p>
                                          {vidaAtual.vRJ2} /{" "}
                                          {infoRatoJ2.hpsBase}
                                        </p>
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
                                        <p>{nomeRatoJ2}</p>
                                        <img
                                          src={
                                            ImagensRato[
                                              infoRatoJ2.classe?.nomeClasse
                                            ]
                                          }
                                        />
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
