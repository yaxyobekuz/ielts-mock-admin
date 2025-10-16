import api from "./api";

export const authApi = {
  profile: async () => await api.get("/api/auth/profile"),
  login: async (data) => await api.post("/api/auth/login", data),
  verify: async (data) => await api.post("/api/auth/verify", data),
  loginWithCode: async (data) => await api.post("/api/auth/login-with-code", data),
  register: async (data) => await api.post("/api/auth/register?role=supervisor", data),
  sendCodeToPhone: async (data) => await api.post("/api/auth/send-code-to-phone", data),
  resendCode: async (data, loginWithCode) => await api.post("/api/auth/resend-code", data, { params: { loginWithCode } }),
};
