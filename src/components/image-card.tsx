"use client";

import { Crown, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { useBench } from "~/lib/bench-context";
import {
  defaultHeight,
  defaultWidth,
  type ImageFormat,
  providers,
  type templates,
} from "~/lib/const";
import { useImage } from "~/lib/use-image";
import { Skeleton } from "./ui/skeleton";

const FORMAT_STYLES: Record<ImageFormat, string> = {
  PNG: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  "WebP Lossy 75%": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "WebP Lossless": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

export function ImageCard({
  template,
  provider,
}: {
  template: keyof typeof templates;
  provider: keyof typeof providers;
}) {
  const { refreshKey, fastestProvider, recordDuration, durations } = useBench();
  const isFastest = provider === fastestProvider;
  const meta = providers[provider];

  const image = useImage(
    provider,
    template,
    defaultWidth,
    defaultHeight,
    refreshKey,
  );

  useEffect(() => {
    if (image?.duration) recordDuration(provider, image.duration);
  }, [image?.duration, provider, recordDuration]);

  const duration = durations[provider as string];
  const aspectRatio = defaultWidth / defaultHeight;

  return (
    <div
      className={`relative overflow-hidden border font-mono text-xs transition-all duration-500 ${
        isFastest
          ? "border-primary/50 shadow-[0_0_20px_-6px] shadow-primary/40"
          : "border-border"
      }`}
    >
      {/* Top-edge glow on winner */}
      {isFastest && (
        <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-primary to-transparent" />
      )}

      {/* ── Header ── single compact row ─────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/10">
        <a
          href={meta.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold hover:text-primary transition-colors group/lnk"
        >
          {meta.name}
          <ExternalLink className="size-2.5 opacity-0 group-hover/lnk:opacity-50 transition-opacity" />
        </a>
        <span className="text-muted-foreground truncate">{meta.engine}</span>
        <span
          className={`ml-auto shrink-0 border px-1.5 py-px font-semibold uppercase tracking-wider text-[9px] ${FORMAT_STYLES[meta.format]}`}
        >
          {meta.format}
        </span>
      </div>

      {/* ── Image ── edge-to-edge ─────────────────────────────────────── */}
      <div className="relative bg-muted/5">
        {image?.src ? (
          // biome-ignore lint/performance/noImgElement: intentional raw image
          <img
            src={image.src}
            alt={template}
            className="w-full object-cover animate-in fade-in duration-400"
            width={defaultWidth}
            height={defaultHeight}
          />
        ) : (
          <Skeleton className="w-full rounded-none" style={{ aspectRatio }} />
        )}
      </div>

      {/* ── Footer ── duration + filesize in one row ──────────────────── */}
      <div className="flex items-center gap-3 px-3 py-2 border-t border-border bg-muted/5">
        {/* Duration — dominant metric */}
        <span
          className={`tabular-nums font-bold text-sm leading-none ${
            isFastest ? "text-primary" : "text-foreground"
          }`}
        >
          {duration != null ? `${duration.toFixed(1)} ms` : "— ms"}
        </span>

        {isFastest && (
          <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-yellow-500 animate-in fade-in duration-500">
            <Crown className="size-2.5 fill-yellow-500" />
            fastest
          </span>
        )}

        <span className="ml-auto text-muted-foreground tabular-nums">
          {image?.filesize ?? "—"}
        </span>
      </div>
    </div>
  );
}
