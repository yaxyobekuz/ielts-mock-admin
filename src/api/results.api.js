import api from "./api";

export const resultsApi = {
  getById: async (id) => await api.get(`/api/results/${id}`),
  create: async (data) => await api.post("/api/results/", data),
  update: async (id, data) => await api.put(`/api/results/${id}`, data),
  get: async (params = {}) => await api.get("/api/results", { params }),
};
