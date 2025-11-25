import ImagensRato from "../../../../components/ImagensRato";
import "../meusRatos/modalRato/ModalCriacaoRato.css";
import "./ModalEscolherRatoBatalha.css";

export default function ModalEscolherRatoBatalha({
  onClose,
  ratosUsuario,
  onConfirmar,
  isLoading,
  erroModal,
  ignorarInscricao, // Nova prop recebida
}) {
  function handleRatoSelecionado(rato) {
    onConfirmar(rato.idRato);
  }

  // LÓGICA CORRIGIDA:
  // 1. O rato deve estar vivo.
  // 2. Se 'ignorarInscricao' for true (Bot), aceitamos ratos em torneio.
  // 3. Se for false (PvP), o rato NÃO pode estar em torneio (!rato.estaTorneio).
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