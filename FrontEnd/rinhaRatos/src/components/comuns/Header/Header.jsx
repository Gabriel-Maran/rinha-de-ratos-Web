import { useNavigate } from "react-router-dom";
import { useMoedas } from "../../../context/MoedasContext"; // 1. Importe o nosso hook
import RatoEsgoto from "../../../assets/classeRatos/RatoEsgoto.png";
import Logo from "../../../assets/Logo_Coliseu_dos_Ratos.svg";
import MouseCoin from "../../../assets/moedas/MouseCoin.png";
import "./Header.css";

// 2. Já não precisamos de 'qtdeMoedas' ou 'saldoMouseCoins' nas props
export default function Header({ home }) {
  // 3. Pedimos o valor das moedas diretamente ao Contexto
  const { qtdeMoedas } = useMoedas();

  const nomePlayer = localStorage.getItem("nome");

  const navigate = useNavigate();

  return (
    <>
      <div className="header">
        <div className="infoHeader">
          <img
            className="fotoJogador"
            onClick={() => navigate("/perfil")}
            src={RatoEsgoto}
          />
          <h1 onClick={() => navigate("/perfil")}>{nomePlayer}</h1>
          {home == "home" && (
            <div className="quantidadeMoedas">
              <img
                className="mouseCoin"
                src={MouseCoin}
                alt="mouseCoin a moeda utilizada em nosso jogo"
              />
              <h3>{qtdeMoedas}</h3>
            </div>
          )}
        </div>
        <img
          onClick={() => navigate(`/${home}`)}
          className="logoColiseu"
          src={Logo}
        />
      </div>
    </>
  );
}
