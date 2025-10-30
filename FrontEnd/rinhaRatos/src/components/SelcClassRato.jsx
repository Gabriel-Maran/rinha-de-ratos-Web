import React from 'react'
import SelecaoDeClasse from "./SelecaoDeClasse.jsx";
import DetalhesDaClasse from "./DetalhesDaClasse.jsx";
import "../css/SelcClassRato.css";

export default function SelcClassRato({ etapa, etapas, onClose, onSlctClasse, onVoltar, classe }) {
  if (etapa === etapas.FECHADO) {
    return null;
  }

  let conteudoModal;

  switch (etapa) {
    case etapas.SELECAO_CLASSE:
      conteudoModal = <SelecaoDeClasse onSlctClasse={onSlctClasse} />
      break;
    case etapas.DETALHES_CLASSE:
      conteudoModal = (
        <DetalhesDaClasse
          classe={classe}
          onConfirmar={onClose}
        />
      );
      break
    default:
      conteudoModal = null
  }

  return (
    <>
      <div className="bgSelcClass">
        <div className="containerSelcClass">
          <button className="sair" onClick={onClose}>
            ✖
          </button>
          {conteudoModal}
        </div>
      </div>
    </>
  );
}
