import { Crown } from "lucide-react";
import { objectKeys } from "ts-extras";
import { providers } from "~/lib/const";

export type HistoryEntry = {
  id: number;
  template: string;
  durations: Record<string, number>;
};

export function HistoryTable({ history }: { history: HistoryEntry[] }) {
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
                  {providers[p].title} (ms)
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => {
              let minDuration = Infinity;
              let fastestProvider: string | null = null;
              const allProviders = objectKeys(providers);
              const isComplete =
                Object.keys(entry.durations).length === allProviders.length;

              if (isComplete) {
                for (const [provider, duration] of Object.entries(
                  entry.durations,
                )) {
                  if (duration < minDuration) {
                    minDuration = duration;
                    fastestProvider = provider;
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
                    const isFastest = p === fastestProvider;
                    return (
                      <td
                        key={p}
                        className="p-3 border-r border-border last:border-r-0"
                      >
                        {duration ? (
                          <span className="inline-flex items-center gap-2">
                            {duration.toFixed(1)}
                            {isFastest && (
                              <Crown className="size-3 text-yellow-500 fill-yellow-500" />
                            )}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
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
