import ImagensRato from "../ImagensRato";
import "../../css/Corpo.css";

export default function ListaDeRatos({ ratosUsuario }) {
  return (
    <>
      <div className="listaRatos">
        {ratosUsuario.map((rato) => (
          <div className="displayRato" key={rato.id}>
            <p>{rato.nome}</p>
            <img src={ImagensRato[rato.classeEsc]} />
          </div>
        ))}
      </div>
    </>
  );
}
