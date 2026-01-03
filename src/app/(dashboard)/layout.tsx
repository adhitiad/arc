import { SearchCommand } from "@/components/SearchCommand";
import React from "react";

// Pastikan export default function ada!
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // AuthGuard memproteksi seluruh halaman dashboard
    // <AuthGuard>
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* HEADER */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur sticky top-0 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">
            AI
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            TRADING HUB
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Bar (Ctrl+K) */}
          <SearchCommand />

          {/* Avatar / Profile Placeholder */}
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700"></div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 container mx-auto p-6">{children}</main>
    </div>
    // </AuthGuard>
  );
}
