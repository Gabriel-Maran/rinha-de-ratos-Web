import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fazerCadastro } from "../../Api/Api";
import Botao from "../../components/comuns/Botao";
import Input from "../../components/comuns/Input";
import Logo from "../../assets/Logo_Coliseu_dos_Ratos.svg";
import Icone_Olho_Aberto from "../../assets/icones/icone_olho_aberto.png";
import Icone_Olho_Fechado from "../../assets/icones/icone_olho_fechado.png";
import "./LogoEFundo.css";
import "./CaixaAcesso.css";

export default function Cadastro() {
  const navigate = useNavigate();
  const possuConta = () => {
    navigate("/login");
  };

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const tipoConta = "ADM";
  const mousecoinSaldo = 30;
  const vitorias = 0;

  const funMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const irLogin = async (evento) => {
    if (email === "" || email === "") {
      setErro("Preencha os campos necessários")
      return
    }
    evento.preventDefault();
    setErro(null);

    const dados = {
      nome,
      email,
      senha,
      tipoConta,
      mousecoinSaldo,
      vitorias,
    };

    try {
      await fazerCadastro(dados);
      console.log("Cadastro OK!");

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
          <h3>Cadastro</h3>
          {erro && <p className="mensagem-erro">{erro}</p>}
        </div>
        <div className="inputs">
          <Input
            input={{
              type: "text",
              value: nome,
              onChange: (e) => setNome(e.target.value),
              placeholder: "Nome de usuário",
            }}
          />
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
          acaoBtn={"Cadastrar"}
          button={{
            className: "botao",
            onClick: irLogin,
          }}
        />
        <Botao
          acaoBtn={"Já tenho conta"}
          button={{
            className: "btnVoltar",
            onClick: possuConta,
          }}
        />
      </div>
    </div>
  );
}
