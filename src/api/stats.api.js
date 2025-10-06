import api from "./api";

export const statsApi = {
  get: async (period = "today") => await api.get(`/api/stats?period=${period}`),
};
