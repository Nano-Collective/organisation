import Link from "next/link";

export function FeaturedPackages() {
  return (
    <section className="py-12 md:py-24 px-4 md:px-6 container mx-auto">
      <div className="mb-8 sm:mb-16 border-b border-foreground/20 pb-4 sm:pb-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          Featured Packages
        </h2>
        <p className="text-xs sm:text-lg text-foreground/70 font-mono">
          Lightweight utilities built by the community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* get-md */}
        <div className="bg-background border border-foreground/20 p-8 group hover:bg-muted transition-all hover:shadow-lg dark:hover:shadow-[0_4px_20px_rgb(0,0,0,0.5)] hover:-translate-y-1 flex flex-col h-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 dark:opacity-100 pointer-events-none" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs sm:text-sm font-bold text-[#0000EE] dark:text-[#A1A1AA]">
                  [ pkg ]
                </span>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                  get-md
                </h3>
              </div>
              <span className="hidden sm:block font-mono text-xs font-bold bg-[#0000EE]/10 dark:bg-[#A1A1AA]/10 text-[#0000EE] dark:text-[#A1A1AA] px-3 py-1 uppercase tracking-wider">
                TypeScript
              </span>
            </div>
            <p className="text-sm sm:text-lg text-foreground/70 leading-relaxed mb-8 flex-grow">
              A fast, lightweight HTML to Markdown converter optimized for LLM
              consumption. Clean, well-structured markdown with intelligent
              content extraction.
            </p>
            <div>
              <Link
                href="/get-md"
                className="inline-flex h-12 items-center justify-center border border-foreground/20 bg-transparent px-8 text-sm font-semibold tracking-wide text-foreground transition-colors hover:border-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <span className="mr-3 font-bold text-[#0000EE] dark:text-[#A1A1AA] transition-colors">
                  &gt;
                </span>
                Learn more
              </Link>
            </div>
          </div>
        </div>

        {/* json-up */}
        <div className="bg-background border border-foreground/20 p-8 group hover:bg-muted transition-all hover:shadow-lg dark:hover:shadow-[0_4px_20px_rgb(0,0,0,0.5)] hover:-translate-y-1 flex flex-col h-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 dark:opacity-100 pointer-events-none" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs sm:text-sm font-bold text-[#0000EE] dark:text-[#A1A1AA]">
                  [ pkg ]
                </span>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                  json-up
                </h3>
              </div>
              <span className="hidden sm:block font-mono text-xs font-bold bg-[#0000EE]/10 dark:bg-[#A1A1AA]/10 text-[#0000EE] dark:text-[#A1A1AA] px-3 py-1 uppercase tracking-wider">
                TypeScript
              </span>
            </div>
            <p className="text-sm sm:text-lg text-foreground/70 leading-relaxed mb-8 flex-grow">
              A fast, type-safe JSON migration tool with Zod schema validation.
              Fluent builder API with automatic version tracking and full
              TypeScript type inference.
            </p>
            <div>
              <a
                href="https://github.com/Nano-Collective/json-up"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center border border-foreground/20 bg-transparent px-8 text-sm font-semibold tracking-wide text-foreground transition-colors hover:border-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <span className="mr-3 font-bold text-[#0000EE] dark:text-[#A1A1AA] transition-colors">
                  &gt;
                </span>
                View on GitHub
              </a>
            </div>
          </div>
        </div>

        {/* prompt-scrub */}
        <div className="bg-background border border-foreground/20 p-8 group hover:bg-muted transition-all hover:shadow-lg dark:hover:shadow-[0_4px_20px_rgb(0,0,0,0.5)] hover:-translate-y-1 flex flex-col h-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 dark:opacity-100 pointer-events-none" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs sm:text-sm font-bold text-[#0000EE] dark:text-[#A1A1AA]">
                  [ pkg ]
                </span>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                  prompt-scrub
                </h3>
              </div>
              <span className="hidden sm:block font-mono text-xs font-bold bg-[#0000EE]/10 dark:bg-[#A1A1AA]/10 text-[#0000EE] dark:text-[#A1A1AA] px-3 py-1 uppercase tracking-wider">
                TypeScript
              </span>
            </div>
            <p className="text-sm sm:text-lg text-foreground/70 leading-relaxed mb-8 flex-grow">
              Local-first PII scrubbing for LLM prompts. Maps emails, secrets,
              and paths to stable placeholders and rehydrates model responses
              locally.
            </p>
            <div>
              <Link
                href="/prompt-scrub"
                className="inline-flex h-12 items-center justify-center border border-foreground/20 bg-transparent px-8 text-sm font-semibold tracking-wide text-foreground transition-colors hover:border-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <span className="mr-3 font-bold text-[#0000EE] dark:text-[#A1A1AA] transition-colors">
                  &gt;
                </span>
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
