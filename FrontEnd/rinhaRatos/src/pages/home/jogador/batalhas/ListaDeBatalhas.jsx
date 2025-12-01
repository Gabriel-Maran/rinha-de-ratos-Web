import { useState } from "react";
import Trofeu from "../../../../assets/icones/IconeTrofeu.png";
import ModalEscolherRatoBatalha from "./ModalEscolherRatoBatalha";
import { entrarBatalha, batlhaBot, removerJogador } from "../../../../Api/Api";
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
  const { user, recarregarUsuario } = useAuth();
  const [btnOpcBatalhas, setBtnOpcBatalhas] = useState("Todas");
  const botoesOpcBatalha = ["Todas", "Inscritas"];

  const [modalSelecionarRato, setModalSelecionarRato] = useState(false);
  const [mostrarResultadoBatalha, setMostrarResultadoBatalha] = useState(false);
  const [batalhaConcluidaId, setBatalhaConcluidaId] = useState(null);
  const [comBot, setComBot] = useState(false);
  const [batalhaSelecionadaId, setBatalhaSelecionadaId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [erroModal, setErroModal] = useState(null);

  // ---------------------------------------------------------
  // BATALHAR COM BOT 
  // ---------------------------------------------------------

  // Fluxo de execução assíncrona para batalhas instantâneas:
  // 1. Envia os dados para a API (batlhaBot).
  // 2. A API processa a luta no backend e retorna o ID da batalha gerada.
  // 3. Atualizamos o estado para exibir o modal de resultado imediatamente (TelaHistorico).
  // Diferente do PvP, aqui não há "inscrição", a luta acontece na hora.
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

  // ---------------------------------------------------------
  // SAIR DA BATALHA (CANCELAR INSCRIÇÃO)
  // ---------------------------------------------------------

  // Gerenciamento de Reembolso e Sincronia:
  // Quando o jogador sai, o dinheiro deve voltar para a conta.

  // 1. removerJogador(API): O Backend remove o registro e estorna o valor no banco de dados.
  // 2. recarregarUsuario(Context): O Frontend força uma busca no endpoint de usuário para
  //    pegar o saldo atualizado. Isso garante que o Header mostre as moedas certas sem F5.
  // 3. onBatalhaInscrita(Prop): Avisa o componente Pai (HomeJogador) para recarregar as listas de batalha.
  const sairBatalha = async (idBatalha) => {
    if (!idBatalha || !idUsuarioLogado) return;

    setIsLoading(true);
    setErroModal(null);

    try {
      await removerJogador(idBatalha, idUsuarioLogado);
      await recarregarUsuario();
      onBatalhaInscrita();
      setIsLoading(false);
    } catch (err) {
      console.error("Erro ao sair:", err);
      setIsLoading(false);
      setErroModal(err?.response?.data?.message || "Erro ao sair da batalha.");
    }
  };

  // ---------------------------------------------------------
  // FORMATAÇÃO DE DATA
  // ---------------------------------------------------------

  // Parsing Manual de String:
  // A API retorna datas no formato ISO (ex: "2023-11-20T14:30:00").
  // O split("T") separa data de hora. O split("-") quebra ano, mês e dia.
  // Template String (`${}`) remonta no formato brasileiro DD/MM.
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

  // ---------------------------------------------------------
  // CONTROLE DE MODAL (ABRIR/FECHAR)
  // ---------------------------------------------------------

  // Reutilização de Componente:
  // Usamos o mesmo modal (ModalEscolherRatoBatalha) para dois contextos diferentes:
  // 1. PvP (entrar em batalha existente): Salva o ID da batalha selecionada.
  // 2. PvE (Bot): Seta a flag 'bot' como true e limpa o ID da batalha.
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

  // ---------------------------------------------------------
  // ENTRAR NA BATALHA (PvP)
  // ---------------------------------------------------------

  // Atualização Otimista (Optimistic UI) vs Real:
  // Aqui você optou por calcular o saldo manualmente no Frontend para resposta imediata,
  // ao invés de esperar o recarregarUsuario() (que usamos no sairBatalha).

  // 1. entrarBatalha(API): Registra o usuário na luta.
  // 2. find(): Procura na lista local (batalhasAbertas) o objeto da batalha pelo ID
  //    para descobrir quanto custava a inscrição.
  // 3. setUser(State): Atualiza manualmente o saldo local subtraindo o valor.
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

      const pegarIdBatalha = batalhasAbertas.find(
        (batalha) => batalha.idBatalha === batalhaSelecionadaId
      );

      const novoSaldo = user.mousecoinSaldo - pegarIdBatalha.custoInscricao;

      setUser((userAntigo) => ({
        ...userAntigo,
        mousecoinSaldo: novoSaldo,
      }));
    } catch (err) {
      setIsLoading(false);
      setErroModal(
        err?.response?.data?.message || "Erro ao entrar na batalha."
      );
    }
  };

  // ---------------------------------------------------------
  // RENDERIZAÇÃO CONDICIONAL
  // ---------------------------------------------------------

  // Switch Case: Alterna o conteúdo principal da tela baseado no botão clicado no Header interno.
  // Case "Todas": Mostra batalhas disponíveis para entrar e botão de luta contra Bot.
  // Case "Inscritas": Mostra apenas batalhas onde o usuário já está, permitindo sair.
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
                    <button
                      className="btnSairBatalha"
                      onClick={() => sairBatalha(batalha.idBatalha)}
                      disabled={isLoading}
                    >
                      Sair
                    </button>
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
