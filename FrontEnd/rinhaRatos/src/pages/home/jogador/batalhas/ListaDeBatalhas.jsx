import { useState } from "react";
import Trofeu from "../../../../assets/icones/IconeTrofeu.png";
import ModalEscolherRatoBatalha from "./ModalEscolherRatoBatalha";
import { entrarBatalha, batlhaBot } from "../../../../Api/Api";
import "./ListaDeBatalhas.css";
import TelaHistorico from "../../../perfil/TelaHistorico";

export default function ListaDeBatalhas({
  ratosUsuario,
  batalhasAbertas,
  batalhasInscrito,
  idUsuarioLogado,
  onBatalhaInscrita,
}) {
  const [btnOpcBatalhas, setBtnOpcBatalhas] = useState("Todas");
  const botoesOpcBatalha = ["Todas", "Inscritas"];

  const [modalSelecionarRato, setModalSelecionarRato] = useState(false);
  const [mostrarResultadoBatalha, setMostrarResultadoBatalha] = useState(false);
  const [batalhaConcluidaId, setBatalhaConcluidaId] = useState(null);
  const [comBot, setComBot] = useState(false);
  const [batalhaSelecionadaId, setBatalhaSelecionadaId] = useState(null);
  const [dadosBatalhaBot, setDadosBatalhaBot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [erroModal, setErroModal] = useState(null);

  const batalharComBot = async (idRato) => {
    setIsLoading(true);
    setErroModal(null);

    try {
      const resposta = await batlhaBot(idUsuarioLogado, idRato);

      setDadosBatalhaBot(resposta.data);
      console.log("RESPOSTA COMPLETA DO BOT:", resposta);
      console.log("DADOS DA RESPOSTA:", resposta.data);

      setIsLoading(false);
      setModalSelecionarRato(false);
      setMostrarResultadoBatalha(true);
    } catch (err) {
      setIsLoading(false);
      setErroModal(
        err?.response?.data?.message || "Erro ao realizar a batalha de treino."
      );
    }
  };

  const formatarDataEHora = (data) => {
    if (!data) return "Data Indisponível";
    try {
      const [parteDaData, parteDaHora] = data.split("T");
      const [ano, mes, dia] = parteDaData.split("-");
      return `${dia}/${mes}, ${parteDaHora}`;
    } catch (erro) {
      console.error("Erro ao formatar data:", erro);
      return data;
    }
  };

  const handleAbrirModal = (idBatalha, bot) => {
    if (!bot) {
      setBatalhaSelecionadaId(idBatalha);
    } else {
      setComBot(true);
    }
    setModalSelecionarRato(true);
    setErroModal(null);
  };

  const handleFecharModal = () => {
    setModalSelecionarRato(false);
    setMostrarResultadoBatalha(false);
    setErroModal(null);
    setBatalhaSelecionadaId(null);
    setBatalhaConcluidaId(null);
    setDadosBatalhaBot(null);
  };

  const handleEntrarBatalha = async (idRato) => {
    if (!idRato || !idUsuarioLogado || !batalhaSelecionadaId) {
      setErroModal("Erro: Dados incompletos.");
      return;
    }

    setIsLoading(true);
    setErroModal(null);

    const dadosEntraBatalha = {
      idBatalha: batalhaSelecionadaId,
      idUsuario: idUsuarioLogado,
      idRato: idRato,
    };

    try {
      await entrarBatalha(dadosEntraBatalha);
      setIsLoading(false);
      handleFecharModal();
      onBatalhaInscrita();
    } catch (err) {
      setIsLoading(false);
      setErroModal(
        err?.response?.data?.message || "Erro ao entrar na batalha."
      );
    }
  };

  let conteudoOpcaoBatalhas;

  switch (btnOpcBatalhas) {
    case "Todas":
      conteudoOpcaoBatalhas = (
        <>
          {mostrarResultadoBatalha && (
            <TelaHistorico
              onClose={handleFecharModal}
              mostrarHistorico={mostrarResultadoBatalha}
              batalhaConcluidaId={batalhaConcluidaId}
              dadosBatalhaBot={dadosBatalhaBot}
              usuarioLogado={{ nome: "SeuUsuario" }}
            />
          )}

          {/* Só mostra o modal de seleção se o de resultado NÃO estiver aberto.
              Isso é uma segurança extra para evitar sobreposição visual */}
          {modalSelecionarRato && !mostrarResultadoBatalha && (
            <ModalEscolherRatoBatalha
              onClose={handleFecharModal}
              ratosUsuario={ratosUsuario}
              onConfirmar={comBot ? batalharComBot : handleEntrarBatalha}
              isLoading={isLoading}
              erroModal={erroModal}
            />
          )}

          <div className="botaoBotELista">
            <button
              className="btnBatalhaComBot"
              onClick={() => handleAbrirModal(null, true)} // Ajustei aqui para passar null no ID e true no bot
            >
              Batalhar com Bot
            </button>
            <div className="listaBatalhas">
              {batalhasAbertas &&
                batalhasAbertas.map((batalha) => (
                  <div className="batalha" key={batalha.idBatalha}>
                    <img src={Trofeu} alt="Troféu" />
                    <div className="infoBatalha">
                      <p>{batalha.nomeBatalha}</p>
                      <p>Inscrição: {batalha.custoInscricao} MouseCoin</p>
                      <p>
                        Data: {formatarDataEHora(batalha.dataHorarioInicio)}
                      </p>
                      <p>Prêmio: {batalha.premioTotal} MouseCoin</p>
                    </div>
                    <div className="opcoesBatalha">
                      <button
                        onClick={() =>
                          handleAbrirModal(batalha.idBatalha, false)
                        }
                      >
                        Participar
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      );
      break;
    case "Inscritas":
      conteudoOpcaoBatalhas = (
        <div className="botaoBotELista">
          <div className="listaBatalhas">
            {batalhasInscrito && batalhasInscrito.length > 0 ? (
              batalhasInscrito.map((batalha) => (
                <div className="batalha" key={batalha.idBatalha}>
                  <img src={Trofeu} alt="Troféu" />
                  <div className="infoBatalha">
                    <p>{batalha.nomeBatalha}</p>
                    <p>Inscrição: {batalha.custoInscricao} MouseCoin</p>
                    <p>Data: {formatarDataEHora(batalha.dataHorarioInicio)}</p>
                    <p>Prêmio: {batalha.premioTotal} MouseCoin</p>
                  </div>
                  <div className="opcoesBatalha">
                    <button disabled>Aguardando...</button>
                  </div>
                </div>
              ))
            ) : (
              <p
                style={{
                  textAlign: "center",
                  fontSize: "1.5rem",
                  marginTop: "2rem",
                }}
              >
                Você não está inscrito em nenhuma batalha aberta.
              </p>
            )}
          </div>
        </div>
      );
      break;
    default:
      conteudoOpcaoBatalhas = null;
  }

  return (
    <>
      <header className="opcoesAbaBatalha">
        {botoesOpcBatalha.map((btnOpcBatalha) => (
          <button
            key={btnOpcBatalha}
            className={
              btnOpcBatalhas === btnOpcBatalha
                ? "btnOpcaoBatalhasAtivo"
                : "btnOpcaoBatalhas"
            }
            onClick={() => setBtnOpcBatalhas(btnOpcBatalha)}
          >
            {btnOpcBatalha}
          </button>
        ))}
      </header>
      {conteudoOpcaoBatalhas}
    </>
  );
}
