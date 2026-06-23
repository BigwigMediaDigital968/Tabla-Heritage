"use client";

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Shield,
  EyeOff,
  Eye,
  ChevronRight,
  User,
  Bell
} from "lucide-react";
import { AdminProvider, useAdmin } from "@/context/AuthContext";

function AdminLoginGate() {
  const { login } = useAdmin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "TaalSadhana2026") {
      login("authenticated_secure_token");
      toast.success("Welcome back, Admin!");
    } else {
      toast.error("Invalid administrator credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-muted-main flex items-center justify-center px-4 font-sans text-left transition-colors duration-200">
      <div className="w-full max-w-md bg-white rounded-brand p-8 border border-border shadow-md space-y-6">
        {/* Header Block */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[var(--secondary-light)] border border-[var(--secondary-dark)] rounded-xl flex items-center justify-center mx-auto text-[var(--primary)]">
            <Shield size={22} className="stroke-[1.75]" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[var(--primary)] tracking-tight">
            Tabla Heritage
          </h2>
          <p className="text-xs text-muted-fg font-light">
            Protected administrator access terminal
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-fg">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2.5 bg-bg-main border border-border focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] rounded-xl text-sm text-fg-main focus:outline-none transition-all placeholder:text-neutral-300"
            />
          </div>

          {/* Master Passphrase Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-fg">
              Master Passphrase
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-4 pr-12 py-2.5 bg-bg-main border border-border focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] rounded-xl text-sm text-fg-main focus:outline-none transition-all placeholder:text-neutral-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-fg hover:text-fg-main transition-colors focus:outline-none cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submission Gate Control */}
          <button
            type="submit"
            className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white font-medium text-sm rounded-xl tracking-wide transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-[0.99]"
          >
            Authorize Connection
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAdmin();
  const [currentTab, setCurrentTab] = useState("dashboard");

  // Dynamically parse out URL params on mount/navigation to visually update active tabs
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab) {
        setCurrentTab(tab);
      } else if (window.location.pathname.includes("/blog")) {
        setCurrentTab("blog");
      }
    }
  }, []);

  if (!isAuthenticated) return <AdminLoginGate />;

  // Dynamic Navigation Link Builder helper to keep active rules DRY
  const renderNavLink = (href: string, id: string, label: string, Icon: React.ComponentType<{ size: number; className?: string }>, tag?: string) => {
    const isActive = currentTab === id;
    return (
      <a
        href={href}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group cursor-pointer ${isActive
            ? "bg-[var(--secondary-light)] text-[var(--primary)] font-semibold shadow-xs"
            : "text-muted-fg hover:bg-muted-main hover:text-fg-main"
          }`}
      >
        <Icon size={18} className={`transition-colors ${isActive ? "text-[var(--primary)]" : "text-neutral-400 group-hover:text-fg-main"}`} />
        <span>{label}</span>
        {tag && (
          <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded transition-colors ${isActive ? "bg-[var(--secondary-dark)] text-[var(--primary)]" : "bg-muted-main text-muted-fg"
            }`}>
            {tag}
          </span>
        )}
      </a>
    );
  };

  // Humanizes current pathing tags for breadcrumb trail display
  const getBreadcrumbLabel = () => {
    if (currentTab === "dashboard") return "Data Overview";
    if (currentTab === "leads") return "Leads Manager";
    if (currentTab === "blog") return "Blogs Manager";
    return "Overview";
  };

  return (
    <>
      <div className=" min-h-screen bg-muted-main text-fg-main font-sans flex text-left overflow-auto antialiased" data-lenis-prevent>
        {/* 1. SIDEBAR NAVIGATION */}
        <aside className="w-64 bg-white border-r border-border/80 flex flex-col justify-between p-5 shrink-0 shadow-xs">
          <div className="space-y-6">
            {/* Logo Brand Header Block */}
            <div className="flex items-center gap-3 px-2 py-1.5 border-b border-neutral-100 pb-4">
              <div className="w-9 h-9 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                T
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--primary)] tracking-wide leading-tight">
                  Tabla Heritage
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary-light)]/80">
                  Management System
                </p>
              </div>
            </div>

            {/* Nav List */}
            <nav className="space-y-1">
              {renderNavLink("/admin?tab=dashboard", "dashboard", "Data Overview", LayoutDashboard)}
              {renderNavLink("/admin?tab=leads", "leads", "Leads Manager", Users)}
              {renderNavLink("/admin/blog", "blog", "Blogs Manager", FileText, "v2")}
            </nav>
          </div>

          {/* System Outbound Escape Gate */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all border border-transparent hover:border-red-100 cursor-pointer group"
          >
            <LogOut size={18} className="text-red-400 group-hover:text-red-600 transition-colors" />
            <span>Logout System</span>
          </button>
        </aside>

        {/* 2. MAIN CORE APPLICATION WINDOW */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          {/* TOP CONTEXT BAR */}
          <header className="h-16 bg-white border-b border-border/80 flex items-center justify-between px-8 shrink-0 shadow-2xs">
            {/* Internal System Breadcrumbs Mapping */}
            <div className="flex items-center gap-2 text-xs font-medium text-muted-fg">
              <span>Console</span>
              <ChevronRight size={14} className="text-neutral-300" />
              <span className="text-[var(--primary)] font-semibold">{getBreadcrumbLabel()}</span>
            </div>

            {/* Right Action Stack */}
            <div className="flex items-center gap-4">
              <button className="p-1.5 rounded-lg text-muted-fg hover:bg-muted-main hover:text-fg-main transition-colors relative cursor-pointer">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </button>
              <div className="h-4 w-px bg-neutral-200"></div>
              <div className="flex items-center gap-2.5 pl-1">
                <div className="w-8 h-8 bg-[var(--secondary-light)] border border-[var(--secondary-dark)] text-[var(--primary)] font-bold text-xs rounded-full flex items-center justify-center">
                  <User size={14} />
                </div>
                <div className="hidden md:block">
                  <p className="text-xs font-semibold text-fg-main leading-none">System Admin</p>
                  <p className="text-[10px] text-muted-fg mt-0.5">Primary Session</p>
                </div>
              </div>
            </div>
          </header>

          {/* INTERCHANGEABLE ACTIVE CONTENT COMPONENT CONTAINER */}
          <main className="flex-1 bg-muted-main overflow-auto">
            <div className="max-w-(--container-width) mx-auto p-4 h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
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
            background: "#ffffff",
            color: "#1f2937",
            borderRadius: "var(--radius-brand)",
            border: "1px solid var(--border)",
            fontSize: "13px",
            boxShadow: "var(--shadow-md)",
          },
        }}
      />
    </AdminProvider>
  );
}