import { useState, useEffect } from "react";
// APIs não são mais importadas aqui
import SelecaoDeClasse from "./SelecaoDeClasse.jsx";
import DetalhesDaClasse from "./DetalhesDaClasse.jsx";
import RatoCriado from "./RatoCriado.jsx";
import "./ModalCriacaoRato.css";

export default function ModalCriacaoRato({
  etapa,
  etapas,
  onClose,
  onSlctClasse,
  indexClasse,
  classe,
  onMostrarRato,
  novoRato,
  descHabilidade,

  // Props de pré-carregamento (Missão 5)
  classes,
  descricaoHabilidades,
  loadingModal,
  erroModal,
}) {
  
  // States internos e useEffect foram removidos

  if (etapa === etapas.FECHADO) {
    return null;
  }

  let conteudoModal;

  switch (etapa) {
    case etapas.SELECAO_CLASSE:
      conteudoModal = (
        <SelecaoDeClasse
          onSlctClasse={onSlctClasse}
          classes={classes || []} // Garante que é um array
          loading={loadingModal}
          error={erroModal}
        />
      );
      break;
    case etapas.DETALHES_CLASSE:
      conteudoModal = (
        <DetalhesDaClasse
          classe={classe}
          // ratosUsuario={novoRato} // Prop 'ratosUsuario' não parecia ser usada
          onMostrar={onMostrarRato}
          indexClasse={indexClasse}
          descricaoHabilidades={descricaoHabilidades || []} // Garante que é um array
        />
      );
      break;
    case etapas.RATO_CRIADO:
      conteudoModal = (
        <RatoCriado
          onClose={onClose}
          novoRato={novoRato}
          descHabilidade={descHabilidade}
        />
      );
      break;
    default:
      conteudoModal = null;
  }

  return (
    <>
      <div className={etapa !== etapa.FECHADO ? "bgModalAtivo" : "bgModal"}>
        <div className="containerModal">
          <button className="sair" onClick={onClose}>
            ✖
          </button>
          {conteudoModal}
        </div>
      </div>
    </>
  );
}