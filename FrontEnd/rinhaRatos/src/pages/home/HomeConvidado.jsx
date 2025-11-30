import { useEffect, useState } from "react";
import { pegarTodasBatalhasConcluidas } from "../../Api/Api";
import HeaderConvidado from "../../components/comuns/Header/HeaderConvidado";
import Ranking from "../../components/comuns/ranking/Ranking";
import Trofeu from "../../assets/icones/IconeTrofeu.png";
import TelaHistorico from "../../components/comuns/historico/TelaHistorico";
import "../perfil/Perfil.css";
import "../home/jogador/batalhas/ListaDeBatalhas.css";

export default function HomeConvidado() {
  const [opcaoAtivada, setOpcaoAtivada] = useState("Batalhas");
  const botoes = ["Batalhas", "Ranking"];

  const [historicoBatalhas, setHistoricoBatalhas] = useState([]);
  const [loadingHistorico, setLoadingHistorico] = useState(false);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [idBatalhaSelecionada, setIdBatalhaSelecionada] = useState(null);

  // --- NOVA FUNÇÃO DE FORMATAÇÃO--
  //Segundo pesquisas com o home essa é melhor, vou validar isso e se pá troco nas outras e comento certinho
  const formatarDataEHora = (dataISO) => {
    if (!dataISO) return "Data Indisponível";
    const data = new Date(dataISO);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  useEffect(() => {
    if (opcaoAtivada === "Batalhas") {
      const buscarHistorico = async () => {
        setLoadingHistorico(true);
        try {
          const resposta = await pegarTodasBatalhasConcluidas();

          if (resposta && Array.isArray(resposta.data)) {
            setHistoricoBatalhas(resposta.data);
          } else {
            setHistoricoBatalhas([]);
          }
        } catch (err) {
          console.error("Erro ao buscar histórico:", err);
          setHistoricoBatalhas([]);
        } finally {
          setLoadingHistorico(false);
        }
      };
      buscarHistorico();
    }
  }, [opcaoAtivada]);

  const abrirHistorico = (idBatalha) => {
    setIdBatalhaSelecionada(idBatalha);
    setMostrarHistorico(true);
  };

  const fecharHistorico = () => {
    setMostrarHistorico(false);
    setIdBatalhaSelecionada(null);
  };

  let conteudoHomeConvidado;

  switch (opcaoAtivada) {
    case "Ranking":
      conteudoHomeConvidado = <Ranking />;
      break;
    default:
      conteudoHomeConvidado = (
        <>
          <div className="subTituloEBotaoRelatorio">
            <h1 className="subTituloBatalhas">Batalhas Concluídas</h1>
          </div>
          <div className="listaBatalhasPerfil">
            {loadingHistorico ? (
              <p className="msg-historico-vazio">Carregando batalhas...</p>
            ) : historicoBatalhas.length > 0 ? (
              historicoBatalhas.map((batalha) => (
                <div className="batalha" key={batalha.idBatalha}>
                  <img src={Trofeu} alt="Troféu" />
                  <div className="infoBatalha">
                    <p>
                      <strong>{batalha.nomeBatalha}</strong>
                    </p>
                    <p>Inscrição: {batalha.custoInscricao} MouseCoin</p>
                    <p>Data: {formatarDataEHora(batalha.dataHorarioInicio)}</p>
                    <p>Prêmio: {batalha.premioTotal} MouseCoin</p>
                    <p className="status-batalha-texto">Concluída</p>
                  </div>
                  <div className="opcoesBatalhaPerfil">
                    <button
                      className="btnVerHistorico"
                      onClick={() => abrirHistorico(batalha.idBatalha)}
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="msg-historico-vazio">
                Nenhuma batalha concluída encontrada.
              </p>
            )}
          </div>
        </>
      );
  }

  return (
    <>
      {mostrarHistorico && idBatalhaSelecionada && (
        <TelaHistorico
          onClose={fecharHistorico}
          mostrarHistorico={mostrarHistorico}
          idBatalha={idBatalhaSelecionada}
        />
      )}
      <HeaderConvidado home="homeconvidado" />
      <div className="corpo-container">
        <div className={"opcoes"}>
          {botoes.map((botao) => (
            <button
              key={botao}
              className={opcaoAtivada === botao ? "opcaoAtiva" : "btnOpcao"}
              onClick={() => setOpcaoAtivada(botao)}
            >
              {botao}
            </button>
          ))}
        </div>
        <div className="conteudo-principal">{conteudoHomeConvidado}</div>
      </div>
    </>
  );
}
