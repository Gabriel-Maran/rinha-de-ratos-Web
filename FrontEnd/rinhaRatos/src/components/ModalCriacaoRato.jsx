import SelecaoDeClasse from "./SelecaoDeClasse.jsx";
import DetalhesDaClasse from "./DetalhesDaClasse.jsx";
import RatoCriado from "./RatoCriado.jsx";
import "../css/ModalCriacaoRato.css";

export default function ModalCriacaoRato({
  etapa,
  etapas,
  onClose,
  onSlctClasse,
  classe,
  indexClasse,
  onMostrarRato,
  nomeRato,
  habilidades,
  habilEscolhida,
  descHabilidade,
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
        <DetalhesDaClasse
          classe={classe}
          indexClasse={indexClasse}
          onMostrar={onMostrarRato}
        />
      );
      break;
    case etapas.RATO_CRIADO:
      conteudoModal = (
        <RatoCriado
          indexClasse={indexClasse}
          onClose={onClose}
          nomeRato={nomeRato}
          habilidades={habilidades}
          habilEscolhida={habilEscolhida}
          descHabilidade={descHabilidade}
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
