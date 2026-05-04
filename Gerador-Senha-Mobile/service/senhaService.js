import api from "./api";

export const savePasswordEntry = (payload) => {
  return api.post("/senhas", payload);
};

export const listPasswordEntries = () => {
  return api.get("/senhas");
};

export const deletePasswordEntry = (passwordId) => {
  return api.delete(`/senhas/${passwordId}`);
};
