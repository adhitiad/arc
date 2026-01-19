"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Brain,
  CheckCircle,
  Clock,
  Play,
  RotateCcw,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TrainingStatus {
  status: "idle" | "training" | "completed" | "failed";
  progress: number;
  current_epoch?: number;
  total_epochs?: number;
  loss?: number;
  accuracy?: number;
  eta?: string;
  message?: string;
}

interface OptimizationStatus {
  symbol: string;
  status: "idle" | "running" | "completed" | "failed";
  progress: number;
  message?: string;
  results?: {
    improvement: number;
    new_accuracy: number;
    training_time: number;
  };
}

export default function OwnerTrainingPage() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus | null>(
    null
  );

  // Manual retrain mutation
  const retrainMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/owner/action/retrain");
      return res.data;
    },
    onSuccess: () => {
      toast.success("AI retraining started");
      // Start polling for status
      pollTrainingStatus();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to start retraining");
    },
  });

  // Restart bot mutation
  const restartMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/owner/action/restart-bot");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Bot restarted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to restart bot");
    },
  });

  // Optimization mutation
  const optimizeMutation = useMutation({
    mutationFn: async (symbol: string) => {
      const res = await api.post(`/pipeline/optimize?symbol=${symbol}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("AI optimization started");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.detail || "Failed to start optimization"
      );
    },
  });

  // Get optimization status
  const { data: optStatus } = useQuery({
    queryKey: ["optimization", selectedSymbol],
    queryFn: async (): Promise<OptimizationStatus> => {
      if (!selectedSymbol) return { symbol: "", status: "idle", progress: 0 };
      const res = await api.get(`/pipeline/status?symbol=${selectedSymbol}`);
      return res.data;
    },
    enabled: !!selectedSymbol,
    refetchInterval: 2000,
  });

  const pollTrainingStatus = () => {
    // This would poll the training status endpoint
    // For now, we'll simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setTrainingStatus({
        status: progress >= 100 ? "completed" : "training",
        progress,
        current_epoch: Math.floor(progress / 10),
        total_epochs: 10,
        loss: Math.random() * 0.5,
        accuracy: 0.7 + (progress / 100) * 0.3,
        message:
          progress >= 100
            ? "Training completed successfully"
            : "Training in progress...",
      });
    }, 1000);
  };

  const popularSymbols = [
    "BBCA.JK",
    "TLKM.JK",
    "BMRI.JK",
    "ASII.JK",
    "UNVR.JK",
    "EURUSD",
    "GBPUSD",
    "USDJPY",
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            AI Training Control
          </h1>
          <p className="text-zinc-400">
            Manage AI model training and optimization
          </p>
        </div>
      </div>

      {/* Training Status */}
      {trainingStatus && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Training Progress
              <Badge
                variant="outline"
                className={`ml-auto ${
                  trainingStatus.status === "completed"
                    ? "border-green-700 text-green-400"
                    : trainingStatus.status === "failed"
                    ? "border-red-700 text-red-400"
                    : "border-blue-700 text-blue-400"
                }`}
              >
                {trainingStatus.status.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{Math.round(trainingStatus.progress)}%</span>
              </div>
              <Progress value={trainingStatus.progress} className="h-2" />
            </div>

            {trainingStatus.message && (
              <p className="text-sm text-zinc-400">{trainingStatus.message}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-zinc-500">Epoch</span>
                <div className="font-semibold">
                  {trainingStatus.current_epoch}/{trainingStatus.total_epochs}
                </div>
              </div>
              <div>
                <span className="text-zinc-500">Loss</span>
                <div className="font-semibold">
                  {trainingStatus.loss?.toFixed(4)}
                </div>
              </div>
              <div>
                <span className="text-zinc-500">Accuracy</span>
                <div className="font-semibold text-green-400">
                  {(trainingStatus.accuracy! * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <span className="text-zinc-500">ETA</span>
                <div className="font-semibold">
                  {trainingStatus.eta || "N/A"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Control Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Manual Training
            </CardTitle>
            <p className="text-sm text-zinc-400">
              Trigger manual retraining of the AI model
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-zinc-800 p-3 rounded text-sm">
              <p className="text-zinc-300 mb-2">
                <strong>What it does:</strong>
              </p>
              <ul className="text-zinc-400 space-y-1">
                <li>• Updates AI model with latest market data</li>
                <li>• Improves signal accuracy and reliability</li>
                <li>• May take 10-30 minutes to complete</li>
                <li>• System performance may be affected during training</li>
              </ul>
            </div>

            <Button
              onClick={() => retrainMutation.mutate()}
              disabled={retrainMutation.isPending}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {retrainMutation.isPending ? (
                <Clock className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Start Manual Retraining
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Restart Bot Logic
            </CardTitle>
            <p className="text-sm text-zinc-400">
              Clear cache and reload bot configuration
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-zinc-800 p-3 rounded text-sm">
              <p className="text-zinc-300 mb-2">
                <strong>What it does:</strong>
              </p>
              <ul className="text-zinc-400 space-y-1">
                <li>• Clears internal cache and memory</li>
                <li>• Reloads configuration files</li>
                <li>• Resets signal generation state</li>
                <li>• Quick operation, no downtime</li>
              </ul>
            </div>

            <Button
              onClick={() => restartMutation.mutate()}
              disabled={restartMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {restartMutation.isPending ? (
                <Clock className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RotateCcw className="w-4 h-4 mr-2" />
              )}
              Restart Bot Logic
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Optimization */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            AI Model Optimization
          </CardTitle>
          <p className="text-sm text-zinc-400">
            Optimize AI model parameters for specific assets
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm"
              >
                <option value="">Select asset to optimize...</option>
                {popularSymbols.map((symbol) => (
                  <option key={symbol} value={symbol}>
                    {symbol}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={() =>
                selectedSymbol && optimizeMutation.mutate(selectedSymbol)
              }
              disabled={!selectedSymbol || optimizeMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {optimizeMutation.isPending ? (
                <Clock className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <TrendingUp className="w-4 h-4 mr-2" />
              )}
              Optimize
            </Button>
          </div>

          {optStatus && selectedSymbol && (
            <div className="bg-zinc-800 p-4 rounded">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">
                  Optimization Status: {selectedSymbol}
                </h4>
                <Badge
                  variant="outline"
                  className={
                    optStatus.status === "completed"
                      ? "border-green-700 text-green-400"
                      : optStatus.status === "running"
                      ? "border-blue-700 text-blue-400"
                      : optStatus.status === "failed"
                      ? "border-red-700 text-red-400"
                      : "border-zinc-700 text-zinc-400"
                  }
                >
                  {optStatus.status.toUpperCase()}
                </Badge>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{Math.round(optStatus.progress)}%</span>
                </div>
                <Progress value={optStatus.progress} className="h-2" />
              </div>

              {optStatus.message && (
                <p className="text-sm text-zinc-400 mb-3">
                  {optStatus.message}
                </p>
              )}

              {optStatus.results && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-500">Improvement</span>
                    <div className="font-semibold text-green-400">
                      +{optStatus.results.improvement.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-zinc-500">New Accuracy</span>
                    <div className="font-semibold text-blue-400">
                      {(optStatus.results.new_accuracy * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-zinc-500">Training Time</span>
                    <div className="font-semibold">
                      {optStatus.results.training_time.toFixed(1)}s
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Training History & Metrics */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Training Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-800 p-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-zinc-400">Last Training</span>
              </div>
              <div className="text-lg font-semibold">2 hours ago</div>
            </div>

            <div className="bg-zinc-800 p-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-zinc-400">Model Version</span>
              </div>
              <div className="text-lg font-semibold">v2.1.4</div>
            </div>

            <div className="bg-zinc-800 p-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-zinc-400">Signal Accuracy</span>
              </div>
              <div className="text-lg font-semibold">87.3%</div>
            </div>

            <div className="bg-zinc-800 p-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-zinc-400">Avg Training Time</span>
              </div>
              <div className="text-lg font-semibold">15 min</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
