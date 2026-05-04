import api from "./api";

export const registerUser = (userData) => {
  return api.post("/signup", userData);
};

export const loginUser = (credentials) => {
  return api.post("/signin", credentials);
};
