import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, tokenStorage } from "../api/auth";

type AuthContextType = {
  isLoggedIn: boolean;
  getCurrentUserId: () => number | null;
  getCurrentUserInfo: () => { id: number; email: string; userName?: string } | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userName: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    setIsLoggedIn(tokenStorage.isLoggedIn());
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    tokenStorage.set(response.token);
    if (response.user) {
      localStorage.setItem("userInfo", JSON.stringify(response.user));
    }
    setIsLoggedIn(true);
  };

  const register = async (email: string, password: string, userName: string) => {
    const response = await authApi.register(email, password, userName);
    tokenStorage.set(response.token);
    if (response.user) {
      localStorage.setItem("userInfo", JSON.stringify(response.user));
    }
    setIsLoggedIn(true);
  };

  const getCurrentUserId = (): number | null => {
    const token = tokenStorage.get();
    if (!token) return null;
    
    try {
      // Yksinkertainen JWT payload dekoodaus (base64)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || null;
    } catch {
      return null;
    }
  };

  const getCurrentUserInfo = () => {
    // Hae käyttäjätiedot localStoragesta (tallennetaan login/register:ssä)
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) return null;
    
    try {
      return JSON.parse(userInfo);
    } catch {
      return null;
    }
  };

  const logout = () => {
    tokenStorage.remove();
    localStorage.removeItem("userInfo");
    setIsLoggedIn(false);
  };

  const value = {
    isLoggedIn,
    getCurrentUserId,
    getCurrentUserInfo,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}