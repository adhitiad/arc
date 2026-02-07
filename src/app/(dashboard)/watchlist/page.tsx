"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Search, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface WatchlistItem {
  symbol: string;
  name?: string;
  category?: string;
  price?: number;
  change?: number;
  changePercent?: number;
}

export default function WatchlistPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newSymbol, setNewSymbol] = useState("");
  const queryClient = useQueryClient();

  // Fetch watchlist
  const { data: watchlist, isLoading } = useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const res = await api.get("/user/watchlist");
      return res.data;
    },
  });

  // Add to watchlist
  const addMutation = useMutation({
    mutationFn: async (symbol: string) => {
      const res = await api.post(`/user/watchlist/add?symbol=${symbol}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      toast.success("Added to watchlist");
      setNewSymbol("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to add symbol");
    },
  });

  // Remove from watchlist
  const removeMutation = useMutation({
    mutationFn: async (symbol: string) => {
      const res = await api.delete(`/user/watchlist/remove?symbol=${symbol}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      toast.success("Removed from watchlist");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to remove symbol");
    },
  });

  // Search assets
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["search", searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return null;
      const res = await api.get(`/search/?q=${searchTerm}`);
      return res.data;
    },
    enabled: searchTerm.length >= 2,
  });

  const handleAddSymbol = () => {
    if (!newSymbol.trim()) return;
    addMutation.mutate(newSymbol.trim().toUpperCase());
  };

  const handleRemoveSymbol = (symbol: string) => {
    removeMutation.mutate(symbol);
  };

  const watchlistItems = Array.isArray(watchlist) ? watchlist : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Watchlist</h1>
          <p className="text-zinc-400">Monitor your favorite assets</p>
        </div>
      </div>

      {/* Add Symbol Section */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Symbol
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Enter symbol (e.g., BBCA, EURUSD)"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              className="bg-zinc-800 border-zinc-700"
              onKeyDown={(e) => e.key === "Enter" && handleAddSymbol()}
            />
            <Button
              onClick={handleAddSymbol}
              disabled={addMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {addMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Section */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search for assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-zinc-800 border-zinc-700"
          />
          {searchLoading && (
            <div className="flex items-center gap-2 mt-3 text-zinc-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching...
            </div>
          )}
          {searchResults && searchResults.length > 0 && (
            <div className="mt-3 space-y-2">
              {searchResults.map((asset: any) => (
                <div
                  key={asset.symbol || asset.ticker || `${asset.category}-${asset.name}`}
                  className="flex items-center justify-between p-3 bg-zinc-800 rounded border border-zinc-700"
                >
                  <div>
                    <div className="font-semibold">{asset.symbol}</div>
                    <div className="text-sm text-zinc-400">
                      {asset.name} • {asset.category}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {asset.signal && (
                      <div className="text-sm text-green-400">
                        Signal: {asset.signal.action}
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addMutation.mutate(asset.symbol)}
                      disabled={addMutation.isPending}
                      className="border-zinc-600"
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Watchlist Items */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Your Watchlist ({watchlistItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading watchlist...
            </div>
          ) : watchlistItems.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Your watchlist is empty</p>
              <p className="text-sm">Add some symbols to start monitoring</p>
            </div>
          ) : (
            <div className="space-y-3">
              {watchlistItems.map((item: WatchlistItem, index) => (
                <div
                  key={item.symbol || index}
                  className="flex items-center justify-between p-4 bg-zinc-800 rounded border border-zinc-700"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-semibold text-lg">{item.symbol}</div>
                      <div className="text-sm text-zinc-400">
                        {item.name || "Unknown Asset"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {item.price && (
                      <div className="text-right">
                        <div className="font-mono text-lg">{item.price}</div>
                        {item.changePercent && (
                          <div
                            className={`text-sm ${
                              item.changePercent >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {item.changePercent >= 0 ? "+" : ""}
                            {item.changePercent.toFixed(2)}%
                          </div>
                        )}
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveSymbol(item.symbol)}
                      disabled={removeMutation.isPending}
                      className="border-zinc-600 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
