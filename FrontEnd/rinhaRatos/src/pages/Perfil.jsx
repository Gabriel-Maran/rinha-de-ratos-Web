import { useState } from "react";
import Header from "../components/comuns/Header";
import "../css/perfil/Perfil.css";

export default function Perfil({ nome, email, senha }) {
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
  }

  console.log(conteudoPerfil);
  return (
    <>
      <Header />
      <div className="corpo-container">
        <div className={"opcoes"}>
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
        <div className="conteudo-principal">{conteudoPerfil}</div>
      </div>
    </>
  );
}
