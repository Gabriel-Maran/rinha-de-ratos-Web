import { useState, useEffect } from "react";
import { buscarHistorico } from "../../Api/Api";
import RE from "../../assets/classeRatos/RatoEsgoto.png";

import "../../pages/perfil/TelaHistorico.css";

export default function TelaHistorico({
  onClose,
  mostrarHistorico,
  idBatalha,
}) {
  const [logs, setLogs] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idBatalha) return;

    const carregarDetalhes = async () => {
      setLoading(true);
      try {
        const resposta = await buscarHistorico(idBatalha);


        const dados = resposta.data;

        if (Array.isArray(dados) && dados.length >= 2) {
          setLogs(dados[0]); // O índice 0 são os logs
          setResultado(dados[1][0]); // O índice 1 é um array com o objeto de resultado
        }
      } catch (erro) {
        console.error("Erro ao carregar histórico:", erro);
      } finally {
        setLoading(false);
      }
    };

    carregarDetalhes();
  }, [idBatalha]);

  if (!mostrarHistorico) return null;

  return (
    <div className={mostrarHistorico ? "bgEscuroOn" : "bgEscuroOff"}>
      <div className="modalResultado">
        <button className="fecharMdResultado" onClick={onClose}>
          ✖
        </button>

        {loading ? (
          <h2 style={{ color: "white", marginTop: "2rem" }}>
            Carregando detalhes...
          </h2>
        ) : (
          <>
            <h1 className="tituloResultado">Resultado da Batalha:</h1>

            {resultado ? (
              <div className="brasaoResultado">
                <div className="secaoVitorioso">
                  <p className="statusJogadorVencedor">Vencedor 🏆</p>
                  <div>
                    <p className="resultNomeJogador">
                      {resultado.vencedorUserName}
                    </p>
                    <div className="infoRatoResultBatalha">
                      <img src={RE} alt="Rato Vencedor" />
                      <p>{resultado.vencedorRatoName}</p>
                      <small style={{ color: "lightgreen" }}>
                        HP Final: {resultado.vencedorRatoHP}
                      </small>
                    </div>
                  </div>
                </div>

                <div className="secaoDerrotado">
                  <p className="statusJogadorDerrotado">Derrotado 💀</p>
                  <div>
                    <p className="resultNomeJogador">
                      {resultado.perdedorUserName}
                    </p>
                    <div className="infoRatoResultBatalha">
                      <img src={RE} alt="Rato Perdedor" />
                      <p>{resultado.perdedorRatoName}</p>
                      <small style={{ color: "red" }}>
                        HP Final: {resultado.perdedorRatoHP}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ color: "white", textAlign: "center" }}>
                Batalha ainda não concluída ou sem resultados.
              </p>
            )}

            <div className="historicoBatalha">
              <h3>Histórico de Turnos</h3>
              <div className="bgConteinerHist">
                <div className="conteinerHistorico">
                  {logs.length > 0 ? (
                    logs.map((log) => {
                      const esquerda = log.player === 1;
                      return (
                        <div
                          className={esquerda ? "regHistEsq" : "regHistDir"}
                          key={log.idmessage}
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
