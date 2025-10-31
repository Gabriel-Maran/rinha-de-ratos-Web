import Botao from "../../components/Botao";
import Input from "../../components/Input";
import "./auth.css";
import "./AuthForm.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo_Coliseu_dos_Ratos.svg";

export default function Cadastro() {
  const navigate = useNavigate();

  const irLogin = () => {
    navigate("/login");
  };

  return (
    <div className="acesso-container">
      <img src={logo} alt="logo chamada coliseu dos ratos" className="logo" />
      <div className="caixaLogin">
        <h3>Cadastro</h3>
        <div className="inputs">
          <Input
            input={{
              type: "text",
              placeholder: "Nome de usuário",
            }}
          />
          <Input
            input={{
              type: "text",
              placeholder: "E-mail",
            }}
          />
          <div className="input-senha">
            <Input
              input={{
                type: "password",
                placeholder: "Senha",
              }}
            />
            <span className="verSenha">👁</span>
          </div>
        </div>
        <Botao acaoBtn={"Cadastrar"} button={{ 
            className: "botao",
            onClick: irLogin      
             }}
         />
        <Botao
          acaoBtn={"Já tenho conta"}
          button={{
            className: "btnVoltar",
            onClick: irLogin
          }}
        />
      </div>
    </div>
  );
}
