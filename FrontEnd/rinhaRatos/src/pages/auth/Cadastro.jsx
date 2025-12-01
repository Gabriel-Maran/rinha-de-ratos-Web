import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fazerCadastro } from "../../Api/Api";
import Logo from "../../assets/Logo_Coliseu_dos_Ratos.svg";
import Icone_Olho_Aberto from "../../assets/icones/icone_olho_aberto.png";
import Icone_Olho_Fechado from "../../assets/icones/icone_olho_fechado.png";
import "./LogoEFundo.css";
import "./CaixaAcesso.css";
import "./CaixaCadastro.css";

export default function Cadastro() {
  const navigate = useNavigate();

  // ---------------------------------------------------------
  //  NAVEGAÇÃO
  // ---------------------------------------------------------

  // Função simples de redirecionamento de rota.
  // Utilizada quando o usuário clica em "Já tenho conta".

  // 1. navigate("/login"): Empurra a rota de login para o histórico do navegador.
  const possuConta = () => {
    navigate("/login");
  };

  // ---------------------------------------------------------
  //  ESTADOS DO FORMULÁRIO E VALORES PADRÃO
  // ---------------------------------------------------------

  // Definição dos estados que controlam os inputs 
  // e os valores fixos para novos jogadores.

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const tipoConta = "JOGADOR";
  const mousecoinSaldo = 30;
  const vitorias = 0;

  // ---------------------------------------------------------
  //  FUNÇÕES AUXILIARES E VISUAIS
  // ---------------------------------------------------------

  // Alternador de visibilidade para o campo de senha.

  // 1. Inverte o valor booleano atual de 'mostrarSenha'.
  // 2. Isso é usado no JSX para mudar o type do input entre "text" e "password".
  const funMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  // ---------------------------------------------------------
  //  REALIZAR CADASTRO (SUBMIT)
  // ---------------------------------------------------------

  // Função assíncrona que processa o envio do formulário para o Back-end.

  // 1. Validação: Verifica se os campos obrigatórios estão preenchidos antes de enviar.
  // 2. preventDefault(): Impede o comportamento padrão do HTML de recarregar a página.
  // 3. Payload: Cria o objeto 'dados' unindo os inputs do usuário com os valores padrão.
  // 4. API Call: Envia os dados e aguarda a resposta. Se sucesso, redireciona.
  // 5. Tratamento de Erro: Captura falhas (ex: email já existe) e exibe feedback visual.
  const realizarCadastro = async (evento) => {
    if (email === "" || senha === "" || nome === "") {
      setErro("Preencha os campos necessários");
      return;
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

  // ---------------------------------------------------------
  //  RENDERIZAÇÃO
  // ---------------------------------------------------------
  return (
    <div className="acesso-container">
      <div className="logoECadastro">
        <img src={Logo} alt="logo coliseu dos ratos" className="logo" />
        <div className="caixaLogin">
          <div className="tituloEErro">
            <h3>Cadastro</h3>
            {erro && <p className="mensagem-erro">{erro}</p>}
          </div>
          <div className="inputs">
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome de usuário"
              className="input-padrao"
            />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              className="input-padrao"
            />

            <div className="input-senha">
              <input
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha"
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
          <button className="botao" onClick={realizarCadastro}>
            Cadastrar
          </button>
          <button className="btnVoltar" onClick={possuConta}>
            Já tenho conta
          </button>
        </div>
      </div>
    </div>
  );
}