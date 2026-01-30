"use client";

import {
    Search,
    Settings,
    Swords,
    TrendingUp,
    Zap
} from "lucide-react";
import * as React from "react";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function CommandCenter() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  // Listener Keyboard (Cmd+K / Ctrl+K)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Parser Perintah Natural (NLP Sederhana)
  const handleSelect = (value: string) => {
    setOpen(false);
    
    // Logika Natural Language Processing (Regex Simple)
    // Pola: "BUY [CODE] [LOT]" atau "SELL [CODE] [LOT]"
    const orderRegex = /^(buy|sell)\s+([a-zA-Z]{4})\s+(\d+)$/i;
    const match = value.match(orderRegex);

    if (match) {
        const action = match[1].toUpperCase();
        const code = match[2].toUpperCase();
        const lot = match[3];
        
        // Simulasi Eksekusi Cepat
        toast.success(`Order Executed: ${action} ${code} ${lot} Lots`, {
            description: "Order sent to exchange via AI Engine.",
            icon: <Zap className="w-4 h-4 text-yellow-400" />
        });
        return;
    }

    // Navigasi Standar
    if (value.includes("dashboard")) router.push("/dashboard");
    if (value.includes("screener")) router.push("/screener");
    if (value.includes("settings")) router.push("/settings");
    if (value.includes("chart")) router.push("/charts");
    if (value.includes("battle")) toast("⚔️ Entering Battle Mode...");
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search (e.g., 'Buy BBCA 100')..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {/* Quick Actions (AI Predicted) */}
        <CommandGroup heading="Smart Actions">
          <CommandItem onSelect={() => handleSelect("Buy BBCA 100")}>
            <Zap className="mr-2 h-4 w-4 text-yellow-500" />
            <span>Quick Buy BBCA 100 Lot</span>
          </CommandItem>
           <CommandItem onSelect={() => handleSelect("battle")}>
            <Swords className="mr-2 h-4 w-4 text-red-500" />
            <span>Enter Battle Mode</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => handleSelect("dashboard")}>
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("screener")}>
            <Search className="mr-2 h-4 w-4" />
            <span>Screener</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}