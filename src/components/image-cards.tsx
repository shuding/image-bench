"use client";

import { RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { objectKeys } from "ts-extras";
import { useBench } from "~/lib/bench-context";
import { providers, templates } from "~/lib/const";
import { HistoryTable } from "./history-table";
import { ImageCard } from "./image-card";

export function ImageCards({ template }: { template: keyof typeof templates }) {
  const { refresh } = useBench();

  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0 },
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Sticky toolbar — sentinel lives inside as an abs element so it doesn't add gap */}
      <div className="sticky top-0 z-20 w-full pb-48 -mb-48 pointer-events-none">
        {/* IntersectionObserver target at the very top edge */}
        <div ref={sentinelRef} className="absolute -top-px h-px w-full" />

        <div
          className={`absolute inset-0 bg-background/60 backdrop-blur-2xl mask-[linear-gradient(to_bottom,black_30%,transparent)] transition-opacity duration-500 ${
            isSticky ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="relative w-full pointer-events-auto">
          <div className="flex flex-col border border-border bg-background/80 w-full md:w-max mx-auto shadow-2xl overflow-hidden">
            <div className="flex">
              <div className="flex overflow-x-auto flex-1 no-scrollbar">
                {objectKeys(templates).map((t) => (
                  <Link
                    key={t}
                    href={`/t/${t}`}
                    className={`px-4 py-2.5 border-r border-border shrink-0 whitespace-nowrap transition-colors text-sm ${
                      t === template
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    {templates[t]}
                  </Link>
                ))}
              </div>
              <button
                type="button"
                className="px-6 py-2.5 bg-muted text-foreground border-l border-border hover:bg-muted/80 flex items-center justify-center gap-2 cursor-pointer shrink-0 transition-all active:scale-95 group font-bold uppercase tracking-widest text-xs"
                onClick={refresh}
                title="Re-run benchmark"
              >
                <RefreshCcw className="size-3.5 group-active:rotate-180 transition-transform duration-500" />
                <span className="hidden md:inline">Run</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Provider grid — top 4, bottom 3 */}
      {(() => {
        const keys = objectKeys(providers);
        const top = keys.slice(0, 4);
        const bottom = keys.slice(4);
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              {top.map((p) => (
                <ImageCard key={p} provider={p} template={template} />
              ))}
            </div>
            {bottom.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full lg:w-3/4 mx-auto">
                {bottom.map((p) => (
                  <ImageCard key={p} provider={p} template={template} />
                ))}
              </div>
            )}
          </>
        );
      })()}

      {/* History */}
      <HistoryTable />
    </div>
  );
}
