"use client";

import { RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { objectKeys } from "ts-extras";
import { providers, templates } from "~/lib/const";
import { type HistoryEntry, HistoryTable } from "./history-table";
import { ImageCard } from "./image-card";

let globalHistory: HistoryEntry[] = [];
let nextHistoryId = 1;

export function ImageCards({ template }: { template: keyof typeof templates }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<HistoryEntry[]>(globalHistory);

  const prevTemplateRef = useRef(template);
  const recordedRunRef = useRef<string | null>(null);

  // Clear durations on template swap
  useEffect(() => {
    if (prevTemplateRef.current !== template) {
      prevTemplateRef.current = template;
      setDurations({});
    }
  }, [template]);

  // Record completed run to history
  useEffect(() => {
    const allProviders = objectKeys(providers);
    const loadedProviders = Object.keys(durations);
    const isComplete =
      loadedProviders.length > 0 &&
      loadedProviders.length === allProviders.length;

    const runKey = `${template}-${refreshKey}`;

    if (isComplete && recordedRunRef.current !== runKey) {
      setHistory((prev) => {
        const newEntry: HistoryEntry = {
          id: nextHistoryId++,
          template,
          durations: { ...durations },
        };
        const newHistory = [newEntry, ...prev];
        globalHistory = newHistory;
        return newHistory;
      });
      recordedRunRef.current = runKey;
    }
  }, [durations, template, refreshKey]);

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
    setDurations({});
  }, []);

  const handleLoad = useCallback((provider: string, durationStr: string) => {
    const duration = parseFloat(durationStr);
    if (!Number.isNaN(duration)) {
      setDurations((prev) => ({ ...prev, [provider]: duration }));
    }
  }, []);

  let fastestProvider: string | null = null;
  const allLoadedProviders = Object.keys(durations);
  // Only show crown if at least 2 providers have loaded to prevent jumping, or just always compute it
  if (
    allLoadedProviders.length > 0 &&
    allLoadedProviders.length === objectKeys(providers).length
  ) {
    let minDuration = Infinity;
    for (const [provider, duration] of Object.entries(durations)) {
      if (duration < minDuration) {
        minDuration = duration;
        fastestProvider = provider;
      }
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 items-center">
      <div className="overflow-x-auto w-full flex justify-center">
        <div className="flex font-mono text-sm border border-border bg-transparent">
          {objectKeys(templates).map((t) => (
            <Link
              key={t}
              href={`/t/${t}`}
              className={`px-4 py-2 border-r border-border ${
                t === template
                  ? "bg-muted text-foreground"
                  : "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              {templates[t]}
            </Link>
          ))}
          <button
            type="button"
            className="px-4 py-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground flex items-center justify-center cursor-pointer"
            onClick={handleRefresh}
          >
            <RefreshCcw className="size-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-6 w-full">
        {objectKeys(providers).map((p) => (
          <div key={p} className="w-full max-w-[400px]">
            <ImageCard
              provider={p}
              template={template}
              refreshKey={refreshKey}
              isFastest={p === fastestProvider}
              onLoad={handleLoad}
            />
          </div>
        ))}
      </div>

      <HistoryTable history={history} />
    </div>
  );
}
