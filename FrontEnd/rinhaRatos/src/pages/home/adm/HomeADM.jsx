import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { pegarBatalhasAbertas } from "../../../Api/Api";
import { ranking } from "../../../Api/Api"; 
import Header from "../../../components/comuns/Header/Header";
import RatoEsgoto from "../../../assets/classeRatos/RatoEsgoto.png";
import trofeu from "../../../assets/icones/IconeTrofeu.png";  
import ModalEditarBatalha from "./ModalEditarBatalha";
import ModalCriarBatalha from "./ModalCriarBatalha";
import "./HomeADM.css";
import "../jogador/batalhas/ListaDeBatalhas";

export default function HomeADM() {
  const { user } = useAuth();
  const [opcaoAtivada, setOpcaoAtivada] = useState("Batalhas");
  const botoes = ["Batalhas", "Ranking"];
  const idUsuarioLogado = user ? user.idUsuario || user.id : null;
  
  const [listaBatalhas, setListaBatalhas] = useState([]);
  const [listaJogadores, setListaJogadores] = useState([]);
  const [batalhaSendoEditada, setBatalhaSendoEditada] = useState();
  const [editarBatalha, setEditarBatalha] = useState(false);
  const [criarBatalha, setCriarBatalha] = useState(false);

  const [loadingDados, setLoadingDados] = useState(true);
  const [erroDados, setErroDados] = useState(null);

  useEffect(() => {
    if (!idUsuarioLogado) return;

    const buscarDadosIniciais = async () => {
      setLoadingDados(true);
      setErroDados(null);
      try {
        const [respostaBatalhas, respostaRanking] = await Promise.all([
          pegarBatalhasAbertas(),
          ranking(),
        ]);

        setListaBatalhas(respostaBatalhas.data);
        setListaJogadores(respostaRanking.data);
      } catch (err) {
        console.error("Erro ao buscar dados iniciais:", err);
        setErroDados("Falha ao carregar dados. Tente atualizar a página.");
      } finally {
        setLoadingDados(false);
      }
    };

    buscarDadosIniciais();
  }, [idUsuarioLogado]);

  const CriacaoBatalha = () => {
    setCriarBatalha(true);
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
      const [parteDaData, parteDaHora] = data.split("T");
      const [ano, mes, dia] = parteDaData.split("-");
      return `${dia}/${mes}, ${parteDaHora}`;
    } catch (erro) {
      console.error("Erro ao formatar data:", erro);
      return data;
    }
  };

  let conteudoHomeAdm;
  if (loadingDados) {
    conteudoHomeAdm = <p className="loading-mensagem">A carregar dados...</p>;
  } else if (erroDados) {
    conteudoHomeAdm = <p className="erro-mensagem">{erroDados}</p>;
  } else {
    switch (opcaoAtivada) {
      case "Ranking":
        conteudoHomeAdm = (
          <>
            <div className="listaJogadores">
              {listaJogadores.map((jogador, index) => (
                <div className="jogador" key={jogador.idUsuario}>
                  <div className="posicaoJogador">
                    <p>{index + 1}º</p> 
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
                estadoModal={criarBatalha ? "bgModalAtivo" : "bgModal"}
                listaBatalhas={listaBatalhas}
                setListaBatalhas={setListaBatalhas}
                onClose={fecharModal}
              />
            )}
            {editarBatalha && (
              <ModalEditarBatalha
                estadoModal={editarBatalha ? "bgModalAtivo" : "bgModal"}
                onClose={fecharModal}
                batalhaSendoEditada={batalhaSendoEditada}
                setListaBatalhas={setListaBatalhas}
                listaBatalhas={listaBatalhas}
              />
            )}
            <button className="btnIniciarCriacao" onClick={CriacaoBatalha}>
              Criar Batalha
            </button>

            <div className="listaBatalhas">
              {listaBatalhas.map((batalha) => (
                <div className="batalha" key={batalha.idBatalha}>
                  <img src={trofeu} />
                  <div className="infoBatalha">
                    <p>{batalha.nomeBatalha}</p>
                    <p>Inscrição: {batalha.custoInscricao} MouseCoin</p>
                    <p>
                      Data e Hora:{" "}
                      {formatarDataEHora(batalha.dataHorarioInicio)}
                    </p>
                    <p>Prêmio: {batalha.premioTotal} MouseCoin</p>
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
          </>
        );
    }
  }

  return (
    <>
      <Header home="home" />
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
        <div className="conteudo-principal">{conteudoHomeAdm}</div>
      </div>
    </>
  );
}
