import { useNavigate } from "react-router-dom";
import Botao from "../../components/comuns/Botao";
import Logo from "../../assets/Logo_Coliseu_dos_Ratos.svg";
import "./LogoEFundo.css";
import "./Acesso.css";

export default function Acesso() {
  const navigate = useNavigate();

  const irLogin = () => {
    navigate("/login");
  };

  const irHomeConvidado = () => {
    navigate("/homeConvidado");
  };

  return (
    <div className="acesso-container">
      <div className="logoEAcesso">
        <img src={Logo} alt="logo coliseu dos ratos" className="logo" />
        <div className="caixa">
          <h3>Você é...</h3>
          <Botao
            acaoBtn={"Jogador/ADM"}
            button={{
              className: "acesso",
              onClick: irLogin,
            }}
          />
          <Botao
            acaoBtn={"Convidado"}
            button={{ className: "acesso", onClick: irHomeConvidado }}
          />
        </div>
      </div>
    </div>
  );
}
