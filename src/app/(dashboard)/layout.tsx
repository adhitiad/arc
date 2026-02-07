"use client";

import AuthGuard from "@/components/AuthGuard";
import { ModeToggle } from "@/components/ModeToggle";
import { MarketSwitcher } from "@/components/MarketSwitcher";
import { SearchCommand } from "@/components/SearchCommand"; // Asumsi ada search command
import { Sidebar } from "@/components/Sidebar";
import { UserNav } from "@/components/UserNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-zinc-100">
        {/* Sidebar Component (Fixed Left) */}
        <Sidebar />

        {/* Main Content Wrapper */}
        {/* lg:pl-64 PENTING: Memberikan ruang kosong di kiri selebar sidebar (64 = 16rem = 256px) */}
        <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
          {/* Header */}
          <header className="sticky top-0 z-40 border-b border-zinc-800 bg-black/50 px-6 py-2 backdrop-blur-md">
            <div className="flex items-center gap-4">
              {/* Search Command (Tengah/Kanan) */}
              <div className="w-full max-w-md hidden md:block">
                <SearchCommand />
              </div>

              {/* User Profile */}
              <div className="ml-auto flex items-center gap-3">
                <ModeToggle />
                <div className="flex flex-col items-end gap-2">
                  <UserNav />
                  <MarketSwitcher />
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
