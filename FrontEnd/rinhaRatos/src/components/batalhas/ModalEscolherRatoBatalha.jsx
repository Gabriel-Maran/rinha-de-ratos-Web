import imagensRato from "../imagensRato";
import "../../css/meusRatos/modalRato/ModalCriacaoRato.css";
import "../../css/batalhas/ModalEscolherRatoBatalha.css";

export default function ModalEscolherRatoBatalha({
  onClose,
  ratosUsuario,
  ratoParaBatalhar,
}) {
  function handleRatoSelecionado(rato) {
    ratoParaBatalhar(rato);
    onClose();
  }
  return (
    <>
      <div className="bgModal">
        <div className="containerModal">
          <button className="sair" onClick={onClose}>
            ✖
          </button>
          <div className="titulo">Escolha um Rato</div>
          <div className="listaRatosBatalhar">
            {ratosUsuario.map((rato, index) => (
              <button
                className="displayRatoBatalhar"
                key={rato}
                onClick={() => handleRatoSelecionado(rato)}
              >
                <p>{rato.nome}</p>
                <img src={imagensRato[rato.classeEsc]} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
