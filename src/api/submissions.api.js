import api from "./api";

export const submissionsApi = {
  get: async () => await api.get("/api/submissions"),
  getById: async (id) => await api.get(`/api/submissions/${id}`),
  update: async (id, data) => await api.put(`/api/submissions/${id}`, data),
};
