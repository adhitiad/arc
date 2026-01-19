"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Bell, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Alert {
  id?: string;
  symbol: string;
  type: "price" | "volume" | "technical";
  condition: "above" | "below" | "crosses_above" | "crosses_below";
  target_price?: number;
  note?: string;
  created_at?: string;
  triggered?: boolean;
}

export default function AlertsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    symbol: "",
    type: "price" as const,
    condition: "above" as const,
    target_price: "",
    note: "",
  });
  const queryClient = useQueryClient();

  // Fetch alerts
  const { data: alerts, isLoading } = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const res = await api.get("/alerts/list");
      return res.data as Alert[];
    },
  });

  // Create alert
  const createMutation = useMutation({
    mutationFn: async (alertData: any) => {
      const res = await api.post("/alerts/create", alertData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast.success("Alert created successfully");
      setShowCreateForm(false);
      setFormData({
        symbol: "",
        type: "price",
        condition: "above",
        target_price: "",
        note: "",
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to create alert");
    },
  });

  // Delete alert
  const deleteMutation = useMutation({
    mutationFn: async (alertId: string) => {
      // Note: API might not have delete endpoint, this is a placeholder
      const res = await api.delete(`/alerts/${alertId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast.success("Alert deleted");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to delete alert");
    },
  });

  const handleCreateAlert = () => {
    if (!formData.symbol || !formData.target_price) {
      toast.error("Please fill in all required fields");
      return;
    }

    const alertData = {
      symbol: formData.symbol.toUpperCase(),
      type: formData.type,
      condition: formData.condition,
      target_price: parseFloat(formData.target_price),
      note: formData.note || "",
    };

    createMutation.mutate(alertData);
  };

  const handleDeleteAlert = (alertId: string) => {
    deleteMutation.mutate(alertId);
  };

  const alertsList = Array.isArray(alerts) ? alerts : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
          <p className="text-zinc-400">Set up price and technical alerts</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {/* Create Alert Form */}
      {showCreateForm && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Create New Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  placeholder="e.g., BBCA, EURUSD"
                  value={formData.symbol}
                  onChange={(e) =>
                    setFormData({ ...formData, symbol: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Alert Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price Alert</SelectItem>
                    <SelectItem value="volume">Volume Alert</SelectItem>
                    <SelectItem value="technical">Technical Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, condition: value })
                  }
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Price goes above</SelectItem>
                    <SelectItem value="below">Price goes below</SelectItem>
                    <SelectItem value="crosses_above">Crosses above</SelectItem>
                    <SelectItem value="crosses_below">Crosses below</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_price">Target Price</Label>
                <Input
                  id="target_price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.target_price}
                  onChange={(e) =>
                    setFormData({ ...formData, target_price: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Input
                id="note"
                placeholder="Additional notes..."
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleCreateAlert}
                disabled={createMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Bell className="w-4 h-4 mr-2" />
                )}
                Create Alert
              </Button>
              <Button
                onClick={() => setShowCreateForm(false)}
                variant="outline"
                className="border-zinc-700"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts List */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Your Alerts ({alertsList.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading alerts...
            </div>
          ) : alertsList.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No alerts set up yet</p>
              <p className="text-sm">Create your first alert to get notified</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alertsList.map((alert, index) => (
                <div
                  key={alert.id || index}
                  className={`p-4 rounded-lg border ${
                    alert.triggered
                      ? "bg-yellow-900/20 border-yellow-700"
                      : "bg-zinc-800 border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">
                            {alert.symbol}
                          </span>
                          {alert.triggered && (
                            <span className="flex items-center gap-1 text-yellow-400 text-sm">
                              <AlertTriangle className="w-4 h-4" />
                              Triggered
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-zinc-400 mt-1">
                          {alert.type} • {alert.condition.replace("_", " ")}
                          {alert.target_price &&
                            ` • Target: ${alert.target_price}`}
                        </div>
                        {alert.note && (
                          <div className="text-sm text-zinc-500 mt-1">
                            {alert.note}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.created_at && (
                        <span className="text-xs text-zinc-500">
                          {new Date(alert.created_at).toLocaleDateString()}
                        </span>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteAlert(alert.id!)}
                        disabled={deleteMutation.isPending}
                        className="border-zinc-600 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert Types Guide */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Alert Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-400">Price Alerts</h4>
              <p className="text-zinc-400">
                Get notified when an asset reaches a specific price level.
                Perfect for entry/exit points.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-400">Volume Alerts</h4>
              <p className="text-zinc-400">
                Alert when trading volume reaches unusual levels, indicating
                potential market interest.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-400">
                Technical Alerts
              </h4>
              <p className="text-zinc-400">
                Set alerts for technical indicators like RSI, MACD, or moving
                average crossovers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
