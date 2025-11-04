import imagensRato from "./ImagensRato";
import "../css/ModalCriacaoRato.css";
import "../css/ModalEscolherRatoBatalha.css";

export default function ModalEscolherRatoBatalha({
  onClose,
  ratosUsuario,
  ratoParaBatalhar,
}) {
  /* function handleRatoSelecionado(ratosUsuario[index]) {
    ratoParaBatalhar(ratosUsuario[index]);
    onClose();
  } */
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
                onClick={() => handleRatoSelecionado(ratosUsuario[index])}
              >
                <p>{ratosUsuario[index]}</p>
                <img src={imagensRato[index]} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
