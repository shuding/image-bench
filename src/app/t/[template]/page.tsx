import { objectKeys } from "ts-extras";
import { ImageCards } from "~/components/image-cards";
import { templates } from "~/lib/const";

export default async function Home({ params }: PageProps<"/t/[template]">) {
  const template = (await params).template as keyof typeof templates;

  return (
    <main className="flex flex-col min-h-screen container mx-auto px-4 py-8 font-mono">
      <div className="flex flex-col gap-2 w-full max-w-5xl mx-auto border-b pb-6 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">$ image-bench</h1>
        <p className="text-sm text-muted-foreground w-full max-w-2xl leading-relaxed">
          Figure out exactly how fast image generation can be. Check the{" "}
          <a
            href="https://github.com/kane50613/image-bench/blob/master/src/app/render/route.tsx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline underline-offset-4"
          >
            source
          </a>{" "}
          to see how it measures.
        </p>
      </div>
      <div className="w-full flex flex-col items-center justify-center">
        <ImageCards template={template} />
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return objectKeys(templates).map((template) => ({
    template,
  }));
}
