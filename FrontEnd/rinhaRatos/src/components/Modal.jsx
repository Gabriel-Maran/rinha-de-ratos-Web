import SelecaoDeClasse from "./SelecaoDeClasse.jsx";
import DetalhesDaClasse from "./DetalhesDaClasse.jsx";
import RatoCriado from "./RatoCriado.jsx";
import "../css/Modal.css";

export default function SelcClassRato({
  etapa,
  etapas,
  onClose,
  onSlctClasse,
  onMostrarRato,
  onVoltar,
  classe,
}) {
  if (etapa === etapas.FECHADO) {
    return null;
  }

  let conteudoModal;

  switch (etapa) {
    case etapas.SELECAO_CLASSE:
      conteudoModal = <SelecaoDeClasse onSlctClasse={onSlctClasse} />;
      break;
    case etapas.DETALHES_CLASSE:
      conteudoModal = (
        <DetalhesDaClasse classe={classe} onMostrar={onMostrarRato} />
      );
      break;
    case etapas.RATO_CRIADO:
      conteudoModal = <RatoCriado />;
      break;
    default:
      conteudoModal = null;
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
