import { useState } from "react";
import RatoEsgoto from "../../assets/classeRatos/RatoEsgoto.png";
import "../../css/ranking/Ranking.css";

export default function Ranking() {
  const [listaJogadores, setListaJogadores] = useState([]);
  const [nome, setNome] = useState("");
  const [vitorias, setVitorias] = useState(0);
  const [posicoes, setPosicoes] = useState(1);

  const CadastrarJogador = () => {
    setPosicoes(posicoes + 1);
    const jogador = {
      id: Date.now(),
      posicao: posicoes,
      nome: nome,
      vitorias: vitorias,
    };

    setListaJogadores([...listaJogadores, jogador]);

    console.log(listaJogadores);

    setNome("");
    setVitorias(0);
  };
  return (
    <>
      <h1 className="subTitulo">Batalhas Vencidas</h1>
      <input
        type="text"
        value={nome}
        placeholder="Nome do jogador"
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        type="number"
        value={vitorias}
        placeholder="Vitórias"
        onChange={(e) => setVitorias(Number(e.target.value))}
      />
      <button onClick={CadastrarJogador}>Adicionar</button>
      <div className="listaJogadores">
        {listaJogadores.map((jogador) => (
          <div className="jogador" key={jogador.id}>
            <div className="posicaoJogador">
              <p>{jogador.posicao}º</p>
            </div>
            <img src={RatoEsgoto} />
            <div className="nomeEVitorias">
              <p className="nomeJogador">{jogador.nome}</p>
              <div className="vitorias">
                <p>{jogador.vitorias}</p>
              </div>
            </div>
            {/*                         <div className="infoJogador">
                            <p>{jogador.nome}</p>
                            <p>{jogador.vitorias}</p>
                        </div> */}
          </div>
        ))}
      </div>
    </>
  );
}
