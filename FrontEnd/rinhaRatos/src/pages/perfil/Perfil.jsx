import { useLocation } from "react-router-dom";
import { useState } from "react";
import Trofeu from "../../assets/icones/IconeTrofeu.png";
import Header from "../../components/comuns/Header/Header";
import TelaHistorico from "./TelaHistorico";
import "./Perfil.css";

export default function Perfil({ qtdeMoedas }) {
  /* Deletar essas três linhas depois quando for fazer a junção com a API */
  const location = useLocation();
  const listaBatalhas = location.state?.listaBatalhas || [];
  let loginADM = false;
  /* -------------------------------------------------------------------- */

  const [opcaoAtivada, setOpcaoAtivada] = useState("Histórico de Batalhas");
  const botoes = ["Histórico de Batalhas", "Perfil"];

  const [nome, setNome] = useState("Joginhos");
  const [email, setEmail] = useState("Jorginhos@gmail.com");
  const [senha, setSenha] = useState("1234");

  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  const fecharHistorico = () =>{
    setMostrarHistorico(false)
  }

  let conteudoPerfil;

  switch (opcaoAtivada) {
    case "Perfil":
      conteudoPerfil = (
        <>
          <div className="dados">
            <p>Nome:</p>
            <input value={nome} onChange={(e) => setNome(e.target.value)} />
            <p>E-mail:</p>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
            <p>Senha:</p>
            <input value={senha} onChange={(e) => setSenha(e.target.value)} />
          </div>
          <button className="botaoSalvar">Salvar alterações</button>
        </>
      );
      break;
    default:
      conteudoPerfil = (
        <>
          {mostrarHistorico && <TelaHistorico onClose={fecharHistorico}/>}
          <div className="opcoesBatalhaFeita">
            <p>Vencedor: Jão</p>
            <button onClick={() => setMostrarHistorico(true)}>Histórico</button>
          </div>
          <div className="historicoBatalhas">
            {listaBatalhas.map((batalha) => (
              <div className="batalhaFeita" key={batalha.id}>
                <img src={Trofeu} />
                <div className="infoBatalhaFeita">
                  <p>{batalha.nome}</p>
                  <p>Inscrição: {batalha.custo} MouseCoin</p>
                  <p>Data e Hora: {batalha.dataEHora}</p>
                  <p>Prêmio: {batalha.premio} MouseCoin</p>
                </div>
              </div>
            ))}
          </div>
        </>
      );
  }

  return (
    <>
      <Header
        home={loginADM == true ? "homeadm" : "home"}
        qtdeMoedas={qtdeMoedas}
      />
      <div className="perfil-container">
        <div className={"opcoesPerfil"}>
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
        <div className="conteudo-perfil">{conteudoPerfil}</div>
      </div>
    </>
  );
}
