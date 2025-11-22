import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------------------------------------------
// APIS RELACIONADAS A AUTENTICAÇÃO
// ---------------------------------------------------------
export const fazerCadastro = (dadosCadastro) => {
  return apiClient.post("/usuario/cadastro", dadosCadastro);
};

export const fazerLogin = (dadosLogin) => {
  return apiClient.post("/usuario/login", dadosLogin);
};

export const esqueceuSenha = (dadosNovaSenha) => {
  return apiClient.post("/usuario/changeUser/password", dadosNovaSenha);
};

// ---------------------------------------------------------
// APIS RELACIONADAS AO PERFIL
// ---------------------------------------------------------
export const trocarSenha = (dadosNovaSenha, idUsuario) => {
  return apiClient.put(`usuario/${idUsuario}/changeUser/basic`, dadosNovaSenha);
};

export const trocarFoto = (idUsuario, idFoto) => {
  return apiClient.post(`usuario/changeFoto/${idUsuario}/${idFoto}`);
};

export const ranking = async () => {
  return await apiClient.get("usuario/top10Vitorias");
};
export const buscarHistorico = async (idBatalha) => {
  return await apiClient.get(`history/${idBatalha}`);
};

// ---------------------------------------------------------
// APIS RELACIONADAS A LOJA
// ---------------------------------------------------------
export const pegarPacotes = async () => {
  return await apiClient.get("lojapacotes/todos");
};

export const compraPacote = async (idPacote, idUsuario) => {
  return await apiClient.post(`lojapacotes/comprar/${idPacote}/${idUsuario}`);
};

// ---------------------------------------------------------
// APIS RELACIONADAS AOS RATOS
// ---------------------------------------------------------
export const ratosUsuario = (dadosRatos) => {
  return apiClient.post("/rato/cadastro", dadosRatos);
};

export const pegarUsuarioPorId = async (id) => {
  return await apiClient.get(`/usuario/${id}`);
};

export const pegarRatosDoUsuario = async (idUsuario) => {
  return await apiClient.get(`/rato/dousuario/${idUsuario}`);
};

export const pegarTodasClasses = async () => {
  return await apiClient.get("/classe/todos");
};

export const pegarDescricaoHabilidades = async () => {
  return await apiClient.get("habilidade/todos");
};

// ---------------------------------------------------------
// APIS RELACIONADAS A BATALHA DO JOGADOR
// ---------------------------------------------------------
export const pegarBatalhasAbertas = async () => {
  return await apiClient.get("batalha/abertas");
};

export const vefificarPlayerInscrito = async (idBatalha, idUsuario) => {
  return await apiClient.get(
    `batalha/verificaplayer/${idBatalha}/${idUsuario}`
  );
};

export const entrarBatalha = (dadosBatalha) => {
  return apiClient.post("batalha/entrar", dadosBatalha);
};

export const pegarBatalhasIncrito = async (idUsuario) => {
  return await apiClient.get(`batalha/user/${idUsuario}`);
};

export const batalhaConcluidas = async (idUsuario) => {
  return await apiClient.get(`batalha/user/concluidas/${idUsuario}`)
}

// ---------------------------------------------------------
// APIS RELACIONADAS A BATALHA DO ADM
// ---------------------------------------------------------
export const criarBatalha = async (dadosBatalha) => {
  return await apiClient.post("batalha/cadastro", dadosBatalha);
};

export const gerenciarBatalha = (dados) => {
  return apiClient.put(`/batalha/atualizar/${dados.idBatalha}`, dados);
};

export const removerJogador = (idBatalha, idUsuario) => {
  return apiClient.post(`batalha/retirar/${idBatalha}/${idUsuario}`);
};

export const pegarJogadoresDaBatalha = (idBatalha) => {
  return apiClient.get(`batalha/${idBatalha}`);
};

export const deletarBatalha = (idBatalha) => {
  return apiClient.delete(`batalha/deletar/${idBatalha}`);
};

export const iniciarBatlhas = (idBatalha) => {
  return apiClient.post(`batalha/iniciar/${idBatalha}`);
};

export const verificarSeBatalhaCheia = (idBatalha) => {
  return apiClient.get(`batalha/batalhacheia/${idBatalha}`);
};
