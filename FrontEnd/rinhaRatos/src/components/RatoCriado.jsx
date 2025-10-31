import imagensRato from "./ImagensRato";
import "../css/Modal.css";
export default function RatoCriado({ indexClasse }) {
  let nomeRato;
  let habilEscolhida;
  let descHabilEscolhida;

  nomeRato = "Roberto Almeida";
  habilEscolhida = "Leptospirose"
  descHabilEscolhida = "80% de chance de reduzir a DEF do alvo em 18% — efeito apenas nesta rodada. Falha: perde 4% do HP."
  return (
    <>
      <div className="titulo">
        Criação concluída!
      </div>
      <div className="imagemENome"><img src={imagensRato[indexClasse]} /><p>{nomeRato}</p></div>
      <div className="infoGeral">
        <p>Geral</p>
        <div className="geralzao">
          <div className="estatisticas">
            <p>Estatísticas Gerais</p>
            <p>Força: { }
              <br/>Agilidade: { }
              <br/>Vida: { }
              <br/>Inteligência: { }
              <br/>Defesa: { }
            </p>
          </div>
          <div className="habilidade">
            <p>{habilEscolhida}</p>
            <p>{descHabilEscolhida}</p>
          </div>
        </div>
      </div>
      <button className="btnFinalizar">Ok</button>
    </>
  );
}
