import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { esqueceuSenha } from "../../Api/Api";
import Logo from "../../assets/Logo_Coliseu_dos_Ratos.svg";
import Icone_Olho_Aberto from "../../assets/icones/icone_olho_aberto.png";
import Icone_Olho_Fechado from "../../assets/icones/icone_olho_fechado.png";
import "./LogoEFundo.css";
import "./CaixaAcesso.css";

export default function EsqueceuSenha() {
  // ---------------------------------------------------------
  //  ESTADOS DO FORMULÁRIO E VARIÁVEIS
  // ---------------------------------------------------------

  // Definição dos estados para controlar os inputs e feedback visual.
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const nome = "";

  const navigate = useNavigate();

  // ---------------------------------------------------------
  //  NAVEGAÇÃO
  // ---------------------------------------------------------

  // Função de redirecionamento para o caso de o usuário lembrar a senha.

  // 1. navigate("/login"): Redireciona de volta para a tela de autenticação.
  const lembreiSenha = () => {
    navigate("/login");
  };

  // ---------------------------------------------------------
  //  FUNÇÕES AUXILIARES E VISUAIS
  // ---------------------------------------------------------

  // Alternador de visibilidade para o campo de nova senha.

  // 1. Inverte o valor de 'mostrarSenha' para alternar o type do input
  //    entre 'text' (visível) e 'password' (oculto).
  const funMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  // ---------------------------------------------------------
  //  REDEFINIR SENHA (SUBMIT)
  // ---------------------------------------------------------

  // Função assíncrona que envia a solicitação de troca de senha para o servidor.

  // 1. Validação: Checa se campos estão vazios antes de prosseguir.
  // 2. preventDefault(): Evita o recarregamento da página.
  // 3. Payload: Monta o objeto com email, a nova senha e o nome (vazio).
  // 4. API Call: Chama 'esqueceuSenha'. Se sucesso, redireciona ao login.
  // 5. Tratamento de Erro: Exibe feedback caso a conta não exista ou haja falha no servidor.
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

  // ---------------------------------------------------------
  //  RENDERIZAÇÃO
  // ---------------------------------------------------------
  return (
    <div className="acesso-container">
      <div className="logoELogin">
        <img src={Logo} alt="logo coliseu dos ratos" className="logo" />
        <div className="caixaLogin">
          <div className="tituloEErro">
            <h3>Redefinição de senha</h3>
            {erro && <p className="mensagem-erro">{erro}</p>}
          </div>
          <div className="inputs">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
            />

            <div className="input-senha">
              <input
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Nova Senha"
                className="input-padrao"
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
          <button className="botao" onClick={redefinirSenha}>
            Redefinir
          </button>

          <button className="btnVoltar" onClick={lembreiSenha}>
            Lembrei kkkkk
          </button>
        </div>
      </div>
    </div>
  );
}