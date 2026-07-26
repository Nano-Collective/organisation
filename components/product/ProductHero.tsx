import type { ReactNode } from "react";
import { FaGithub } from "react-icons/fa";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  SubtleButtonLink,
} from "@/components/ui/motion";

interface ProductHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  githubUrl: string;
  docsUrl: string;
  /** The demo shown on the right — e.g. a terminal animation or a GIF. */
  demo: ReactNode;
  /** Release maturity, e.g. "alpha". Renders as a badge beside the title. */
  badge?: string;
  /** Shown under the badge — what the maturity label means for the reader. */
  badgeNote?: string;
}

export function ProductHero({
  eyebrow,
  title,
  description,
  githubUrl,
  docsUrl,
  demo,
  badge,
  badgeNote,
}: ProductHeroProps) {
  return (
    <section className="relative pt-12 pb-12 sm:pb-20 px-4 md:px-6 container mx-auto">
      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-16 items-center">
        {/* Left side: Typography */}
        <div className="space-y-4 sm:space-y-8 lg:pr-8">
          <StaggerItem>
            <div className="flex items-center gap-2 text-xs font-semibold font-mono text-muted-foreground uppercase tracking-widest border-b border-foreground/20 pb-2 max-w-[250px]">
              <span className="text-[#0000EE] dark:text-[#A1A1AA] font-bold">
                &gt;
              </span>
              {eyebrow}
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-4xl sm:text-5xl lg:text-[4rem] leading-[1.05] font-bold tracking-tight text-foreground break-words">
                {title}
              </h1>
              {badge && (
                <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest bg-[#0000EE] dark:bg-foreground text-white dark:text-background px-3 py-1.5">
                  {badge}
                </span>
              )}
            </div>
          </StaggerItem>

          <StaggerItem>
            <p className="text-sm sm:text-lg lg:text-xl text-foreground/70 max-w-[540px] leading-relaxed">
              {description}
            </p>
          </StaggerItem>

          {badgeNote && (
            <StaggerItem>
              <p className="border-l-2 border-[#0000EE] dark:border-[#A1A1AA] pl-4 text-xs sm:text-sm text-foreground/70 font-mono leading-relaxed max-w-[540px]">
                {badgeNote}
              </p>
            </StaggerItem>
          )}

          <StaggerItem>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 pt-4 sm:pt-6">
              <SubtleButtonLink
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-none bg-[#0000EE] dark:bg-foreground px-8 text-xs sm:text-sm font-semibold tracking-wide text-white dark:text-background transition-colors hover:bg-[#0000EE]/90 dark:hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <FaGithub className="mr-2 h-4 w-4" />
                View on GitHub
              </SubtleButtonLink>
              <SubtleButtonLink
                href={docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-none border border-foreground/20 bg-background px-8 text-xs sm:text-sm font-semibold tracking-wide text-foreground transition-colors hover:border-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Documentation
              </SubtleButtonLink>
            </div>
          </StaggerItem>
        </div>

        <StaggerItem className="w-full flex justify-center lg:justify-end mt-4 sm:mt-8 lg:mt-0 max-w-full overflow-hidden pt-4 pb-4">
          <FadeIn className="w-full max-w-[700px] border-1 border-[#0000EE] dark:border-[#A1A1AA] bg-muted relative">
            {demo}
          </FadeIn>
        </StaggerItem>
      </StaggerContainer>
    </section>
  );
}
