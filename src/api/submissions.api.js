import api from "./api";

export const submissionsApi = {
  getById: async (id) => await api.get(`/api/submissions/${id}`),
  get: async (params) => await api.get("/api/submissions", { params }),
  getByLinkId: async (linkId, params) =>
    await api.get("/api/submissions", { params: { ...params, linkId } }),
  getByTestId: async (testId, params) =>
    await api.get("/api/submissions", { params: { ...params, testId } }),
  update: async (id, data) => await api.put(`/api/submissions/${id}`, data),
};
