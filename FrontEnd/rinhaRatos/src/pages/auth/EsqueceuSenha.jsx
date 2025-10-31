import Botao from "../../components/Botao.jsx";
import "./auth.css"; 
import "./AuthForm.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo_Coliseu_dos_Ratos.svg";
import Input from "../../components/Input.jsx";

export default function EsqueceuSenha() {
  const navigate = useNavigate();
  const irLogin = () => {
    navigate("/login");
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
              placeholder: "E-mail",
            }}
          />
          <div className="input-senha">
            <Input
              input={{
                type: "text",
                placeholder: "Nova senha",
              }}
            />
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
