import axios from "axios";

// Axios configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

// Request
api.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem("auth");
    const { token } = JSON.parse(auth) || {};
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response
api.interceptors.response.use(
  // Then
  (res) => res.data,

  // Catchw
  ({ response, status }) => {
    if (status === 401) localStorage.removeItem("auth");
    return Promise.reject(response.data);
  }
);

export default api;
