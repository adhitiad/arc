"use client";

import ApiTest from "@/components/ApiTest";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  MessageSquare,
  Save,
  Settings,
  Wallet,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BalanceSettings {
  stock_idr: number;
  forex_usd: number;
}

interface TelegramSettings {
  chat_id: string;
}

export default function SettingsPage() {
  const { email } = useAuthStore();
  const queryClient = useQueryClient();
  const [balanceData, setBalanceData] = useState({
    stock_idr: "",
    forex_usd: "",
  });
  const [telegramData, setTelegramData] = useState({
    chat_id: "",
  });

  // Update balance settings
  const balanceMutation = useMutation({
    mutationFn: async (data: BalanceSettings) => {
      const res = await api.post("/user/settings/balance", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Balance settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update balance");
    },
  });

  // Update telegram settings
  const telegramMutation = useMutation({
    mutationFn: async (data: TelegramSettings) => {
      const res = await api.post("/user/settings/telegram", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Telegram settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update telegram");
    },
  });

  const handleUpdateBalance = () => {
    const stockIdr = parseFloat(balanceData.stock_idr);
    const forexUsd = parseFloat(balanceData.forex_usd);

    if (isNaN(stockIdr) || isNaN(forexUsd)) {
      toast.error("Please enter valid numbers for balance");
      return;
    }

    balanceMutation.mutate({
      stock_idr: stockIdr,
      forex_usd: forexUsd,
    });
  };

  const handleUpdateTelegram = () => {
    if (!telegramData.chat_id.trim()) {
      toast.error("Please enter a valid Telegram Chat ID");
      return;
    }

    telegramMutation.mutate({
      chat_id: telegramData.chat_id.trim(),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-zinc-400">
            Manage your account and trading preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="balance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-800">
          <TabsTrigger
            value="balance"
            className="data-[state=active]:bg-zinc-700"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Balance
          </TabsTrigger>
          <TabsTrigger
            value="telegram"
            className="data-[state=active]:bg-zinc-700"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Telegram
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-zinc-700">
            <Zap className="w-4 h-4 mr-2" />
            API Test
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balance">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Balance Settings
              </CardTitle>
              <p className="text-sm text-zinc-400">
                Set your trading capital for personalized money management
                calculations
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="stock_idr">Stock Balance (IDR)</Label>
                  <Input
                    id="stock_idr"
                    type="number"
                    placeholder="50000000"
                    value={balanceData.stock_idr}
                    onChange={(e) =>
                      setBalanceData({
                        ...balanceData,
                        stock_idr: e.target.value,
                      })
                    }
                    className="bg-zinc-800 border-zinc-700"
                  />
                  <p className="text-xs text-zinc-500">
                    Your available capital for Indonesian stock trading
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="forex_usd">Forex Balance (USD)</Label>
                  <Input
                    id="forex_usd"
                    type="number"
                    step="0.01"
                    placeholder="500"
                    value={balanceData.forex_usd}
                    onChange={(e) =>
                      setBalanceData({
                        ...balanceData,
                        forex_usd: e.target.value,
                      })
                    }
                    className="bg-zinc-800 border-zinc-700"
                  />
                  <p className="text-xs text-zinc-500">
                    Your available capital for forex trading
                  </p>
                </div>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Money Management</h4>
                <p className="text-sm text-zinc-400 mb-3">
                  These balances will be used to calculate position sizes and
                  risk management for personalized trading signals.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-500">Risk per trade:</span>
                    <span className="ml-2 text-zinc-300">1-2% of balance</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Max drawdown:</span>
                    <span className="ml-2 text-zinc-300">10% of balance</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleUpdateBalance}
                disabled={balanceMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {balanceMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Update Balance
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="telegram">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Telegram Integration
              </CardTitle>
              <p className="text-sm text-zinc-400">
                Connect your Telegram account for real-time trading
                notifications
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chat_id">Telegram Chat ID</Label>
                  <Input
                    id="chat_id"
                    placeholder="123456789"
                    value={telegramData.chat_id}
                    onChange={(e) =>
                      setTelegramData({
                        ...telegramData,
                        chat_id: e.target.value,
                      })
                    }
                    className="bg-zinc-800 border-zinc-700"
                  />
                  <p className="text-xs text-zinc-500">
                    Your unique Telegram Chat ID for receiving notifications
                  </p>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-700 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-400 mb-2">
                  How to get your Chat ID
                </h4>
                <ol className="text-sm text-zinc-300 space-y-1 list-decimal list-inside">
                  <li>Open Telegram and search for @userinfobot</li>
                  <li>Send /start to the bot</li>
                  <li>Copy the ID number it provides</li>
                  <li>Paste it in the field above and save</li>
                </ol>
              </div>

              <div className="bg-zinc-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Notification Types</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Signal Alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Price Alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>Risk Warnings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Trade Confirmations</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleUpdateTelegram}
                disabled={telegramMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {telegramMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Connect Telegram
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <ApiTest />
        </TabsContent>
      </Tabs>

      {/* Account Information */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-zinc-500">Email</Label>
              <p className="text-zinc-100 font-medium">{email}</p>
            </div>
            <div>
              <Label className="text-zinc-500">Account Status</Label>
              <p className="text-green-400 font-medium">Active</p>
            </div>
            <div>
              <Label className="text-zinc-500">API Access</Label>
              <p className="text-zinc-100 font-medium">Enabled</p>
            </div>
            <div>
              <Label className="text-zinc-500">Last Login</Label>
              <p className="text-zinc-100 font-medium">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
