import imagensRato from "../../ImagensRato";
import "../../css/meusRatos/modalRato/ModalCriacaoRato.css";

export default function RatoCriado({ novoRato, onClose }) {
  const rato = JSON.parse(localStorage.getItem("ratoCriado")) || {};

  const stats = {
    strength: rato.strBase,
    agility: rato.agiBase,
    health: rato.hpsBase,
    intelligence: rato.intBase,
    defense: rato.defBase,
  };

  const handleClose = () => {
    localStorage.removeItem("ratoCriado");
    onClose();
  };

  return (
    <>
      <div className="titulo">Criação concluída!</div>

      <div className="imagemENome">
        <img src={imagensRato[(rato.classe?.idClasse || 1) - 1]} />
        <p>{rato.nomeCustomizado}</p>
      </div>

      <div className="infoGeral">
        <div className="conteinerTitusEstHabil">
          <div className="caixaEstatisticas">
            <p className="titusEstHabil">Estatísticas Gerais</p>
            <p className="estatisticas">
              Força: {stats.strength}
              <br />
              Agilidade: {stats.agility}
              <br />
              Vida: {stats.health}
              <br />
              Inteligência: {stats.intelligence}
              <br />
              Defesa: {stats.defense}
            </p>
          </div>

          <div className="caixaHabilidadeEsc">
            <p className="titusEstHabil">{rato.habilidade?.nomeHabilidade}</p>
            <p className="descHabilEsc">{novoRato.descHabilidadeEsc}</p>
          </div>
        </div>
      </div>

      <button className="btnFinalizar" onClick={handleClose}>
        Ok
      </button>
    </>
  );
}
