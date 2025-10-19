import api from "./api";

export const submissionsApi = {
  getById: async (id) => await api.get(`/api/submissions/${id}`),
  get: async (params) => await api.get("/api/submissions", { params }),
  update: async (id, data) => await api.put(`/api/submissions/${id}`, data),
};
