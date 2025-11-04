import imagensRato from "../../ImagensRato";
import "../../css/meusRatos/modalRato/ModalCriacaoRato.css";

export default function RatoCriado({ novoRato, onClose }) {
  const rato = JSON.parse(localStorage.getItem("ratoCriado")) || {};

  const classeToImage = {
    "Rato de Biblioteca": imagensRato[0],
    "Rato de Cassino": imagensRato[1],
    "Rato de Esgoto": imagensRato[2],
    "Rato de Fazenda": imagensRato[3],
    "Rato de Hospital": imagensRato[4],
    "Rato de Laboratório": imagensRato[5],
  };

  const stats = {
    strength: rato.strBase,
    agility: rato.agiBase,
    health: rato.hpsBase,
    intelligence: rato.intBase,
    defense: rato.defBase,
  };

  const imagemRato = classeToImage[rato.classe?.nomeClasse] || imagensRato[0];

  const handleClose = () => {
    localStorage.removeItem("ratoCriado");
    onClose();
  };

  return (
    <>
      <div className="titulo">Criação concluída!</div>

      <div className="imagemENome">
        <img src={imagemRato} alt={rato.classe?.nomeClasse} />
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
