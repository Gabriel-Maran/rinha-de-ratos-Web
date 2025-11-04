import { useState } from "react";
import imagensRato from "../../ImagensRato.jsx"
import MouseCoin from "../../../assets/moedas/imgCoin.svg";
import Input from "../../comuns/Input.jsx";
import { ratosUsuario } from "../../../Api/Api.js";

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

  const [nomeRato, setNomeRato] = useState("Federoso");
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
      console.log("Cadastro OK!", resposta.data);

      localStorage.setItem("strBase", resposta.data.strBase);
      localStorage.setItem("agiBase", resposta.data.agiBase);
      localStorage.setItem("hpsBase", resposta.data.hpsBase);
      localStorage.setItem("intBase", resposta.data.intBase);
      localStorage.setItem("defBase", resposta.data.defBase);
     

      onMostrar(classe, nomeRato, habilidades, habilAtiva, descHabilidade);
    } catch (err) {
      console.error("Falha ao salvar rato:", err);
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
