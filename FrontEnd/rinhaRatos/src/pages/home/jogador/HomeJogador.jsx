import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  pegarRatosDoUsuario,
  pegarTodasClasses,
  pegarDescricaoHabilidades,
  pegarBatalhasIncrito,
  pegarBatalhasDisponiveis,
} from "../../../Api/Api";
import Header from "../../../components/comuns/Header/Header";
import Botao from "../../../components/comuns/Botao";
import ModalCriacaoRato from "./meusRatos/modalRato/ModalCriacaoRato";
import ListaDeRatos from "./meusRatos/ListaDeRatos";
import ListaDeBatalhas from "./batalhas/ListaDeBatalhas";
import Ranking from "./ranking/Ranking";
import Loja from "./loja/Loja";
import "./HomeJogador.css";

// Objeto constante para controlar as "fases" do Modal de criação/visualização.
const ETAPAS = {
  FECHADO: 0,
  SELECAO_CLASSE: 1,
  DETALHES_CLASSE: 2,
  RATO_CRIADO: 3,
};

export default function HomeJogador() {
  const { user } = useAuth();

  // ---------------------------------------------------------
  // ESTADOS DE CONTROLE DO MODAL E SELEÇÃO
  // ---------------------------------------------------------
  const [etapaModal, setEtapaModal] = useState(ETAPAS.FECHADO);
  const [classeSelecionada, setClasseSelecionada] = useState(null);
  const [indexClasse, setIndexClasse] = useState(null);
  const [descHabilidade, setDescHabilidade] = useState(null);
  const [novoRato, setNovoRato] = useState(null);

  // ---------------------------------------------------------
  // ESTADOS DE DADOS VINDOS DA API
  // ---------------------------------------------------------
  const [ratosUsuario, setRatosUsuario] = useState([]);
  const [classes, setClasses] = useState(null);
  const [descricaoHabilidades, setDescHabilidades] = useState(null);

  const [batalhasAbertas, setBatalhasAbertas] = useState([]);
  const [batalhasInscrito, setBatalhasInscrito] = useState([]);

  // ---------------------------------------------------------
  // ESTADOS DE UI E CARREGAMENTO
  // ---------------------------------------------------------
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

  // ---------------------------------------------------------
  // BUSCA DE DADOS (CARREGAMENTO INICIAL E ATUALIZAÇÃO)
  // ---------------------------------------------------------

  // useCallback garante que a função não seja recriada a cada renderização,
  // evitando loops infinitos no useEffect.
  const buscarDadosIniciais = useCallback(
    async (silencioso = false) => {
      if (!idUsuarioLogado) return;

      if (!silencioso) {
        setLoadingRatos(true);
        setErroRatos(null);
      }

      try {
        // Promise.all executa todas as requisições em paralelo.
        // O código só continua quando TODAS responderem.
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

        // Lógica de Ordenação:
        // Ordena as batalhas disponíveis de forma decrescente pelo ID.
        // (ID Maior - ID Menor) faz com que as batalhas mais novas apareçam no topo.
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
      } catch (err) {
        console.error("Erro ao buscar dados iniciais:", err);
        if (!silencioso) setErroRatos("Falha ao carregar dados.");
      } finally {
        if (!silencioso) setLoadingRatos(false);
      }
    },
    [idUsuarioLogado]
  );

  useEffect(() => {
    // Busca inicial com loading visual
    buscarDadosIniciais(false); 

    // Cria um intervalo (Polling) para atualizar os dados a cada 3 segundos
    // sem mostrar o loading (silencioso), mantendo a lista sempre atualizada.
    const intervalo = setInterval(() => {
      buscarDadosIniciais(true);
    }, 3000);

    return () => clearInterval(intervalo);
  }, [buscarDadosIniciais]);

  // ---------------------------------------------------------
  // FUNÇÕES DE CONTROLE DO MODAL
  // ---------------------------------------------------------
  const mostrarSelecaoClasse = () => {
    setEtapaModal(ETAPAS.SELECAO_CLASSE);
  };

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

    // Procura a descrição da habilidade correspondente na lista carregada
    if (descricaoHabilidades && ratoClicado.habilidade) {
      const habilidadeEncontrada = descricaoHabilidades.find(
        (h) => h.nomeHabilidade === ratoClicado.habilidade.nomeHabilidade
      );
      const desc = habilidadeEncontrada
        ? habilidadeEncontrada.descricao
        : "Descrição indisponível.";
      setDescHabilidade(desc);
    }

    setEtapaModal(ETAPAS.RATO_CRIADO);
  };

  // Salva o rato selecionado no LocalStorage para persistência durante a navegação
  const definirRatoBatalha = (rato) => {
    localStorage.setItem("ratoSelecionado", JSON.stringify(rato));
    setRatoParaBatalhar(rato);
  };

  // ---------------------------------------------------------
  // RENDERIZAÇÃO CONDICIONAL (SWITCH DE ABAS)
  // ---------------------------------------------------------
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
            {/* Componente Modal que gerencia todas as etapas de criação/visualização */}
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

            <ListaDeRatos
              ratosUsuario={ratosUsuario}
              onSelectRato={definirRatoBatalha}
              ratoSelecionado={ratoParaBatalhar}
              mostrarDetalhesRato={mostrarDetalhesRato}
            />
            <Botao
              button={{
                className: "addRato",
                onClick: mostrarSelecaoClasse,
                disabled: loadingRatos || contagemRatosVivos >= limiteRatos,
              }}
              acaoBtn={
                <strong>
                  {contagemRatosVivos >= limiteRatos
                    ? "Limite Atingido"
                    : loadingRatos
                    ? "Carregando..."
                    : ".Adicionar Rato + "}
                </strong>
              }
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
            onBatalhaInscrita={() => buscarDadosIniciais(false)}
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