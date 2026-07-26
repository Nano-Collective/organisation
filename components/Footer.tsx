import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t-2 border-foreground/20 bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between gap-12 lg:gap-16">
          <div className="max-w-sm">
            <Link
              href="/"
              className="font-bold text-2xl tracking-tight flex items-center gap-2 text-foreground mb-4"
            >
              Nano Collective
            </Link>
            <p className="text-sm text-foreground/70 font-mono leading-relaxed">
              Open-source AI tools built for developers. Privacy-first,
              local-first.
            </p>
          </div>
          <div className="grid grid-cols-2 md:flex md:flex-row gap-x-8 gap-y-12 sm:gap-16 lg:gap-24">
            <div className="min-w-[140px]">
              <h4 className="font-bold text-sm text-foreground mb-4 font-mono tracking-wide uppercase border-b border-foreground/20 pb-2 inline-block">
                Products
              </h4>
              <ul className="space-y-3 font-mono text-sm text-foreground/70">
                <li>
                  <Link
                    href="/nanocoder"
                    className="hover:text-[#0000EE] dark:hover:text-[#A1A1AA] transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-[#0000EE] dark:text-[#A1A1AA] opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0">
                      &gt;
                    </span>
                    Nanocoder
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nanotune"
                    className="hover:text-[#0000EE] dark:hover:text-[#A1A1AA] transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-[#0000EE] dark:text-[#A1A1AA] opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0">
                      &gt;
                    </span>
                    Nanotune
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sentinel"
                    className="hover:text-[#0000EE] dark:hover:text-[#A1A1AA] transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-[#0000EE] dark:text-[#A1A1AA] opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0">
                      &gt;
                    </span>
                    Sentinel
                    <span className="text-[10px] uppercase tracking-widest text-foreground/50">
                      alpha
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/get-md"
                    className="hover:text-[#0000EE] dark:hover:text-[#A1A1AA] transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-[#0000EE] dark:text-[#A1A1AA] opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0">
                      &gt;
                    </span>
                    get-md
                  </Link>
                </li>
                <li>
                  <Link
                    href="/prompt-scrub"
                    className="hover:text-[#0000EE] dark:hover:text-[#A1A1AA] transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-[#0000EE] dark:text-[#A1A1AA] opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0">
                      &gt;
                    </span>
                    prompt-scrub
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/Nano-Collective/json-up"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#0000EE] dark:hover:text-[#A1A1AA] transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-[#0000EE] dark:text-[#A1A1AA] opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0">
                      &gt;
                    </span>
                    json-up
                  </a>
                </li>
              </ul>
            </div>

            <div className="min-w-[140px]">
              <h4 className="font-bold text-sm text-foreground mb-4 font-mono tracking-wide uppercase border-b border-foreground/20 pb-2 inline-block">
                Community
              </h4>
              <ul className="space-y-3 font-mono text-sm text-foreground/70">
                <li>
                  <Link
                    href="/contributors"
                    className="hover:text-[#0000EE] dark:hover:text-[#A1A1AA] transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-[#0000EE] dark:text-[#A1A1AA] opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0">
                      &gt;
                    </span>
                    Contributors
                  </Link>
                </li>

                <li>
                  <a
                    href="https://discord.gg/ktPDV6rekE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#0000EE] dark:hover:text-[#A1A1AA] transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-[#0000EE] dark:text-[#A1A1AA] opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0">
                      &gt;
                    </span>
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Nano-Collective"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#0000EE] dark:hover:text-[#A1A1AA] transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-[#0000EE] dark:text-[#A1A1AA] opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0">
                      &gt;
                    </span>
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            <div className="min-w-[100px]">
              <h4 className="font-bold text-sm text-foreground mb-4 font-mono tracking-wide uppercase border-b border-foreground/20 pb-2 inline-block">
                Resources
              </h4>
              <ul className="space-y-3 font-mono text-sm text-foreground/70">
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-[#0000EE] dark:hover:text-[#A1A1AA] transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-[#0000EE] dark:text-[#A1A1AA] opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0">
                      &gt;
                    </span>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/growth"
                    className="hover:text-[#0000EE] dark:hover:text-[#A1A1AA] transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-[#0000EE] dark:text-[#A1A1AA] opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0">
                      &gt;
                    </span>
                    Growth
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sponsor"
                    className="hover:text-[#0000EE] dark:hover:text-[#A1A1AA] transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-[#0000EE] dark:text-[#A1A1AA] opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0">
                      &gt;
                    </span>
                    Sponsor
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pipeline"
                    className="hover:text-[#0000EE] dark:hover:text-[#A1A1AA] transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-[#0000EE] dark:text-[#A1A1AA] opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0">
                      &gt;
                    </span>
                    Build
                  </Link>
                </li>
                <li>
                  <Link
                    href="/assets"
                    className="hover:text-[#0000EE] dark:hover:text-[#A1A1AA] transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-[#0000EE] dark:text-[#A1A1AA] opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0">
                      &gt;
                    </span>
                    Assets
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-foreground/60 font-mono">
          <p>
            © {new Date().getFullYear()} Nano Collective. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="hover:text-[#0000EE] dark:hover:text-[#A1A1AA] transition-colors"
            >
              [ Privacy ]
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
