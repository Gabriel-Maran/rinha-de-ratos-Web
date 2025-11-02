import { useState } from "react";
import Botao from "./Botao";
import Modal from "./Modal";
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
  const [indexClasse, setIndexClasse] = useState(null);
  const [clssRatoCriar, setClssRatoCriar] = useState(null);

  const mostrarSelecaoClasse = () => {
    setEtapaModal(ETAPAS.SELECAO_CLASSE);
  };

  const fecharModal = () => {
    setEtapaModal(ETAPAS.FECHADO);
    setClasseSelecionada(null);
    setIndexClasse(null);
    setClssRatoCriar(null);
  };

  const selecionarClasse = (classe, index) => {
    setClasseSelecionada(classe);
    setIndexClasse(index);
    setEtapaModal(ETAPAS.DETALHES_CLASSE);
  };

  const mostrarRatoCriado = () => {
    setEtapaModal(ETAPAS.RATO_CRIADO);
    setClssRatoCriar(clssRatoCriar);
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
          indexClasse={indexClasse}
        />
        <div
          className={`conteudo-principal ${
            etapaModal != ETAPAS.FECHADO ? "escurecer" : ""
          }`}
        >
          <Botao
            button={{
                className: "addRato",
                onClick: mostrarSelecaoClasse,
            }}
            acaoBtn={"Adicionar Rato"}
          />
        </div>
      </div>
    </>
  );
}
