// src/api/auth-api.ts
import axiosClient from "./axiosClient";

export const loginApi = (email: string, password: string) =>
  axiosClient.post("/api/login", { email, password });

export const registerApi = (name: string, email: string, password: string) =>
  axiosClient.post("/api/register", { name, email, password });
