import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  trocarSenha,
  trocarFoto,
  pegarUsuarioPorId,
  buscarHistoricoSemBto,
  pegarBatalhasCriadas,
  baixarPdf,
  baixarPdfGeral,
} from "../../Api/Api";
import { useAuth } from "../../context/AuthContext";
import Trofeu from "../../assets/icones/IconeTrofeu.png";
import Header from "../../components/comuns/Header/Header";
import TelaHistorico from "../../components/comuns/historico/TelaHistorico";
import Icone_Olho_Aberto from "../../assets/icones/icone_olho_aberto.png";
import Icone_Olho_Fechado from "../../assets/icones/icone_olho_fechado.png";
import ModalOpcFoto, { getFotoUrlById } from "./ModalOpcFotosPerfil";
import "./Perfil.css";
import "../home/jogador/batalhas/ListaDeBatalhas.css";

export default function Perfil({ qtdeMoedas }) {
  const navigate = useNavigate();

  const [opcaoAtivada, setOpcaoAtivada] = useState("Histórico de Batalhas");
  const botoes = ["Histórico de Batalhas", "Perfil"];

  const { user, setUser } = useAuth();
  const idUsuarioLogado = user ? user.idUsuario || user.id : null;
  const loginADM = user?.tipoConta?.toUpperCase() === "ADM";

  // ---------------------------------------------------------
  // ESTADOS GERAIS (PERFIL)
  // ---------------------------------------------------------
  const [nome, setNome] = useState(user?.nome ?? "");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [fotoSelecionada, setFotoSelecionada] = useState(
    user?.idFotoPerfil || 1
  );
  const [modalOpcFoto, setModalOpcFoto] = useState(false);

  // ---------------------------------------------------------
  // ESTADOS DO HISTÓRICO
  // ---------------------------------------------------------
  const [historicoBatalhas, setHistoricoBatalhas] = useState([]);
  const [loadingHistorico, setLoadingHistorico] = useState(false);
  const [idBatalhaSelecionada, setIdBatalhaSelecionada] = useState(null);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  const fotoUrl = getFotoUrlById(fotoSelecionada);

  // ---------------------------------------------------------
  // CARREGAMENTO INICIAL E PROTEÇÃO DE ROTA
  // ---------------------------------------------------------

  // se não houver um ID de usuário válido (não logado),
  // ele redireciona imediatamente para a tela de login para proteger a rota.
  useEffect(() => {
    if (idUsuarioLogado === null) {
      navigate("/login");
    }
  }, [idUsuarioLogado, navigate]);

  // ---------------------------------------------------------
  // BUSCA DE DADOS (PERFIL OU HISTÓRICO)
  // ---------------------------------------------------------

  // Lógica Condicional de Busca:
  // 1. Se a aba "Perfil" estiver ativa, preenchemos os inputs com os dados do Contexto (user).
  // 2. Se a aba "Histórico" estiver ativa, decidimos qual API chamar baseados no tipo de conta (ADM ou JOGADOR).
  // Isso evita chamadas desnecessárias à API quando o usuário está apenas editando o perfil.
  useEffect(() => {
    if (!idUsuarioLogado) return;

    if (user && opcaoAtivada === "Perfil") {
      setEmail(user.email);
      setNome(user.nome);
      setFotoSelecionada(user.idFotoPerfil || 0);
    }

    if (opcaoAtivada === "Histórico de Batalhas") {
      if (user.tipoConta?.toUpperCase() === "JOGADOR") {
        const buscarHistorico = async () => {
          setLoadingHistorico(true);
          try {
            console.log("Buscando histórico para ID:", idUsuarioLogado);
            const resposta = await buscarHistoricoSemBto(idUsuarioLogado);
            console.log("Resposta Histórico:", resposta.data);

            if (Array.isArray(resposta.data)) {
              setHistoricoBatalhas(resposta.data);
            } else {
              setHistoricoBatalhas([]);
            }
          } catch (err) {
            console.error("Erro ao buscar histórico:", err);
            setHistoricoBatalhas([]);
          } finally {
            setLoadingHistorico(false);
          }
        };
        buscarHistorico();
      } else {
        // Lógica para ADM
        const buscarHistorico = async () => {
          setLoadingHistorico(true);
          try {
            const resposta = await pegarBatalhasCriadas(idUsuarioLogado);
            if (Array.isArray(resposta.data)) {
              setHistoricoBatalhas(resposta.data);
            } else {
              setHistoricoBatalhas([]);
            }
          } catch (err) {
            console.error("Erro ao buscar histórico:", err);
            setHistoricoBatalhas([]);
          } finally {
            setLoadingHistorico(false);
          }
        };
        buscarHistorico();
      }
    }
  }, [user, opcaoAtivada, idUsuarioLogado]);

  // ---------------------------------------------------------
  //  BAIXAR O HISTORICO ESPECÍFICO EM PDF
  // ---------------------------------------------------------

  // BLOB (Binary Large Object): Sem usar o blob, o axios tenta abrir o arquivo e ler como texto/json.
  // Com o blob, você diz para ele tratar os dados brutos como um arquivo binário e salvar na memória.

  // 1. window.URL.createObjectURL: Cria uma URL temporária apontando para o arquivo na memória RAM do navegador.
  // 2. document.createElement("a"): Cria um link de download invisível.
  // 3. setAttribute("download", ...): Define o nome que o arquivo terá ao ser salvo no PC do usuário.
  // 4. click(): Simula o clique do usuário para iniciar o download.
  const baixarHistoricoBatalha = async (idBatalha) => {
    setMensagemSucesso(null);
    setErro(null);
    try {
      const resposta = await baixarPdfGeral(idUsuarioLogado, idBatalha);

      const url = window.URL.createObjectURL(new Blob([resposta.data]));
      const link = document.createElement("a");
      link.href = url;

      link.setAttribute(
        "download",
        `Historico_Batalha_${idBatalha}_Usuario_${idUsuarioLogado}.pdf`
      );

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMensagemSucesso("Relatório baixado com sucesso!");
    } catch (err) {
      console.error(err);
      setErro("Erro ao baixar o PDF. Tente novamente.");
    }
  };

  // ---------------------------------------------------------
  //  BAIXAR RELATÓRIO GERAL EM PDF
  // ---------------------------------------------------------

  // Funciona exatamente como a função anterior, mas chama o endpoint que gera
  // um compilado de todas as batalhas do usuário, em vez de uma única batalha.
  const baixarHistoricoBatalhaGeral = async () => {
    setMensagemSucesso(null);
    setErro(null);
    try {
      const resposta = await baixarPdf(idUsuarioLogado);

      const url = window.URL.createObjectURL(new Blob([resposta.data]));
      const link = document.createElement("a");
      link.href = url;

      link.setAttribute(
        "download",
        `Historico_Batalhas_${idUsuarioLogado}.pdf`
      );

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMensagemSucesso("Relatório baixado com sucesso!");
    } catch (err) {
      console.error(err);
      setErro("Erro ao baixar o PDF. Tente novamente.");
    }
  };

  // ---------------------------------------------------------
  //  ATUALIZAR DADOS DO PERFIL
  // ---------------------------------------------------------

  // preventDefault(): Evita que o navegador recarregue a página (comportamento padrão de formulários HTML).
  // Contexto (setUser): Após salvar no banco de dados (API), é CRUCIAL atualizar o contexto global (setUser).
  // Isso garante que o Header e outros componentes reflitam as mudanças (ex: nova foto) sem precisar de F5.

  // 1. Atualiza dados textuais (senha, email, nome).
  // 2. Verifica se a foto mudou antes de enviar (economia de dados).
  // 3. Busca o usuário atualizado no Back e atualiza o Front.
  const senhaTrocada = async (evento) => {
    evento.preventDefault();
    setErro(null);
    setMensagemSucesso(null);

    const dados = { email, nome, senha };

    try {
      await trocarSenha(dados, idUsuarioLogado);

      if (fotoSelecionada !== user.idFotoPerfil) {
        await trocarFoto(idUsuarioLogado, fotoSelecionada);
      }

      const respostaUsuarioAtualizada = await pegarUsuarioPorId(
        idUsuarioLogado
      );
      setUser(respostaUsuarioAtualizada.data);

      setSenha("");
      setMensagemSucesso("Perfil alterado com sucesso!");
    } catch (err) {
      console.error(err);
      setErro(err?.response?.data?.message || "Erro ao salvar alterações.");
    }
  };

  // ---------------------------------------------------------
  //  LOGOUT 
  // ---------------------------------------------------------

  // Limpeza de Sessão:
  // 1. setUser(null): Limpa o estado global da aplicação.
  // 2. sessionStorage.removeItem: Remove o "cookie" do navegador para evitar login automático.
  // 3. navigate("/login"): Redireciona o usuário para a porta de entrada.
  const deslogar = () => {
    setUser(null);
    sessionStorage.removeItem("idUsuario");
    navigate("/login");
  };

  // ---------------------------------------------------------
  // FUNÇÕES AUXILIARES E VISUAIS
  // ---------------------------------------------------------

  // Alterna o estado booleano para trocar o tipo do input entre 'text' e 'password'
  const funMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const fecharModalOpcFoto = () => {
    setModalOpcFoto(false);
  };

  const handleFotoSelecionada = (id) => {
    setFotoSelecionada(id);
  };

  const abrirHistorico = (idBatalha) => {
    setIdBatalhaSelecionada(idBatalha);
    setMostrarHistorico(true);
  };

  const fecharHistorico = () => {
    setMostrarHistorico(false);
    setIdBatalhaSelecionada(null);
  };

  // Formatação de Data:
  // Recebe uma string ISO (2025-11-26T15:30:00) e a quebra usando .split("T") e .split("-").
  // Retorna uma string amigável no formato DD/MM, HH:MM.
  const formatarDataEHora = (data) => {
    if (!data) return "Data Indisponível";
    try {
      const [parteDaData, parteDaHora] = data.split("T");
      const [ano, mes, dia] = parteDaData.split("-");
      const horaMinuto = parteDaHora ? parteDaHora.substring(0, 5) : "";
      return `${dia}/${mes}, ${horaMinuto}`;
    } catch (erro) {
      return data;
    }
  };

  // Retorno Visual Condicional:
  // Verifica o ID do vencedor comparado ao usuário logado para retornar "Vitória" ou "Derrota".
  // Se ainda estiver em aberto, retorna o status da batalha.
  const getStatusVisual = (batalha) => {
    if (batalha.vencedor) {
      if (batalha.vencedor.idUsuario === idUsuarioLogado) return "Vitória 🏆";
      return "Derrota 💀";
    }
    if (batalha.status === "InscricoesAbertas") return "Aguardando";
    return "Em Andamento";
  };

  // ---------------------------------------------------------
  // RENDERIZAÇÃO
  // ---------------------------------------------------------
  let conteudoPerfil;

  switch (opcaoAtivada) {
    case "Perfil":
      conteudoPerfil = (
        <>
          {modalOpcFoto && (
            <ModalOpcFoto
              modalAtivado={modalOpcFoto}
              onClose={fecharModalOpcFoto}
              onSelectFoto={handleFotoSelecionada}
              fotoAtual={fotoSelecionada}
            />
          )}
          <h1 className="subtituloPerfil">Redefina suas informações</h1>
          <div className="dados">
            <button
              className="btnOpcFotoPerfil"
              onClick={() => setModalOpcFoto(true)}
            >
              <img className="perfil" src={fotoUrl} alt="Foto de Perfil" />
            </button>
            <p className="lblInfoPerfil">Nome:</p>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder=""
            />

            <p className="lblInfoPerfil">E-mail:</p>
            <input
              type="text"
              className="input-padrao"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
            />

            <p className="lblInfoPerfil">Nova Senha:</p>
            <div className="input-senha">
              <input
                type={mostrarSenha ? "text" : "password"}
                className="input-padrao"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Nova senha"
              />
              <span className="verSenhaRedefinida" onClick={funMostrarSenha}>
                {mostrarSenha ? (
                  <img src={Icone_Olho_Fechado} alt="icone de olho fechado" />
                ) : (
                  <img src={Icone_Olho_Aberto} alt="icone de olho aberto" />
                )}
              </span>
            </div>
            {erro && <p className="mensagem-erro">{erro}</p>}
            {mensagemSucesso && (
              <p className="mensagem-sucesso">{mensagemSucesso}</p>
            )}
            <div className="acoesPerfil">
              <button className="btnSalvar" onClick={senhaTrocada}>
                Salvar
              </button>
              <button className="btnDeslogar" onClick={deslogar}>
                Deslogar
              </button>
            </div>
          </div>
        </>
      );
      break;

    default:
      conteudoPerfil = (
        <>
          {mostrarHistorico && idBatalhaSelecionada && (
            <TelaHistorico
              onClose={fecharHistorico}
              mostrarHistorico={mostrarHistorico}
              idBatalha={idBatalhaSelecionada}
              usuarioLogado={user}
            />
          )}
          <div className="subTituloEBotaoRelatorio">
            {loginADM ? (
              <h1 className="subTituloBatalhas">Batalhas Criadas</h1>
            ) : (
              <h1 className="subTituloBatalhas">Batalhas Concluídas</h1>
            )}
            <button
              className="btnBaixarRelatorioGeral"
              onClick={baixarHistoricoBatalhaGeral}
            >
              Baixar Relatório Geral
            </button>
          </div>
          <div className="listaBatalhasPerfil">
            {loadingHistorico ? (
              <p className="msg-historico-vazio">Carregando batalhas...</p>
            ) : historicoBatalhas.length > 0 ? (
              historicoBatalhas.map((batalha) => (
                <div className="batalha" key={batalha.idBatalha}>
                  <img src={Trofeu} alt="Troféu" />
                  <div className="infoBatalha">
                    <p>{batalha.nomeBatalha}</p>
                    <p>Inscrição: {batalha.custoInscricao} MouseCoin</p>
                    <p>Data: {formatarDataEHora(batalha.dataHorarioInicio)}</p>
                    <p>Prêmio: {batalha.premioTotal} MouseCoin</p>

                    {loginADM ? (
                      <p></p>
                    ) : (
                      <p className="status-batalha-texto">
                        {getStatusVisual(batalha)}
                      </p>
                    )}
                  </div>
                  <div className="opcoesBatalhaPerfil">
                    <button
                      className="btnVerHistorico"
                      onClick={() => abrirHistorico(batalha.idBatalha)}
                    >
                      Ver Histórico
                    </button>
                    <button
                      className="btnBaixarRelatorio"
                      onClick={() => baixarHistoricoBatalha(batalha.idBatalha)}
                    >
                      Baixar Relatório
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="msg-historico-vazio">
                Você ainda não participou de batalhas.
              </p>
            )}
          </div>
        </>
      );
  }
  return (
    <>
      <Header
        home={loginADM == true ? "homeadm" : "home"}
        qtdeMoedas={qtdeMoedas}
      />
      <div className="perfil-container">
        <div className={"opcoesPerfil"}>
          {botoes.map((botao) => (
            <button
              key={botao}
              className={opcaoAtivada == botao ? "opcaoAtiva" : "btnOpcao"}
              onClick={() => setOpcaoAtivada(botao)}
            >
              {botao}
            </button>
          ))}
        </div>
        <div className="conteudo-perfil">{conteudoPerfil}</div>
      </div>
    </>
  );
}
