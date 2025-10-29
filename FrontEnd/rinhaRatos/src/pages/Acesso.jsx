import React from "react";
import Botao from "../components/Botao.jsx";
import '../css/Acesso.css';
import { useNavigate } from "react-router-dom";

export default function Acesso() {
   const navigate = useNavigate();

   const irLogin = (e) => {
    navigate("/login"); 
  };

  return (
    <>
       <div className="caixaLogin">
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
              </div >
    </>
  );
}
