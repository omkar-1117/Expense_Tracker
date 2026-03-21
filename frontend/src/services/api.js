import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(err);
  }
);

export const login = (payload) => api.post("/token/", payload);
export const registerUser = (payload) => api.post("/register/", payload);
export const getExpenses = () => api.get("/expenses/");
export const createExpense = (payload) => api.post("/expenses/", payload);
export const deleteExpense = (id) => api.delete(`/expenses/${id}/`);

export default api;
