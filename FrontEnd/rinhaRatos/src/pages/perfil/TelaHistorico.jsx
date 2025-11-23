import { useState, useEffect } from "react";
import { buscarHistorico } from "../../Api/Api";
import { useAuth } from "../../context/AuthContext";
import RE from "../../assets/classeRatos/RatoEsgoto.png";
import ImgVitoria from "../../assets/icones/IconeVitoria.png";
import ImgDerrota from "../../assets/icones/IconeDerrota.png";
import "../../pages/perfil/TelaHistorico.css";

export default function TelaHistorico({
  onClose,
  mostrarHistorico,
  idBatalha,
  dadosBatalhaBot,
}) {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  // Inicialize com null, pois ID geralmente não é array
  const [idVencedor, setIdVencedor] = useState(null); 
  const [loading, setLoading] = useState(true);

  const idUsuarioLogado = user?.idUsuario || user?.id;

  useEffect(() => {
    // Se não mostrar, nem busca. Economiza recurso.
    if (!mostrarHistorico) return;

    const carregarDados = async () => {
      const idFinal = dadosBatalhaBot || idBatalha;
      if (!idFinal) return;

      setLoading(true);
      try {
        const resposta = await buscarHistorico(idFinal);
        const dados = resposta.data;

        // O Backend retorna [ [logs...], [resultado...] ]
        if (Array.isArray(dados) && dados.length >= 2) {
          setLogs(dados[0]);
          // Assumindo que o ID do vencedor vem na estrutura do segundo array ou na raiz
          // Ajuste o caminho abaixo conforme seu backend exato (ex: dados[1][0].id_vencedor)
          const infoResultado = dados[1][0]; 
          setIdVencedor(infoResultado?.id_vencedor || resposta.data.id_vencedor);
        }
      } catch (err) {
        console.error("Erro ao carregar histórico:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [idBatalha, dadosBatalhaBot, mostrarHistorico]);

  if (!mostrarHistorico) return null;

  // Lógica Derivada (Calculada a cada renderização, fora do useEffect)
  const vitoria = idVencedor === idUsuarioLogado;
  const imagemBanner = vitoria ? ImgVitoria : ImgDerrota;
  const mensagemResultado = vitoria ? "Vitória!" : "Derrota!";

  return (
    <div className="bgEscuroOn">
      <div className="modalResultado">
        <button className="fecharMdResultado" onClick={onClose}>✖</button>

        {loading ? (
          <h2 className="loadingResultado">Carregando resultado...</h2>
        ) : (
          <>
            <h1 className="tituloResultado">Resultado da Batalha:</h1>

            <div className="area-banner-central">
              <img src={imagemBanner} alt="Resultado" className="img-banner-final" />
              <h2 className="texto-resultado-final">{mensagemResultado}</h2>
            </div>

            <div className="historicoBatalha">
              <h3>Histórico</h3>
              <div className="bgConteinerHist">
                <div className="conteinerHistorico">
                  {logs.length > 0 ? (
                    logs.map((log, index) => {
                      const isPlayer1 = log.player === 1;
                      return (
                        <div
                          className={isPlayer1 ? "regHistEsq" : "regHistDir"}
                          key={log.idmessage || index}
                        >
                          {isPlayer1 && <img className="imgEsquerda" src={RE} alt="rato" />}
                          <p><strong>Round {log.round}:</strong> {log.descricao}</p>
                          {!isPlayer1 && <img className="imgDireita" src={RE} alt="rato" />}
                        </div>
                      );
                    })
                  ) : (
                    <p className="nenhumRegistro">Nenhum registro de combate.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}