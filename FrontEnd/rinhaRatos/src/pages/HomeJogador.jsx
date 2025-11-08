import { useState } from "react";
import Header from "../components/comuns/Header";
import Botao from "../components/comuns/Botao";
import ModalCriacaoRato from "../components/meusRatos/modalRato/ModalCriacaoRato";
import ListaDeRatos from "../components/meusRatos/ListaDeRatos";
import ListaDeBatalhas from "../components/batalhas/ListaDeBatalhas";
import Ranking from "../components/ranking/Ranking";
import Loja from "../components/loja/Loja";
import "../css/Corpo.css";

const ETAPAS = {
  FECHADO: 0,
  SELECAO_CLASSE: 1,
  DETALHES_CLASSE: 2,
  RATO_CRIADO: 3,
};

export default function Inicio() {
  const [etapaModal, setEtapaModal] = useState(ETAPAS.FECHADO);
  const [classeSelecionada, setClasseSelecionada] = useState(null);
  const [nomeRatoEsc, setNomeRatoEsc] = useState(null);
  const [indexClasse, setIndexClasse] = useState(null);
  const [clssRatoCriar, setClssRatoCriar] = useState(null);
  const [listaHabilidades, setListaHabilidades] = useState(null);
  const [habilEscolhida, setHabilEscolhida] = useState(null);
  const [descHabilidade, setDescHabilidade] = useState(null);

  const [novoRato, setNovoRato] = useState({});

  const [ratosUsuario, setRatosUsuario] = useState([]);

  const [ratoParaBatalhar, setRatoParaBatalhar] = useState(null);

  const [qtdeMoedas, setQtdeMoedas] = useState(0);

  const [opcaoAtivada, setOpcaoAtivada] = useState("Meus ratos");
  const botoes = ["Meus ratos", "Batalhas", "Ranking", "Loja"];

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
      classeEsc: classe,
      habilidadeEsc: habilidades[habilAtiva],
      descHabilidadeEsc: descHabilidade,
    };
    setClssRatoCriar(classe);
    setNomeRatoEsc(nomeRato);
    setListaHabilidades(habilidades);
    setHabilEscolhida(habilAtiva);
    setDescHabilidade(descHabilidade);
    setNovoRato(ratoCriado);
    setRatosUsuario([...ratosUsuario, ratoCriado]);
    setEtapaModal(ETAPAS.RATO_CRIADO);
    console.log(novoRato, ratosUsuario);
  };

  const definirRatoBatalha = (rato) => {
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
            nomeRato={nomeRatoEsc}
            indexClasse={indexClasse}
            habilidades={listaHabilidades}
            habilEscolhida={habilEscolhida}
            descHabilidade={descHabilidade}
            novoRato={novoRato}
          />
          <ListaDeRatos ratosUsuario={ratosUsuario} />
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
