import Link from "next/link";

export function CommunityCTA() {
  return (
    <section className="py-20 md:py-32 px-4 md:px-6 bg-[#0000EE] text-white">
      <div className="container mx-auto max-w-3xl text-center">
        <div className="font-mono text-xs md:text-sm font-bold uppercase tracking-widest mb-6 opacity-80">
          [ Join the Collective ]
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 md:mb-8">
          Bring your project under the umbrella.
        </h2>
        <p className="text-sm sm:text-lg md:text-xl opacity-90 mb-12 leading-relaxed max-w-2xl mx-auto">
          The Nano Collective is a home for independent projects, not only our
          own. If you are building AI tooling that respects privacy, runs on the
          user's own hardware, or opens up something proprietary, it can ship
          under the collective's brand, distribution rails, and infrastructure
          defaults. Anyone can propose. No application form, no contribution
          history required.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
          <Link
            href="/pipeline"
            className="inline-flex h-14 items-center justify-center rounded-none bg-white px-10 text-sm font-bold tracking-wide text-[#0000EE] transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0000EE]"
          >
            Read the pipeline
          </Link>
          <a
            href="https://discord.gg/ktPDV6rekE"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center rounded-none border-2 border-white bg-transparent px-10 text-sm font-bold tracking-wide text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0000EE]"
          >
            Join Discord
          </a>
          <a
            href="https://github.com/Nano-Collective"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center rounded-none border-2 border-white bg-transparent px-10 text-sm font-bold tracking-wide text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0000EE]"
          >
            Contribute on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
