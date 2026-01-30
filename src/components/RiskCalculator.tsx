"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AlertTriangle, Calculator } from "lucide-react";
import { useState } from "react";

export function RiskCalculator() {
  const [balance, setBalance] = useState(100000000); // Default 100 Juta
  const [entry, setEntry] = useState(0);
  const [stopLoss, setStopLoss] = useState(0);
  const [riskPercent, setRiskPercent] = useState(2); // 2% Risk

  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    if (entry <= stopLoss) return; // Hanya Long position logic

    const riskAmount = balance * (riskPercent / 100);
    const riskPerShare = entry - stopLoss;
    const shares = riskAmount / riskPerShare;
    const lots = Math.floor(shares / 100);
    const capitalRequired = lots * 100 * entry;

    setResult({
      lots,
      riskAmount,
      capitalRequired,
      isSafe: capitalRequired <= balance,
    });
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm text-zinc-400">
          <Calculator className="w-4 h-4 text-blue-500" />
          Smart Position Sizing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Entry Price</Label>
            <Input
              type="number"
              value={entry}
              onChange={(e) => setEntry(Number(e.target.value))}
              className="bg-zinc-950 border-zinc-800"
              placeholder="e.g 5000"
            />
          </div>
          <div className="space-y-2">
            <Label>Stop Loss</Label>
            <Input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(Number(e.target.value))}
              className="bg-zinc-950 border-zinc-800 text-red-400"
              placeholder="e.g 4800"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <Label>Risk Tolerance</Label>
            <span className="text-blue-400 font-bold">{riskPercent}%</span>
          </div>
          <Slider
            defaultValue={[2]}
            max={10}
            step={0.5}
            onValueChange={(v) => setRiskPercent(v[0])}
            className="py-2"
          />
          <p className="text-xs text-zinc-500">
            You will lose Rp {((balance * riskPercent) / 100).toLocaleString()}{" "}
            if hit SL.
          </p>
        </div>

        <Button
          onClick={calculate}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Calculate Size
        </Button>

        {result && (
          <div
            className={`mt-4 p-4 rounded-lg border ${result.isSafe ? "bg-green-900/20 border-green-900" : "bg-red-900/20 border-red-900"}`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-zinc-400">Recommended Lots</span>
              <span className="text-3xl font-bold text-white">
                {result.lots}
              </span>
            </div>
            <div className="text-xs space-y-1 text-zinc-400">
              <div className="flex justify-between">
                <span>Capital Required:</span>
                <span
                  className={result.isSafe ? "text-green-400" : "text-red-400"}
                >
                  Rp {result.capitalRequired.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Risk Amount:</span>
                <span className="text-red-400">
                  Rp {result.riskAmount.toLocaleString()}
                </span>
              </div>
            </div>
            {!result.isSafe && (
              <div className="mt-2 flex items-center gap-2 text-xs text-red-500">
                <AlertTriangle className="w-3 h-3" /> Not enough balance!
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
