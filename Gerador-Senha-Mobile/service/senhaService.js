import api from "./api";

export const criarSenha = (data) => {
  return api.post("/senhas", data);
};

export const listarSenhas = () => {
  return api.get("/senhas");
};

export const deletarSenha = (id) => {
  return api.delete(`/senhas/${id}`);
};