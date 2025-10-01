import api from "./api";

export const templatesApi = {
  get: async () => await api.get("/api/templates"),
  getById: async (id) => await api.get(`/api/templates/${id}?random=true`),
  use: async (id, data) => await api.post(`/api/templates/${id}/use`, data),
};
