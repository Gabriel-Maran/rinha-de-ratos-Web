import ImagensRato from "../../../../../components/ImagensRato";
import "./RatoCriado.css";

export default function RatoCriado({ onClose, novoRato, descHabilidade }) {
  
  // ---------------------------------------------------------
  // PREPARAÇÃO E SEGURANÇA DOS DADOS (DEFENSIVE PROGRAMMING)
  // ---------------------------------------------------------

  // Fallback de Objeto (|| {}):
  // Se 'novoRato' vier nulo ou undefined (por exemplo, num erro de carregamento),
  // definimos 'rato' como um objeto vazio {}. Isso impede que o código quebre
  // ao tentar acessar propriedades como 'rato.strBase' mais abaixo.
  const rato = novoRato || {};
  const textoDescricao = descHabilidade;

  // Mapeamento de Dados:
  // Criamos um objeto 'stats' para organizar os atributos vindos do Backend (strBase, agiBase)
  // em chaves mais legíveis para o Frontend. Isso centraliza a leitura e facilita
  // a manutenção caso o nome das colunas mude no banco de dados no futuro.
  const stats = {
    strength: rato.strBase,
    agility: rato.agiBase,
    health: rato.hpsBase,
    intelligence: rato.intBase,
    defense: rato.defBase,
  };

  const handleClose = () => {
    onClose();
  };

  // ---------------------------------------------------------
  // RENDERIZAÇÃO
  // ---------------------------------------------------------

  // 1. Título Condicional (Ternário):
  //    Este componente é híbrido. Ele serve tanto para mostrar "Criação concluída!" (após criar)
  //    quanto para ver "Detalhes do Rato" (ao clicar na lista).
  //    Usamos 'novoRato?.idRato' para saber se é um rato já existente ou um recém-criado.

  // 2. Image Lookup (ImagensRato[...] || ...):
  //    Busca a imagem pela chave da classe. Se falhar, usa o "Rato de Esgoto" como fallback.

  // 3. Optional Chaining (rato.classe?.nomeClasse):
  //    O '?' garante que, se 'rato.classe' for nulo, o código não trave tentando ler 'nomeClasse'.
  return (
    <>
      <div className="titulo">
        {novoRato?.idRato ? "Detalhes do Rato" : "Criação concluída!"}
      </div>
      <div className="imagemENome">
        <img
          src={
            ImagensRato[rato.classe?.nomeClasse] ||
            ImagensRato["Rato de Esgoto"]
          }
        />
        <p>{rato.nomeCustomizado}</p>
      </div>
      <div className="infoGeral">
        <div className="conteinerTitusEstHabil">
          <div className="caixaEstatisticas">
            <p className="titusEstHabil">Estatísticas Gerais</p>
            <p className="estatisticas">
              Força: {stats.strength} <br />
              Agilidade: {stats.agility} <br />
              Vida: {stats.health} <br />
              Inteligência: {stats.intelligence} <br />
              Defesa: {stats.defense}
            </p>
          </div>
          <div className="caixaHabilidadeEsc">
            <p className="titusEstHabil">{rato.habilidade?.nomeHabilidade}</p>
            <p className="descHabilEsc">
              {textoDescricao || "Descrição não encontrada."}
            </p>
          </div>
        </div>
      </div>
      <button className="btnFinalizar" onClick={onClose}>
        Ok
      </button>
    </>
  );
}