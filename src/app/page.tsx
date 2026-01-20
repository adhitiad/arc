import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Brain, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Navbar */}
      <header className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-950/80 backdrop-blur z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center font-bold">
            AI
          </div>
          <span className="font-bold text-xl tracking-tight">TradingHub</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-zinc-300 hover:text-white">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 px-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-sm font-medium mb-6 border border-blue-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Now with Real-time Bandarmology
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-linear-to-r from-white via-blue-100 to-zinc-500 bg-clip-text text-transparent">
            Trade Smarter with <br /> AI & Smart Money Flow
          </h1>
          <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
            Stop guessing. Use institutional-grade AI signals and track the
            "Bandar" (Smart Money) accumulation in real-time. Data-driven
            trading for the modern investor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="h-12 px-8 text-lg bg-white text-black hover:bg-zinc-200 w-full sm:w-auto"
              >
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-lg border-zinc-700 w-full sm:w-auto"
              >
                View Features
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section
          id="features"
          className="py-20 bg-zinc-900/50 border-y border-zinc-800"
        >
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">
              Why Professional Traders Choose Us
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 transition-colors">
                <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Signal Engine</h3>
                <p className="text-zinc-400">
                  Our Deep Learning models analyze years of historical data to
                  predict price movements with high accuracy.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 transition-colors">
                <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Bandarmology 2.0</h3>
                <p className="text-zinc-400">
                  Detect hidden accumulation and distribution. See what the Big
                  Players (Bandar) are doing before the retail crowd knows.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-green-500/50 transition-colors">
                <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Personal Alerts</h3>
                <p className="text-zinc-400">
                  Get instant Buy/Sell signals sent directly to your private
                  Telegram. Never miss a breakout again.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 border-t border-zinc-800 text-center text-zinc-500 text-sm">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/legal/privacy" className="hover:text-zinc-300">
            Privacy Policy
          </Link>
          <Link href="/legal/terms" className="hover:text-zinc-300">
            Terms of Service
          </Link>
          <Link href="/legal/disclaimer" className="hover:text-zinc-300">
            Disclaimer
          </Link>
        </div>
        <p>© 2024 AI Trading Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
