"use client";

import { PricingTable } from "@/components/subscription/PricingTable"; // Import PricingTable
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
import { useAuthStore } from "@/lib/store";
import { Copy, CreditCard, Eye, EyeOff, Key, Lock, User } from "lucide-react"; // Tambah icon CreditCard
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

  return (
    <div className="space-y-6 max-w-6xl">
      {" "}
      {/* Lebarkan max-width agar PricingTable muat */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-zinc-400">
          Kelola akun, keamanan, dan preferensi langganan Anda.
        </p>
      </div>
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="bg-zinc-800 text-zinc-400">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>{" "}
          {/* Tab Baru */}
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="developer">Developer</TabsTrigger>
        </TabsList>

        {/* --- TAB 1: ACCOUNT PROFILE --- */}
        <TabsContent value="account" className="mt-4 max-w-4xl">
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
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- TAB 2: SUBSCRIPTION (BARU) --- */}
        <TabsContent value="subscription" className="mt-4">
          <Card className="bg-zinc-900 border-zinc-800 border-0 shadow-none bg-transparent">
            <div className="mb-6">
              <h3 className="text-lg font-medium leading-6 text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-500" /> Paket
                Langganan
              </h3>
              <p className="mt-1 text-sm text-zinc-400">
                Pilih paket yang sesuai dengan kebutuhan trading Anda.
              </p>
            </div>
            {/* Panggil Komponen Pricing Table */}
            <PricingTable />
          </Card>
        </TabsContent>

        {/* --- TAB 3: SECURITY --- */}
        <TabsContent value="security" className="mt-4 max-w-4xl">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-500" />
                Ubah Password
              </CardTitle>
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

        {/* --- TAB 4: DEVELOPER --- */}
        <TabsContent value="developer" className="mt-4 max-w-4xl">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-yellow-500" />
                API Configuration
              </CardTitle>
              <CardDescription>
                API Key ini memberikan akses penuh ke akun Anda. Jangan bagikan
                ke siapapun.
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
