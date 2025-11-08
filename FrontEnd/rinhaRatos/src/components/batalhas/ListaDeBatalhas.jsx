import { useState } from "react";
import trofeu from "../../assets/icones/IconeTrofeu.png";
import ModalEscolherRatoBatalha from "./ModalEscolherRatoBatalha";
import "../../css/batalhas/ListaDeBatalhas.css";

/* Deletar os parâmetros "listaBatalhas" e "setListaBatalhas" quando for fazer a junção com a API */
export default function ListaDeBatalhas({
  ratosUsuario,
  ratoParaBatalhar,
}) {
  const [listaBatalhas, setListaBatalhas] = useState([]);
  const [btnOpcBatalhas, setBtnOpcBatalhas] = useState("Todas");
  const botoesOpcBatalha = ["Todas", "Inscritas"];

  const [ativarModal, setAtivarModal] = useState(false);

  const fecharSelecaoRato = () => {
    setAtivarModal(!ativarModal);
    console.log(ratosUsuario);
  };

  let conteudoOpcaoBatalhas;

  switch (btnOpcBatalhas) {
    case "Todas":
      conteudoOpcaoBatalhas = (
        <>
          {ativarModal && (
            <ModalEscolherRatoBatalha
              onClose={fecharSelecaoRato}
              ratosUsuario={ratosUsuario}
              ratoParaBatalhar={ratoParaBatalhar}
            />
          )}
          <div className="listaBatalhas">
            {listaBatalhas.map((batalha) => (
              <div className="batalha" key={batalha.id}>
                <img src={trofeu} />
                <div className="infoBatalha">
                  <p>{batalha.nome}</p>
                  <p>Inscrição: {batalha.custo} MouseCoin</p>
                  <p>Data e Hora: {batalha.dataEHora}</p>
                  <p>Prêmio: {batalha.premio} MouseCoin</p>
                </div>
                <div className="opcoesBatalha">
                  <button onClick={() => setAtivarModal(true)}>
                    Participar
                  </button>
                </div>
              </div>
            ))}
          </div>
          {ativarModal}
        </>
      );
      break;
    case "Inscrições":
      conteudoOpcaoBatalhas = (
        <div className="listaBatalhas">
          {listaBatalhas.map((batalha) => (
            <div className="batalha" key={batalha.id}>
              <img src={trofeu} />
              <div className="infoBatalha">
                <p>{batalha.nome}</p>
                <p>Inscrição: {batalha.custo} MouseCoin</p>
                <p>Data e Hora: {batalha.dataEHora}</p>
                <p>Prêmio: {batalha.premio} MouseCoin</p>
              </div>
              <div className="opcoesBatalha">
                <button>Jogar</button>
              </div>
            </div>
          ))}
        </div>
      );
  }

  return (
    <>
      <header className="opcoesAbaBatalha">
        {botoesOpcBatalha.map((btnOpcBatalha) => (
          <button
            key={btnOpcBatalha}
            className={
              btnOpcBatalhas == btnOpcBatalha
                ? "btnOpcaoBatalhasAtivo"
                : "btnOpcaoBatalhas"
            }
            onClick={() => setBtnOpcBatalhas(btnOpcBatalha)}
          >
            {btnOpcBatalha}
          </button>
        ))}
      </header>
      {conteudoOpcaoBatalhas}
    </>
  );
}
