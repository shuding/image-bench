"use client";

import { Crown } from "lucide-react";
import { useEffect } from "react";
import type { templates } from "~/lib/const";
import { defaultHeight, defaultWidth, providers } from "~/lib/const";
import { useImage } from "~/lib/use-image";
import { Skeleton } from "./ui/skeleton";

export function ImageCard({
  template,
  provider,
  refreshKey,
  isFastest,
  onLoad,
}: {
  template: keyof typeof templates;
  provider: keyof typeof providers;
  refreshKey: number;
  isFastest: boolean;
  onLoad: (provider: string, durationStr: string) => void;
}) {
  const aspectRatio = defaultWidth / defaultHeight;
  const image = useImage(
    provider,
    template,
    defaultWidth,
    defaultHeight,
    refreshKey,
  );

  useEffect(() => {
    if (image?.duration) {
      onLoad(provider, image.duration);
    }
  }, [image?.duration, provider, onLoad]);

  return (
    <div className="font-mono rounded-none border border-border shadow-none bg-transparent overflow-hidden">
      <div className="flex justify-between items-center px-3 py-2 border-b border-border bg-muted/20">
        <a
          href={providers[provider].url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="inline-flex items-center gap-2 font-bold hover:underline">
            {providers[provider].title}
            {isFastest && (
              <Crown className="size-4 text-yellow-500 fill-yellow-500" />
            )}
          </span>
        </a>
        <span className="text-xs text-muted-foreground">{template}</span>
      </div>
      <div className="bg-muted/10">
        {image?.src ? (
          // biome-ignore lint/performance/noImgElement: We want raw image
          <img
            src={image.src}
            alt={template}
            className="w-full object-cover"
            width={defaultWidth}
            height={defaultHeight}
          />
        ) : (
          <Skeleton className="w-full rounded-none" style={{ aspectRatio }} />
        )}
      </div>
      <div className="grid grid-cols-3 text-xs border-t border-border divide-x divide-border bg-muted/5">
        <ImageCardStat
          label="Duration"
          value={image?.duration ? `${image.duration}ms` : "-"}
        />
        <ImageCardStat
          label="Resolution"
          value={`${defaultWidth}x${defaultHeight}`}
        />
        <ImageCardStat label="Filesize" value={image?.filesize ?? "-"} />
      </div>
    </div>
  );
}

function ImageCardStat({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="p-3 flex flex-col gap-1.5">
      <span className="text-muted-foreground font-semibold uppercase text-xs tracking-wider">
        {label}
      </span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
