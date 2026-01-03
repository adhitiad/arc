"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner"; // Pastikan install sonner: npm install sonner

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Panggil Backend Python
      const res = await api.post("/auth/login", { email, password });

      const user = res.data.user;
      // Simpan ke Zustand
      login(user.email, user.api_key, user.role);

      toast.success("Welcome back, Trader!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm p-8 bg-zinc-900 rounded-xl border border-zinc-800 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center mb-6">AI HUB LOGIN</h1>

        <div className="space-y-1">
          <label className="text-xs text-zinc-400">Email</label>
          <Input
            className="bg-black border-zinc-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-zinc-400">Password</label>
          <Input
            type="password"
            className="bg-black border-zinc-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Access Terminal"}
        </Button>
      </form>
    </div>
  );
}
