import { useState } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import { ratosUsuario } from "../../../../../Api/Api.js";
import ImagensRato from "../../../../../components/ImagensRato";
import MouseCoin from "../../../../../assets/moedas/MouseCoin.png";
import "./DetalhesDaClasse.css";

export default function DetalhesDaClasse({
  classe,
  onMostrar,
  descricaoHabilidades,
}) {
  // ---------------------------------------------------------
  // GERENCIAMENTO DE ESTADO LOCAL E GLOBAL
  // ---------------------------------------------------------

  // useAuth: Recupera o usuário para verificar saldo e
  // setUser para atualizar o saldo após a compra.
  const { user, setUser } = useAuth();

  // Estados locais para controlar o formulário de criação
  const [nomeRato, setNomeRato] = useState(classe.apelido);
  const [habilAtiva, setHabilAtiva] = useState(0);
  const [erro, setErro] = useState(null);

  // Função simples para atualizar o índice da habilidade selecionada
  const handleBtnHabil = (index) => setHabilAtiva(index);

  // ---------------------------------------------------------
  // LÓGICA DE DADOS DERIVADOS (LOOKUP)
  // ---------------------------------------------------------

  // Em vez de salvar a descrição inteira no estado, salvamos apenas o índice (habilAtiva).
  // A cada renderização, calculamos qual é a habilidade e buscamos a descrição correspondente
  // no array 'descricaoHabilidades' vindo das props.
  const habilidadeAtiva = classe.habilidades[habilAtiva];

  const descObj = descricaoHabilidades.find(
    (itemDesc) => itemDesc.idHabilidade === habilidadeAtiva.idHabilidade
  );
  const textoDescricao = descObj?.descricao;

  // ---------------------------------------------------------
  // FINALIZAR CRIAÇÃO (COMPRA)
  // ---------------------------------------------------------

  // Fluxo de Transação:
  // 1. Validação: Verifica se o usuário tem saldo antes de incomodar o servidor.
  // 2. Persistência: Chama a API (ratosUsuario) para salvar o novo rato no banco.
  // 3. Atualização Otimista: Subtrai o valor do Contexto Global (setUser) manualmente.
  //    Isso garante que o Header mostre o novo saldo imediatamente, sem precisar de F5 ou nova query.
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
      const resposta = await ratosUsuario(dados);
      console.log("Cadastro OK! (Resposta da API):", resposta.data);

      const ratoSalvo = resposta.data;

      const novoSaldo = user.mousecoinSaldo - 5;
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

  // ---------------------------------------------------------
  // RENDERIZAÇÃO
  // ---------------------------------------------------------

  // Input Controlado: O valor do input é ligado ao estado 'nomeRato'.
  // Image Fallback (||): Se a classe não tiver imagem específica, usa "Rato de Esgoto".
  // Map de Habilidades: Renderiza botões dinâmicos. O estilo "btnAtivo" depende da comparação do índice.
  return (
    <>
      <div className="titulo">{classe.nomeClasse}</div>
      <div className="detalhes-conteudo">
        <div className="inputEFoto">
          <div className="nomeRato">
            <input
              type="text"
              className="input-nome-rato"
              placeholder={nomeRato}
              maxLength={15}
              onChange={(e) => setNomeRato(e.target.value)}
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
