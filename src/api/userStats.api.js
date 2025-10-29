import api from "./api";

export const userStatsApi = {
  get: async () => await api.get("/api/user-stats"),
};
