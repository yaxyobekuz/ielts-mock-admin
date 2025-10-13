import api from "./api";

export const partsApi = {
  getAll: async () => await api.get("/api/parts"),
  getById: async (id) => await api.get(`/api/parts/${id}`),
  create: async (data) => await api.post("/api/parts", data),
  delete: async (id) => await api.delete(`/api/parts/${id}`),
  update: async (id, data) => await api.put(`/api/parts/${id}`, data),
};
