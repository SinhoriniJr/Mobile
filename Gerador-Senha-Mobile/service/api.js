import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const authToken = await AsyncStorage.getItem("token");

  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

export default api;
