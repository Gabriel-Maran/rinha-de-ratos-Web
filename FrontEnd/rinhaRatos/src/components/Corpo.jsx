import { useState } from "react";
import Botao from "./Botao";
import SelcClassRato from "./Modal";
import "../css/Corpo.css";

const ETAPAS = {
  FECHADO: 0,
  SELECAO_CLASSE: 1,
  DETALHES_CLASSE: 2,
  RATO_CRIADO: 3
};

export default function Corpo() {
  const [etapaModal, setEtapaModal] = useState(ETAPAS.FECHADO);
  const [classeSelecionada, setClasseSelecionada] = useState(null)

  const mostrarSelecaoClasse = () => {
    setEtapaModal(ETAPAS.SELECAO_CLASSE)
  }

  const fecharModal = () => {
    setEtapaModal(ETAPAS.FECHADO);
    setClasseSelecionada(null)
  };

  const selecionarClasse = (classe) => {
    setClasseSelecionada(classe)
    setEtapaModal(ETAPAS.DETALHES_CLASSE)
  }

  const voltarParaSelecao = () => {
    setEtapaModal(ETAPAS.SELECAO_CLASSE);
    setClasseSelecionada(null)
  }

  const mostrarRatoCriado = () => {
    setEtapaModal(ETAPAS.RATO_CRIADO);
  }

  return (
    <>
      <div className="corpo-container">
        <SelcClassRato
          etapa={etapaModal}
          etapas={ETAPAS}
          onClose={fecharModal}
          onSlctClasse={selecionarClasse}
          onMostrarRato={mostrarRatoCriado}
          onVoltar={voltarParaSelecao}
          classe={classeSelecionada}
        />
        <div className={`conteudo-principal ${etapaModal != ETAPAS.FECHADO ? 'escurecer' : ''}`}>
          <Botao
            button={{ onClick: mostrarSelecaoClasse }}
            acaoBtn={"Adicionar Rato"}
          />
        </div>
      </div>
    </>
  );
}
