// ARQUIVO: ModalOpcFotosPerfil.jsx
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

// Lista estática apenas com dados, sem estado "selecionada"
const LISTA_FOTOS = [
  { id: 0, img: FtPerfilPadrao },
  { id: 1, img: FtPerfil1 },
  { id: 2, img: FtPerfil2 },
  { id: 3, img: FtPerfil3 },
  { id: 4, img: FtPerfil4 },
  { id: 5, img: FtPerfil5 },
  { id: 6, img: FtPerfil6 },
  { id: 7, img: FtPerfil7 },
  { id: 8, img: FtPerfil8 },
  { id: 9, img: FtPerfil9 },
  { id: 10, img: FtPerfil10 },
];

// ATENÇÃO: Recebendo 'fotoAtual' nas props
export default function ModalOpcFoto({ modalAtivado, onClose, onSelectFoto, fotoAtual }) {
  
  if (!modalAtivado) return null;

  // Se fotoAtual for nulo ou indefinido, usa 0 (o rato) como fallback
  const idFotoSegura = fotoAtual ?? 0;

  return (
    <div className="bgModalAtivo">
      <div className="containerModalFotos">
        <button className="sair" onClick={onClose}>
          ✖
        </button>
        <div className="titModalOpcFoto">Selecione uma foto de perfil</div>
        
        <div className="listaFotosPerfil">
          {LISTA_FOTOS.map((foto) => {
            // A MÁGICA: Verifica se o ID desta foto é igual ao ID que veio do Pai
            const estaSelecionada = foto.id === idFotoSegura;
            
            return (
              <div 
                key={foto.id}
                // O CSS vai pintar de verde baseado nessa classe
                className={estaSelecionada ? "fotoPerfilSelc" : "fotoPerfil"}
                onClick={() => onSelectFoto(foto.id)}
              >
                <img src={foto.img} alt={`Foto de perfil ${foto.id}`} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Helpers (mantidos para compatibilidade com seu código existente)
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

export const getFotoUrlById = (id) => {
  return FOTOS_PERFIL_MAP[id] || FOTOS_PERFIL_MAP[0];
};