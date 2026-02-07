"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Briefcase,
  Crown,
  Database,
  FileText,
  History,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  ScanSearch,
  Settings,
  ShieldAlert,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Definisi Menu Items
const menuItems = [
  {
    title: "Market Pulse",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/screener", icon: ScanSearch, label: "Screener" },
      { href: "/charts", icon: LineChart, label: "Charts & Tech" },
      { href: "/analysis", icon: FileText, label: "AI Analysis" }, // Fitur Baru
    ],
  },
  {
    title: "My Trading",
    items: [
      { href: "/journal", icon: BookOpen, label: "Journal" },
      { href: "/backtest", icon: History, label: "Backtest" },
      { href: "/watchlist", icon: Briefcase, label: "Watchlist" },
      { href: "/alerts", icon: ShieldAlert, label: "Alerts" },
    ],
  },
];

const adminItems = [
  { href: "/admin/users", icon: Users, label: "User Manager" },
  { href: "/admin/upgrades", icon: Zap, label: "Upgrade Requests" },
];

const ownerItems = [
  { href: "/owner/dashboard", icon: Crown, label: "Super Dashboard" },
  { href: "/owner/logs", icon: Database, label: "System Logs" },
  { href: "/owner/files", icon: FileText, label: "File Manager" },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { role, email, logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  // Helper untuk mengecek active link
  const isActive = (path: string) => pathname === path;

  // Komponen Link yang Reusable
  const NavLink = ({ href, icon: Icon, label }: any) => (
    <Link
      href={href}
      onClick={() => setOpen(false)} // Tutup sheet di mobile saat klik
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-white",
        isActive(href)
          ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
          : "text-zinc-400 hover:bg-zinc-800",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );

  // Konten Sidebar (Desktop & Mobile sama isinya)
  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-4">
      {/* Header Logo */}
      <div className="flex h-14 items-center border-b border-zinc-800 px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            AI
          </div>
          <span>
            Trading<span className="text-blue-500">Hub</span>
          </span>
        </Link>
      </div>

      {/* Scrollable Menu Area */}
      <div className="flex-1 overflow-auto py-2 px-4 space-y-6">
        {/* Group: Market Pulse & My Trading */}
        {menuItems.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {group.title}
            </h4>
            {group.items.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </div>
        ))}

        {/* Group: Admin (Only visible for Admin/Enterprise/Owner) */}
        {(role === "admin" || role === "owner" || role === "enterprise") && (
          <div className="space-y-1">
            <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
              Admin Zone
            </h4>
            {adminItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </div>
        )}

        {/* Group: Owner (Only visible for Owner) */}
        {role === "owner" && (
          <div className="space-y-1">
            <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-red-400">
              God Mode
            </h4>
            {ownerItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </div>
        )}

        {/* Group: Settings */}
        <div className="space-y-1">
          <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Settings
          </h4>
          <NavLink href="/settings" icon={Settings} label="Account & Billing" />
        </div>
      </div>

      {/* Footer: User Info & Logout */}
      <div className="mt-auto border-t border-zinc-800 p-4">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
            {email?.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-white">{email}</p>
            <p className="text-xs text-zinc-500 uppercase flex items-center gap-1">
              {role}
              {role === "premium" && (
                <Zap className="w-3 h-3 text-yellow-500" />
              )}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-zinc-700 text-zinc-400 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside
        className={cn(
          "hidden w-64 flex-col border-r border-zinc-800 bg-zinc-950 lg:flex fixed inset-y-0 left-0 z-50",
          className,
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-3 left-4 z-50"
          >
            <Menu className="h-6 w-6 text-zinc-400" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-zinc-950 border-r border-zinc-800"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
