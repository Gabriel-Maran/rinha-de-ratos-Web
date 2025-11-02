import { useState } from "react";
import imagensRato from "./ImagensRato";
import "../css/Corpo.css";

export default function ListaDeRatos() {
  const [ratosUsuario, setRatosUsuario] = useState(["Robertinho Loco","Destruidor","Sabe-tudo"]);

  return (
    <>
      <div className="listaRatos">
        {ratosUsuario.map((rato, index) => (
          <div className="displayRato" key={rato}>
            <p>{ratosUsuario[index]}</p>
            <img src={imagensRato[index]} />
          </div>
        ))}
      </div>
    </>
  );
}
