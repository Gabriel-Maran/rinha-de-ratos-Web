import ImagensRato from "../../../../../components/ImagensRato";
import "./RatoCriado.css";

// Refatorado para receber props (Missão 4)
export default function RatoCriado({ onClose, novoRato, descHabilidade }) {
  
  // Lê das props, não do localStorage
  const rato = novoRato || {};
  const textoDescricao = descHabilidade;

  const stats = {
    strength: rato.strBase,
    agility: rato.agiBase,
    health: rato.hpsBase,
    intelligence: rato.intBase,
    defense: rato.defBase,
  };

  const handleClose = () => {
    // Limpeza do localStorage removida
    onClose();
  };

  return (
    <>
      <div className="titulo">Criação concluída!</div>

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

      <button className="btnFinalizar" onClick={handleClose}>
        Ok
      </button>
    </>
  );
}