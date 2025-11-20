import ImagensRato from "../../../../components/ImagensRato";
import "../meusRatos/modalRato/ModalCriacaoRato.css";
import "./ModalEscolherRatoBatalha.css";

export default function ModalEscolherRatoBatalha({
  onClose,
  ratosUsuario,
  onConfirmar,
  isLoading,
  erroModal,
}) {

  function handleRatoSelecionado(rato) {
    onConfirmar(rato.idRato); 
  }

  const ratosDisponiveis = ratosUsuario.filter(rato => rato.estaVivo && !rato.estaTorneio);

  return (
    <>
      <div className="bgModalAtivo">
        <div className="containerModal">
          <button className="sair" onClick={onClose} disabled={isLoading}>
            ✖
          </button>
          <div className="titulo">Escolha um Rato</div>
          {isLoading && <p className="loading-mensagem">A inscrever rato...</p>}
          {erroModal && <p className="mensagem-erro-batalha">{erroModal}</p>}
          {ratosDisponiveis.length === 0 && !isLoading && (
            <p className="mensagem-erro-batalha">Nenhum rato disponível para batalhar.</p>
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
                  src={ImagensRato[rato.classe?.nomeClasse || rato.classeEsc?.nomeClasse] || ImagensRato["Rato de Esgoto"]} 
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