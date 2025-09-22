import api from "./api";

export const resultsApi = {
  get: async () => await api.get("/api/results"),
  getById: async (id) => await api.get(`/api/results/${id}`),
  create: async (data) => await api.post("/api/results/", data),
  update: async (id, data) => await api.put(`/api/results/${id}`, data),
};
