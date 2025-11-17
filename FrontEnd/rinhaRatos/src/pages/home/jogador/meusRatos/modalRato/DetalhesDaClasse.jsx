import { useState } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import { ratosUsuario } from "../../../../../Api/Api.js";
import ImagensRato from "../../../../../components/ImagensRato";
import MouseCoin from "../../../../../assets/moedas/MouseCoin.png";
import Input from "../../../../../components/comuns/Input";
import "./DetalhesDaClasse.css";

export default function DetalhesDaClasse({
  classe,
  onMostrar,
  descricaoHabilidades,
}) {
  const [nomeRato, setNomeRato] = useState(classe.apelido);
  const [habilAtiva, setHabilAtiva] = useState(0);
  const [erro, setErro] = useState(null);
  const {user, setUser } = useAuth();
  const handleBtnHabil = (index) => setHabilAtiva(index);
  const habilidadeAtiva = classe.habilidades[habilAtiva];
  
  
  const descObj = descricaoHabilidades.find(
    (itemDesc) => itemDesc.idHabilidade === habilidadeAtiva.idHabilidade
  );
  const textoDescricao = descObj?.descricao;
  
  const salvarRato = async () => {
    const custoRato = 5;

    if (user.mousecoinSaldo < custoRato) {
      setErro("Moedas insuficientes para criar o rato.");
      return;
    }


    const idUsuarioLogado = user.idUsuario || user.id;
    const habilidadeSelecionada = classe.habilidades[habilAtiva];


    const dados = {
      idUsuario: idUsuarioLogado,
      nomeCustomizado: nomeRato,
      idHabilidade: habilidadeSelecionada.idHabilidade,
    };

    try {
      console.log("Enviando para API:", dados);
      const resposta = await ratosUsuario(dados);
      console.log("Cadastro OK! (Resposta da API):", resposta.data);

      const ratoSalvo = resposta.data;

      const novoSaldo = user.mousecoinSaldo - 5;

      // ATUALIZA o 'user' no AuthContext globalmente
      setUser((prevUser) => ({
        ...prevUser,
        mousecoinSaldo: novoSaldo,
      }));

      onMostrar(ratoSalvo, textoDescricao);
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

          <img
            src={
              ImagensRato[classe.nomeClasse] || ImagensRato["Rato de Esgoto"]
            }
          />
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
              {habilAtiva === index
                ? habilidade.nomeHabilidade
                : `Habilidade ${index + 1}`}
            </button>
          ))}
        </div>

        <div className="descHabilidade">
          {textoDescricao || "Descrição não encontrada."}
        </div>

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
