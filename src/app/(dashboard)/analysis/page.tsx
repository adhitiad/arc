"use client";

import { FinancialReportCard } from "@/components/FinancialReportCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { Loader2, UploadCloud } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!file || !symbol) {
      toast.error("Please provide symbol and PDF file");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("symbol", symbol);
    formData.append("period", "Latest"); // Bisa dibuat input text
    formData.append("file", file);

    try {
      const res = await api.post("/analysis/upload-report", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
      toast.success("Analysis Complete!");
    } catch (e) {
      toast.error("Analysis failed. Try a smaller PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          AI Financial Analyzer
        </h1>
        <p className="text-zinc-400">
          Upload Laporan Keuangan (PDF) dan biarkan AI membacanya untuk Anda.
        </p>
      </div>

      {/* Upload Section */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-3 items-end">
            <div className="space-y-2">
              <Label>Stock Symbol</Label>
              <Input
                placeholder="e.g. BBRI"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Financial Report (PDF)</Label>
              <Input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="bg-zinc-800 border-zinc-700 text-zinc-300"
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <UploadCloud className="w-4 h-4 mr-2" />
              )}
              Analyze Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Result Section */}
      {result && (
        <FinancialReportCard
          data={result}
          symbol={symbol}
          period="Uploaded Report"
        />
      )}
    </div>
  );
}
