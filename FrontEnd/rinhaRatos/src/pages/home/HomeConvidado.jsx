import { useState } from "react";
import HeaderConvidado from "../../components/comuns/Header/HeaderConvidado";
import Ranking from "./jogador/ranking/Ranking";
import Trofeu from "../../assets/icones/IconeTrofeu.png";
import "../home/adm/HomeADM";

export default function HomeConvidado() {
  const [opcaoAtivada, setOpcaoAtivada] = useState("Batalhas");
  const botoes = ["Batalhas", "Ranking"];

  const [listaBatalhas, setListaBatalhas] = useState([]);

  const [listaJogadores, setListaJogadores] = useState([]);
  const [nome, setNome] = useState("");

  let conteudoHomeConvidado;

  switch (opcaoAtivada) {
    case "Ranking":
      conteudoHomeConvidado = <Ranking />;
      break;
    default:
      conteudoHomeConvidado = (
        <>
          <div className="listaBatalhas">
            {listaBatalhas.map((batalha) => (
              <div className="batalha" key={batalha.id}>
                <img src={Trofeu} />
                <div className="infoBatalha">
                  <p>{batalha.nome}</p>
                  <p>Inscrição: {batalha.custo} MouseCoin</p>
                  <p>Data e Hora: {batalha.dataEHora}</p>
                  <p>Prêmio: {batalha.premio} MouseCoin</p>
                </div>
                <button
                  className="btnGerenciar"
                  onClick={() => VerHistorico(batalha)}
                >
                  Historico
                </button>
              </div>
            ))}
          </div>
        </>
      );
  }
  return (
    <>
      <HeaderConvidado home="homeconvidado" />
      <div className="corpo-container">
        <div className={"opcoes"}>
          {botoes.map((botao) => (
            <button
              key={botao}
              className={opcaoAtivada == botao ? "opcaoAtiva" : "btnOpcao"}
              onClick={() => setOpcaoAtivada(botao)}
            >
              {botao}
            </button>
          ))}
        </div>
        <div className="conteudo-principal">{conteudoHomeConvidado}</div>
      </div>
    </>
  );
}
