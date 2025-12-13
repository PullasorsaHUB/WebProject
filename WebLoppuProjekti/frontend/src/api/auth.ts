import { apiPost } from "./httpClient";

export type AuthResponse = { 
  token: string;
  user?: {
    id: number;
    email: string;
  };
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export const authApi = {
  login: (email: string, password: string) =>
    apiPost<LoginRequest, AuthResponse>("/api/auth/login", { email, password }),
  
  register: (email: string, password: string) =>
    apiPost<RegisterRequest, AuthResponse>("/api/auth/register", { email, password }),
};

// Token management helpers
export const tokenStorage = {
  get: () => localStorage.getItem("authToken"),
  set: (token: string) => localStorage.setItem("authToken", token),
  remove: () => localStorage.removeItem("authToken"),
  isLoggedIn: () => !!localStorage.getItem("authToken"),
};