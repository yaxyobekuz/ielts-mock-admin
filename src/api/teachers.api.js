import api from "./api";

export const teachersApi = {
  getById: async (id) => await api.get(`/api/teachers/${id}`),
  create: async (data) => await api.post("/api/teachers", data),
  get: async (params = {}) => await api.get("/api/teachers", { params }),
  update: async (id, data) => await api.put(`/api/teachers/${id}`, data),
  updatePermissions: async (id, data) => {
    return await api.put(`/api/teachers/${id}/permissions`, data);
  },
};
