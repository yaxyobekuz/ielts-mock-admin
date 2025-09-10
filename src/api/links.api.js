import api from "./api";

export const linksApi = {
  get: async () => await api.get("/api/links?mine=true"),
  getById: async (id) => await api.get(`/api/links/${id}`),
  create: async (data) => await api.post("/api/links", data),
  preview: async (id) => await api.get(`/api/links/${id}/preview`),
  addUsage: async (id, data) => await api.post(`/api/links/${id}/usage`, data),
};
