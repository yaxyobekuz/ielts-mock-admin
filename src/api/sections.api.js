import api from "./api";

export const sectionsApi = {
  getAll: async () => await api.get("/api/sections"),
  getById: async (id) => await api.get(`/api/sections/${id}`),
  create: async (data) => await api.post("/api/sections", data),
  remove: async (id) => await api.delete(`/api/sections/${id}`),
  update: async (id, data) => await api.put(`/api/sections/${id}`, data),
};
