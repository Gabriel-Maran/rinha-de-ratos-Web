import { useState } from "react";
import ImagensRato from "../../ImagensRato.jsx";
import MouseCoin from "../../../assets/moedas/imgCoin.svg";
import Input from "../../comuns/Input.jsx";
import { ratosUsuario } from "../../../Api/Api.js";

export default function DetalhesDaClasse({ classe, onMostrar, }) {
  console.log(classe)
  const [nomeRato, setNomeRato] = useState(classe.apelido);
  const [habilAtiva, setHabilAtiva] = useState(0);
  const [erro, setErro] = useState(null);

  const handleBtnHabil = (index) => setHabilAtiva(index);

  const salvarRato = async () => {
    const idUsuarioLogado = localStorage.getItem("idUsuario");


    const habilidadeSelecionada = classe.habilidades[habilAtiva];

    const dados = {
      idUsuario: idUsuarioLogado,
      nomeCustomizado: nomeRato,
      idHabilidade: habilidadeSelecionada.idHabilidade,
    };

    try {
      console.log("Enviando para API:", dados);
      const resposta = await ratosUsuario(dados);
      console.log("Cadastro OK!", resposta.data);


      localStorage.setItem("ratoCriado", JSON.stringify(resposta.data));
      console.log("DADOS DO RATO SALVO:", resposta.data);

      onMostrar(
        classe,
        nomeRato,
        classe.habilidades,
        habilAtiva,
        habilidadeSelecionada.descricao
      );
    } catch (err) {
      console.error("Falha ao salvar rato:", err);
      setErro(err?.response?.data?.message || "Erro ao salvar");
    }
  };

  return (
    <>
      <div className="titulo">{classe.nomeClasse}</div>

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

          <img src={ImagensRato[classe.nomeClasse] || ImagensRato["Rato de Esgoto"]} />

        </div>

        <div className="descRato">{classe.descricao}</div>

        <p className="slctHabilidade">Selecione a habilidade:</p>
        <div className="opcoesHabilidade">
          {classe.habilidades.map((habilidade, index) => (
            <button
              className={habilAtiva === index ? "btnAtivo" : ""}
              key={habilidade.idHabilidade}
              onClick={() => handleBtnHabil(index)}
            >
              {habilAtiva === index ? habilidade.nomeHabilidade : `Habilidade ${index + 1}`}
            </button>
          ))}
        </div>

        <div className="descHabilidade">{classe.habilidades[habilAtiva]?.nomeHabilidade}</div>

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
