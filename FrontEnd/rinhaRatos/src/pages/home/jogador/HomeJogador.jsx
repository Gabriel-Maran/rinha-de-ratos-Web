import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  pegarRatosDoUsuario,
  pegarTodasClasses,
  pegarDescricaoHabilidades,
  pegarBatalhasIncrito,
  pegarBatalhasDisponiveis,
  ratoMorto,
} from "../../../Api/Api";
import Header from "../../../components/comuns/Header/Header";
import ModalCriacaoRato from "./meusRatos/modalRato/ModalCriacaoRato";
import ListaDeRatos from "./meusRatos/ListaDeRatos";
import ListaDeBatalhas from "./batalhas/ListaDeBatalhas";
import Ranking from "../../../components/comuns/ranking/Ranking";
import Loja from "./loja/Loja";
import TelaHistorico from "../../../components/comuns/historico/TelaHistorico";
import "./HomeJogador.css";

const ETAPAS = {
  FECHADO: 0,
  SELECAO_CLASSE: 1,
  DETALHES_CLASSE: 2,
  RATO_CRIADO: 3,
};

export default function HomeJogador() {
  const { user, recarregarUsuario } = useAuth();

  const navigate = useNavigate();
  const listaBatalhasAntigas = useRef([]);

  const [etapaModal, setEtapaModal] = useState(ETAPAS.FECHADO);
  const [classeSelecionada, setClasseSelecionada] = useState(null);
  const [indexClasse, setIndexClasse] = useState(null);
  const [descHabilidade, setDescHabilidade] = useState(null);
  const [novoRato, setNovoRato] = useState(null);

  const [mostrarResultadoBatalha, setMostrarResultadoBatalha] = useState(false);
  const [idBatalhaResultado, setIdBatalhaResultado] = useState(null);

  const [ratosUsuario, setRatosUsuario] = useState([]);
  const [classes, setClasses] = useState(null);
  const [descricaoHabilidades, setDescHabilidades] = useState(null);

  const [batalhasAbertas, setBatalhasAbertas] = useState([]);
  const [batalhasInscrito, setBatalhasInscrito] = useState([]);

  const [loadingRatos, setLoadingRatos] = useState(true);
  const [erroRatos, setErroRatos] = useState(null);

  const [ratoParaBatalhar, setRatoParaBatalhar] = useState(null);
  const [opcaoAtivada, setOpcaoAtivada] = useState("Meus ratos");

  const idUsuarioLogado = user ? user.idUsuario || user.id : null;
  const qtdeMoedas = user?.mousecoinSaldo ?? 0;

  const botoes = ["Meus ratos", "Batalhas", "Ranking", "Loja"];
  const limiteRatos = 3;

  const ratosVivos = ratosUsuario.filter((rato) => rato.estaVivo);
  const contagemRatosVivos = ratosVivos.length;

  useEffect(() => {
    if (idUsuarioLogado === null) {
      navigate("/login");
    }
  }, [idUsuarioLogado, navigate]);

  const buscarDadosIniciais = useCallback(
    async (silencioso = false) => {
      if (!idUsuarioLogado) return;

      if (!silencioso) {
        setLoadingRatos(true);
        setErroRatos(null);
      }

      try {
        const [
          respostaRatos,
          respostaClasses,
          respostaHabilidades,
          respostaBatalhas,
          respostaBatalhasInscrito,
        ] = await Promise.all([
          pegarRatosDoUsuario(idUsuarioLogado),
          pegarTodasClasses(),
          pegarDescricaoHabilidades(),
          pegarBatalhasDisponiveis(idUsuarioLogado),
          pegarBatalhasIncrito(idUsuarioLogado),
        ]);

        setRatosUsuario(respostaRatos.data);
        setClasses(respostaClasses.data);
        setDescHabilidades(respostaHabilidades.data);
        setBatalhasInscrito(respostaBatalhasInscrito.data);

        if (Array.isArray(respostaBatalhas.data)) {
          const listaOrdenada = respostaBatalhas.data.sort((a, b) => {
            const idA = a.idBatalha || a.id;
            const idB = b.idBatalha || b.id;
            return idB - idA;
          });
          setBatalhasAbertas(listaOrdenada);
        } else {
          setBatalhasAbertas([]);
        }

        // --- LÓGICA DE FIM DE BATALHA ---
        if (listaBatalhasAntigas.current.length > 0) {
          listaBatalhasAntigas.current.forEach((batalhaVelha) => {
            const batalhaNova = respostaBatalhasInscrito.data.find(
              (b) =>
                (b.idBatalha || b.id) ===
                (batalhaVelha.idBatalha || batalhaVelha.id)
            );

            if (
              batalhaNova &&
              batalhaVelha.status !== "Concluida" &&
              batalhaNova.status === "Concluida"
            ) {
              let meuRatoNaBatalha = null;
              if (batalhaNova.jogador1?.idUsuario === idUsuarioLogado) {
                meuRatoNaBatalha = batalhaNova.rato1;
              } else if (batalhaNova.jogador2?.idUsuario === idUsuarioLogado) {
                meuRatoNaBatalha = batalhaNova.rato2;
              }

              if (meuRatoNaBatalha) {
                setIdBatalhaResultado(batalhaNova.idBatalha || batalhaNova.id);
                setMostrarResultadoBatalha(true);
                recarregarUsuario();

                const criadorIdRaw =
                  batalhaNova.admCriador?.idUsuario ??
                  batalhaNova.admCriador?.id;
                const criadorIdNum =
                  criadorIdRaw != null ? Number(criadorIdRaw) : null;
                const ehBatalhaContraBot =
                  !batalhaNova.admCriador || criadorIdNum === -1;

                if (ehBatalhaContraBot) {
                  console.log(
                    "🤖 Batalha contra Bot detectada: Morte desativada."
                  );
                } else {
                  const idVencedor = Number(
                    batalhaNova.vencedor?.idUsuario ??
                      batalhaNova.vencedorId ??
                      batalhaNova.vencedor?.id ??
                      batalhaNova.vencedor
                  );

                  if (
                    Number.isFinite(idVencedor) &&
                    idVencedor !== idUsuarioLogado
                  ) {
                    const ratoId =
                      meuRatoNaBatalha?.idRato ?? meuRatoNaBatalha?.id;
                    if (ratoId) {
                      ratoMorto(ratoId);
                      buscarDadosIniciais(true);
                    }
                  }
                }
              }
            }
          });
        }

        listaBatalhasAntigas.current = respostaBatalhasInscrito.data;
      } catch (err) {
        console.error("Erro ao buscar dados iniciais:", err);
        if (!silencioso) setErroRatos("Falha ao carregar dados.");
      } finally {
        if (!silencioso) setLoadingRatos(false);
      }
    },
    [idUsuarioLogado, recarregarUsuario]
  );

  useEffect(() => {
    buscarDadosIniciais(false);
    recarregarUsuario();
    const intervalo = setInterval(() => {
      buscarDadosIniciais(true);
      recarregarUsuario();
    }, 3000);

    return () => clearInterval(intervalo);
  }, [buscarDadosIniciais, recarregarUsuario]); //

  const handleAtualizarAposInscricao = async () => {
    await buscarDadosIniciais(false);
    await recarregarUsuario();
  };

  const mostrarSelecaoClasse = () => setEtapaModal(ETAPAS.SELECAO_CLASSE);
  const fecharModal = () => {
    setEtapaModal(ETAPAS.FECHADO);
    setClasseSelecionada(null);
    setIndexClasse(null);
    setNovoRato(null);
    setDescHabilidade(null);
  };
  const selecionarClasse = (classe, index) => {
    setEtapaModal(ETAPAS.DETALHES_CLASSE);
    setClasseSelecionada(classe);
    setIndexClasse(index);
  };
  const mostrarRatoCriado = (ratoCompletoDaApi, descHabilidadeDaClasse) => {
    setRatosUsuario((prevRatos) => [...prevRatos, ratoCompletoDaApi]);
    setNovoRato(ratoCompletoDaApi);
    setDescHabilidade(descHabilidadeDaClasse);
    setEtapaModal(ETAPAS.RATO_CRIADO);
  };
  const mostrarDetalhesRato = (ratoClicado) => {
    setNovoRato(ratoClicado);
    if (descricaoHabilidades && ratoClicado.habilidade) {
      const habilidadeEncontrada = descricaoHabilidades.find(
        (h) => h.nomeHabilidade === ratoClicado.habilidade.nomeHabilidade
      );
      setDescHabilidade(
        habilidadeEncontrada
          ? habilidadeEncontrada.descricao
          : "Descrição indisponível."
      );
    }
    setEtapaModal(ETAPAS.RATO_CRIADO);
  };
  const definirRatoBatalha = (rato) => {
    localStorage.setItem("ratoSelecionado", JSON.stringify(rato));
    setRatoParaBatalhar(rato);
  };
  const fecharHistoricoAutomatico = () => {
    setMostrarResultadoBatalha(false);
    setIdBatalhaResultado(null);
    buscarDadosIniciais(false);
    recarregarUsuario();
  };

  let conteudoCorpo;
  if (loadingRatos) {
    conteudoCorpo = <p className="loading-mensagem">A carregar dados...</p>;
  } else if (erroRatos) {
    conteudoCorpo = <p className="erro-mensagem">{erroRatos}</p>;
  } else {
    switch (opcaoAtivada) {
      case "Meus ratos":
       conteudoCorpo = (
          <>
            <ModalCriacaoRato
              etapa={etapaModal}
              etapas={ETAPAS}
              onClose={fecharModal}
              onSlctClasse={selecionarClasse}
              onMostrarRato={mostrarRatoCriado}
              classe={classeSelecionada}
              indexClasse={indexClasse}
              descHabilidade={descHabilidade}
              novoRato={novoRato}
              classes={classes}
              descricaoHabilidades={descricaoHabilidades}
              loadingModal={loadingRatos}
              erroModal={erroRatos}
            />
            <button
              className="addRato"
              onClick={mostrarSelecaoClasse}
              disabled={loadingRatos || contagemRatosVivos >= limiteRatos}
            >
              <strong>
                {contagemRatosVivos >= limiteRatos
                  ? "Limite Atingido"
                  : loadingRatos
                  ? "Carregando..."
                  : ".Adicionar Rato + "}
              </strong>
            </button>
            <ListaDeRatos
              ratosUsuario={ratosUsuario}
              onSelectRato={definirRatoBatalha}
              ratoSelecionado={ratoParaBatalhar}
              mostrarDetalhesRato={mostrarDetalhesRato}
            />
          </>
        );
        break;
      case "Batalhas":
        const inscricoesPendentes = batalhasInscrito.filter(
          (batalha) => batalha.status === "InscricoesAbertas"
        );
        conteudoCorpo = (
          <ListaDeBatalhas
            batalhasAbertas={batalhasAbertas}
            batalhasInscrito={inscricoesPendentes}
            ratosUsuario={ratosUsuario}
            idUsuarioLogado={idUsuarioLogado}
            onBatalhaInscrita={handleAtualizarAposInscricao}
          />
        );
        break;
      case "Ranking":
        conteudoCorpo = <Ranking />;
        break;
      case "Loja":
        conteudoCorpo = <Loja qtdeMoedas={qtdeMoedas} />;
        break;
    }
  }

  return (
    <>
      {mostrarResultadoBatalha && idBatalhaResultado && (
        <TelaHistorico
          onClose={fecharHistoricoAutomatico}
          mostrarHistorico={mostrarResultadoBatalha}
          idBatalha={idBatalhaResultado}
          usuarioLogado={user}
        />
      )}
      <Header home="home" qtdeMoedas={qtdeMoedas} />
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
        <div className="conteudo-principal">{conteudoCorpo}</div>
      </div>
    </>
  );
}