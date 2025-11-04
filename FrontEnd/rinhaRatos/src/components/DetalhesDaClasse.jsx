import { useState } from "react";
import imagensRato from "./ImagensRato";
import MouseCoin from "../assets/moedas/MouseCoin.svg";
import Input from "../components/Input";
import { ratosUsuario } from "../Api/api.js";

export default function DetalhesDaClasse({ classe, onMostrar, ratosUsuario }) {
  const [nomeRato, setNomeRato] = useState("Federoso");
  const [descRato, setDescRato] = useState("Sobrevive nas sombras, usando lama e toxinas para corroer defesas; brutal e imprevisível.")
  const [habilidades, setHabilidades] = useState(["Leptospirose", "Nuvem de Lama", "Fedor Corrosivo"])
  const [descHabilidades, setDescHabilidades] = useState(["80% de chance de reduzir a DEF do alvo em 18% — efeito apenas nesta rodada. Falha: perde 4% do HP.",
    "78% de chance de reduzir a AGI do alvo em 20% — efeito apenas nesta rodada. Falha: perde 8% do PA apenas nesta rodada.",
    "75% de chance de causar dano direto igual a 8% do HP máximo do alvo (instantâneo). Falha: perde 6% da DEF apenas nesta rodada.",])

  const [habilAtiva, setHabilAtiva] = useState(0);
  const [erro, setErro] = useState(null);

  const handleBtnHabil = (index) => {
    setHabilAtiva(index - 1);
    console.log(habilAtiva);
    console.log(index);
  };

  const salvarRato = async () => {
    const idUsuarioLogado = localStorage.getItem("idUsuario");

    const dados = {
      idUsuario: idUsuarioLogado,
      nomeCustomizado: nomeRato,
      nomeHabilidade: habilidades[habilAtiva],
    };
    try {
      const resposta = await ratosUsuario(dados);
      console.log("Rato Criado!", resposta.data);
      onMostrar(classe, nomeRato, habilidades, habilAtiva, descHabilidades);
    } catch (err) {
      onsole.error("Falha ao salvar rato:", err); // É bom logar o erro
      setErro(err?.response?.data?.message || "Erro ao salvar");
    }
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
          <img src={imagensRato[classe]} />
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
        <div className="descHabilidade">{descHabilidades[habilAtiva]}</div>
        <div className="socorro">
          <button className="btnFinalizar" onClick={salvarRato}>
            Finalizar
          </button>
          <div className="custo">
            <p>5</p>
            <img src={MouseCoin} />
          </div>
        </div>
      </div>
    </>
  );
}
