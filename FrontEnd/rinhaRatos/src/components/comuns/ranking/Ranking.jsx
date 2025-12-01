import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { ranking } from "../../../Api/Api";
import { getFotoUrlById } from "../../../pages/perfil/ModalOpcFotosPerfil";
import "./Ranking.css";

export default function Ranking() {
  const { user } = useAuth();

  const idUsuarioLogado = user ? user.idUsuario || user.id : null;

  // Estado Local: Armazena a lista ordenada de jogadores
  const [listaJogadores, setListaJogadores] = useState([]);

  // Estados de Controle de Interface
  const [loadingDados, setLoadingDados] = useState(true);
  const [erroDados, setErroDados] = useState(null);

  // ---------------------------------------------------------
  // BUSCA DE DADOS (CARREGAMENTO DO RANKING)
  // ---------------------------------------------------------

  // Fluxo de Tratamento de Erros:
  // 1. Inicia o loading visual.
  // 2. Tenta buscar os dados.
  // 3. Se der erro, salva a mensagem para mostrar ao usuário.
  // 4. Finally: Desliga o loading INDEPENDENTE do resultado (sucesso ou erro),
  // para não deixar a tela travada em "Carregando...".
  useEffect(() => {
    const buscarDadosIniciais = async () => {
      setLoadingDados(true);
      setErroDados(null);
      try {
        const respostaRanking = await ranking();
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
  // RENDERIZAÇÃO DA LISTA
  // ---------------------------------------------------------

  // Renderização Condicional:
  // Se a lista estiver vazia (length === 0), mostramos uma mensagem.

  // Renderização de Lista (.map):
  // O índice do map (index) é usado para calcular a posição no ranking (index + 1),
  // já que arrays começam em 0 (1º lugar = index 0).
  return (
    <>
      <h1 className="subTitulo">Batalhas Vencidas</h1>
      {loadingDados ? (
        <p className="msg-historico-vazio">Carregando ranking...</p>
      ) : erroDados ? (
        <p className="erro-mensagem">{erroDados}</p>
      ) : listaJogadores.length === 0 ? (
        <p className="msg-historico-vazio">Nenhum jogador no ranking ainda.</p>
      ) : (
        <div className="listaJogadores">
          {listaJogadores.map((jogador, index) => {
            const imgPerfil = getFotoUrlById(jogador.idFotoPerfil || 0);
            return (
              <div className="jogador" key={jogador.idUsuario || index}>
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
      )}
    </>
  );
}
