import { useNavigate } from "react-router-dom";
import Input from "../../components/Input.jsx";
import Botao from "../../components/Botao.jsx";
import "./auth.css"; 
import "./AuthForm.css";
import logo from "../../assets/Logo_Coliseu_dos_Ratos.svg";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    navigate("/home");
  };

  const irCadastro = () => {
    navigate("/cadastro");
  };

  const irEsqueceuSenha = () => {
    navigate("/esqueceuSenha");
  };
  return (
    <div className="acesso-container">
      <img src={logo} alt="logo chamada coliseu dos ratos" className="logo" />
      <div className="caixaLogin">
        <h3>Fazer login</h3>

        <div className="inputs">
          <Input input={{ type: "text", placeholder: "E-mail" }} />
          <div className="input-senha">
            <Input input={{ type: "password", placeholder: "Senha" }} />
            <span className="verSenha">👁</span>
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
            onClick: handleLogin,
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
