"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Flame, Medal, Shield, Swords, Trophy, Zap } from "lucide-react";

export function GamificationHub() {
  const { data: stats } = useQuery({
    queryKey: ["journal", "stats"],
    queryFn: async () => (await api.get("/journal/stats")).data,
    refetchInterval: 60000,
  });

  const totalTrades = Number(stats?.total_trades ?? 0);
  const winRate = Number(stats?.win_rate ?? 0);
  const profitFactor = Number(stats?.profit_factor ?? 0);

  const level = Math.min(20, Math.floor(totalTrades / 10) + 1);
  const levelProgress = Math.min(100, (totalTrades % 10) * 10);
  const xpToNext = Math.max(0, 100 - levelProgress) * 10;

  const rankLabel =
    winRate >= 70
      ? "Elite Trader"
      : winRate >= 55
        ? "Pro Trader"
        : "Rising Trader";

  const badges = [
    {
      name: "Diamond Hand",
      desc: "Win Rate > 60%",
      unlocked: winRate >= 60,
      icon: <Shield className="w-5 h-5 text-blue-400" />,
    },
    {
      name: "Sniper",
      desc: "Profit Factor > 1.5",
      unlocked: profitFactor >= 1.5,
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
    },
    {
      name: "Whale Hunter",
      desc: "100+ Trades",
      unlocked: totalTrades >= 100,
      icon: <Medal className="w-5 h-5 text-purple-400" />,
    },
    {
      name: "Top 10",
      desc: "Win Rate > 75%",
      unlocked: winRate >= 75,
      icon: <Trophy className="w-5 h-5 text-zinc-600" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* 1. Level & XP Card */}
      <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Trader Level
            </CardTitle>
            <BadgeLevel level={level} title={rankLabel} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-white">Lvl {level}</span>
            <span className="text-sm text-zinc-500 mb-1">/ 20</span>
          </div>
          <Progress value={levelProgress} className="h-2 bg-zinc-800" />
          <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-500" />
            {xpToNext.toLocaleString()} XP to next level
          </p>
        </CardContent>
      </Card>

      {/* 2. Battle Mode Card */}
      <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden group hover:border-red-900/50 transition-colors">
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 blur-3xl -z-10 group-hover:bg-red-600/20 transition-all" />
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <Swords className="w-4 h-4 text-red-500" /> Battle Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-zinc-200">Weekly PnL Tournament</p>
              <p className="text-xs text-zinc-500">
                Win Rate {winRate.toFixed(1)}% • {totalTrades} trades
              </p>
            </div>
            <Button
              size="sm"
              variant="destructive"
              className="bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-900"
            >
              Find Match
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 3. Achievements / Badges */}
      <Card className="col-span-full bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" /> Trophy Case
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {badges.map((badge) => (
              <BadgeItem
                key={badge.name}
                icon={badge.icon}
                name={badge.name}
                desc={badge.desc}
                unlocked={badge.unlocked}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BadgeLevel({ level, title }: { level: number; title: string }) {
  return (
    <div className="px-2 py-1 bg-yellow-900/20 border border-yellow-700/50 rounded text-[10px] text-yellow-500 font-bold uppercase tracking-wider">
      {title}
    </div>
  );
}

function BadgeItem({ icon, name, desc, unlocked }: any) {
  return (
    <div
      className={`flex flex-col items-center text-center min-w-[80px] p-2 rounded-lg border ${unlocked ? "bg-zinc-800/50 border-zinc-700" : "bg-zinc-900 border-zinc-800 opacity-40 grayscale"}`}
    >
      <div className="mb-2 p-2 bg-zinc-950 rounded-full border border-zinc-800 shadow-inner">
        {icon}
      </div>
      <div className="text-xs font-bold text-zinc-200">{name}</div>
      <div className="text-[10px] text-zinc-500">{desc}</div>
    </div>
  );
}
