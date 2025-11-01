import imagensRato from "./ImagensRato";
import "../css/Modal.css";
export default function RatoCriado({ indexClasse, onClose }) {
  let nomeRato;
  let habilEscolhida;
  let descHabilEscolhida;

  nomeRato = "Roberto Almeida";
  habilEscolhida = "Leptospirose";
  descHabilEscolhida =
    "80% de chance de reduzir a DEF do alvo em 18% — efeito apenas nesta rodada. Falha: perde 4% do HP.";
  return (
    <>
      <div className="titulo">Criação concluída!</div>
      <div className="imagemENome">
        <img src={imagensRato[indexClasse]} />
        <p>{nomeRato}</p>
      </div>
      <div className="infoGeral">
        <div className="conteinerTitusEstHabil">
          <div className="caixaEstatisticas">
            <p className="titusEstHabil">Estatísticas Gerais</p>
            <p className="estatisticas">
              Força: {}
              <br />
              Agilidade: {}
              <br />
              Vida: {}
              <br />
              Inteligência: {}
              <br />
              Defesa: {}
            </p>
          </div>
          <div className="caixaHabilidadeEsc">
            <p className="titusEstHabil">{habilEscolhida}</p>
            <p className="descHabilEsc">{descHabilEscolhida}</p>
          </div>
        </div>
      </div>
      <button className="btnFinalizar" onClick={onClose}>Ok</button>
    </>
  );
}
