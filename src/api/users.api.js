import api from "./api";

export const usersApi = {
  update: async (data) => await api.put(`/api/users/me`, data),
  updateAvatar: async (file, config = {}) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return await api.put("/api/users/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      ...config,
    });
  },
};
