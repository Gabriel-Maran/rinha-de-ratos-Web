import { useState } from "react";
import Trofeu from "../../../../assets/icones/IconeTrofeu.png";
import ModalEscolherRatoBatalha from "./ModalEscolherRatoBatalha";
import { entrarBatalha } from "../../../../Api/Api";
import "./ListaDeBatalhas.css";


export default function ListaDeBatalhas({
  ratosUsuario,
  batalhasAbertas,
  batalhasInscrito, 
  idUsuarioLogado,
  onBatalhaInscrita, 
}) {
  const [btnOpcBatalhas, setBtnOpcBatalhas] = useState("Todas");
  const botoesOpcBatalha = ["Todas", "Inscritas"];

  const [ativarModal, setAtivarModal] = useState(false);


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

  const handleAbrirModal = (idBatalha) => {
    setBatalhaSelecionadaId(idBatalha); 
    setAtivarModal(true);
    setErroModal(null);
  };

  const handleFecharModal = () => {
    setAtivarModal(false);
    setErroModal(null);
    setBatalhaSelecionadaId(null);
  };

  const handleEntrarBatalha = async (idRato) => {
    if (!idRato || !idUsuarioLogado || !batalhaSelecionadaId) {
      setErroModal(
        "Erro: Não foi possível identificar o rato, usuário ou batalha."
      );
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
          {ativarModal && (
            <ModalEscolherRatoBatalha
              onClose={handleFecharModal}
              ratosUsuario={ratosUsuario}
              onConfirmar={handleEntrarBatalha} 
              isLoading={isLoading}
              erroModal={erroModal}
            />
          )}
          <div className="listaBatalhas">
            {batalhasAbertas &&
              batalhasAbertas.map((batalha) => (
                <div className="batalha" key={batalha.idBatalha}>
                  <img src={Trofeu} />
                  <div className="infoBatalha">
                    <p>{batalha.nomeBatalha}</p>
                    <p>Inscrição: {batalha.custoInscricao} MouseCoin</p>
                    <p>
                      Data e Hora:{" "}
                      {formatarDataEHora(batalha.dataHorarioInicio)}
                    </p>
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
        </>
      );
      break;
    case "Inscritas":
      conteudoOpcaoBatalhas = (
        <div className="listaBatalhas">
          {batalhasInscrito &&
            batalhasInscrito.map((batalha) => (
              <div className="batalha" key={batalha.idBatalha}>
                <img src={Trofeu} />
                <div className="infoBatalha">
                  <p>{batalha.nomeBatalha}</p>
                  <p>Inscrição: {batalha.custoInscricao} MouseCoin</p>
                  <p>
                    Data e Hora: {formatarDataEHora(batalha.dataHorarioInicio)}
                  </p>
                  <p>Prêmio: {batalha.premioTotal} MouseCoin</p>
                </div>
                <div className="opcoesBatalha">
                  <button>Jogar</button>
                </div>
              </div>
            ))}
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
