import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fazerCadastro = (dadosCadastro) => {
  return apiClient.post("/usuario/cadastro", dadosCadastro);
};

export const fazerLogin = (dadosLogin) => {
  return apiClient.post("/usuario/login", dadosLogin);
};

export const trocarSenha = (dadosNovaSenha) => {
  return apiClient.post("/usuario/changeUser/password", dadosNovaSenha);
};

export const ratosUsuario = (dadosRatos) => {
  return apiClient.post("/rato/cadastro", dadosRatos)
};

export const pegarTodasClasses = async () => {
  return await apiClient.get("/classe/todos");
};

/* export const pegarDescricaoHabilidades = async () => {
  return await apiClient.get("habilidade/todos")
}; */