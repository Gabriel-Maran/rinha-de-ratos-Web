import { useState } from "react";
import HeaderConvidado from "../../components/comuns/HeaderConvidado";
import RatoEsgoto from "../../assets/classeRatos/RatoEsgoto.png";
import trofeu from "../../assets/icones/IconeTrofeu.png";
import "../../css/home/ADM/homeADM.css";

export default function HomeConvidado() {
  const [opcaoAtivada, setOpcaoAtivada] = useState("Batalhas");
  const botoes = ["Batalhas", "Ranking"];

  const [listaBatalhas, setListaBatalhas] = useState([]);

  const [listaJogadores, setListaJogadores] = useState([]);
  const [nome, setNome] = useState("");
  const [vitorias, setVitorias] = useState(0);
  const [posicoes, setPosicoes] = useState(1);

  let conteudoHomeConvidado;

  switch (opcaoAtivada) {
    case "Ranking":
      conteudoHomeConvidado = (
        <>
          <h1 className="subTitulo">Batalhas Vencidas</h1>
          <div className="listaJogadores">
            {listaJogadores.map((jogador) => (
              <div className="jogador" key={jogador.id}>
                <div className="posicaoJogador">
                  <p>{jogador.posicao}º</p>
                </div>
                <img src={RatoEsgoto} />
                <div className="nomeEVitorias">
                  <p className="nomeJogador">{jogador.nome}</p>
                  <div className="vitorias">
                    <p>{jogador.vitorias}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      );
      break;
    default:
      conteudoHomeConvidado = (
        <>
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
