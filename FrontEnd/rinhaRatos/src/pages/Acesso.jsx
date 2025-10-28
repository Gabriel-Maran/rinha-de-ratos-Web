import CaixaAcesso from "../components/CaixaAcesso";
import Logo from "../assets/Logo_Coliseu_dos_Ratos.svg"
import { use, useState } from "react";
import '../css/Login.css';

export default function Login() {
  const [tela, setTela] = useState(0)
  const [titulo, setTitulo] = useState("Você é...")

  return (
    <>
      <div className="login-container">
        <img src={Logo} className="logo" />
        <div className="caixa">
          <CaixaAcesso
          tela = {tela}
          setTela = {setTela}
          titulo = {titulo}
          setTitulo = {setTitulo}
          />
        </div>
      </div>
    </>
  );
}
