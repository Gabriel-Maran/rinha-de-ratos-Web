import { useState } from "react";
import { criarBatalha } from "../../../Api/Api";
import "./ModalCriarBatalha.css";
import "./ModalEditarBatalha.css";

export default function ModalCriarBatalhas({
  estadoModal,
  nomeBatalha,
  custoInscricao,
  dataHora,
  listaBatalhas,
  setNomeBatalha,
  setCustoInscricao,
  setDataHora,
  setListaBatalhas,
  onClose,
}) {
  const [erro, setErro] = useState(null);

  const CadastrarBatalha = async () => {
    if (nomeBatalha === "" || custoInscricao === "" || dataHora === "") {
      setErro("Por favor, os campos necessários.");
      return;
    }
    setErro(null);
    const idAdm = localStorage.getItem("idUsuario");

    const dados = {
      nomeBatalha: nomeBatalha,
      dataHorarioInicio: dataHora,
      idAdmCriador: idAdm,
      custoInscricao: custoInscricao,
    };

    try {
      const resposta = await criarBatalha(dados);
      localStorage.setItem("dadosDaBatalha", JSON.stringify(resposta.data));

      const novaBatalha = resposta.data;
      console.log("Batalha Criada!", resposta.data);

      setListaBatalhas([...listaBatalhas, novaBatalha]);
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
                value={dataHora}
                onChange={(e) => setDataHora(e.target.value)}
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
