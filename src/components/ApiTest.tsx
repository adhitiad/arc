"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { testApiConnection } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

export default function ApiTest() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTestConnection = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      const result = await testApiConnection();
      setTestResult(result);

      if (result.success) {
        toast.success("API Connection successful!");
      } else {
        toast.error(`API Connection failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Test failed:", error);
      toast.error("Test failed unexpectedly");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          API Connectivity Test
          <Button
            onClick={handleTestConnection}
            disabled={loading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Testing..." : "Test Connection"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {testResult && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  testResult.success ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="font-medium">
                {testResult.success
                  ? "Connection Successful"
                  : "Connection Failed"}
              </span>
            </div>

            {testResult.success ? (
              <div className="bg-zinc-800 p-4 rounded border">
                <h4 className="font-semibold mb-2 text-green-400">
                  Health Check Response:
                </h4>
                <pre className="text-sm text-zinc-300 whitespace-pre-wrap">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-zinc-800 p-4 rounded border border-red-800">
                <h4 className="font-semibold mb-2 text-red-400">
                  Error Details:
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Error:</strong> {testResult.error}
                  </p>
                  {testResult.details && (
                    <p>
                      <strong>Details:</strong>{" "}
                      {JSON.stringify(testResult.details)}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="text-xs text-zinc-500">
              <p>API Base URL: http://localhost:8000</p>
              <p>Endpoint: /health</p>
              <p>Make sure your FastAPI backend is running on port 8000</p>
            </div>
          </div>
        )}

        {!testResult && !loading && (
          <div className="text-center py-8 text-zinc-500">
            <p>Click "Test Connection" to verify API connectivity</p>
            <p className="text-xs mt-2">
              This will test the connection to your FastAPI backend at
              http://localhost:8000/health
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
