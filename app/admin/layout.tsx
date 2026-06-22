"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Menu,
  Shield,
  Bell,
  User,
  ChevronDown,
  EyeOff,
  Eye,
} from "lucide-react";
import { AdminProvider, useAdmin } from "@/context/AuthContext";

// Local Sub-Component View for Static Login Guard Page
function AdminLoginGate() {
  const { login } = useAdmin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "TaalSadhana2026") {
      login("authenticated_secure_token");
      toast.success("Login Successfull!");
    } else {
      alert("Invalid structural administrator keys.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0b] flex items-center justify-center px-4 font-sans text-left">
      <div className="w-full max-w-md bg-[#141312] rounded-3xl p-8 border border-neutral-800/80 shadow-2xl space-y-6">
        {/* Header Block */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#c5a880]/10 border border-[#c5a880]/30 rounded-2xl flex items-center justify-center mx-auto text-[#c5a880]">
            <Shield size={22} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-tight">
            Tabla Heritage
          </h2>
          <p className="text-xs text-neutral-400 font-light">
            Protected administrator directory access channel
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-[16px] font-bold uppercase tracking-wider text-neutral-400">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full px-4 py-2.5 bg-[#1a1917] border border-neutral-800 focus:border-[#c5a880] rounded-xl text-md text-white focus:outline-none transition-colors"
            />
          </div>

          {/* Master Passphrase Input with Hide/Show Action Toggle */}
          <div className="space-y-1.5">
            <label className="text-[16px] font-bold uppercase tracking-wider text-neutral-400">
              Master Passphrase
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"} // Dynamic input type definition
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-4 pr-12 py-2.5 bg-[#1a1917] border border-neutral-800 focus:border-[#c5a880] rounded-xl text-md text-white focus:outline-none transition-colors"
              />
              <button
                type="button" // Critical to prevent implicit form triggers on click
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors focus:outline-none cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submission Gate Control */}
          <button
            type="submit"
            className="w-full py-3 bg-[#c5a880] hover:bg-[#b3956d] text-white font-semibold text-md rounded-xl tracking-wide transition-colors shadow-md cursor-pointer"
          >
            Authorize Connection
          </button>
        </form>
      </div>
    </div>
  );
}

// Global Nav Shell Component
function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAdmin();

  if (!isAuthenticated) return <AdminLoginGate />;

  return (
    <div className="min-h-screen bg-[#0c0c0b] text-neutral-200 font-sans flex text-left overflow-auto">
      {/* 1. PERSISTENT SYSTEM SIDEBAR */}
      <aside className="w-64 bg-[#141312] border-r border-neutral-800/80 flex flex-col justify-between p-5 shrink-0">
        <div className="space-y-7">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-[#c5a880] rounded-xl flex items-center justify-center text-white font-bold text-xl">
              T
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white tracking-wide">
                Tabla Heritage
              </h3>
              <p className="text-[16px] uppercase font-bold tracking-widest text-[#c5a880]">
                Admin Panel
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            <a
              href="/admin?tab=dashboard"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-md font-medium text-neutral-400 hover:bg-[#1a1917] hover:text-white transition-colors cursor-pointer"
            >
              <LayoutDashboard size={25} /> Data Overview
            </a>
            <a
              href="/admin?tab=leads"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-md font-medium text-neutral-400 hover:bg-[#1a1917] hover:text-white transition-colors cursor-pointer"
            >
              <Users size={25} /> Leads Manager
            </a>
            <a
              href="/admin/blog"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-md font-medium text-neutral-400 hover:bg-[#1a1917] hover:text-white transition-colors cursor-pointer"
            >
              <FileText size={25} /> Blogs Manager{" "}
              <span className="ml-auto text-[8px] px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-400">
                v2
              </span>
            </a>
          </nav>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xl font-medium text-rose-400 hover:bg-rose-950/20 transition-colors border border-transparent hover:border-rose-900/20 cursor-pointer"
        >
          <LogOut size={30} /> Logout
        </button>
      </aside>

      {/* 2. FLEXIBLE MAIN APPLICATION WINDOW */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* COMPONENT BODY ATTACHMENT EXECUTOR */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#0c0c0b]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminShellLayout>{children}</AdminShellLayout>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#141312",
            color: "#fff",
            borderRadius: "12px",
            border: "1px solid #262524",
            fontSize: "13px",
          },
        }}
      />
    </AdminProvider>
  );
}
