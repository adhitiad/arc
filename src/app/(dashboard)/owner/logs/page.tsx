"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Info,
  Terminal,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface LogEntry {
  timestamp: string;
  level: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
  message: string;
  module?: string;
  details?: any;
}

export default function OwnerLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Stream logs
  const { data: logStream, isLoading } = useQuery({
    queryKey: ["logs"],
    queryFn: async () => {
      const res = await api.get("/owner/logs/stream");
      return res.data;
    },
    refetchInterval: 2000, // Refresh every 2 seconds
  });

  useEffect(() => {
    if (logStream && Array.isArray(logStream)) {
      setLogs((prevLogs) => {
        const newLogs = [...prevLogs, ...logStream];
        // Keep only last 1000 entries to prevent memory issues
        return newLogs.slice(-1000);
      });
    }
  }, [logStream]);

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  const getLogIcon = (level: string) => {
    switch (level) {
      case "ERROR":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "WARNING":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "SUCCESS":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getLogBadgeColor = (level: string) => {
    switch (level) {
      case "ERROR":
        return "bg-red-900/30 text-red-400 border-red-700";
      case "WARNING":
        return "bg-yellow-900/30 text-yellow-400 border-yellow-700";
      case "SUCCESS":
        return "bg-green-900/30 text-green-400 border-green-700";
      default:
        return "bg-blue-900/30 text-blue-400 border-blue-700";
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const exportLogs = () => {
    const logText = logs
      .map(
        (log) =>
          `[${log.timestamp}] ${log.level} ${
            log.module ? `[${log.module}]` : ""
          } ${log.message}`
      )
      .join("\n");

    const blob = new Blob([logText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const errorCount = logs.filter((log) => log.level === "ERROR").length;
  const warningCount = logs.filter((log) => log.level === "WARNING").length;
  const infoCount = logs.filter((log) => log.level === "INFO").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
          <p className="text-zinc-400">
            Real-time system monitoring and debugging
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setAutoScroll(!autoScroll)}
            variant="outline"
            className={`border-zinc-700 ${autoScroll ? "bg-blue-600" : ""}`}
          >
            <Clock className="w-4 h-4 mr-2" />
            Auto-scroll {autoScroll ? "ON" : "OFF"}
          </Button>
          <Button
            onClick={exportLogs}
            variant="outline"
            className="border-zinc-700"
          >
            Export
          </Button>
          <Button
            onClick={clearLogs}
            variant="outline"
            className="border-zinc-700"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Log Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-zinc-400">Total Logs</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {logs.length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-sm text-zinc-400">Errors</span>
            </div>
            <div className="text-2xl font-bold text-red-400">{errorCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-zinc-400">Warnings</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              {warningCount}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-green-400" />
              <span className="text-sm text-zinc-400">Info</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{infoCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Logs Display */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            Live System Logs
            <Badge variant="outline" className="ml-auto border-zinc-700">
              {isLoading ? "Connecting..." : "Connected"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black rounded border border-zinc-700 p-4">
            <div className="font-mono text-sm max-h-96 overflow-y-auto space-y-1">
              {logs.length === 0 ? (
                <div className="text-zinc-500 text-center py-8">
                  <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No logs available yet...</p>
                  <p className="text-xs mt-1">Waiting for system activity</p>
                </div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-2 rounded hover:bg-zinc-900/50"
                  >
                    {getLogIcon(log.level)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getLogBadgeColor(log.level)}`}
                        >
                          {log.level}
                        </Badge>
                        {log.module && (
                          <span className="text-xs text-zinc-500 font-mono">
                            {log.module}
                          </span>
                        )}
                        <span className="text-xs text-zinc-600 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-zinc-300 text-sm break-words">
                        {log.message}
                      </p>
                      {log.details && (
                        <details className="mt-1">
                          <summary className="text-xs text-zinc-500 cursor-pointer hover:text-zinc-400">
                            Show details
                          </summary>
                          <pre className="text-xs text-zinc-600 mt-1 bg-zinc-800 p-2 rounded overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Categories */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Log Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-400">System Logs</h4>
              <ul className="space-y-1 text-zinc-400">
                <li>• AI model training progress</li>
                <li>• API request/response logs</li>
                <li>• Database operations</li>
                <li>• Background job status</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-green-400">Trading Logs</h4>
              <ul className="space-y-1 text-zinc-400">
                <li>• Signal generation events</li>
                <li>• Order execution results</li>
                <li>• Risk management alerts</li>
                <li>• Performance metrics</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-yellow-400">Warning Logs</h4>
              <ul className="space-y-1 text-zinc-400">
                <li>• Rate limit warnings</li>
                <li>• API timeout issues</li>
                <li>• Data validation errors</li>
                <li>• Resource usage alerts</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-red-400">Error Logs</h4>
              <ul className="space-y-1 text-zinc-400">
                <li>• System failures</li>
                <li>• API connection issues</li>
                <li>• Data processing errors</li>
                <li>• Security incidents</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
