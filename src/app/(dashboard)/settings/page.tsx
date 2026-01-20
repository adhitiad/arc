"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Copy, Eye, EyeOff, Key, Lock, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { apiKey, email, role } = useAuthStore();
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State untuk Change Password
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [tgCode, setTgCode] = useState<string | null>(null);

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      toast.success("API Key disalin ke clipboard");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("Password baru dan konfirmasi tidak cocok");
      return;
    }

    setIsLoading(true);
    // Simulasi API Call ke Backend
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Password berhasil diubah!");
      setPasswords({ current: "", new: "", confirm: "" });
    }, 1500);
  };

  const handleGenerateTgCode = async () => {
    const res = await api.post("/users/generate-telegram-code");
    setTgCode(res.data.code);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-zinc-400">
          Kelola akun, keamanan, dan preferensi developer Anda.
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="bg-zinc-800 text-zinc-400">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="developer">Developer</TabsTrigger>
        </TabsList>

        {/* --- TAB 1: ACCOUNT PROFILE --- */}
        <TabsContent value="account" className="mt-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Profil Pengguna
              </CardTitle>
              <CardDescription>Informasi dasar akun Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={email || ""}
                    disabled
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipe Akun</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={role?.toUpperCase() || "FREE"}
                      disabled
                      className="bg-zinc-950 border-zinc-800 font-bold text-blue-400"
                    />
                    {role === "free" && (
                      <Button
                        size="sm"
                        className="bg-linear-to-r from-blue-600 to-purple-600 border-0"
                      >
                        Upgrade
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- TAB 2: SECURITY (PASSWORD) --- */}
        <TabsContent value="security" className="mt-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-500" />
                Ubah Password
              </CardTitle>
              <CardDescription>
                Pastikan akun Anda tetap aman dengan password yang kuat
              </CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordChange}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Password Saat Ini</Label>
                  <Input
                    type="password"
                    className="bg-zinc-950 border-zinc-800"
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords({ ...passwords, current: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Password Baru</Label>
                    <Input
                      type="password"
                      className="bg-zinc-950 border-zinc-800"
                      value={passwords.new}
                      onChange={(e) =>
                        setPasswords({ ...passwords, new: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Konfirmasi Password Baru</Label>
                    <Input
                      type="password"
                      className="bg-zinc-950 border-zinc-800"
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords({ ...passwords, confirm: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mt-4 p-4 border border-blue-900/50 bg-blue-900/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-blue-400">
                          Telegram Notifications
                        </h4>
                        <p className="text-sm text-zinc-400">
                          Get private signals directly to your chat.
                        </p>
                      </div>
                      {!tgCode ? (
                        <Button
                          onClick={handleGenerateTgCode}
                          variant="outline"
                          className="border-blue-600 text-blue-400"
                        >
                          Connect Telegram
                        </Button>
                      ) : (
                        <div className="text-center">
                          <p className="text-xs text-zinc-500 mb-1">
                            Send this code to our bot:
                          </p>
                          <div className="text-2xl font-mono font-bold tracking-widest text-white">
                            {tgCode}
                          </div>
                          <Button
                            variant="link"
                            className="text-blue-400 h-auto p-0 text-xs"
                            onClick={() =>
                              window.open(
                                "https://t.me/YOUR_BOT_NAME",
                                "_blank",
                              )
                            }
                          >
                            Open Bot
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-zinc-800 pt-4 flex justify-end">
                <Button type="submit" disabled={isLoading} variant="secondary">
                  {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* --- TAB 3: DEVELOPER (API KEY) --- */}
        <TabsContent value="developer" className="mt-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-yellow-500" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Gunakan key ini untuk akses via Python Client atau WebSocket
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Secret API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showKey ? "text" : "password"}
                      value={apiKey || ""}
                      readOnly
                      className="bg-zinc-950 border-zinc-800 pr-10 font-mono text-yellow-500/80"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={copyToClipboard}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  Jangan bagikan key ini. Jika terkompromi, segera generate
                  ulang.
                </p>
              </div>
            </CardContent>

            <CardFooter className="bg-red-900/10 border-t border-zinc-800 pt-4 flex justify-between items-center">
              <div className="text-xs text-red-400">Danger Zone</div>
              <Button variant="destructive" size="sm">
                Regenerate Key
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
