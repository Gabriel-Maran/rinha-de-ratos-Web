import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { esqueceuSenha } from "../../Api/Api";
import Botao from "../../components/comuns/Botao";
import Input from "../../components/comuns/Input";
import Logo from "../../assets/Logo_Coliseu_dos_Ratos.svg";
import Icone_Olho_Aberto from "../../assets/icones/icone_olho_aberto.png";
import Icone_Olho_Fechado from "../../assets/icones/icone_olho_fechado.png";
import "./LogoEFundo.css";
import "./CaixaAcesso.css";

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

  const redefinirSenha = async (evento) => {
    evento.preventDefault();
    if (email === "" || senha === "") {
      setErro("Preencha os campos necessários");
      return;
    }
    setErro(null);

    const dados = {
      email,
      senha,
      nome,
    };

    try {
      await esqueceuSenha(dados);
      console.log("Senha redefinida!");
      navigate("/login");
    } catch (err) {
      setErro(
        err?.response?.data?.message || "Erro ao conectar com o servidor."
      );
    }
  };

  return (
    <div className="acesso-container">
      <img src={Logo} alt="logo coliseu dos ratos" className="logo" />
      <div className="caixaLogin">
        <div className="tituloEErro">
          <h3>Redefinição de senha</h3>
          {erro && <p className="mensagem-erro">{erro}</p>}
        </div>
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
            <span className="verSenha" onClick={funMostrarSenha}>
              {mostrarSenha ? (
                <img src={Icone_Olho_Fechado} alt="icone de olho fechado" />
              ) : (
                <img src={Icone_Olho_Aberto} alt="icone de olho aberto" />
              )}
            </span>
          </div>
        </div>

        <Botao
          acaoBtn={"Redefinir"}
          button={{
            className: "botao",
            onClick: redefinirSenha,
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
