import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  pegarRatosDoUsuario,
  pegarTodasClasses,
  pegarDescricaoHabilidades,
  pegarBatalhasIncrito,
  pegarBatalhasDisponiveis,
  ratoMorto,
} from "../../../Api/Api";
import Header from "../../../components/comuns/Header/Header";
import Botao from "../../../components/comuns/Botao";
import ModalCriacaoRato from "./meusRatos/modalRato/ModalCriacaoRato";
import ListaDeRatos from "./meusRatos/ListaDeRatos";
import ListaDeBatalhas from "./batalhas/ListaDeBatalhas";
import Ranking from "./ranking/Ranking";
import Loja from "./loja/Loja";
// 1. IMPORTAÇÃO NOVA: Precisamos importar a tela de resultado
import TelaHistorico from "../../perfil/TelaHistorico"; 

import "./HomeJogador.css";

const ETAPAS = {
  FECHADO: 0,
  SELECAO_CLASSE: 1,
  DETALHES_CLASSE: 2,
  RATO_CRIADO: 3,
};

export default function HomeJogador() {
  const { user } = useAuth();
  const listaBatalhasAntigas = useRef([]);
  
  // ---------------------------------------------------------
  // ESTADOS DE CONTROLE DO MODAL E SELEÇÃO
  // ---------------------------------------------------------
  const [etapaModal, setEtapaModal] = useState(ETAPAS.FECHADO);
  const [classeSelecionada, setClasseSelecionada] = useState(null);
  const [indexClasse, setIndexClasse] = useState(null);
  const [descHabilidade, setDescHabilidade] = useState(null);
  const [novoRato, setNovoRato] = useState(null);

  // 2. ESTADOS NOVOS: Controle do Modal de Resultado Automático
  const [mostrarResultadoBatalha, setMostrarResultadoBatalha] = useState(false);
  const [idBatalhaResultado, setIdBatalhaResultado] = useState(null);

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

        // Ordenação
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
        
        // ------------------------------------------------------------
        // LÓGICA DO VIGIA (MODIFICADA PARA ABRIR O HISTÓRICO)
        // ------------------------------------------------------------
        if (listaBatalhasAntigas.current.length > 0) {
          
          listaBatalhasAntigas.current.forEach((batalhaVelha) => {
            const batalhaNova = respostaBatalhasInscrito.data.find(
              (b) => (b.idBatalha || b.id) === (batalhaVelha.idBatalha || batalhaVelha.id)
            );

            if (batalhaNova && batalhaVelha.status !== "Concluida" && batalhaNova.status === "Concluida") {
               console.log("BATALHA ACABOU! ID:", batalhaNova.idBatalha);

               let meuRatoNaBatalha = null;
               if (batalhaNova.jogador1?.idUsuario === idUsuarioLogado) {
                   meuRatoNaBatalha = batalhaNova.rato1; 
               } 
               else if (batalhaNova.jogador2?.idUsuario === idUsuarioLogado) {
                   meuRatoNaBatalha = batalhaNova.rato2; 
               }

               if (meuRatoNaBatalha) {
                   
                  // Chama o modal para o mostrar o resultado
                   setIdBatalhaResultado(batalhaNova.idBatalha || batalhaNova.id);
                   setMostrarResultadoBatalha(true);
                   
                   
                   // LÓGICA DE MORTE
                   if (batalhaNova.vencedor?.idUsuario !== idUsuarioLogado) {
                       console.log("💀 DERROTA! Executando baixa do rato...");
                       ratoMorto(meuRatoNaBatalha.idRato || meuRatoNaBatalha.id);
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
    [idUsuarioLogado]
  );

  useEffect(() => {
    buscarDadosIniciais(false); 
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

  const definirRatoBatalha = (rato) => {
    localStorage.setItem("ratoSelecionado", JSON.stringify(rato));
    setRatoParaBatalhar(rato);
  };

  const fecharHistoricoAutomatico = () => {
    setMostrarResultadoBatalha(false);
    setIdBatalhaResultado(null);
    buscarDadosIniciais(false);
  };

  // ---------------------------------------------------------
  // RENDERIZAÇÃO
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