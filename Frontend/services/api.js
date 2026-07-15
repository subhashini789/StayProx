import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { getAuthSession } from "./authStore";

const getApiBaseUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
  const host = hostUri?.split(":")[0];

  if (host) {
    return `http://${host}:5000/api`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:5000/api";
  }

  return "http://localhost:5000/api";
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

api.interceptors.request.use((config) => {
  const { token } = getAuthSession();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
