import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getFotoUrlById } from "../../perfil/ModalOpcFotosPerfil";
import { useNavigate } from "react-router-dom";
import {
  pegarBatalhasAbertas,
  iniciarBatlhas,
  ranking,
  verificarSeBatalhaCheia,
} from "../../../Api/Api";
import Header from "../../../components/comuns/Header/Header";
import trofeu from "../../../assets/icones/IconeTrofeu.png";
import ModalEditarBatalha from "./ModalEditarBatalha";
import ModalCriarBatalha from "./ModalCriarBatalha";
import "./HomeADM.css";
import "../jogador/HomeJogador.css";
import "../jogador/batalhas/ListaDeBatalhas";

export default function HomeADM() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [opcaoAtivada, setOpcaoAtivada] = useState("Batalhas");
  const botoes = ["Batalhas", "Ranking"];

  // Normalização de ID: Garante que o código funcione tanto se o backend retornar .id quanto .idUsuario.
  const idUsuarioLogado = user ? user.idUsuario || user.id : null;

  const [listaBatalhas, setListaBatalhas] = useState([]);
  const [listaJogadores, setListaJogadores] = useState([]);
  const [batalhaSendoEditada, setBatalhaSendoEditada] = useState();
  const [editarBatalha, setEditarBatalha] = useState(false);
  const [criarBatalha, setCriarBatalha] = useState(false);

  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [mensagemErro, setMensagemErro] = useState(null);

  const [loadingDados, setLoadingDados] = useState(true);
  const [erroDados, setErroDados] = useState(null);

  // ---------------------------------------------------------
  // PROTEÇÃO DE ROTA
  // ---------------------------------------------------------

  // Redirecionamento de Segurança:
  // Verifica se o usuário está logado E se ele é realmente um ADM.
  // Se for um jogador comum tentando acessar "/homeadm", ele é chutado de volta para o login.
  useEffect(() => {
    if (!idUsuarioLogado || user?.tipoConta?.toUpperCase() === "JOGADOR") {
      navigate("/login");
    }
  }, [idUsuarioLogado, user, navigate]);

  const limparMensagens = () => {
    setTimeout(() => {
      setMensagemSucesso(null);
      setMensagemErro(null);
    }, 1000);
  };

  // ---------------------------------------------------------
  // BUSCA DE DADOS INICIAIS (PARALELISMO)
  // ---------------------------------------------------------

  // Promise.all: Técnica de otimização de performance.
  // Em vez de esperar uma requisição terminar para começar a outra (Waterfall),
  // disparamos 'pegarBatalhasAbertas' e 'ranking' simultaneamente.
  // O código só continua quando AMBAS terminarem. Isso reduz o tempo total de carregamento pela metade.
  useEffect(() => {
    if (!idUsuarioLogado) return;

    const buscarDadosIniciais = async () => {
      setLoadingDados(true);
      setErroDados(null);
      try {
        const [respostaBatalhas, respostaRanking] = await Promise.all([
          pegarBatalhasAbertas(),
          ranking(),
        ]);

        setListaBatalhas(respostaBatalhas.data);
        setListaJogadores(respostaRanking.data);
      } catch (err) {
        console.error("Erro ao buscar dados iniciais:", err);
        setErroDados("Falha ao carregar dados. Tente atualizar a página.");
      } finally {
        setLoadingDados(false);
      }
    };

    buscarDadosIniciais();
  }, [idUsuarioLogado]);

  // ---------------------------------------------------------
  // CONTROLE DE MODAIS
  // ---------------------------------------------------------
  const CriacaoBatalha = () => {
    setCriarBatalha(true);
  };

  const EdicaoDeBatalha = (batalha) => {
    setEditarBatalha(true);
    setBatalhaSendoEditada(batalha);
  };

  const fecharModal = () => {
    setEditarBatalha(false);
    setCriarBatalha(false);
  };

  // ---------------------------------------------------------
  // LÓGICA DE INICIAR BATALHA (VALIDAÇÃO E EXCEÇÃO)
  // ---------------------------------------------------------

  // Validação via Fluxo de Exceção:
  // A função 'verificarSeBatalhaCheia' tem um comportamento específico:
  // - Se retornar sucesso (200), significa que a batalha NÃO está cheia (tem vagas) -> Erro para iniciar.
  // - Se retornar erro (409 Conflict), significa que a batalha ESTÁ cheia -> Sucesso para iniciar.

  // Atualização Otimista (setListaBatalhas filter):
  // Após o sucesso, removemos a batalha da lista visualmente sem precisar recarregar
  // todos os dados do servidor novamente.
  const IniciarBatalha = async (batalha) => {
    const idBatalha = batalha.idBatalha || batalha.id;

    setMensagemSucesso(null);
    setMensagemErro(null);

    try {
      try {
        await verificarSeBatalhaCheia(idBatalha);
        setMensagemErro("🚫 Jogadores insuficientes!");
        limparMensagens();
        return;
      } catch (errCheck) {
        if (errCheck.response && errCheck.response.status === 409) {
        } else {
          throw errCheck;
        }
      }

      await iniciarBatlhas(idBatalha);
      console.log(idBatalha);
      setMensagemSucesso("Batalha iniciada com sucesso!");
      limparMensagens();

      setListaBatalhas((antiga) =>
        antiga.filter((b) => b.idBatalha !== idBatalha)
      );
    } catch (err) {
      console.error(err);
      setMensagemErro(
        err?.response?.data?.message || "Erro ao iniciar batalha."
      );
      limparMensagens();
    }
  };

  // ---------------------------------------------------------
  // FORMATAÇÃO DE DADOS
  // ---------------------------------------------------------

  // Tratamento de String de Data:
  // Recebe formato ISO do banco e transforma manualmente em "DD/MM, HH:MM".
  // O bloco try/catch evita que a tela inteira quebre caso venha uma data inválida ("null" ou undefined).
  const formatarDataEHora = (data) => {
    if (!data) return "Data Indisponível";
    try {
      const [parteDaData, parteDaHora] = data.split("T");
      const [hora, minuto, segundo] = parteDaHora.split(":");
      const [ano, mes, dia] = parteDaData.split("-");
      return `${dia}/${mes}, ${hora}:${minuto}`;
    } catch (erro) {
      console.error("Erro ao formatar data:", erro);
      return data;
    }
  };

  // ---------------------------------------------------------
  // RENDERIZAÇÃO CONDICIONAL E SWITCH
  // ---------------------------------------------------------

  let conteudoHomeAdm;

  // Feedback de Carregamento:
  // Antes de mostrar o conteúdo, verificamos se os dados chegaram.
  if (loadingDados) {
    conteudoHomeAdm = <p className="loading-mensagem">Carregando...</p>;
  } else if (erroDados) {
    conteudoHomeAdm = <p className="erro-mensagem">{erroDados}</p>;
  } else {
    switch (opcaoAtivada) {
      case "Ranking":
        conteudoHomeAdm = (
          <>
            <h1 className="subTitulo">Batalhas Vencidas</h1>
            <div className="listaJogadores">
              {listaJogadores.map((jogador, index) => {
                const imgPerfil = getFotoUrlById(jogador.idFotoPerfil || 0);
                return (
                  <div className="jogador" key={jogador.idUsuario}>
                    <div className="posicaoJogador">
                      <p>{index + 1}º</p>
                    </div>
                    <img src={imgPerfil} alt={`Avatar de ${jogador.nome}`} />
                    <div className="nomeEVitorias">
                      <p className="nomeJogador">{jogador.nome}</p>
                      <div className="vitorias">
                        <p>{jogador.vitorias}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        );
        break;
      default:
        conteudoHomeAdm = (
          <>
            {criarBatalha && (
              <ModalCriarBatalha
                estadoModal={criarBatalha ? "bgModalAtivo" : "bgModal"}
                listaBatalhas={listaBatalhas}
                setListaBatalhas={setListaBatalhas}
                onClose={fecharModal}
              />
            )}
            {editarBatalha && (
              <ModalEditarBatalha
                estadoModal={editarBatalha ? "bgModalAtivo" : "bgModal"}
                onClose={fecharModal}
                batalhaSendoEditada={batalhaSendoEditada}
                setListaBatalhas={setListaBatalhas}
                listaBatalhas={listaBatalhas}
              />
            )}
            <button className="btnIniciarCriacao" onClick={CriacaoBatalha}>
              Criar Batalha
            </button>
            <div className="botaoBotELista">
              {mensagemSucesso && (
                <div className="msg-sucesso">{mensagemSucesso}</div>
              )}
              {mensagemErro && <div className="msg-erro">{mensagemErro}</div>}
              <div className="listaBatalhas">
                {listaBatalhas.map((batalha) => (
                  <div
                    className="batalha"
                    key={batalha.idBatalha || batalha.id}
                  >
                    <img src={trofeu} />
                    <div className="infoBatalha">
                      <p>{batalha.nomeBatalha}</p>
                      <p>Inscrição: {batalha.custoInscricao} MouseCoin</p>
                      <p>
                        Data e Hora:{" "}
                        {formatarDataEHora(batalha.dataHorarioInicio)}
                      </p>
                      <p>Prêmio: {batalha.premioTotal} MouseCoin</p>
                    </div>
                    <div className="acoesBatalhaADM">
                      <button
                        className="btnIniciarBatalha"
                        onClick={() => IniciarBatalha(batalha)}
                      >
                        Iniciar Batalha
                      </button>
                      <button
                        className="btnGerenciarBatalha"
                        onClick={() => EdicaoDeBatalha(batalha)}
                      >
                        Gerenciar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
    }
  }

  return (
    <>
      <Header home="home" />
      <div className="corpo-container">
        <div className={"opcoes"}>
          {botoes.map((botao) => (
            <button
              key={botao}
              className={opcaoAtivada === botao ? "opcaoAtiva" : "btnOpcao"}
              onClick={() => setOpcaoAtivada(botao)}
            >
              {botao}
            </button>
          ))}
        </div>
        <div className="conteudo-principal">{conteudoHomeAdm}</div>
      </div>
    </>
  );
}
