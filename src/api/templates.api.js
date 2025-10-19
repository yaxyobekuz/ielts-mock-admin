import api from "./api";

export const templatesApi = {
  get: async (params = {}) => await api.get("/api/templates", { params }),
  getById: async (id) => await api.get(`/api/templates/${id}?random=true`),
  use: async (id, data) => await api.post(`/api/templates/${id}/use`, data),
  create: async (data, config = {}) => {
    return await api.post(`/api/templates`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      ...config,
    });
  },
};
