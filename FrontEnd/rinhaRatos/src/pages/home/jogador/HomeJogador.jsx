import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  pegarRatosDoUsuario,
  pegarTodasClasses,
  pegarDescricaoHabilidades,
} from "../../../Api/Api";
import Header from "../../../components/comuns/Header/Header";
import Botao from "../../../components/comuns/Botao";
import ModalCriacaoRato from "./meusRatos/modalRato/ModalCriacaoRato";
import ListaDeRatos from "./meusRatos/ListaDeRatos";
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
  const [etapaModal, setEtapaModal] = useState(ETAPAS.FECHADO);
  const [classeSelecionada, setClasseSelecionada] = useState(null);
  const [indexClasse, setIndexClasse] = useState(null);
  const [descHabilidade, setDescHabilidade] = useState(null);
  const { user } = useAuth();

  const [novoRato, setNovoRato] = useState(null);

  const qtdeMoedas = user.mousecoinSaldo;

  // CORREÇÃO FINAL (Missão 7): Lida com os dois formatos de ID
  const idUsuarioLogado = user.idUsuario || user.id;

  // States dos Ratos
  const [ratosUsuario, setRatosUsuario] = useState([]);
  const [loadingRatos, setLoadingRatos] = useState(true); // Controla todos os loads
  const [erroRatos, setErroRatos] = useState(null); // Controla todos os erros

  // States para os dados do modal (pré-carregamento)
  const [classes, setClasses] = useState(null);
  const [descricaoHabilidades, setDescHabilidades] = useState(null);

  const [ratoParaBatalhar, setRatoParaBatalhar] = useState(null);
  const ratosVivos = ratosUsuario.filter((rato) => rato.estaVivo);
  const contagemRatosVivos = ratosVivos.length;
  const limiteRatos = 3;

  const [opcaoAtivada, setOpcaoAtivada] = useState("Meus ratos");
  const botoes = ["Meus ratos", "Batalhas", "Ranking", "Loja"];

  // UseEffect que carrega TUDO em paralelo (Missão 5)
  useEffect(() => {
    // Só roda se o ID do usuário (de qualquer fonte) estiver disponível
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
  }, [idUsuarioLogado]); // Depende do ID do usuário

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

  // Função limpa (Missão 4)
  const mostrarRatoCriado = (ratoCompletoDaApi, descHabilidadeDaClasse) => {
    setRatosUsuario((prevRatos) => [...prevRatos, ratoCompletoDaApi]);
    setNovoRato(ratoCompletoDaApi);
    setDescHabilidade(descHabilidadeDaClasse);
    setEtapaModal(ETAPAS.RATO_CRIADO);
  };

  const definirRatoBatalha = (rato) => {
    // Isso ainda usa localStorage, mas é para seleção, não para fonte da verdade
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
            // Dados pré-carregados (Missão 5)
            classes={classes}
            descricaoHabilidades={descricaoHabilidades}
            loadingModal={loadingRatos}
            erroModal={erroRatos}
          />

          {/* TODO: Tratar 'loadingRatos' e 'erroRatos' aqui */}
          <ListaDeRatos
            ratosUsuario={ratosUsuario}
            onSelectRato={definirRatoBatalha}
            ratoSelecionado={ratoParaBatalhar}
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
      // A Loja também precisará usar o useAuth() para atualizar o saldo
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
