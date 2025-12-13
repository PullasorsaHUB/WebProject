import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, tokenStorage } from "../api/auth";

type AuthContextType = {
  isLoggedIn: boolean;
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
    setIsLoggedIn(true);
  };

  const register = async (email: string, password: string, userName: string) => {
    const response = await authApi.register(email, password, userName);
    tokenStorage.set(response.token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    tokenStorage.remove();
    setIsLoggedIn(false);
  };

  const value = {
    isLoggedIn,
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