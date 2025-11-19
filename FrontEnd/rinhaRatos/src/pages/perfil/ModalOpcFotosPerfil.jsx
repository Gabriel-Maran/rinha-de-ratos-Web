import { useState } from 'react';
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

export default function ModalOpcFoto({ modalAtivado, onClose, onSelectFoto }) {
  const listafotosPerfil = {
    1: {
      id: 1,
      img: FtPerfil1,
      selecionada: false
    },
    2: {
      id: 2,
      img: FtPerfil2,
      selecionada: false
    },
    3: {
      id: 3,
      img: FtPerfil3,
      selecionada: false
    },
    4: {
      id: 4,
      img: FtPerfil4,
      selecionada: false
    },
    5: {
      id: 5,
      img: FtPerfil5,
      selecionada: false
    },
    6: {
      id: 6,
      img: FtPerfil6,
      selecionada: false
    },
    7: {
      id: 7,
      img: FtPerfil7,
      selecionada: false
    },
    8: {
      id: 8,
      img: FtPerfil8,
      selecionada: false
    },
    9: {
      id: 9,
      img: FtPerfil9,
      selecionada: false
    },
    10: {
      id: 10,
      img: FtPerfil10,
      selecionada: false
    },
    0: {
      id: 0,
      img: FtPerfilPadrao,
      selecionada: true
    },
  };

  const [fotos, setfotos] = useState(listafotosPerfil)
  
  const handleClickFoto = (fotoClicada) => {
    const novasFotos = {}
    Object.keys(fotos).map((chave) => {
      const fotoAtual = fotos[chave];
      const taSelecionada = (fotoAtual.id === fotoClicada.id)

      novasFotos[chave] = {
        ...fotoAtual,
        selecionada: taSelecionada
      }
    })
    setfotos(novasFotos)
    
    onSelectFoto(fotoClicada.id, fotoClicada.img);                    
  }

  return (
    <>
      <div className={modalAtivado ? "bgModalAtivo" : "bgModal"}>
        <div className="containerModalFotos">
          <button className="sair" onClick={onClose}>
            ✖
          </button>
          <div className="titModalOpcFoto">Selecione uma foto de perfil</div>
          <div className="listaFotosPerfil">
            {Object.values(fotos).map((foto) => (
              <div className={foto.selecionada === true ? "fotoPerfilSelc" : "fotoPerfil"}
                key={foto.id} 
                onClick={() => handleClickFoto(foto)}>
                <img src={foto.img} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export const FOTOS_PERFIL_MAP = {
  0: FtPerfilPadrao,
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
};

// Função auxiliar para obter a URL da foto, usando o ID e garantindo o fallback
export const getFotoUrlById = (id) => {
      return FOTOS_PERFIL_MAP[id] || FOTOS_PERFIL_MAP[0];
};