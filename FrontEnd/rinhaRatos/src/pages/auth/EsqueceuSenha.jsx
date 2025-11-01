import Botao from "../../components/Botao.jsx";
import "./auth.css";
import "./AuthForm.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo_Coliseu_dos_Ratos.svg";
import Input from "../../components/Input.jsx";
import { trocarSenha } from "../../Api/api.js";
import { useState } from "react";

export default function EsqueceuSenha() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const nome = "";

  const navigate = useNavigate();


  const funMostrarSenha = () => {
  setMostrarSenha(!mostrarSenha);
  };

  const irLogin = async (evento) => {
    evento.preventDefault();
    const dados = {
      email,
      senha,
      nome,
    };

    try {
      const resposta = await trocarSenha(dados);
      console.log("Login OK!", resposta.data);
      navigate("/login");
    } catch (err) {
      setErro(err?.response?.data?.message || "Email ou senha inválidos.");
    }
  };
  return (
    <div className="acesso-container">
      <img src={logo} alt="logo chamada coliseu dos ratos" className="logo" />
      <div className="caixaLogin">
        <h3>Redefinição de senha</h3>
        <div className="inputs">
          <Input
            input={{
              type: "text",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: "E-mail",
            }}
          />
          <div className="input-senha">
            <Input
              input={{
                type: mostrarSenha ? "text" : "password",
                value: senha,
                onChange: (e) => setSenha(e.target.value),
                placeholder: "Nova Senha",
              }}
            />
            <span
              className="verSenha"
              onClick={(e) => funMostrarSenha(e.target.value)}
            >
              {mostrarSenha ? "🙈" : "👁"}
            </span>
          </div>
        </div>

        <Botao
          acaoBtn={"Redefinir"}
          button={{
            className: "botao",
            onClick: irLogin,
          }}
        />
        <Botao
          acaoBtn={"Lembrei kkkkk"}
          button={{
            className: "btnVoltar",
            onClick: irLogin,
          }}
        />
      </div>
    </div>
  );
}
