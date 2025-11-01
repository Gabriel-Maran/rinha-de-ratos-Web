import { useNavigate } from "react-router-dom";
import Input from "../../components/Input.jsx";
import Botao from "../../components/Botao.jsx";
import "./auth.css";
import "./AuthForm.css";
import logo from "../../assets/Logo_Coliseu_dos_Ratos.svg";
import { useState } from "react";
import { fazerLogin } from "../../Api/api.js";

export default function Login() {
  const navigate = useNavigate();

  const irCadastro = () => {
    navigate("/cadastro");
  };

  const irEsqueceuSenha = () => {
    navigate("/esqueceuSenha");
  };

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const nome = "";

  const funMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const irLogin = async (evento) => {
    // Impede que o navegador recarregue à página
    evento.preventDefault();

    const dados = { email, senha, nome };

    try {
      // Entrega o pacote de dados para a Api e espera o back
      const resposta = await fazerLogin(dados);

      console.log("Login OK!", resposta.data);

      localStorage.setItem("idUsuario", resposta.data.id);
      localStorage.setItem("tipoConta", resposta.data.tipo_conta);

      navigate("/home");
    } catch (err) {
      setErro(err?.response?.data?.message);
    }
  };

  return (
    <div className="acesso-container">
      <img src={logo} alt="logo chamada coliseu dos ratos" className="logo" />
      <div className="caixaLogin">
        <h3>Fazer login</h3>
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
                placeholder: "Senha",
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
          acaoBtn={"Esqueci a senha..."}
          button={{
            className: "resetSenha",
            onClick: irEsqueceuSenha,
          }}
        />

        <Botao
          acaoBtn={"Logar"}
          button={{
            className: "botao",
            onClick: irLogin,
          }}
        />

        <Botao
          acaoBtn={"Não possuo conta"}
          button={{
            className: "linkCadastro",
            onClick: irCadastro,
          }}
        />
      </div>
    </div>
  );
}
