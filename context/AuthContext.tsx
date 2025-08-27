// src/context/AuthContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { registerApi } from "../api/auth-api";

// ---- Types ----
type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

// ---- Context ----
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // AsyncStorage 
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        const savedUser = await AsyncStorage.getItem("user");

        if (savedToken) setToken(savedToken);
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to load storage:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStorageData();
  }, []);

  // ---- Login ----
  const login = async (email: string, password: string) => {
    // fake login
    if (email === "test@test.com" && password === "1234") {
      const fakeUser = { id: "1", name: "Test User", email };
      setUser(fakeUser);
      await AsyncStorage.setItem("user", JSON.stringify(fakeUser));
      console.log("✅ Login success, user set:", fakeUser);
    } else {
      throw new Error("Invalid credentials");
    }
  };
  
  

  // ---- Register ----
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await registerApi(name, email, password);
      const { token, user } = response.data;

      setToken(token);
      setUser(user);

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (error: any) {
      console.error("Register failed:", error.response?.data || error.message);
      throw error;
    }
  };

  // ---- Logout ----
  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ---- Custom Hook ----
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
