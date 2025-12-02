import { useState, useEffect } from "react";
import {
  buscarHistorico,
  pegarUsuarioPorId,
  pegarJogadoresDaBatalha,
  pegarRatoPorID,
} from "../../../Api/Api";
import { useAuth } from "../../../context/AuthContext";
import { getFotoUrlById } from "../../../pages/perfil/ModalOpcFotosPerfil";
import ImgVitoria from "../../../assets/icones/IconeVitoria.png";
import ImgDerrota from "../../../assets/icones/IconeDerrota.png";
import ImgNeutra from "../../../assets/icones/IconeNeutro.png";
import ImagensRato from "../../ImagensRato";
import "./TelaHistorico.css";

// ---------------------------------------------------------
// COMPONENTE DE VISUALIZAÇÃO DE RELATÓRIOS PÓS-BATALHA
// ---------------------------------------------------------

// ARQUITETURA DE DADOS:
// Este componente atua como um agregador complexo de dados.
// Ele recebe apenas um ID (idBatalha) e precisa reconstruir toda a cena:
// 1. Busca o Histórico.
// 2. Busca os dados da Batalha (Quem jogou, quem venceu).
// 3. Busca os dados dos Usuários (Nomes, Fotos).
// 4. Busca os dados dos Ratos (Classes, Skins).
// Essa cadeia de requisições é gerenciada no useEffect principal.

// PROCESSAMENTO DE LOGS (REGEX E PARSING):
// O backend retorna os logs como strings textuais (ex: "Rato A causou 10 de dano").
// Para desenhar as Barras de Vida entre os rounds, o componente
// utiliza Regex para extrair os valores numéricos de vida
// de strings específicas do log e armazená-los no estado 'valorVidaPorRound'.

// RENDERIZAÇÃO E NAVEGAÇÃO INTERNA:
// O modal possui um sistema de abas interno ("1" para Resumo/Banner, "2" para Logs Detalhados).
// A renderização é condicional baseada no status de carregamento ('loading') e
// na presença dos dados.

export default function TelaHistorico({
  onClose,
  mostrarHistorico,
  idBatalha,
  dadosBatalhaBot,
}) {
  const { user } = useAuth();

  // ---------------------------------------------------------
  // GERENCIAMENTO DE ESTADO (STATES)
  // ---------------------------------------------------------

  // Estados de Controle e Dados Brutos:
  const [logs, setLogs] = useState([]);
  const [idVencedor, setIdVencedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participou, setParticipou] = useState(false);

  // Derivação de Identidade:
  // Garante que temos o ID correto, seja logado como 'JOGADOR' ou conta genérica.
  const idUsuarioLogado =
    user?.idUsuario && user?.tipoConta === "JOGADOR"
      ? user?.idUsuario
      : user?.id;

  // Estados de Exibição (Vencedor vs Derrotado):
  // Organiza os dados para o Banner de Resultado (Aba 1).
  const [infoJogadorVencedor, setInfoJogadorVencedor] = useState(null);
  const [infoJogadorDerrotado, setInfoJogadorDerrotado] = useState(null);
  const [fotoJVencedor, setFotoJVencedor] = useState(0);
  const [fotoJDerrotado, setFotoJDerrotado] = useState(0);
  const [infoRatoVencedor, setInfoRatoVencedor] = useState(null);
  const [infoRatoDerrotado, setInfoRatoDerrotado] = useState(null);

  // Estados de Dados dos Jogadores (Posicionais):
  // Organiza os dados para o Log de Batalha (Aba 2 - Esquerda vs Direita).
  const [infoJogador1, setInfoJogador1] = useState(null);
  const [fotoJ1, setFotoJ1] = useState(0);
  const [nomeRatoJ1, setNomeRatoJ1] = useState("");
  const [infoRatoJ1, setInfoRatoJ1] = useState(null);

  const [infoJogador2, setInfoJogador2] = useState(null);
  const [fotoJ2, setFotoJ2] = useState(0);
  const [nomeRatoJ2, setNomeRatoJ2] = useState("");
  const [infoRatoJ2, setInfoRatoJ2] = useState(null);

  // Estado Calculado (Vidas):
  const [valorVidaPorRound, setValorVidaPorRound] = useState([]);

  // Controle de Navegação do Modal:
  const [abaModal, setAbaModal] = useState("1");
  const botoesNavModal = ["1", "2"];

  // ---------------------------------------------------------
  // EFEITOS E LÓGICA ASSÍNCRONA
  // ---------------------------------------------------------

  // Effect 1: Processamento de Logs (Parser)
  // Observa mudanças nos 'logs' brutos e extrai a vida dos ratos ao final de cada round.
  useEffect(() => {
    /* Regex para capturar padrões como "Vida=100 | Vida=90" */
    const regexRound = /[^=|]+=\s*(\d+)\s*\|\s*[^=|]+=\s*(\d+)/;

    /* Filtra apenas as mensagens do sistema (player === 0) que indicam fim de turno */
    const finaisDeRound = logs.filter((r) => r.player === 0);

    let novasVidas = [];

    finaisDeRound.map((regTerminouRound) => {
      const index = regTerminouRound.round - 1;
      const msgAcabouRound = regTerminouRound.descricao.match(regexRound);

      if (msgAcabouRound) {
        // Captura grupos do Regex (Vida J1 e Vida J2)
        const vRJ1 = Number(msgAcabouRound[1]);
        const vRJ2 = Number(msgAcabouRound[2]);

        novasVidas[index] = { vRJ1, vRJ2 };
      }
    });

    setValorVidaPorRound(novasVidas);
  }, [logs]);

  // Effect 2: Organização Vencedor/Perdedor
  // Define quem aparece à esquerda (Vencedor) e direita (Perdedor) no Banner,
  // baseando-se no ID do vencedor retornado pela API.
  useEffect(() => {
    if (idVencedor && infoJogador1 && infoJogador2) {
      if (idVencedor === infoJogador1.idUsuario) {
        setInfoJogadorVencedor(infoJogador1);
        setInfoJogadorDerrotado(infoJogador2);
        setFotoJVencedor(getFotoUrlById(infoJogador1.idFotoPerfil));
        setFotoJDerrotado(getFotoUrlById(infoJogador2.idFotoPerfil));
      } else {
        setInfoJogadorVencedor(infoJogador2);
        setInfoJogadorDerrotado(infoJogador1);
        setFotoJVencedor(getFotoUrlById(infoJogador2.idFotoPerfil));
        setFotoJDerrotado(getFotoUrlById(infoJogador1.idFotoPerfil));
      }
    }
  }, [idVencedor, infoJogador1, infoJogador2]);

  // Effect 3: Data Fetching (Cascata)
  // Realiza a busca sequencial e paralela de todos os dados necessários.
  useEffect(() => {
    if (!mostrarHistorico) return;

    const carregarDados = async () => {
      const idFinal = dadosBatalhaBot || idBatalha;
      if (!idFinal) return;

      setLoading(true);

      try {
        const resposta = await buscarHistorico(idFinal);
        const dados = resposta.data;

        if (Array.isArray(dados) && dados.length >= 2) {
          try {
            const respostaBatalha = await pegarJogadoresDaBatalha(idFinal);
            const dadosBatalha = respostaBatalha.data;
            try {
              const idRatoVencedor = dadosBatalha?.idRatoVencedor;
              const idRatoDerrotado = dadosBatalha?.idRatoPerdedor;
              const respostaRatoVencedor = await pegarRatoPorID(idRatoVencedor);
              const respostaRatoDerrotado = await pegarRatoPorID(
                idRatoDerrotado
              );
              setInfoRatoVencedor(respostaRatoVencedor?.data);
              setInfoRatoDerrotado(respostaRatoDerrotado?.data);
            } catch (err) {
              console.error(
                "Erro ao buscar dados do rato vencedor/derrotado:",
                err
              );
            }

            // Passo 4: Configurar Jogadores (Player 1 e Player 2)
            const idJogador1 = dadosBatalha.jogador1.idUsuario;
            const idJogador2 = dadosBatalha.jogador2.idUsuario;
            setNomeRatoJ1(dadosBatalha.rato1.nomeCustomizado);
            setNomeRatoJ2(dadosBatalha.rato2.nomeCustomizado);

            const idRatoJ1 = dadosBatalha.rato1.idRato;
            const idRatoJ2 = dadosBatalha.rato2.idRato;

            // Passo 5 (Paralelo): Buscar perfil completo dos Usuários
            try {
              const respostaJogador1 = await pegarUsuarioPorId(idJogador1);
              const dadosJogador1 = respostaJogador1.data;
              setFotoJ1(getFotoUrlById(dadosJogador1.idFotoPerfil));
              setInfoJogador1(dadosJogador1);

              const respostaJogador2 = await pegarUsuarioPorId(idJogador2);
              const dadosJogador2 = respostaJogador2.data;
              setFotoJ2(getFotoUrlById(dadosJogador2.idFotoPerfil));
              setInfoJogador2(dadosJogador2);
            } catch (err) {
              console.error("Erro ao buscar dados dos usuários:", err);
            }

            // Passo 6 (Paralelo): Buscar detalhes dos Ratos (Skins/Classes) para os Logs
            try {
              !idUsuarioLogado ? setParticipou(false) : setParticipou(true);
              const ratoJ1 = await pegarRatoPorID(idRatoJ1);
              const dadosRatoJ1 = ratoJ1.data;
              setInfoRatoJ1(dadosRatoJ1);

              const ratoJ2 = await pegarRatoPorID(idRatoJ2);
              const dadosRatoJ2 = ratoJ2.data;
              setInfoRatoJ2(dadosRatoJ2);
            } catch (err) {
              console.error("Erro ao buscar ratos:", err);
            }
          } catch (err) {
            console.error("Erro ao pegar os jogadores da batalha:", err);
          }

          setLogs(dados[0]); // Gaveta 1: Logs textuais
          const infoResultado = dados[1]?.[0]; // Gaveta 2: Metadados do resultado

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

  // ---------------------------------------------------------
  // RENDERIZAÇÃO CONDICIONAL 
  // ---------------------------------------------------------

  if (!mostrarHistorico) return null;

  // Lógica de UI para o Banner (Vitória, Derrota ou Neutro)
  const vitoria = idVencedor === idUsuarioLogado;
  const imagemBanner = !idUsuarioLogado
    ? ImgNeutra
    : vitoria
    ? ImgVitoria
    : ImgDerrota;
  const mensagemResultado = vitoria ? "Você venceu!!!" : "Você perdeu...";

  let conteudoAba;

  // Switch de Abas (1: Resumo, Default/2: Logs)
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
                  className={
                    participou ? "img-banner-final" : "img-banner-final-neutro"
                  }
                />
                {!participou && (
                  <>
                    <div className="resultadoDaBatalhaNeutro">
                      <div className="secaoVitorioso">
                        <p className="statusJogadorVencedor">Sigmas 🗿:</p>
                        <div className="resultInfoJogador">
                          <img src={fotoJVencedor} />
                          <p>{infoJogadorVencedor?.nome ?? ""}</p>
                        </div>
                        <div className="infoRatoResultBatalha">
                          <img
                            src={
                              ImagensRato[infoRatoVencedor?.classe?.nomeClasse]
                            }
                          />
                          <p>{infoRatoVencedor?.nomeCustomizado}</p>
                        </div>
                      </div>
                      <div className="secaoDerrotado">
                        <p className="statusJogadorDerrotado">Betinhas 🤓:</p>
                        <div className="resultInfoJogador">
                          <img src={fotoJDerrotado} />
                          <p>{infoJogadorDerrotado?.nome ?? ""}</p>
                        </div>
                        <div className="infoRatoResultBatalha">
                          <img
                            src={
                              ImagensRato[infoRatoDerrotado?.classe?.nomeClasse]
                            }
                          />
                          <p>{infoRatoDerrotado?.nomeCustomizado}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {participou && (
                  <h2 className="texto-resultado-final">{mensagemResultado}</h2>
                )}
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
                            ? fotoJ1
                            : log.player === 2
                            ? fotoJ2
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
                                    {infoJogador1?.nome}
                                  </p>
                                )}
                                {log.player === 2 && (
                                  <p className="nomeJogador2">
                                    {infoJogador2?.nome}
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

  // ---------------------------------------------------------
  // RENDERIZAÇÃO FINAL (JSX)
  // ---------------------------------------------------------
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
