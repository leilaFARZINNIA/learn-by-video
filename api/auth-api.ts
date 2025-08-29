import api from "./axiosClient";

export const getMe = async () => {
  const { data } = await api.get("/api/me");
  return data.user;
};

export const logout = async () => {
  await api.post("/auth/logout");
};

// Local auth
export const loginLocal = (email: string, password: string) =>
  api.post("/auth/local/login", { email, password });

export const registerLocal = (name: string, email: string, password: string) =>
  api.post("/auth/local/register", { name, email, password });
