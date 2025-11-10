import ImagensRato from "../../../../components/ImagensRato";
import "../meusRatos/modalRato/ModalCriacaoRato.css";
import "./ModalEscolherRatoBatalha.css";

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
                <img src={ImagensRato[rato.classeEsc]} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
