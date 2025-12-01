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
  
  // ---------------------------------------------------------
  // RENDERIZAÇÃO CONDICIONAL 
  // ---------------------------------------------------------

  // Performance e Limpeza do DOM:
  // Se a etapa for "FECHADO", retornamos null imediatamente.
  // Isso diz ao React para não montar nada no DOM, economizando memória
  // e garantindo que o modal não fique invisível ocupando espaço ou cliques.
  if (etapa === etapas.FECHADO) {
    return null;
  }

  // ---------------------------------------------------------
  // GERENCIAMENTO DE FLUXO 
  // ---------------------------------------------------------

  // Máquina de Estados Visual:
  // Em vez de usar rotas (URL), usamos uma variável de estado ('etapa') para 
  // decidir qual componente filho renderizar. Isso cria a sensação de "Passo a Passo".
  
  // Prop Drilling (Passagem de Props):
  // Este componente atua como um "Hub". Ele recebe muitos dados do Pai (HomeJogador)
  // apenas para repassar para os filhos específicos (Selecao, Detalhes, Criado).
  
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

  // ---------------------------------------------------------
  // RENDERIZAÇÃO DO CONTAINER 
  // ---------------------------------------------------------

  // Container Genérico:
  // Este return fornece a "moldura" do modal (fundo escuro, caixa branca, botão fechar).
  // O conteúdo interno ({conteudoModal}) muda dinamicamente conforme o switch acima.
  return (
    <>
      <div className={etapa !== etapas.FECHADO ? "bgModalAtivo" : "bgModal"}>
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