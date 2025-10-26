import api from "./api";

export const statsApi = {
  /**
   * Get dashboard stats for homepage
   * @param {Object} params - Query parameters
   * @param {string} params.period - 'daily' | 'weekly'
   * @param {number} params.days - Number of days to fetch
   */
  getDashboard: async (params) => {
    return await api.get("/api/stats/dashboard", { params });
  },

  /**
   * Get detailed stats for analytics page
   * @param {Object} params - Query parameters
   * @param {string} params.startDate - Start date (YYYY-MM-DD)
   * @param {string} params.endDate - End date (YYYY-MM-DD)
   * @param {string} params.period - 'daily' | 'weekly' | 'monthly'
   * @param {string} params.userId - Optional user ID (for supervisors/admins)
   */
  getDetailed: async (params) => {
    return await api.get("/api/stats/detailed", { params });
  },

  /**
   * Get stats for a specific user
   * @param {string} userId - User ID
   */
  getUserStats: async (userId) => {
    return await api.get(`/api/stats/user/${userId}`);
  },

  /**
   * Manually trigger stats collection (admin only)
   * @param {Object} data - Request body
   * @param {string} data.date - Date to collect stats for (YYYY-MM-DD)
   */
  trigger: async (data) => {
    return await api.post("/api/stats/trigger", data);
  },
};
