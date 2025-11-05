import Botao from "../../components/comuns/Botao";
import "./auth.css";
import "./AuthForm.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo_Coliseu_dos_Ratos.svg";
import icone_olho_aberto from "../../assets/icones/icone_olho_aberto.png";
import icone_olho_fechado from "../../assets/icones/icone_olho_fechado.png";
import Input from "../../components/comuns/Input";
import { trocarSenha } from "../../Api/Api";
import { useState } from "react";

export default function EsqueceuSenha() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const nome = "";

  const navigate = useNavigate();
  const lembreiSenha = () => {
    navigate("/login");
  };
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
      setErro(err?.response?.data?.message || "Erro ao conectar com o servidor.");
    }
  };
  return (
    <div className="acesso-container">
      <img src={logo} alt="logo chamada coliseu dos ratos" className="logo" />
      <div className="caixaLogin">
        <h3>Redefinição de senha</h3>

        {erro && <p className="mensagem-erro">{erro}</p>}

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
              {mostrarSenha ? (
                <img src={icone_olho_fechado} alt="icone de olho fechado" />
              ) : (
                <img src={icone_olho_aberto} alt="icone de olho fechado" />
              )}
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
            onClick: lembreiSenha,
          }}
        />
      </div>
    </div>
  );
}
