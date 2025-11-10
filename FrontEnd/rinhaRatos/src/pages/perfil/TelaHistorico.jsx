import { useState } from "react"
import Vitoria from "../../assets/icones/IconeVitoria.png"
import Derrota from "../../assets/icones/IconeDerrota.png"
import "../../pages/perfil/TelaHistorico.css";

export default function TelaHistorico({ onClose }) {

  const [vencedor, setVencedor] = useState(false)

  return (
    <>
      <div className="conteinerHistorico">
        <div className="conteudoHistorico">
          <h1 className="tituloHistorico">Resultado da Batalha:</h1>
          <div className={vencedor === true ? "Vitoria" : "Derrota"}>
            <h2>Você perdeu...</h2>
          </div>
          <button className="fecharHistorico" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </>
  );
}
