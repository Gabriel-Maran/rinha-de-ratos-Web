import { useState } from "react";
import Trofeu from "../../../../assets/icones/IconeTrofeu.png";
import ModalEscolherRatoBatalha from "./ModalEscolherRatoBatalha";
import { entrarBatalha } from "../../../../Api/Api";
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
  const [batalhaConcluidaId, setBatalhaConcluidaId] = useState(null)
  const [comBot, setComBot] = useState(false);
  const [batalhaSelecionadaId, setBatalhaSelecionadaId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [erroModal, setErroModal] = useState(null);

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
      idRato: idRato
    };

    try {
      await entrarBatalha(dadosEntraBatalha);
      setIsLoading(false);
      handleFecharModal();
      onBatalhaInscrita(); // Avisa o pai para atualizar
    } catch (err) {
      setIsLoading(false);
      setErroModal(err?.response?.data?.message || "Erro ao entrar na batalha.");
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
            />
          )}
          {modalSelecionarRato && (
            <ModalEscolherRatoBatalha
              onClose={handleFecharModal}
              ratosUsuario={ratosUsuario}
              onConfirmar={handleEntrarBatalha}
              isLoading={isLoading}
              erroModal={erroModal}
            />
          )}
          <button
            className="btnBatalhaComBot"
            onClick={() => setMostrarResultadoBatalha(true)}
          >
            Teste
          </button>
          <div className="botaoBotELista">
            <button
              className="btnBatalhaComBot"
              onClick={(bot) => handleAbrirModal(bot)}
            >
              Batalhar com Bot
            </button>
            <div className="listaBatalhas">
              {batalhasAbertas && batalhasAbertas.map((batalha) => (
                <div className="batalha" key={batalha.idBatalha}>
                  <img src={Trofeu} />
                  <div className="infoBatalha">
                    <p>{batalha.nomeBatalha}</p>
                    <p>Inscrição: {batalha.custoInscricao} MouseCoin</p>
                    <p>Data: {formatarDataEHora(batalha.dataHorarioInicio)}</p>
                    <p>Prêmio: {batalha.premioTotal} MouseCoin</p>
                  </div>
                  <div className="opcoesBatalha">
                    <button onClick={() => handleAbrirModal(batalha.idBatalha)}>
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
                  <img src={Trofeu} />
                  <div className="infoBatalha">
                    <p>{batalha.nomeBatalha}</p>
                    <p>Inscrição: {batalha.custoInscricao} MouseCoin</p>
                    <p>Data: {formatarDataEHora(batalha.dataHorarioInicio)}</p>
                    <p>Prêmio: {batalha.premioTotal} MouseCoin</p>
                  </div>
                  <div className="opcoesBatalha">
                    <button>Aguardando...</button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", fontSize: "1.5rem", marginTop: "2rem" }}>
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