import axios from "axios";

const api = axios.create({
  baseURL: "http://10.36.125.1"
});
export default api;