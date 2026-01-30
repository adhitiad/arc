"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, FastForward, Pause, Play, RotateCcw } from "lucide-react";
import { useState } from "react";

export function ReplayControls({
  onPlay,
  onPause,
  onReset,
  onDateChange,
}: any) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) onPlay();
    else onPause();
  };

  return (
    <Card className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur border border-zinc-700 p-2 rounded-full shadow-2xl z-50 flex items-center gap-2">
      <div className="flex items-center gap-2 px-4 border-r border-zinc-700">
        <Calendar className="w-4 h-4 text-zinc-400" />
        <Input
          type="date"
          className="w-32 bg-transparent border-0 h-8 text-sm focus-visible:ring-0 px-0"
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>

      <Button variant="ghost" size="icon" onClick={onReset} title="Reset">
        <RotateCcw className="w-4 h-4 text-zinc-400" />
      </Button>

      <Button
        size="icon"
        className={`rounded-full w-12 h-12 ${isPlaying ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"}`}
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause className="fill-black text-black" />
        ) : (
          <Play className="fill-white ml-1" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSpeed(speed === 1 ? 5 : 1)}
        title="Speed"
      >
        <div className="flex items-center text-xs font-bold text-zinc-400">
          <FastForward className="w-3 h-3 mr-0.5" /> {speed}x
        </div>
      </Button>
    </Card>
  );
}
