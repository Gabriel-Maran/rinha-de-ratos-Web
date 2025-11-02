import { useState } from "react";
import imagensRato from "./ImagensRato";
import MouseCoin from "../assets/moedas/MouseCoin.svg";
import Input from "../components/Input";

export default function DetalhesDaClasse({ classe, onMostrar, indexClasse }) {
  /* let nomeRato; */ /* Parte que pega da api o nome default do id do rato*/
  let descRato;
  let habilidades;
  let descHabilidade;

  /* nomeRato = "Fedoroso"; */
  descRato =
    "Sobrevive nas sombras, usando lama e toxinas para corroer defesas; brutal e imprevisível.";
  habilidades = ["Leptospirose", "Nuvem de Lama", "Fedor Corrosivo"];
  descHabilidade = [
    "80% de chance de reduzir a DEF do alvo em 18% — efeito apenas nesta rodada. Falha: perde 4% do HP.",
    "78% de chance de reduzir a AGI do alvo em 20% — efeito apenas nesta rodada. Falha: perde 8% do PA apenas nesta rodada.",
    "75% de chance de causar dano direto igual a 8% do HP máximo do alvo (instantâneo). Falha: perde 6% da DEF apenas nesta rodada.",
  ];

  const [nomeRato, setNomeRato] = useState("Fedoroso");
  const [habilAtiva, setHabilAtiva] = useState(0);

  const handleBtnHabil = (index) => {
    setHabilAtiva(index - 1);
    console.log(habilAtiva);
    console.log(index);
  };

  return (
    <>
      <div className="titulo">{classe}</div>
      <div className="detalhes-conteudo">
        <div className="inputEFoto">
          <div className="nomeRato">
            <Input
              input={{
                type: "text",
                placeholder: nomeRato,
                maxLength: 15,
                onChange: (e) => setNomeRato(e.target.value),
              }}
            />
            <span className="simboloEditar">🖊</span>
          </div>
          <img src={imagensRato[indexClasse]} />
        </div>
        <div className="descRato">{descRato}</div>
        <p className="slctHabilidade">Selecione a habilidade:</p>
        <div className="opcoesHabilidade">
          {habilidades.map((habilidade, index) => (
            <button
              className={habilAtiva == index ? "btnAtivo" : ""}
              key={habilidade}
              onClick={() => handleBtnHabil(index + 1)}
            >
              {habilAtiva == index
                ? habilidades[index]
                : `Habilidade ${index + 1}`}
            </button>
          ))}
        </div>
        <div className="descHabilidade">{descHabilidade[habilAtiva]}</div>
        <div className="socorro">
          <button
            className="btnFinalizar"
            onClick={() =>
              onMostrar(classe, nomeRato, habilidades, habilAtiva, descHabilidade, )
            }
          >
            Finalizar
          </button>
          {/* <button onClick={() => console.log(classe, habilidades, habilAtiva, descHabilidade)}>aaaa</button> */}
          <div className="custo">
            <p>5</p>
            <img src={MouseCoin} />
          </div>
        </div>
      </div>
    </>
  );
}
