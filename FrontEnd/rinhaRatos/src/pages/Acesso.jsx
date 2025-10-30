import React from "react";
import Botao from "../components/Botao.jsx";
import '../css/Acesso.css';
import { useNavigate } from "react-router-dom";
import logo from '../assets/Logo_Coliseu_dos_Ratos.svg'

export default function Acesso() {
  const navigate = useNavigate();

  const irLogin = () => {
    navigate("/login");
  };

  return (
    <div className="acesso-container">
      <img src={logo} alt="logo chamada coliseu dos ratos"  className="log"/>
      <div className="caixa"> 
        <h3>Você é...</h3>

        <Botao
          acaoBtn={"Jogador/ADM"}
          button={{
            className: "acesso", 
            onClick: irLogin
          }}
        />

        <Botao
          acaoBtn={"Convidado"}
          button={{ className: "acesso" }}
        />
      </div>
    </div>
  );
}
