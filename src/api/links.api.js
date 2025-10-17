import api from "./api";

export const linksApi = {
  getById: async (id) => await api.get(`/api/links/${id}`),
  delete: async (id) => await api.delete(`/api/links/${id}`),
  create: async (data) => await api.post("/api/links", data),
  get: async (params) => await api.get(`/api/links`, { params }),
  preview: async (id) => await api.get(`/api/links/${id}/preview`),
  update: async (id, data) => await api.put(`/api/links/${id}`, data),
  addUsage: async (id, data) => await api.post(`/api/links/${id}/usage`, data),
};
