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
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Database,
  Download,
  Eye,
  RefreshCw,
  Table,
} from "lucide-react";
import { useState } from "react";

interface DatabaseRecord {
  _id?: string;
  [key: string]: any;
}

export default function OwnerDatabasePage() {
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [limit, setLimit] = useState<number>(20);

  // Available collections
  const collections = [
    "users",
    "signals",
    "trades",
    "alerts",
    "watchlists",
    "market_data",
    "system_logs",
    "ai_models",
  ];

  // Fetch database content
  const {
    data: dbData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["database", selectedCollection, limit],
    queryFn: async () => {
      if (!selectedCollection) return null;
      const res = await api.get(
        `/owner/db/view/${selectedCollection}?limit=${limit}`
      );
      return res.data as DatabaseRecord[];
    },
    enabled: !!selectedCollection,
  });

  const filteredData =
    dbData?.filter((record) => {
      if (!searchTerm) return true;
      return JSON.stringify(record)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    }) || [];

  const exportData = () => {
    if (!filteredData.length) return;

    const jsonData = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedCollection}-export-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getDataKeys = (data: DatabaseRecord[]) => {
    if (!data.length) return [];
    const allKeys = new Set<string>();
    data.forEach((record) => {
      Object.keys(record).forEach((key) => allKeys.add(key));
    });
    return Array.from(allKeys);
  };

  const keys = getDataKeys(filteredData);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Database Viewer</h1>
          <p className="text-zinc-400">
            Inspect and manage database collections
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="border-zinc-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Collection Selector */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Select Collection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="collection">Collection</Label>
              <Select
                value={selectedCollection}
                onValueChange={setSelectedCollection}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Choose collection..." />
                </SelectTrigger>
                <SelectContent>
                  {collections.map((collection) => (
                    <SelectItem key={collection} value={collection}>
                      {collection}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="limit">Limit</Label>
              <Select
                value={limit.toString()}
                onValueChange={(value) => setLimit(parseInt(value))}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 records</SelectItem>
                  <SelectItem value="25">25 records</SelectItem>
                  <SelectItem value="50">50 records</SelectItem>
                  <SelectItem value="100">100 records</SelectItem>
                  <SelectItem value="500">500 records</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label>Actions</Label>
              <div className="flex gap-2">
                <Button
                  onClick={exportData}
                  disabled={!filteredData.length}
                  variant="outline"
                  className="border-zinc-600"
                  size="sm"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Content */}
      {selectedCollection && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Table className="w-5 h-5" />
              {selectedCollection} ({filteredData.length} records)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                Loading database records...
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-8 text-zinc-400">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No records found</p>
                <p className="text-sm">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Collection might be empty"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-3 bg-zinc-800 rounded font-semibold text-sm text-zinc-300 border-b border-zinc-700">
                  <div className="col-span-1">#</div>
                  {keys.slice(0, 10).map((key) => (
                    <div key={key} className="truncate" title={key}>
                      {key}
                    </div>
                  ))}
                  <div className="col-span-1">Actions</div>
                </div>

                {/* Table Rows */}
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {filteredData.map((record, index) => (
                    <div
                      key={record._id || index}
                      className="grid grid-cols-12 gap-4 p-3 bg-zinc-800/50 rounded border border-zinc-700 hover:border-zinc-600 transition-colors"
                    >
                      <div className="col-span-1 text-sm text-zinc-400 font-mono">
                        {index + 1}
                      </div>
                      {keys.slice(0, 10).map((key) => (
                        <div
                          key={key}
                          className="truncate text-sm text-zinc-300"
                          title={JSON.stringify(record[key])}
                        >
                          {typeof record[key] === "object"
                            ? "[Object]"
                            : typeof record[key] === "boolean"
                            ? record[key].toString()
                            : String(record[key] || "").slice(0, 50)}
                        </div>
                      ))}
                      <div className="col-span-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-zinc-600"
                          onClick={() => {
                            // Show full record details
                            alert(JSON.stringify(record, null, 2));
                          }}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Collection Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Available Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {collections.map((collection) => (
                <div
                  key={collection}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    selectedCollection === collection
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                  onClick={() => setSelectedCollection(collection)}
                >
                  {collection}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Important Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-zinc-400">
              <div>
                <strong className="text-zinc-300">Read-Only Access:</strong>{" "}
                This viewer provides read-only access to database collections
                for inspection purposes.
              </div>
              <div>
                <strong className="text-zinc-300">Performance:</strong> Large
                collections are limited to prevent performance issues. Use
                search to filter results.
              </div>
              <div>
                <strong className="text-zinc-300">Data Types:</strong> Complex
                objects are displayed as [Object]. Click the eye icon for full
                details.
              </div>
              <div>
                <strong className="text-zinc-300">Export:</strong> Use the
                export button to download filtered data as JSON for further
                analysis.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
