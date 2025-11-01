import Botao from "../../components/Botao";
import Input from "../../components/Input";
import "./auth.css";
import "./AuthForm.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/Logo_Coliseu_dos_Ratos.svg";
import { fazerCadastro } from "../../Api/Api";

export default function Cadastro() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState(null);
  const tipoConta = "JOGADOR";
  const mousecoinSaldo = 30;
  const vitorias = 0;

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
      console.log("Login OK!", resposta.data);
 
      navigate("/login"); 
    } catch (err){

     setErro(err.response.data.message || "Erro...");
    }
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
                type: "password",
                value: senha,
                onChange: (e) => setSenha(e.target.value),
                placeholder: "Senha",
              }}
            />
            <span className="verSenha">👁</span>
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
            onClick: irLogin,
          }}
        />
      </div>
    </div>
  );
}
