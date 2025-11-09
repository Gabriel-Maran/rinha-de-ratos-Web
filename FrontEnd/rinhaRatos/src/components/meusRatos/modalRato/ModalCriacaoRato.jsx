import { useState, useEffect } from "react"; 
import SelecaoDeClasse from "./SelecaoDeClasse.jsx";
import DetalhesDaClasse from "./DetalhesDaClasse.jsx";
import RatoCriado from "./RatoCriado.jsx";
import "../../../css/meusRatos/modalRato/ModalCriacaoRato.css";
import { pegarTodasClasses, pegarDescricaoHabilidades } from "../../../Api/Api.js";

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

  const [classes, setClasses] = useState([]);
  const [descricaoHabilidades, setDescHabilidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (etapa === etapas.SELECAO_CLASSE) {
      const fetchDados = async () => {
        setLoading(true);
        setError(null);
        try {
          const [resposta, respostaDescHabil] = await Promise.all([
            pegarTodasClasses(),
            pegarDescricaoHabilidades() 
          ]);
          setClasses(resposta.data);
          setDescHabilidades(respostaDescHabil.data);
        } catch (err) {
          console.error("Erro ao buscar dados:", err);
          setError("Falha ao carregar os dados.");
        } finally {
          setLoading(false);
        }
      };
      fetchDados();
    }
  }, [etapa, etapas.SELECAO_CLASSE]); 
  if (etapa === etapas.FECHADO) {
    return null;
  }

  let conteudoModal;

  switch (etapa) {
    case etapas.SELECAO_CLASSE:
      conteudoModal = (
        <SelecaoDeClasse 
          onSlctClasse={onSlctClasse}
          classes={classes}
          loading={loading}
          error={error}
        />
      );
      break;
    case etapas.DETALHES_CLASSE:
      conteudoModal = (
        <DetalhesDaClasse
          classe={classe}
          ratosUsuario={novoRato}
          onMostrar={onMostrarRato}
          indexClasse={indexClasse}
          descricaoHabilidades={descricaoHabilidades} 
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
      <div className={etapa == etapa.FECHADO ? "bgModal" : "bgModalAtivo"}>
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
