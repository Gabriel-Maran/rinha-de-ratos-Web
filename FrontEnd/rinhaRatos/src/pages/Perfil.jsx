import { useLocation } from "react-router-dom";
import { useState } from "react";
import trofeu from "../assets/icones/IconeTrofeu.png"
import Header from "../components/comuns/Header";
import "../css/perfil/Perfil.css";

export default function Perfil({qtdeMoedas}) {

  /* Deletar essas três linhas depois quando for fazer a junção com a API */  
  const location = useLocation();
  const listaBatalhas = location.state?.listaBatalhas || [];
  let loginADM = false
  /* -------------------------------------------------------------------- */

  const [opcaoAtivada, setOpcaoAtivada] = useState("Histórico de Batalhas");
  const botoes = ["Histórico de Batalhas", "Perfil"];

  let conteudoPerfil;

  switch (opcaoAtivada) {
    case "Perfil":
      conteudoPerfil = (
        <>
          <div className="dados">
            <p>Nome:</p>
            <input value="Jorginhos" />
            <p>E-mail:</p>
            <input value="Jorginhos@gmail.com" />
            <p>Senha:</p>
            <input value="1234" />
          </div>
          <button className="botaoSalvar">Salvar alterações</button>
        </>
      );
      break;
    default:
      conteudoPerfil = (
        <div className="historicoBatalhas">
          {listaBatalhas.map((batalha) => (
            <div className="batalhaFeita" key={batalha.id}>
              <img src={trofeu} />
              <div className="infoBatalhaFeita">
                <p>{batalha.nome}</p>
                <p>Inscrição: {batalha.custo} MouseCoin</p>
                <p>Data e Hora: {batalha.dataEHora}</p>
                <p>Prêmio: {batalha.premio} MouseCoin</p>
              </div>
              <div className="opcoesBatalhaFeita">
                <p>Vencedor: Jão</p>
                <button>Histórico</button>
              </div>
            </div>
          ))}
        </div>
      );
  }

  return (
    <>
      <Header home={loginADM == true ? "homeadm" : "home"} qtdeMoedas={qtdeMoedas}/>
      <div className="perfil-container">
        <div className={"opcoesPerfil"}>
          {botoes.map((botao) => (
            <button
              key={botao}
              className={opcaoAtivada == botao ? "opcaoAtiva" : ""}
              onClick={() => setOpcaoAtivada(botao)}
            >
              {botao}
            </button>
          ))}
        </div>
        <div className="conteudo-perfil">{conteudoPerfil}</div>
      </div>
    </>
  );
}
