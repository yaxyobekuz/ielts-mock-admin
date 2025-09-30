import api from "./api";

export const teachersApi = {
  get: async () => await api.get("/api/teachers"),
  getById: async (id) => await api.get(`/api/teachers/${id}`),
  create: async (data) => await api.post("/api/teachers", data),
  update: async (id, data) => await api.put(`/api/teachers/${id}`, data),
};
