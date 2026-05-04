import api from "./api";

export const signup = (data) => {
  return api.post("/signup", data);
};

export const signin = (data) => {
  return api.post("/signin", data);
};