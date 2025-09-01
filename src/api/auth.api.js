import api from "./api";

export const authApi = {
  profile: async () => await api.get("/api/auth/profile"),
  login: async (data) => await api.post("/api/auth/login", data),
  verify: async (data) => await api.post("/api/auth/verify", data),
  register: async (data) => await api.post("/api/auth/register", data),
};
