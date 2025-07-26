"use client";

import {createContext, useState} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { API_URL} from "./constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = async (email, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append("email", email);
      formData.append("password", password);
      const response = await axios.post(`${API_URL}/login`, {email: email, password: password}, {
        withCredentials: true,
      });
      setUser(response.data);
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {withCredentials: true});
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
