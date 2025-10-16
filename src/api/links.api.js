import api from "./api";

export const linksApi = {
  getById: async (id) => await api.get(`/api/links/${id}`),
  create: async (data) => await api.post("/api/links", data),
  preview: async (id) => await api.get(`/api/links/${id}/preview`),
  get: async (testId) => await api.get(`/api/links`, { params: { testId } }),
  addUsage: async (id, data) => await api.post(`/api/links/${id}/usage`, data),
};
