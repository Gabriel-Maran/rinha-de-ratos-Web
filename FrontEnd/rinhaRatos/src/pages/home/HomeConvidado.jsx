import { useEffect, useState } from "react";
import { pegarTodasBatalhasConcluidas } from "../../Api/Api";
import HeaderConvidado from "../../components/comuns/Header/HeaderConvidado";
import Ranking from "../../components/comuns/ranking/Ranking";
import Trofeu from "../../assets/icones/IconeTrofeu.png";
import TelaHistorico from "../../components/comuns/historico/TelaHistorico";
import "../perfil/Perfil.css";
import "../home/jogador/batalhas/ListaDeBatalhas.css";

export default function HomeConvidado() {
  // ---------------------------------------------------------
  // GERENCIAMENTO DE ESTADO (NAVEGAÇÃO E DADOS)
  // ---------------------------------------------------------

  // Controle de Abas:
  // Define qual conteúdo será renderizado: "Batalhas" (Histórico) ou "Ranking".
  const [opcaoAtivada, setOpcaoAtivada] = useState("Batalhas");
  const botoes = ["Batalhas", "Ranking"];

  // Estados de Dados e UI:
  // Armazena a lista de batalhas vindas da API, controla o loader e
  // gerencia a visibilidade do Modal de detalhes (TelaHistorico).
  const [historicoBatalhas, setHistoricoBatalhas] = useState([]);
  const [loadingHistorico, setLoadingHistorico] = useState(false);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [idBatalhaSelecionada, setIdBatalhaSelecionada] = useState(null);

  // Função utilitária para formatar data ISO para o padrão brasileiro legível
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

  // ---------------------------------------------------------
  // BUSCA DE DADOS E POLLING (ATUALIZAÇÃO EM TEMPO REAL)
  // ---------------------------------------------------------

  // useEffect com Polling:
  // Este efeito é disparado quando a aba muda. Se for "Batalhas", ele inicia
  // um ciclo de busca automática (Polling) a cada 3 segundos.

  // Cleanup Function (Limpeza):
  // O retorno "return () => clearInterval(intervalo)" é crucial.
  // Ele cancela o timer quando o usuário sai da tela ou muda de aba,
  // prevenindo vazamento de memória e erros de atualização em componentes desmontados.
  useEffect(() => {
    if (opcaoAtivada === "Batalhas") {
      const buscarHistorico = async () => {
        try {
          const resposta = await pegarTodasBatalhasConcluidas();

          if (resposta && Array.isArray(resposta.data)) {
            // Ordenação (Sort):
            // Lógica (b - a) garante que os IDs maiores (batalhas mais recentes)
            // apareçam no topo da lista.
            const listaOrdenada = resposta.data.sort((a, b) => {
              const idA = a.idBatalha || a.id;
              const idB = b.idBatalha || b.id;
              return idB - idA;
            });

            setHistoricoBatalhas(listaOrdenada);
          } else {
            setHistoricoBatalhas([]);
          }
        } catch (err) {
          console.error("Erro ao buscar histórico:", err);
        } finally {
          setLoadingHistorico(false);
        }
      };

      setLoadingHistorico(true);
      buscarHistorico();
  
      const intervalo = setInterval(() => {
        buscarHistorico();
      }, 3000);

      return () => clearInterval(intervalo);
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

  // ---------------------------------------------------------
  // RENDERIZAÇÃO CONDICIONAL DO CONTEÚDO
  // ---------------------------------------------------------

  // Switch Case para View:
  // Determina o que será armazenado na variável 'conteudoHomeConvidado'
  // mantendo o return principal do componente mais limpo.
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

  // ---------------------------------------------------------
  // RENDERIZAÇÃO FINAL 
  // ---------------------------------------------------------
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
