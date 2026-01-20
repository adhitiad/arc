"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AddTradeDialog({
  onTradeAdded,
}: {
  onTradeAdded?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi API Call ke Backend (POST /journal)
    setTimeout(() => {
      setIsLoading(false);
      setOpen(false);
      toast.success("Trade recorded successfully!");
      if (onTradeAdded) onTradeAdded();
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <BookOpen className="w-4 h-4 mr-2" />
          Add Trade
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record New Trade</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Symbol</Label>
              <Input
                placeholder="BBCA.JK"
                className="bg-zinc-800 border-zinc-700"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Action</Label>
              <Select defaultValue="BUY">
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUY">BUY</SelectItem>
                  <SelectItem value="SELL">SELL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Entry Price</Label>
              <Input
                type="number"
                placeholder="0"
                className="bg-zinc-800 border-zinc-700"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Quantity (Lots)</Label>
              <Input
                type="number"
                placeholder="1"
                className="bg-zinc-800 border-zinc-700"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              className="bg-zinc-800 border-zinc-700"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Strategy / Notes</Label>
            <Textarea
              placeholder="Why did you take this trade?"
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-2 bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              "Save Trade"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
