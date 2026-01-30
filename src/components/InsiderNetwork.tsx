"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, GitCommit, GitPullRequest, User } from "lucide-react";

// Tipe data yang dikembalikan backend Graph
interface Relation {
  entity: string;
  related_company: string;
  role: string;
}

export function InsiderNetwork({
  symbol,
  relations,
}: {
  symbol: string;
  relations: Relation[];
}) {
  if (!relations || relations.length === 0) return null;

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <GitPullRequest className="w-5 h-5" />
          Insider Connections ({symbol})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative border-l-2 border-zinc-800 ml-3 space-y-6 pb-2">
          {relations.map((rel, i) => (
            <div key={i} className="relative pl-6">
              {/* Dot Connector */}
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-zinc-900 border-2 border-purple-500" />

              <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50 hover:border-purple-500/50 transition-colors">
                {/* The Connector (Person) */}
                <div className="flex items-center gap-2 mb-2 border-b border-zinc-700/50 pb-2">
                  <User className="w-4 h-4 text-zinc-400" />
                  <span className="font-bold text-zinc-200">{rel.entity}</span>
                  <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded-full ml-auto">
                    {rel.role}
                  </span>
                </div>

                {/* The Target (Company) */}
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <GitCommit className="w-4 h-4 rotate-90" />
                  Also connects to:
                  <span className="flex items-center gap-1 text-white font-mono bg-zinc-900 px-2 rounded">
                    <Building className="w-3 h-3" /> {rel.related_company}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-zinc-500 text-center bg-zinc-950 py-2 rounded">
          ⚠️ High Alert: Movement in {symbol} often correlates with connected
          companies.
        </div>
      </CardContent>
    </Card>
  );
}
