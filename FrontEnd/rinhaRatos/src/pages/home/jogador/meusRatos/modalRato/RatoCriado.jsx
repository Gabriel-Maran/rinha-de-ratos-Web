import ImagensRato from "../../../../../components/ImagensRato";
import "./ModalCriacaoRato.css";

export default function RatoCriado({onClose}) {

  const rato = JSON.parse(localStorage.getItem("ratoCriado")) || {};
  const textoDescricao = localStorage.getItem("descricaoRatoCriado");


  const stats = {
    strength: rato.strBase,
    agility: rato.agiBase,
    health: rato.hpsBase,
    intelligence: rato.intBase,
    defense: rato.defBase,
  };


  const handleClose = () => {
    localStorage.removeItem("ratoCriado");
    localStorage.removeItem("descricaoRatoCriado");
    onClose();
  };

  return (
    <>
      <div className="titulo">Criação concluída!</div>

      <div className="imagemENome">

      
<img src={ImagensRato[rato.classe?.nomeClasse] || ImagensRato["Rato de Esgoto"]} /> 
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
            <p className="descHabilEsc">{textoDescricao || "Descrição não encontrada."}</p>
          </div>
        </div>
      </div>

      <button className="btnFinalizar" onClick={handleClose}>
        Ok
      </button>
    </>
  );
}