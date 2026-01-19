"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store";
import { Brain, Database, Shield, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { apiKey } = useAuthStore();

  useEffect(() => {
    if (apiKey) {
      router.push("/dashboard");
    }
  }, [apiKey, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className="w-12 h-12 text-blue-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Trading Hub
            </h1>
          </div>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
            Production-ready backend with AI, Bandarmology, and Global
            Middleware. Advanced trading signals powered by Hybrid AI Engine
            (PPO + Llama3).
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Access Terminal
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-zinc-700">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Signals</h3>
            <p className="text-zinc-400 text-sm">
              Real-time trading signals with Bandarmology analysis
            </p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 text-center">
            <Shield className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Secure API</h3>
            <p className="text-zinc-400 text-sm">
              X-API-Key authentication with role-based access
            </p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 text-center">
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Fast Execution</h3>
            <p className="text-zinc-400 text-sm">
              Optimized for high-frequency trading operations
            </p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 text-center">
            <Database className="w-8 h-8 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Database Access</h3>
            <p className="text-zinc-400 text-sm">
              Direct database viewing for administrators
            </p>
          </div>
        </div>

        {/* API Features */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            API Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-400">Authentication</h4>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Register/Login</li>
                <li>• API Key Management</li>
                <li>• Role-based Access</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-400">Trading Features</h4>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Market Data & Charts</li>
                <li>• Stock Screener</li>
                <li>• Alert System</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-400">Analytics</h4>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Trading Journal</li>
                <li>• Backtesting</li>
                <li>• Performance Stats</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-yellow-400">Owner Tools</h4>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• File Management</li>
                <li>• AI Training Control</li>
                <li>• System Monitoring</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-red-400">Admin Panel</h4>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• User Management</li>
                <li>• Role Upgrades</li>
                <li>• System Administration</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-indigo-400">User Dashboard</h4>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Watchlist Management</li>
                <li>• Personal Signals</li>
                <li>• Telegram Integration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
