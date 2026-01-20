"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ScrollText } from "lucide-react";

export default function LogsPage() {
  const { data: logs } = useQuery({
    queryKey: ["owner-logs"],
    queryFn: async () => (await api.get("/owner/audit-logs")).data,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Audit Logs</h1>
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="w-5 h-5" /> Activity Stream
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {logs?.map((log: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-2 h-2 rounded-full ${log.status >= 400 ? "bg-red-500" : "bg-green-500"}`}
                  />
                  <div>
                    <div className="text-sm font-medium text-zinc-200">
                      {log.action}
                    </div>
                    <div className="text-xs text-zinc-500">{log.user}</div>
                  </div>
                </div>
                <div className="text-xs font-mono text-zinc-500">
                  {log.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
