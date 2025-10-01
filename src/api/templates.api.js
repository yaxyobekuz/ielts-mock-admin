import api from "./api";

export const templatesApi = {
  get: async () => await api.get("/api/templates"),
  getById: async (id) => await api.get(`/api/templates/${id}`),
};
