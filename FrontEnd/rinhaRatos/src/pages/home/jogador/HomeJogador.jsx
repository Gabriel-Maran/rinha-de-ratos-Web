import { useState, useEffect } from "react"; // ADICIONADO: useEffect para sincronizar com localStorage
import { useAuth } from "../../../context/AuthContext";
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
  const [nomeRatoEsc, setNomeRatoEsc] = useState(null);
  const [indexClasse, setIndexClasse] = useState(null);
  const [clssRatoCriar, setClssRatoCriar] = useState(null);
  const [listaHabilidades, setListaHabilidades] = useState(null);
  const [habilEscolhida, setHabilEscolhida] = useState(null);
  const [descHabilidade, setDescHabilidade] = useState(null);
  const { setUser } = useAuth();

  const [novoRato, setNovoRato] = useState({});

  const [qtdeMoedas, setQtdeMoedas] = useState(0);

  const idUsuarioLogado = localStorage.getItem("idUsuario");

  const [ratosUsuario, setRatosUsuario] = useState(() => {
    return JSON.parse(localStorage.getItem(`ratos_${idUsuarioLogado}`)) || [];
  });

  const [ratoParaBatalhar, setRatoParaBatalhar] = useState(
    () =>
      JSON.parse(localStorage.getItem(`ratoSelecionado_${idUsuarioLogado}`)) ||
      null
  );

  const [opcaoAtivada, setOpcaoAtivada] = useState("Meus ratos");
  const botoes = ["Meus ratos", "Batalhas", "Ranking", "Loja"];
  useEffect(() => {
    const idUsuarioLogado = localStorage.getItem("idUsuario");
    localStorage.setItem(
      `ratos_${idUsuarioLogado}`,
      JSON.stringify(ratosUsuario)
    );
  }, [ratosUsuario]);

  const mostrarSelecaoClasse = () => {
    setEtapaModal(ETAPAS.SELECAO_CLASSE);
  };

  const fecharModal = () => {
    setEtapaModal(ETAPAS.FECHADO);
    setClasseSelecionada(null);
    setNomeRatoEsc(null);
    setIndexClasse(null);
    setClssRatoCriar(null);
    setNovoRato(null);
    setListaHabilidades(null);
    setHabilEscolhida(null);
    setDescHabilidade(null);
  };

  const selecionarClasse = (classe, index) => {
    console.log(etapaModal);
    setEtapaModal(ETAPAS.DETALHES_CLASSE);
    setClasseSelecionada(classe);
    setIndexClasse(index);
  };

  const mostrarRatoCriado = (
    classe,
    nomeRato,
    habilidades,
    habilAtiva,
    descHabilidade
  ) => {
    const ratoCriado = {
      id: Date.now(),
      nome: nomeRato,
      nomeCustomizado: nomeRato,
      classeEsc: classe,
      classe: classe,
      habilidadeEsc: habilidades[habilAtiva],
      descHabilidadeEsc: descHabilidade,
    };
    setClssRatoCriar(classe);
    setNomeRatoEsc(nomeRato);
    setListaHabilidades(habilidades);
    setHabilEscolhida(habilAtiva);
    setDescHabilidade(descHabilidade);
    setNovoRato(ratoCriado);

    // ADICIONADO: atualiza estado e persistence via useEffect acima
    setRatosUsuario((prev) => [...prev, ratoCriado]); // ADICIONADO

    setEtapaModal(ETAPAS.RATO_CRIADO);
    console.log(novoRato, ratosUsuario);
  };

  // MODIFICADO: agora só guarda seleção em localStorage e no estado; não navega
  const definirRatoBatalha = (rato) => {
    localStorage.setItem("ratoSelecionado", JSON.stringify(rato));
    setRatoParaBatalhar(rato); // ADICIONADO: atualiza estado local com o rato selecionado
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
            nomeRato={nomeRatoEsc}
            indexClasse={indexClasse}
            habilidades={listaHabilidades}
            habilEscolhida={habilEscolhida}
            descHabilidade={descHabilidade}
            novoRato={novoRato}
          />
          <ListaDeRatos
            ratosUsuario={ratosUsuario}
            onSelectRato={definirRatoBatalha} // ADICIONADO: passa callback para seleção
            ratoSelecionado={ratoParaBatalhar} // ADICIONADO: passa seleção atual para destacar
          />
          <Botao
            button={{
              className: "addRato",
              onClick: mostrarSelecaoClasse,
            }}
            acaoBtn={<strong> .{"Adicionar Rato + "}</strong>}
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
      conteudoCorpo = (
        <Loja setQtdeMoedas={setQtdeMoedas} qtdeMoedas={qtdeMoedas} />
      );
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
