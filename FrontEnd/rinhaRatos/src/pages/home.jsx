import { useState } from "react";
import Botao from "../components/Botao";
import Modal from "../components/Modal";
import "../css/Corpo.css";

const ETAPAS = {
  FECHADO: 0,
  SELECAO_CLASSE: 1,
  DETALHES_CLASSE: 2,
  RATO_CRIADO: 3,
};

export default function Corpo() {
  const [etapaModal, setEtapaModal] = useState(ETAPAS.FECHADO);
  const [classeSelecionada, setClasseSelecionada] = useState(null);
  const [nomeRatoEsc, setNomeRato] = useState(null);
  const [indexClasse, setIndexClasse] = useState(null);
  const [clssRatoCriar, setClssRatoCriar] = useState(null);
  const [listaHabilidades, setListaHabilidades] = useState(null);
  const [habilEscolhida, setHabilEscolhida] = useState(null);
  const [descHabilidade, setDescHabilidade] = useState(null);

  const mostrarSelecaoClasse = () => {
    setEtapaModal(ETAPAS.SELECAO_CLASSE);
  };

  const fecharModal = () => {
    setEtapaModal(ETAPAS.FECHADO);
    setClasseSelecionada(null);
    setNomeRato(null);
    setIndexClasse(null);
    setClssRatoCriar(null);
    setListaHabilidades(null);
    setHabilEscolhida(null);
    setDescHabilidade(null);
  };

  const selecionarClasse = (classe, index) => {
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
    setClssRatoCriar(classe);
    setNomeRato(nomeRato);
    setListaHabilidades(habilidades);
    setHabilEscolhida(habilAtiva);
    setDescHabilidade(descHabilidade);
    setEtapaModal(ETAPAS.RATO_CRIADO);
  };

  return (
    <>
      <div className="corpo-container">
        <Modal
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
        />
        <div
          className={`conteudo-principal ${
            etapaModal != ETAPAS.FECHADO ? "escurecer" : ""
          }`}
        >
          <Botao
            button={{ onClick: mostrarSelecaoClasse }}
            acaoBtn={"Adicionar Rato"}
          />
        </div>
      </div>
    </>
  );
}
