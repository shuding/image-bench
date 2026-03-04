"use client";

import { Crown } from "lucide-react";
import { objectKeys } from "ts-extras";
import { useBench } from "~/lib/bench-context";
import { providers } from "~/lib/const";

export function HistoryTable() {
  const { history } = useBench();

  if (history.length === 0) return null;

  return (
    <div className="w-full flex justify-center mt-8 border-t border-border pt-8 fade-in animate-in duration-500">
      <div className="w-full flex border border-border bg-muted/5 overflow-x-auto text-sm">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-border bg-muted/10 uppercase tracking-widest text-xs text-muted-foreground">
              <th className="p-3 border-r border-border font-semibold">Run</th>
              <th className="p-3 border-r border-border font-semibold">
                Template
              </th>
              {objectKeys(providers).map((p) => (
                <th
                  key={p}
                  className="p-3 border-r border-border font-semibold last:border-r-0"
                >
                  <span className="block">{providers[p].name}</span>
                  <span className="block font-normal text-muted-foreground normal-case tracking-normal">
                    {providers[p].format}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => {
              const allProviders = objectKeys(providers);
              const isComplete =
                Object.keys(entry.durations).length === allProviders.length;

              let fastestProvider: string | null = null;
              if (isComplete) {
                let min = Infinity;
                for (const [p, d] of Object.entries(entry.durations)) {
                  if (d < min) {
                    min = d;
                    fastestProvider = p;
                  }
                }
              }

              return (
                <tr
                  key={entry.id}
                  className="border-b border-border last:border-b-0 hover:bg-muted/10 transition-colors cursor-default"
                >
                  <td className="p-3 border-r border-border font-medium">
                    #{entry.id}
                  </td>
                  <td className="p-3 border-r border-border text-muted-foreground">
                    {entry.template}
                  </td>
                  {allProviders.map((p) => {
                    const duration = entry.durations[p as string];
                    return (
                      <td
                        key={p}
                        className="p-3 border-r border-border last:border-r-0"
                      >
                        {duration ? (
                          <span className="inline-flex items-center gap-2">
                            {duration.toFixed(1)}
                            {p === fastestProvider && (
                              <Crown className="size-3 text-yellow-500 fill-yellow-500" />
                            )}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
