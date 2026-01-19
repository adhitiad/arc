"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, Star, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

interface SearchResult {
  symbol: string;
  name?: string;
  category?: string;
  price?: number;
  change?: number;
  changePercent?: number;
  signal?: {
    action: "BUY" | "SELL" | "HOLD";
    price: number;
    tp: number;
    sl: number;
    probability?: string;
  };
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];
      const res = await api.get(`/search/?q=${searchTerm}`);
      return res.data as SearchResult[];
    },
    enabled: searchTerm.length >= 2,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the useQuery enabled condition
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Asset Search</h1>
          <p className="text-zinc-400">Find and analyze trading assets</p>
        </div>
      </div>

      {/* Search Form */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              placeholder="Enter symbol or asset name (min 2 characters)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-zinc-800 border-zinc-700 flex-1"
            />
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={searchTerm.length < 2}
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      {isLoading && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Searching...
          </CardContent>
        </Card>
      )}

      {searchResults && searchResults.length > 0 && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Search Results ({searchResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((asset) => (
                <div
                  key={asset.symbol}
                  className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {asset.symbol}
                        </h3>
                        {asset.category && (
                          <span className="px-2 py-1 bg-zinc-700 rounded text-xs text-zinc-300">
                            {asset.category}
                          </span>
                        )}
                      </div>
                      {asset.name && (
                        <p className="text-zinc-400 text-sm mb-2">
                          {asset.name}
                        </p>
                      )}

                      {/* Price Information */}
                      {asset.price && (
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-zinc-500">Price: </span>
                            <span className="font-mono font-semibold">
                              {asset.price}
                            </span>
                          </div>
                          {asset.changePercent !== undefined && (
                            <div className="flex items-center gap-1">
                              <span className="text-zinc-500">Change: </span>
                              <span
                                className={`font-semibold ${
                                  asset.changePercent >= 0
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                              >
                                {asset.changePercent >= 0 ? (
                                  <TrendingUp className="w-4 h-4 inline mr-1" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 inline mr-1" />
                                )}
                                {asset.changePercent >= 0 ? "+" : ""}
                                {asset.changePercent.toFixed(2)}%
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Signal Information */}
                    {asset.signal && (
                      <div className="ml-6 text-right">
                        <div className="mb-2">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded text-sm font-semibold ${
                              asset.signal.action === "BUY"
                                ? "bg-green-600 text-white"
                                : asset.signal.action === "SELL"
                                ? "bg-red-600 text-white"
                                : "bg-yellow-600 text-white"
                            }`}
                          >
                            {asset.signal.action}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 space-y-1">
                          <div>Entry: {asset.signal.price}</div>
                          <div>TP: {asset.signal.tp}</div>
                          <div>SL: {asset.signal.sl}</div>
                          {asset.signal.probability && (
                            <div>Prob: {asset.signal.probability}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="ml-6 flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-zinc-600"
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Watchlist
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-zinc-600"
                      >
                        View Chart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {searchResults &&
        searchResults.length === 0 &&
        searchTerm.length >= 2 &&
        !isLoading && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="text-center py-8">
              <Search className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
              <p className="text-zinc-400">
                No assets found for "{searchTerm}"
              </p>
              <p className="text-sm text-zinc-500 mt-1">
                Try searching for a different symbol or asset name
              </p>
            </CardContent>
          </Card>
        )}

      {/* Search Tips */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Search Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-zinc-400">
            <div>
              <h4 className="font-semibold text-zinc-300 mb-2">
                Stock Symbols
              </h4>
              <ul className="space-y-1">
                <li>• BBCA (Bank Central Asia)</li>
                <li>• TLKM (Telkom Indonesia)</li>
                <li>• BMRI (Bank Mandiri)</li>
                <li>• ASII (Astra International)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-300 mb-2">Forex Pairs</h4>
              <ul className="space-y-1">
                <li>• EURUSD (Euro vs US Dollar)</li>
                <li>• GBPUSD (British Pound vs US Dollar)</li>
                <li>• USDJPY (US Dollar vs Japanese Yen)</li>
                <li>• AUDUSD (Australian Dollar vs US Dollar)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
