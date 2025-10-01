import api from "./api";

export const uploadApi = {
  uploadImage: async (file, config = {}) => {
    const formData = new FormData();
    formData.append("image", file);
    return await api.post("/api/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      ...config,
    });
  },

  uploadImages: async (files, config = {}) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    return await api.post("/api/upload/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      ...config,
    });
  },
};
