"use client";

import { RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { objectKeys } from "ts-extras";
import { providers, templates } from "~/lib/const";
import { type HistoryEntry, HistoryTable } from "./history-table";
import { ImageCard } from "./image-card";

let globalHistory: HistoryEntry[] = [];

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
        const nextId =
          prev.length > 0 ? Math.max(...prev.map((e) => e.id)) + 1 : 1;
        const newEntry: HistoryEntry = {
          id: nextId,
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

  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the sentinel is NOT intersecting, it means we've scrolled past it
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px 0px 0px 0px" },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 items-center">
      <div ref={sentinelRef} className="h-px w-full -mb-8" />
      <div className="sticky top-0 z-20 w-full -mt-4 pt-4 pb-48 -mb-48 pointer-events-none">
        <div
          className={`absolute inset-0 bg-background/40 backdrop-blur-xl mask-[linear-gradient(to_bottom,black_25%,transparent)] transition-opacity duration-500 ${
            isSticky ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="relative w-full pointer-events-auto">
          <div className="flex font-mono text-sm border border-border bg-background w-full md:w-max mx-auto shadow-lg overflow-hidden">
            <div className="flex overflow-x-auto flex-1 no-scrollbar">
              {objectKeys(templates).map((t) => (
                <Link
                  key={t}
                  href={`/t/${t}`}
                  className={`px-4 py-2 border-r border-border shrink-0 whitespace-nowrap transition-colors ${
                    t === template
                      ? "bg-muted text-foreground"
                      : "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  {templates[t]}
                </Link>
              ))}
            </div>
            <button
              type="button"
              className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 cursor-pointer shrink-0 transition-all active:scale-95 group font-bold uppercase tracking-wider text-xs"
              onClick={handleRefresh}
              title="Refresh Images"
            >
              <RefreshCcw className="size-3.5 group-active:rotate-180 transition-transform duration-500" />
              <span className="hidden md:inline">Run</span>
            </button>
          </div>
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
