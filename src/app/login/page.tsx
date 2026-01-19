"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", loginData);
      const user = res.data.user;
      login(user.email, user.api_key, user.role);
      toast.success("Welcome back, Trader!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", registerData);
      toast.success("Account created successfully! Please login.");
      setRegisterData({ email: "", password: "" });
      // Switch to login tab
      (
        document.querySelector(
          '[data-state="inactive"][value="login"]'
        ) as HTMLElement
      )?.click();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">
              AI
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TRADING HUB
              </h1>
              <p className="text-sm text-zinc-400">Access Terminal</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="login" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-zinc-700"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-zinc-700"
            >
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form
              onSubmit={handleLogin}
              className="space-y-4 p-6 bg-zinc-900 rounded-xl border border-zinc-800"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="trader@example.com"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
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
          </TabsContent>

          <TabsContent value="register">
            <form
              onSubmit={handleRegister}
              className="space-y-4 p-6 bg-zinc-900 rounded-xl border border-zinc-800"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="trader@example.com"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                  required
                />
                <p className="text-xs text-zinc-500">
                  Password must be at least 8 characters long
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6 text-sm text-zinc-400">
          <p>Production-ready AI Trading Backend</p>
          <p className="text-xs mt-1">Hybrid PPO + Llama3 Engine</p>
        </div>
      </div>
    </div>
  );
}
