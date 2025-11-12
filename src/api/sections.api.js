import api from "./api";

export const sectionsApi = {
  getAll: async () => await api.get("/api/sections"),
  getById: async (id) => await api.get(`/api/sections/${id}`),
  create: async (data) => await api.post("/api/sections", data),
  delete: async (id) => await api.delete(`/api/sections/${id}`),
  update: async (id, data) => await api.put(`/api/sections/${id}`, data),
  extractData: async (file, sectionType, config = {}) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", sectionType);
    return await api.post("/api/sections/extract-data-from-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      ...config,
    });
  },
};
