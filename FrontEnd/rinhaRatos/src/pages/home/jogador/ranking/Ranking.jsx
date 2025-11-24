import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { ranking } from "../../../../Api/Api";
import { getFotoUrlById } from "../../../perfil/ModalOpcFotosPerfil";
import "./Ranking.css";

export default function Ranking() {
  const { user } = useAuth();
  const idUsuarioLogado = user ? user.idUsuario || user.id : null;

  const [listaJogadores, setListaJogadores] = useState([]);

  const [loadingDados, setLoadingDados] = useState(true);
  const [erroDados, setErroDados] = useState(null);

  useEffect(() => {
    if (!idUsuarioLogado) return;

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

  return (
    <>
      <h1 className="subTitulo">Batalhas Vencidas</h1>

      {listaJogadores.length === 0 ? (
        <p>Nenhum jogador no ranking ainda.</p>
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
