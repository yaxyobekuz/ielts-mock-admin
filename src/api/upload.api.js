import api from "./api";

export const uploadApi = {
  uploadPhoto: async (file, config = {}) => {
    const formData = new FormData();
    formData.append("photo", file);
    return await api.post("/api/upload/photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      ...config,
    });
  },

  uploadPhotos: async (files, config = {}) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("photos", file));
    return await api.post("/api/upload/photos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      ...config,
    });
  },
};
