import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  pegarRatosDoUsuario,
  pegarTodasClasses,
  pegarDescricaoHabilidades,
  pegarBatalhasAbertas,
} from "../../../Api/Api";
import Header from "../../../components/comuns/Header/Header";
import Botao from "../../../components/comuns/Botao";
import ModalCriacaoRato from "./meusRatos/modalRato/ModalCriacaoRato";
import ListaDeRatos from "./meusRatos/ListaDeRatos";
import RatoCriado from "./meusRatos/modalRato/RatoCriado";
import ListaDeBatalhas from "./batalhas/ListaDeBatalhas";
import Ranking from "./ranking/Ranking";
import Loja from "./loja/Loja";
import "./HomeJogador.css";

const ETAPAS = {
  FECHADO: 0,
  SELECAO_CLASSE: 1,
  DETALHES_CLASSE: 2,
  RATO_CRIADO: 3,
};

export default function HomeJogador() {
  const { user } = useAuth();

  const [etapaModal, setEtapaModal] = useState(ETAPAS.FECHADO);
  const [classeSelecionada, setClasseSelecionada] = useState(null);
  const [indexClasse, setIndexClasse] = useState(null);
  const [descHabilidade, setDescHabilidade] = useState(null);
  const [classes, setClasses] = useState(null);
  const [descricaoHabilidades, setDescHabilidades] = useState(null);

  const [novoRato, setNovoRato] = useState(null);

  const [ratosUsuario, setRatosUsuario] = useState([]);
  const [loadingRatos, setLoadingRatos] = useState(true);
  const [erroRatos, setErroRatos] = useState(null);

  const [ratoParaBatalhar, setRatoParaBatalhar] = useState(null);
  const [opcaoAtivada, setOpcaoAtivada] = useState("Meus ratos");

  const idUsuarioLogado = (user?.idUsuario || user?.id) ?? 0;
  const qtdeMoedas = user?.mousecoinSaldo ?? 0;
  const botoes = ["Meus ratos", "Batalhas", "Ranking", "Loja"];
  const limiteRatos = 3;

  const ratosVivos = ratosUsuario.filter((rato) => rato.estaVivo);
  const contagemRatosVivos = ratosVivos.length;

  useEffect(() => {
    if (!idUsuarioLogado) return;

    const buscarDadosIniciais = async () => {
      setLoadingRatos(true);
      setErroRatos(null);

      try {
        const [respostaRatos, respostaClasses, respostaHabilidades] =
          await Promise.all([
            pegarRatosDoUsuario(idUsuarioLogado),
            pegarTodasClasses(),
            pegarDescricaoHabilidades(),
            pegarBatalhasAbertas()
          ]);

        setRatosUsuario(respostaRatos.data);
        setClasses(respostaClasses.data);
        setDescHabilidades(respostaHabilidades.data);
      } catch (err) {
        console.error("Erro ao buscar dados iniciais:", err);
        setErroRatos("Falha ao carregar dados.");
      } finally {
        setLoadingRatos(false);
      }
    };

    buscarDadosIniciais();
  }, [idUsuarioLogado]);

  const mostrarSelecaoClasse = () => {
    setEtapaModal(ETAPAS.SELECAO_CLASSE);
  };

  const fecharModal = () => {
    setEtapaModal(ETAPAS.FECHADO);
    setClasseSelecionada(null);
    setIndexClasse(null);
    setNovoRato(null);
    setDescHabilidade(null);
  };

  const selecionarClasse = (classe, index) => {
    setEtapaModal(ETAPAS.DETALHES_CLASSE);
    setClasseSelecionada(classe);
    setIndexClasse(index);
  };

  const mostrarRatoCriado = (ratoCompletoDaApi, descHabilidadeDaClasse) => {
    setRatosUsuario((prevRatos) => [...prevRatos, ratoCompletoDaApi]);
    setNovoRato(ratoCompletoDaApi);
    setDescHabilidade(descHabilidadeDaClasse);
    setEtapaModal(ETAPAS.RATO_CRIADO);
  };

  const mostrarDetalhesRato = () => {
    setEtapaModal(ETAPAS.RATO_CRIADO);
  };

  const definirRatoBatalha = (rato) => {
    localStorage.setItem("ratoSelecionado", JSON.stringify(rato));
    setRatoParaBatalhar(rato);
  };

  let conteudoCorpo;

  switch (opcaoAtivada) {
    case "Meus ratos":
      conteudoCorpo = (
        <>
          <ModalCriacaoRato
            etapa={etapaModal}
            etapas={ETAPAS}
            onClose={fecharModal}
            onSlctClasse={selecionarClasse}
            onMostrarRato={mostrarRatoCriado}
            classe={classeSelecionada}
            indexClasse={indexClasse}
            descHabilidade={descHabilidade}
            novoRato={novoRato}
            classes={classes}
            descricaoHabilidades={descricaoHabilidades}
            loadingModal={loadingRatos}
            erroModal={erroRatos}
          />

          <ListaDeRatos
            ratosUsuario={ratosUsuario}
            onSelectRato={definirRatoBatalha}
            ratoSelecionado={ratoParaBatalhar}
            mostrarDetalhesRato={mostrarDetalhesRato}
          />
          <Botao
            button={{
              className: "addRato",
              onClick: mostrarSelecaoClasse,
              disabled: loadingRatos || contagemRatosVivos >= limiteRatos,
            }}
            acaoBtn={
              <strong>
                {contagemRatosVivos >= limiteRatos
                  ? "Limite Atingido"
                  : loadingRatos
                  ? "Carregando..."
                  : ".Adicionar Rato + "}
              </strong>
            }
          />
        </>
      );
      break;
    case "Batalhas":
      conteudoCorpo = (
        <ListaDeBatalhas
          ratosUsuario={ratosUsuario}
          ratoParaBatalhar={definirRatoBatalha}
        />
      );
      break;
    case "Ranking":
      conteudoCorpo = <Ranking />;
      break;
    case "Loja":
      conteudoCorpo = <Loja qtdeMoedas={qtdeMoedas} />;
      break;
  }

  return (
    <>
      <Header home="home" qtdeMoedas={qtdeMoedas} />
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
        <div className="conteudo-principal">{conteudoCorpo}</div>
      </div>
    </>
  );
}
