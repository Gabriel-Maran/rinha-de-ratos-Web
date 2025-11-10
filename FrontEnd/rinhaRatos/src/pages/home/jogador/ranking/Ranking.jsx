import { useState } from "react";
import RatoEsgoto from "../../../../assets/classeRatos/RatoEsgoto.png";
import "./Ranking.css";

export default function Ranking() {
  const [listaJogadores, setListaJogadores] = useState([]);
  const [nome, setNome] = useState("");
  const [vitorias, setVitorias] = useState(0);
  const [posicoes, setPosicoes] = useState(1);

  return (
    <>
      <h1 className="subTitulo">Batalhas Vencidas</h1>
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
          </div>
        ))}
      </div>
    </>
  );
}
