import RatoEsgoto from "../assets/classeRatos/RatoEsgoto.png";
import Input from "../components/Input"
import "../css/SelcClassRato.css";

export default function DetalhesDaClasse({ classe, onConfirmar }) {

  let nomeRato;/* Parte que pega da api o nome default do id do rato*/
  let descRato;

  nomeRato = "Fedoroso"
  descRato = "O rato de esgoto é um sobrevivente nato das profundezas urbanas — pequeno, ágil e astuto. Com pelos úmidos e olhar desconfiado, ele percorre túneis e sombras em busca de restos e oportunidades, adaptando-se a qualquer ambiente. É o verdadeiro símbolo da resistência silenciosa no submundo das cidades."

  return (
    <>
      <div className="titulo">
        <h1>{classe}</h1>
      </div>
      <div className="detalhes-conteudo">
        <Input
          input={{
            type: "text",
            placeholder: nomeRato
          }}
        />
        <div className="descEFoto">
          <img src={RatoEsgoto} />
          <div className="desc"><p>{descRato}</p>
          </div>
        </div>
        {/* Adicionar um botão de Voltar e Confirmar */}
        <button onClick={onConfirmar}>Confirmar</button>
      </div>
    </>
  );
};