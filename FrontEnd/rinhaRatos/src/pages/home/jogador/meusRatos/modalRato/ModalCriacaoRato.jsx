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
  classes,
  descricaoHabilidades,
  loadingModal,
  erroModal,
}) {
  
  if (etapa === etapas.FECHADO) {
    return null;
  }

  let conteudoModal;

  switch (etapa) {
    case etapas.SELECAO_CLASSE:
      conteudoModal = (
        <SelecaoDeClasse
          onSlctClasse={onSlctClasse}
          classes={classes || []} 
          loading={loadingModal}
          error={erroModal}
        />
      );
      break;
    case etapas.DETALHES_CLASSE:
      conteudoModal = (
        <DetalhesDaClasse
          classe={classe}
          onMostrar={onMostrarRato}
          indexClasse={indexClasse}
          descricaoHabilidades={descricaoHabilidades || []}
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
