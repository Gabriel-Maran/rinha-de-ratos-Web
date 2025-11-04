import { useState } from "react";
import ImagensRato from "../../imagensRato";
import MouseCoin from "../../../assets/moedas/imgCoin.svg";
import Input from "../../comuns/Input.jsx";
import { ratosUsuario } from "../../../Api/Api.js";

export default function DetalhesDaClasse({ classe, onMostrar, indexClasse }) {
  let descRato =
    "Sobrevive nas sombras, usando lama e toxinas para corroer defesas; brutal e imprevisível.";

  const habilidades = ["Leptospirose", "Nuvem de Lama", "Fedor Corrosivo"];
  const descHabilidade = [
    "80% de chance de reduzir a DEF do alvo em 18% — efeito apenas nesta rodada. Falha: perde 4% do HP.",
    "78% de chance de reduzir a AGI do alvo em 20% — efeito apenas nesta rodada. Falha: perde 8% do PA apenas nesta rodada.",
    "75% de chance de causar dano direto igual a 8% do HP máximo do alvo (instantâneo). Falha: perde 6% da DEF apenas nesta rodada.",
  ];

  const [nomeRato, setNomeRato] = useState("Federoso");
  const [habilAtiva, setHabilAtiva] = useState(0);
  const [erro, setErro] = useState(null);

  const handleBtnHabil = (index) => setHabilAtiva(index);

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

    
      localStorage.setItem("ratoCriado", JSON.stringify(resposta.data));

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

          <img src={ImagensRato[indexClasse]} />
        </div>

        <div className="descRato">{descRato}</div>

        <p className="slctHabilidade">Selecione a habilidade:</p>
        <div className="opcoesHabilidade">
          {habilidades.map((habilidade, index) => (
            <button
              className={habilAtiva === index ? "btnAtivo" : ""}
              key={habilidade}
              onClick={() => handleBtnHabil(index)}
            >
              {habilAtiva === index ? habilidade : `Habilidade ${index + 1}`}
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

        {erro && <p className="erro">{erro}</p>}
      </div>
    </>
  );
}
