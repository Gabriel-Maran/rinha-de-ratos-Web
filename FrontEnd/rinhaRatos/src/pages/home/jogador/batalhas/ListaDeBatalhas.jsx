import { useState } from "react";
import Trofeu from "../../../../assets/icones/IconeTrofeu.png";
import ModalEscolherRatoBatalha from "./ModalEscolherRatoBatalha";
import { entrarBatalha, batlhaBot } from "../../../../Api/Api";
import { useAuth } from "../../../../context/AuthContext";
import "./ListaDeBatalhas.css";
import TelaHistorico from "../../../../components/comuns/historico/TelaHistorico";

export default function ListaDeBatalhas({
  ratosUsuario,
  batalhasAbertas,
  batalhasInscrito,
  idUsuarioLogado,
  onBatalhaInscrita,
}) {
  const { user, setUser } = useAuth();
  const [btnOpcBatalhas, setBtnOpcBatalhas] = useState("Todas");
  const botoesOpcBatalha = ["Todas", "Inscritas"];

  const [modalSelecionarRato, setModalSelecionarRato] = useState(false);
  const [mostrarResultadoBatalha, setMostrarResultadoBatalha] = useState(false);
  const [batalhaConcluidaId, setBatalhaConcluidaId] = useState(null);
  const [comBot, setComBot] = useState(false);
  const [batalhaSelecionadaId, setBatalhaSelecionadaId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [erroModal, setErroModal] = useState(null);

  const batalharComBot = async (idRato) => {
    setIsLoading(true);
    setErroModal(null);
    try {
      const resposta = await batlhaBot(idUsuarioLogado, idRato);
      console.log("Resposta batlhaBot:", resposta?.data);
      const novoId = resposta.data.idBatalha;
      if (!novoId)
        throw new Error("Não foi possível recuperar o ID da batalha.");

      setBatalhaConcluidaId(novoId);
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
      return data;
    }
  };

  const handleAbrirModal = (idBatalha, bot) => {
    if (bot) {
      setComBot(true);
      setBatalhaSelecionadaId(null);
    } else {
      setComBot(false);
      setBatalhaSelecionadaId(idBatalha);
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
    setComBot(false);
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

      //Entra na função batalhasAbertas e pega a batalha que estou editando permitindo que eu acesse os dados dessa batalha.
      const pegarIdBatalha = batalhasAbertas.find(
        (batalha) => batalha.idBatalha === batalhaSelecionadaId
      );

      const novoSaldo = user.mousecoinSaldo - pegarIdBatalha.custoInscricao;

      // Atualiza o estado global com o novo objeto de usuário
      setUser((userAntigo) => ({
        ...userAntigo, // Copia todos os dados antigos
        mousecoinSaldo: novoSaldo,
      }));
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
              dadosBatalhaBot={comBot ? batalhaConcluidaId : null}
              idBatalha={!comBot ? batalhaConcluidaId : null}
              usuarioLogado={{ idUsuario: idUsuarioLogado }}
            />
          )}

          {modalSelecionarRato && !mostrarResultadoBatalha && (
            <ModalEscolherRatoBatalha
              onClose={handleFecharModal}
              ratosUsuario={ratosUsuario}
              onConfirmar={comBot ? batalharComBot : handleEntrarBatalha}
              isLoading={isLoading}
              erroModal={erroModal}
              ignorarInscricao={comBot}
            />
          )}

          <div className="botaoBotELista">
            <button
              className="btnBatalhaComBot"
              onClick={() => handleAbrirModal(null, true)}
            >
              Batalhar com Bot
            </button>
            <div className="listaBatalhas">
              {batalhasAbertas &&
                batalhasAbertas
                  .filter((batalha) => !batalha.jogador2)
                  .map((batalha) => (
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
                          className="entrarOuAguardarBatalha"
                          onClick={() => handleAbrirModal(batalha.idBatalha)}
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
                    <button className="entrarOuAguardarBatalha" disabled>
                      Aguardando...
                    </button>
                    <button className="btnSairBatalha">Sair</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="nenhumaInscricao">
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
