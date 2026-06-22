"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

interface AdminContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local session storage on initial mount
    const token = localStorage.getItem("ts_admin_session");
    if (token === "authenticated_secure_token") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("ts_admin_session", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("ts_admin_session");
    setIsAuthenticated(false);
    toast.success("logged out success!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#c5a880] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context)
    throw new Error("useAdmin must be used within an AdminProvider");
  return context;
}
