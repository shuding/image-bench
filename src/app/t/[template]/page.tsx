import { objectKeys } from "ts-extras";
import { ImageCards } from "~/components/image-cards";
import { BenchProvider } from "~/lib/bench-context";
import { providers, templates } from "~/lib/const";

export default async function TemplatePage({
  params,
}: PageProps<"/t/[template]">) {
  const template = (await params).template as keyof typeof templates;

  return (
    <BenchProvider template={template}>
      <main className="flex flex-col min-h-screen font-mono">
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <header className="relative border-b border-border overflow-hidden">
          {/* Subtle grid bg */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Gradient orb */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

          <div className="relative container mx-auto px-4 py-10 max-w-5xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground border border-border px-3 py-1 mb-4">
              <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
              {objectKeys(providers).length} providers ·{" "}
              {objectKeys(templates).length} templates
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              <span className="text-muted-foreground font-normal">$ </span>
              image-bench
            </h1>

            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              Measure exactly how fast each image generation backend can render.
              Pick a template, hit{" "}
              <span className="text-foreground font-semibold">Run</span>, and
              compare.{" "}
              <a
                href="https://github.com/kane50613/image-bench/blob/master/src/app/render/route.tsx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                View source →
              </a>
            </p>
          </div>
        </header>

        {/* ── Bench ──────────────────────────────────────────────────── */}
        <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
          <ImageCards template={template} />
        </div>
      </main>
    </BenchProvider>
  );
}

export function generateStaticParams() {
  return objectKeys(templates).map((template) => ({ template }));
}
