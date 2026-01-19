"use client";

import { SearchCommand } from "@/components/SearchCommand";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store";
import {
  BarChart3,
  Bell,
  Brain,
  Database,
  FileText,
  Home,
  LogOut,
  Search,
  Settings,
  Star,
  Terminal,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Search", href: "/search", icon: Search },
  { name: "Watchlist", href: "/watchlist", icon: Star },
  { name: "Screener", href: "/screener", icon: TrendingUp },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "Charts", href: "/charts", icon: BarChart3 },
  { name: "Journal", href: "/journal", icon: FileText },
  { name: "Backtest", href: "/backtest", icon: Zap },
  { name: "Settings", href: "/settings", icon: Settings },
];

const ownerNavigation = [
  { name: "File Manager", href: "/owner/files", icon: FileText },
  { name: "System Logs", href: "/owner/logs", icon: Terminal },
  { name: "AI Training", href: "/owner/training", icon: Brain },
  { name: "Database", href: "/owner/database", icon: Database },
];

const adminNavigation = [
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Upgrade Queue", href: "/admin/upgrades", icon: TrendingUp },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, role, email } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isOwner = role === "owner";
  const isAdmin = role === "admin" || isOwner;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-zinc-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">
              AI
            </div>
            <div>
              <div className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TRADING HUB
              </div>
              <div className="text-xs text-zinc-400">{role?.toUpperCase()}</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}

          {/* Owner Section */}
          {isOwner && (
            <div className="pt-4">
              <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                Owner Tools
              </div>
              {ownerNavigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-purple-600 text-white"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Admin Section */}
          {isAdmin && !isOwner && (
            <div className="pt-4">
              <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                Admin Panel
              </div>
              {adminNavigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-red-600 text-white"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-semibold">
              {email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-zinc-100 truncate">
                {email}
              </div>
              <div className="text-xs text-zinc-400">{role}</div>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full border-zinc-700 text-zinc-400 hover:text-zinc-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="h-16 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur sticky top-0 z-50 flex items-center justify-between px-6">
          <div className="flex-1" />

          <div className="flex items-center gap-4">
            {/* Search Bar (Ctrl+K) */}
            <SearchCommand />
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
