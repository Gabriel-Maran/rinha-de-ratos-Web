import { useState } from "react";
import Botao from "./Botao";
import SelcClassRato from "./SelcClassRato";
import "../css/Corpo.css";

export default function Corpo() {
  const [ativado, setAtivado] = useState(false);
  const [estilo, setEstilo] = useState("corpo-container");
  const [estilo2, setEstilo2] = useState("display");
  const mostrarModal = () => {
    setAtivado(true);
    setEstilo("corpo-container-preto");
    setEstilo2("display-preto");
  };
  return (
    <>
      <div className={estilo}>
        <SelcClassRato
          ativado={ativado}
          setAtivado={setAtivado}
          setEstilo={setEstilo}
          setEstilo2={setEstilo2}
        />
        <div className={estilo2}>
          <Botao
            button={{ onClick: mostrarModal }}
            acaoBtn={"Adicionar Rato"}
          />
        </div>
      </div>
    </>
  );
}
