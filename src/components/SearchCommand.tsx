"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

export function SearchCommand() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { apiKey } = useAuthStore(); // Ambil API Key

  React.useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      // Guard: Jangan search kalau tidak punya API Key
      if (!apiKey) {
        console.warn("Skipping search: No API Key");
        return;
      }

      setLoading(true);
      try {
        const res = await api.get(`/search/?q=${query}`);
        setResults(res.data);
      } catch (e: any) {
        console.error("Search failed:", e);

        // Jika 403, tandanya sesi habis -> Redirect Login
        if (e.response && e.response.status === 403) {
          setOpen(false); // Tutup modal
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, apiKey, router]);

  // Shortcut Ctrl+K / Cmd+K
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

  // Fetch ke Backend
  React.useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search/?q=${query}`);
        setResults(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <>
      <Button
        variant="outline"
        className="w-full md:w-64 justify-between text-zinc-400 bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200"
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5" /> Search asset...
        </span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-400 opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type symbol (e.g., BBCA, EURUSD)..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {loading && (
            <div className="p-4 flex justify-center">
              <Loader2 className="animate-spin text-zinc-500" />
            </div>
          )}

          {results.length > 0 && (
            <CommandGroup heading="Assets">
              {results.map((item) => (
                <CommandItem
                  key={item.symbol}
                  onSelect={() => {
                    console.log("Selected", item.symbol);
                    setOpen(false);
                    // Nanti bisa diarahkan ke halaman detail asset
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex justify-between w-full items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-100">
                        {item.symbol}
                      </span>
                      <span className="text-xs text-zinc-500 uppercase">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {item.has_signal && (
                        <Badge
                          variant="outline"
                          className="text-green-500 border-green-900 bg-green-900/10"
                        >
                          Active Signal
                        </Badge>
                      )}
                      <Badge
                        variant={
                          item.status === "BUY"
                            ? "default"
                            : item.status === "SELL"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-[10px] h-5 px-1.5"
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
