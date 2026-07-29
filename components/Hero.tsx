import Link from "next/link";
import AsciiWebsiteBackgroundGenerated from "@/components/ui/AsciiWebsiteBackgroundGenerated";

export function Hero() {
  return (
    <section className="relative overflow-x-clip pt-12 pb-12 sm:pb-20 px-4 md:px-6 container mx-auto">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#0000EE]/5 blur-[120px] rounded-full pointer-events-none hidden dark:block" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-16 items-center lg:items-stretch">
        {/* Left side: Typography */}
        <div className="space-y-4 sm:space-y-8 lg:pr-8">
          <div className="flex items-center gap-2 text-xs font-semibold font-mono text-muted-foreground uppercase tracking-widest border-b border-foreground/20 pb-2 max-w-[200px]">
            <span className="text-[#0000EE] dark:text-[#A1A1AA] font-bold">
              &gt;
            </span>
            Open Source AI Tools
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] leading-[1.05] font-bold tracking-tight text-foreground break-words">
            Local-first AI tools, built for the{" "}
            <span
              className="font-serif font-medium text-[#0000EE] dark:text-[#A1A1AA] text-[1.1em]"
              style={{ fontFamily: '"Newsreader", Georgia, serif' }}
            >
              people who use them
            </span>
          </h1>

          <p className="text-sm sm:text-lg lg:text-xl text-foreground/70 max-w-[540px] leading-relaxed">
            Nano Collective is a home for privacy-respecting, local-first AI
            tools that help developers build, automate, and ship faster without
            surrendering control.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 pt-4 sm:pt-6">
            <Link
              href="#products"
              className="inline-flex h-12 items-center justify-center rounded-none bg-[#0000EE] dark:bg-foreground px-8 text-xs sm:text-sm font-semibold tracking-wide text-white dark:text-background transition-colors hover:bg-[#0000EE]/90 dark:hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Explore Projects
            </Link>
            <a
              href="https://github.com/Nano-Collective"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-none border border-foreground/20 bg-background px-8 text-xs sm:text-sm font-semibold tracking-wide text-foreground transition-colors hover:border-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div className="w-full flex justify-center lg:justify-end mt-4 sm:mt-8 lg:mt-0 max-w-full overflow-hidden pt-4 pb-4 sm:pr-4 sm:pl-1 lg:h-full">
          <div className="bg-muted border-2 border-[#0000EE] dark:border-[#A1A1AA] shadow-[4px_4px_0px_0px_rgba(0,0,238,1)] dark:shadow-[4px_4px_0px_0px_#A1A1AA] sm:shadow-[8px_8px_0px_0px_rgba(0,0,238,1)] dark:sm:shadow-[8px_8px_0px_0px_#A1A1AA] transition-transform hover:-translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,238,1)] dark:hover:shadow-[2px_2px_0px_0px_#A1A1AA] sm:hover:shadow-[4px_4px_0px_0px_rgba(0,0,238,1)] dark:sm:hover:shadow-[4px_4px_0px_0px_#A1A1AA] max-w-[700px] overflow-hidden w-full lg:h-full">
            <div
              className="w-full overflow-hidden lg:h-full"
              aria-hidden="true"
            >
              <AsciiWebsiteBackgroundGenerated fill />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
