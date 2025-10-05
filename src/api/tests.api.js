import api from "./api";

export const testsApi = {
  get: async () => await api.get("/api/tests?mine=true"),
  getById: async (id) => await api.get(`/api/tests/${id}`),
  getLatest: async () => await api.get("/api/tests/latest"),
  create: async (data) => await api.post("/api/tests", data),
  delete: async (id) => await api.delete(`/api/tests/${id}`),
  update: async (id, data) => await api.put(`/api/tests/${id}`, data),
  updateModuleDuration: async (id, module, data) => {
    return await api.put(`/api/tests/${id}/${module}/duration`, data);
  },
  addAudioToModule: async (id, module, file, config = {}) => {
    const formData = new FormData();
    formData.append("file", file);
    return await api.post(`/api/tests/${id}/${module}/audios`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      ...config,
    });
  },
  deleteAudioFromModule: async (id, module, audioId) => {
    return await api.post(`/api/tests/${id}/${module}/audios/${audioId}`);
  },
};
