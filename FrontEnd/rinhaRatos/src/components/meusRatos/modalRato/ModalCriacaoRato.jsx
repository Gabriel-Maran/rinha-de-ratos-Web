import SelecaoDeClasse from "./SelecaoDeClasse.jsx";
import DetalhesDaClasse from "./DetalhesDaClasse.jsx";
import RatoCriado from "./RatoCriado.jsx";
import "../../../css/meusRatos/modalRato/ModalCriacaoRato.css";

export default function ModalCriacaoRato({
  etapa,
  etapas,
  onClose,
  onSlctClasse,
  indexClasse,
  classe,
  onMostrarRato,
  novoRato,
}) {
  if (etapa === etapas.FECHADO) {
    return null;
  }

  let conteudoModal;

  switch (etapa) {
    case etapas.SELECAO_CLASSE:
      conteudoModal = <SelecaoDeClasse onSlctClasse={onSlctClasse } />;
      break;
    case etapas.DETALHES_CLASSE:
      conteudoModal = (
        <DetalhesDaClasse
          classe={classe}
          ratosUsuario={novoRato}
          onMostrar={onMostrarRato}
          indexClasse={indexClasse}
        />
      );
      break;
    case etapas.RATO_CRIADO:
      conteudoModal = (
        <RatoCriado
          onClose={onClose}
          novoRato={novoRato}
        />
      );
      break;
    default:
      conteudoModal = null;
  }

  return (
    <>
      <div className="bgModal">
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
