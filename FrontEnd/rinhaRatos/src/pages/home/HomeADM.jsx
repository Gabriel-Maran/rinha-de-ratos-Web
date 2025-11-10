import { useState } from "react";
import Header from "../../components/comuns/Header";
import RatoEsgoto from "../../assets/classeRatos/RatoEsgoto.png";
import trofeu from "../../assets/icones/IconeTrofeu.png";
import ModalEditarBatalha from "./ModalEditarBatalha";
import ModalCriarBatalha from "./ModalCriarBatalha";
import "../../css/home/ADM/homeADM.css";
import "../../css/batalhas/ListaDeBatalhas.css";

export default function HomeADM() {
  const [opcaoAtivada, setOpcaoAtivada] = useState("Batalhas");
  const botoes = ["Batalhas", "Ranking"];

  const [listaBatalhas, setListaBatalhas] = useState([]);

  const [nomeBatalha, setNomeBatalha] = useState("");
  const [custoInscricao, setCustoInscricao] = useState(0);
  const [dataHora, setDataHora] = useState("");
  const [premio, setPremio] = useState(0);
  const [jogador1, setJogador1] = useState(null);
  const [jogador2, setJogador2] = useState(null);
  const [iniciar, setIniciar] = useState(false);

  const [batalhaSendoEditada, setBatalhaSendoEditada] = useState();

  const [editarBatalha, setEditarBatalha] = useState(false);
  const [criarBatalha, setCriarBatalha] = useState(false);
  const [estadoModal, setEstadoModal] = useState("bgModal");

  const [listaJogadores, setListaJogadores] = useState([]);
  const [nome, setNome] = useState("");
  const [vitorias, setVitorias] = useState(0);
  const [posicoes, setPosicoes] = useState(1);

  const CriacaoBatalha = () => {
    setCriarBatalha(true);
    setEstadoModal("bgModalAtivo");
  };

  const EdicaoDeBatalha = (batalha) => {
    setEditarBatalha(true);
    setBatalhaSendoEditada(batalha);
  };

  const fecharModal = () => {
    setEditarBatalha(false);
    setCriarBatalha(false);
  };

  const formatarDataEHora = (data) => {
    if (!data) return "Data Indisponível";

    try {
      const [parteDaData, parteDaHora] = data.split("T"); // ["2025-10-30", "22:54"]
      const [ano, mes, dia] = parteDaData.split("-"); // ["2025", "10", "30"]
      return `${dia}/${mes}, ${parteDaHora}`; // "30/10, 22:54"
    } catch (erro) {
      console.error("Erro ao formatar data:", erro);
      return data;
    }
  };

  let conteudoHomeAdm;

  switch (opcaoAtivada) {
    case "Ranking":
      conteudoHomeAdm = (
        <>
          <div className="listaJogadores">
            {listaJogadores.map((jogador) => (
              <div className="jogador" key={jogador.id}>
                <div className="posicaoJogador">
                  <p>{jogador.posicao}º</p>
                </div>
                <img src={RatoEsgoto} />
                <div className="nomeEVitorias">
                  <p className="nomeJogador">{jogador.nome}</p>
                  <div className="vitorias">
                    <p>{jogador.vitorias}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      );
      break;
    default:
      conteudoHomeAdm = (
        <>
          {criarBatalha && (
            <ModalCriarBatalha
              estadoModal={estadoModal}
              nomeBatalha={nomeBatalha}
              custoInscricao={custoInscricao}
              dataHora={dataHora}
              premio={premio}
              jogador1={jogador1}
              jogador2={jogador2}
              iniciar={iniciar}
              listaBatalhas={listaBatalhas}
              setNomeBatalha={setNomeBatalha}
              setCustoInscricao={setCustoInscricao}
              setDataHora={setDataHora}
              setPremio={setPremio}
              setListaBatalhas={setListaBatalhas}
              onClose={fecharModal}
            />
          )}
          {editarBatalha && (
            <ModalEditarBatalha
              estadoModal={estadoModal}
              onClose={fecharModal}
              batalhaSendoEditada={batalhaSendoEditada}
              setNomeBatalha={setNomeBatalha}
              setCustoInscricao={setCustoInscricao}
              setDataHora={setDataHora}
              setPremio={setPremio}
              setListaBatalhas={setListaBatalhas}
              listaBatalhas={listaBatalhas}
            />
          )}
          <button className="btnIniciarCriacao" onClick={CriacaoBatalha}>
            Criar Batalha
          </button>
          <div className="listaBatalhas">
            {listaBatalhas.map((batalha) => (
              <div className="batalha" key={batalha.id}>
                <img src={trofeu} />
                <div className="infoBatalha">
                  <p>{batalha.nome}</p>
                  <p>Inscrição: {batalha.custo} MouseCoin</p>
                  <p>Data e Hora: {formatarDataEHora(batalha.dataEHora)}</p>
                  <p>Prêmio: {batalha.premio} MouseCoin</p>
                </div>
                <button
                  className="btnGerenciar"
                  onClick={() => EdicaoDeBatalha(batalha)}
                >
                  Gerenciar
                </button>
              </div>
            ))}
          </div>
          {criarBatalha}
          {editarBatalha}
        </>
      );
  }
  return (
    <>
      <Header home="home" />
      <div className="corpo-container">
        <div className={"opcoes"}>
          {botoes.map((botao) => (
            <button
              key={botao}
              className={opcaoAtivada == botao ? "opcaoAtiva" : "btnOpcao"}
              onClick={() => setOpcaoAtivada(botao)}
            >
              {botao}
            </button>
          ))}
        </div>
        <div className="conteudo-principal">{conteudoHomeAdm}</div>
      </div>
    </>
  );
}
