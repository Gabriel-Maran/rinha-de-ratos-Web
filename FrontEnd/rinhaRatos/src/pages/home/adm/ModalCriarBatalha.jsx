import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { criarBatalha } from "../../../Api/Api";
import "./ModalCriarBatalha.css";
import "./ModalEditarBatalha.css";

export default function ModalCriarBatalhas({
  estadoModal,
  listaBatalhas,
  setListaBatalhas,
  onClose,
}) {
  const { user } = useAuth();
  const [erro, setErro] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState(null);

  const [nomeBatalha, setNomeBatalha] = useState("");
  const [dataHorarioInicio, setDataHorarioInicio] = useState("");
  const [custoInscricao, setCustoInscricao] = useState(0);

  const CadastrarBatalha = async () => {
    if (nomeBatalha === "" || custoInscricao <= 0 || dataHorarioInicio === "") {
      setErro("Por favor, preencha todos os campos corretamente.");
      return;
    }
    setErro(null);
    setMensagemSucesso(null); 
    const idAdmCriador = user.idUsuario || user.id;

    const dados = {
      nomeBatalha,
      dataHorarioInicio,
      idAdmCriador,
      custoInscricao,
    };

    try {
      const resposta = await criarBatalha(dados);
      setMensagemSucesso(
        resposta.data.message || "Batalha criada com sucesso!"
      );

      const novaBatalha = resposta.data;
      console.log("Batalha Criada!", novaBatalha);
      setListaBatalhas([ novaBatalha, ...listaBatalhas]);
      
      onClose();
    } catch (err) {
      setErro(
        err?.response?.data?.message || "Erro ao conectar com o servidor."
      );
    }
  };

  return (
    <>
      <div className={estadoModal}>
        <div className="containerModal">
          <button className="sair" onClick={onClose}>
            ✖
          </button>
          <h1 className="tituloAba">Criação da Batalha</h1>

          {erro && <p className="mensagem-erro-batalha">{erro}</p>}
          {mensagemSucesso && (
            <p className="mensagem-sucesso-batalha">{mensagemSucesso}</p>
          )}

          <div className="criarBatalha">
            <div>
              <h3>Nome</h3>
              <input
                type="text"
                value={nomeBatalha}
                onChange={(e) => setNomeBatalha(e.target.value)}
              />
            </div>
            <div>
              <h3>Inscrição</h3>
              <input
                type="number"
                value={custoInscricao}
                onChange={(e) => setCustoInscricao(Number(e.target.value))}
              />
            </div>
            <div>
              <h3>Data e Hora de Início</h3>
              <input
                type="datetime-local"
                value={dataHorarioInicio}
                onChange={(e) => setDataHorarioInicio(e.target.value)}
              />
            </div>
          </div>
          <button className="btnCriarBatalha" onClick={CadastrarBatalha}>
            Criar
          </button>
        </div>
      </div>
    </>
  );
}
