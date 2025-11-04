import Botao from "../../components/comuns/Botao";
import Input from "../../components/comuns/Input";
import "./auth.css";
import "./AuthForm.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/Logo_Coliseu_dos_Ratos.svg";
import icone_olho_aberto from "../../assets/icones/icone_olho_aberto.png";
import icone_olho_fechado from "../../assets/icones/icone_olho_fechado.png";
import { fazerCadastro } from "../../Api/Api";

export default function Cadastro() {
  const navigate = useNavigate();
  const possuConta = () => {
    navigate("/login");
  };

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const tipoConta = "JOGADOR";
  const mousecoinSaldo = 30;
  const vitorias = 0;

  const funMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };
  const irLogin = async (evento) => {
    evento.preventDefault();

    const dados = {
      nome,
      email,
      senha,
      tipoConta,
      mousecoinSaldo,
      vitorias,
    };
    try {
      const resposta = await fazerCadastro(dados);
      console.log("Cadastro OK!", resposta.data);

      localStorage.setItem("idUsuario", resposta.data.idUsuario);
      localStorage.setItem("nome", resposta.data.nome);
      localStorage.setItem("email", resposta.data.email);
      localStorage.setItem("tipoConta", resposta.data.tipoConta);
      localStorage.setItem("mousecoinSaldo", resposta.data.mousecoinSaldo);
      localStorage.setItem("vitorias", resposta.data.vitorias);
      localStorage.setItem("ratos", JSON.stringify(resposta.data.ratos));

      navigate("/login");
    } catch (err) {
      setErro(err?.response?.data?.message || "Email ou senha inválidos.");
    }
  };

  return (
    <div className="acesso-container">
      <img src={logo} alt="logo chamada coliseu dos ratos" className="logo" />
      <div className="caixaLogin">
        <h3>Cadastro</h3>
        {erro && <p className="mensagem-erro">{erro}</p>}
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
