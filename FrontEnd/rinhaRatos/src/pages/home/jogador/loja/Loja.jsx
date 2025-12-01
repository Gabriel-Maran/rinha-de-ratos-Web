import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { compraPacote, pegarPacotes } from "../../../../Api/Api";
import PacotePequeno from "../../../../assets/moedas/MontePequenoMouseCoin.png";
import PacoteMedio from "../../../../assets/moedas/MonteMedioMouseCoin.png";
import PacoteGrande from "../../../../assets/moedas/MonteGrandeMouseCoin.png";
import "./Loja.css";

export default function Loja() {
  // ---------------------------------------------------------
  // CONTEXTO E ESTADO GLOBAL
  // ---------------------------------------------------------

  // useAuth(): Acesso ao "cofre" global de dados.
  // user: Dados atuais do jogador (incluindo saldo).
  // setUser: Função para atualizar esses dados sem precisar recarregar a página.
  // idUsuarioLogado: Lógica de segurança com operador de coalescência nula (??).
  // Se 'user' for nulo (não logado), define o ID como 0 para evitar quebras.
  const { user, setUser } = useAuth();
  const idUsuarioLogado = (user?.idUsuario || user?.id) ?? 0;

  // Estado Local: Armazena a lista de produtos (pacotes) vindos do Backend.
  const [pacotes, setPacotes] = useState([]);

  // ---------------------------------------------------------
  // BUSCA DE DADOS (CARREGAMENTO DA LOJA)
  // ---------------------------------------------------------

  // useEffect: Sincroniza o componente com o sistema externo (API).
  // Assim que o componente monta (ou se o 'user' mudar), ele busca os pacotes disponíveis.
  useEffect(() => {
    if (!user) return; 
    const fetchDados = async () => {
      try {
        const resposta = await pegarPacotes();
        setPacotes(resposta.data);
      } catch (err) {
        console.error("Erro ao buscar pacotes:", err);
      }
    };
    fetchDados();
  }, [user]);

  // ---------------------------------------------------------
  // COMPRA E ATUALIZAÇÃO DE SALDO (LÓGICA CRÍTICA)
  // ---------------------------------------------------------

  // Fluxo de Compra com Atualização Otimista (Manual):
  // 1. await compraPacote: Envia a transação para o Banco de Dados.
  // 2. Cálculo Local: Soma o saldo atual + a quantidade comprada imediatamente.
  // 3. setUser(Callback): Atualiza o Contexto Global manualmente.

  // Spread Operator (...userAntigo): É CRUCIAL. Ele copia todas as propriedades
  // do usuário (nome, email, foto, id) e sobrescreve APENAS o 'mousecoinSaldo'.
  // Sem isso seria apagado todos os outros dados do usuário da memória.
  const addValorNaConta = async (pacoteClicado) => {
    try {
      await compraPacote(pacoteClicado.idPacote, idUsuarioLogado);

      const novoSaldo = user.mousecoinSaldo + pacoteClicado.mousecoinQuantidade;

      setUser((userAntigo) => ({
        ...userAntigo,
        mousecoinSaldo: novoSaldo,
      }));
    } catch (err) {
      console.error("Erro ao comprar pacote:", err);
    }
  };

  // ---------------------------------------------------------
  // MAPEAMENTO DE IMAGENS
  // ---------------------------------------------------------

  // Estratégia de Dicionário: Em vez de usar vários 'if/else' dentro do HTML
  // para decidir qual imagem mostrar, criamos um objeto onde a CHAVE é a quantidade
  // e o VALOR é a imagem importada.
  const imagensPacotes = {
    15: PacotePequeno,
    30: PacoteMedio,
    60: PacoteGrande,
  };

  // ---------------------------------------------------------
  // RENDERIZAÇÃO
  // ---------------------------------------------------------

  // .map(): Transforma a lista de dados (pacotes) em elementos visuais (divs).
  // Fallback de Imagem (||): Se a quantidade do pacote não existir no dicionário 'imagensPacotes',
  // usa 'PacotePequeno' como padrão para não quebrar o layout.
  return (
    <>
      <h1 className="subTituloLoja">Compre aqui suas MouseCoin</h1>
      <div className="pacotesMoedas">
        {pacotes.map((pacote) => (
          <div
            key={pacote.idPacote}
            onClick={() => addValorNaConta(pacote)}
            className="pacote"
          >
            <p className="pacote-quantidade">{pacote.mousecoinQuantidade}</p>
            <div className="infoPacote">
              <img
                src={
                  imagensPacotes[pacote.mousecoinQuantidade] || PacotePequeno
                }
              />
              <div className="valor">R$ {pacote.precoBrl.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
