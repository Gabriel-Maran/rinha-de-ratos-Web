import FtPerfilPadrao from "../../assets/perfil/perfil-default.png";
import FtPerfil1 from "../../assets/perfil/perfil-homem-1.png";
import FtPerfil2 from "../../assets/perfil/perfil-homem-2.png";
import FtPerfil3 from "../../assets/perfil/perfil-homem-3.png";
import FtPerfil4 from "../../assets/perfil/perfil-homem-4.png";
import FtPerfil5 from "../../assets/perfil/perfil-homem-5.png";
import FtPerfil6 from "../../assets/perfil/perfil-mulher-1.png";
import FtPerfil7 from "../../assets/perfil/perfil-mulher-2.png";
import FtPerfil8 from "../../assets/perfil/perfil-mulher-3.png";
import FtPerfil9 from "../../assets/perfil/perfil-mulher-4.png";
import FtPerfil10 from "../../assets/perfil/perfil-mulher-5.png";
import "../home/jogador/HomeJogador.css";
import "./ModalOpcFotosPerfil.css";

export default function ModalOpcFoto({ modalAtivado, onClose }) {
  const listafotosPerfil = {
    1: FtPerfil1,
    2: FtPerfil2,
    3: FtPerfil3,
    4: FtPerfil4,
    5: FtPerfil5,
    6: FtPerfil6,
    7: FtPerfil7,
    8: FtPerfil8,
    9: FtPerfil9,
    10: FtPerfil10,
    0: FtPerfilPadrao,
  };

  return (
    <>
      <div className={modalAtivado ? "bgModalAtivo" : "bgModal"}>
        <div className="containerModal">
          <button className="sair" onClick={onClose}>
            ✖
          </button>
          <div className="listaFotosPerfil">
            {Object.values(listafotosPerfil).map((foto) => (
              <div className="fotoPerfil" key={foto}>
                <img src={foto} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
