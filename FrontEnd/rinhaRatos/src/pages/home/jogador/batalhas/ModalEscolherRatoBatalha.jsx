import ImagensRato from "../../../../components/ImagensRato";
import "../meusRatos/modalRato/ModalCriacaoRato.css";
import "./ModalEscolherRatoBatalha.css";

export default function ModalEscolherRatoBatalha({
  onClose,
  ratosUsuario,
  onConfirmar,
  isLoading,
  erroModal,
  ignorarInscricao,
}) {
  
  // ---------------------------------------------------------
  // SELEÇÃO DO RATO
  // ---------------------------------------------------------
  
  // Função Wrapper: Recebe o objeto 'rato' inteiro do clique,
  // mas envia apenas o ID para a função do Pai (onConfirmar).
  // Isso mantém a comunicação entre componentes limpa, passando apenas o necessário.
  function handleRatoSelecionado(rato) {
    onConfirmar(rato.idRato);
  }

  // ---------------------------------------------------------
  // FILTRAGEM DE RATOS ELEGÍVEIS (LÓGICA DE NEGÓCIO)
  // ---------------------------------------------------------

  // filter(): Método de array que cria uma NOVA lista contendo apenas os itens que passaram no teste (retornaram true).
  
  // Regras aplicadas para exibir um rato na lista:
  // 1. Vida: O rato precisa estar vivo. Mortos não batalham.
  // 2. Exceção (Bot): Se a flag 'ignorarInscricao' for true (Batalha com Bot), 
  //    o rato pode lutar mesmo se já estiver inscrito em um torneio PvP.
  // 3. Regra Padrão (PvP): Se for batalha contra outro jogador, o rato deve estar livre (!rato.estaTorneio).
  const ratosDisponiveis = ratosUsuario.filter((rato) => {
    if (!rato.estaVivo) return false;
    if (ignorarInscricao) return true; 
    return !rato.estaTorneio;
  });

  return (
    <>
      <div className="bgModalAtivo">
        <div className="containerModal">
          <button className="sair" onClick={onClose} disabled={isLoading}>
            ✖
          </button>
          <div className="titulo">Escolha um Rato</div>
          
          {isLoading && (
            <p className="loading-mensagem-modal-selecao-rato">
              Inscrevendo rato...
            </p>
          )}
          {erroModal && (
            <p className="mensagem-erro-batalha">{erroModal}</p>
          )}

          {ratosDisponiveis.length === 0 && !isLoading && (
            <p className="mensagem-erro-batalha">
              {ignorarInscricao 
                ? "Nenhum rato vivo disponível." 
                : "Nenhum rato disponível. Verifique se estão vivos e não inscritos em outras batalhas."}
            </p>
          )}

          {/* ---------------------------------------------------------
             RENDERIZAÇÃO DA LISTA (MAP)
             ---------------------------------------------------------
             map(): Percorre o array filtrado e transforma cada dado em um componente visual (botão).
             
             Lógica de Imagem (Fallback):
             Tenta encontrar a imagem específica da classe do rato no objeto ImagensRato.
             O operador '||' funciona como um "OU": se a imagem da classe não existir (undefined),
             ele carrega a imagem padrão ("Rato de Esgoto") para evitar quebra de layout.
          */}
          <div className="listaRatosBatalhar">
            {ratosDisponiveis.map((rato) => (
              <button
                className="displayRatoBatalhar"
                key={rato.idRato}
                onClick={() => handleRatoSelecionado(rato)}
                disabled={isLoading}
              >
                <p>{rato.nomeCustomizado || "Rato sem nome"}</p>
                <img
                  src={
                    ImagensRato[rato.classe?.nomeClasse || rato.classeEsc?.nomeClasse] ||
                    ImagensRato["Rato de Esgoto"]
                  }
                  alt={rato.nomeCustomizado}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}