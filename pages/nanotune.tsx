import {
  Check,
  Code,
  Cpu,
  Globe,
  Server,
  Settings,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";
import Head from "next/head";
import { Footer } from "@/components/Footer";
import NanotuneTerminal from "@/components/NanotuneTerminal";
import { type Feature, FeatureGrid } from "@/components/product/FeatureGrid";
import { FinalCTA } from "@/components/product/FinalCTA";
import { ProductHero } from "@/components/product/ProductHero";
import {
  type InstallCommand,
  QuickStart,
} from "@/components/product/QuickStart";
import { type Reason, ReasonsGrid } from "@/components/product/ReasonsGrid";
import { SponsorsSection } from "@/components/product/SponsorsSection";
import { SectionReveal } from "@/components/ui/motion";

const GITHUB_URL = "https://github.com/Nano-Collective/nanotune";
const DOCS_URL = "https://docs.nanocollective.org/nanotune/docs";

const features: Feature[] = [
  {
    icon: Cpu,
    title: "Apple Silicon Native",
    description:
      "Optimized for MLX to leverage unified memory architecture, delivering blazing fast local fine-tuning on Mac.",
  },
  {
    icon: Globe,
    title: "Interactive TUI",
    description:
      "No complex YAML configs or endless CLI flags. A clean, interactive interface guides you through every step.",
  },
  {
    icon: Zap,
    title: "End-to-End Pipeline",
    description:
      "Automatically handles dataset validation, ChatML formatting, training loops, and LoRA fusion.",
  },
  {
    icon: Settings,
    title: "Built-In Evaluation",
    description:
      "Validate model performance with integrated LLM judge and benchmarking suites directly from the CLI.",
  },
  {
    icon: Server,
    title: "GGUF Export",
    description:
      "Export your tuned models to standard GGUF format for direct use in Ollama, LM Studio, or llama.cpp.",
  },
  {
    icon: Code,
    title: "Instant Chat REPL",
    description:
      "Test your fine-tuned models immediately via the built-in chat interface. No external tools required.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Train models entirely offline. Your proprietary datasets never leave your machine.",
  },
  {
    icon: Terminal,
    title: "Terminal Native",
    description:
      "Designed explicitly for terminal workflows. Fits seamlessly into your existing developer environment.",
  },
];

const reasons: Reason[] = [
  {
    icon: Code,
    title: "100% Open Source",
    description:
      "Read the code. Audit the code. Improve the code. It belongs to the community, not a corporation.",
  },
  {
    icon: Cpu,
    title: "Apple Silicon Optimized",
    description:
      "Built specifically for M-series chips to maximize training efficiency using MLX.",
  },
  {
    icon: Globe,
    title: "Zero Vendor Lock-In",
    description:
      "Export your models to universally supported formats. Your workflow remains entirely yours.",
  },
  {
    icon: Shield,
    title: "Absolute Privacy",
    description:
      "Fine-tune on sensitive company data without fear of leaks or API terms of service changes.",
  },
  {
    icon: Zap,
    title: "Community Driven",
    description:
      "Features are built based on what developers actually need, not what looks good in a marketing pitch.",
  },
  {
    icon: Settings,
    title: "Highly Extensible",
    description:
      "Seamlessly integrates with the broader MLX and llama.cpp ecosystems for advanced use cases.",
  },
];

const installCommands: InstallCommand[] = [
  { label: "NPM", command: "npm install -g @nanocollective/nanotune" },
  { label: "NPX", command: "npx @nanocollective/nanotune init" },
];

export default function NanotunePage() {
  return (
    <>
      <Head>
        <title>Nanotune | Nano Collective</title>
        <meta
          name="description"
          content="A simple, interactive CLI for fine-tuning small language models on Apple Silicon. Built by a community collective rather than a company."
        />
        <meta property="og:title" content="Nanotune | Nano Collective" />
        <meta
          property="og:description"
          content="A simple, interactive CLI for fine-tuning small language models on Apple Silicon. Built by a community collective rather than a company."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nanocollective.org/nanotune" />
        <meta property="og:image" content="/og-image.png" />
      </Head>

      <div className="min-h-screen bg-background font-sans flex flex-col">
        <ProductHero
          eyebrow="OPEN SOURCE MODEL TUNING"
          title="Nanotune"
          description="A simple, interactive CLI for fine-tuning small language models on Apple Silicon. No YAML configs, no complex flags - just an interactive TUI."
          githubUrl={GITHUB_URL}
          docsUrl={DOCS_URL}
          demo={<NanotuneTerminal />}
        />

        <div className="border-t-2 border-foreground/20" />

        <main className="flex-1">
          {/* What Is Nanotune */}
          <SectionReveal>
            <section className="py-16 sm:py-24 border-b border-foreground/20">
              <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                    Not for profit. For the community.
                  </h2>
                  <div className="space-y-6 text-sm sm:text-base md:text-lg text-foreground/70 leading-relaxed font-medium">
                    <p>
                      Nanotune is a simple, interactive CLI for fine-tuning
                      small language models on Apple Silicon. No YAML configs,
                      no complex flags - just an interactive TUI that guides you
                      through each step.
                    </p>
                    <p>
                      Built by the Nano Collective, a community collective
                      building AI tooling not for profit, but for the community.
                      Everything we build is open, transparent, and driven by
                      the people who use it.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </SectionReveal>

          <FeatureGrid features={features} />

          {/* Workflow Examples */}
          <SectionReveal>
            <section className="py-16 sm:py-24 border-b border-foreground/20">
              <div className="container mx-auto px-4 md:px-6">
                <div>
                  <div className="mb-12 sm:mb-16 text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                      Realistic workflows.
                    </h2>
                    <p className="text-md text-foreground/70 mt-4 max-w-2xl mx-auto">
                      Nanotune handles dataset formatting, local fine-tuning,
                      and inference testing natively in your terminal.
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Example 1 */}
                    <div className="flex flex-col border border-foreground/20 bg-background">
                      <div className="h-10 border-b border-foreground/20 flex items-center px-4 bg-muted/30 gap-2 font-mono text-xs text-foreground/70 uppercase tracking-widest font-bold">
                        <Terminal className="w-4 h-4" />
                        Dataset
                      </div>
                      <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto bg-background dark:bg-[#111] text-foreground dark:text-zinc-300 flex-1">
                        <div className="text-[#0000EE] dark:text-pink-400 mb-4 font-bold dark:font-normal">
                          $ nanotune data add
                        </div>
                        <div className="text-green-600 dark:text-green-400 font-bold mb-3">
                          Nanotune - Add Training Data
                        </div>
                        <div className="text-foreground/90 dark:text-blue-400 mb-3">
                          Examples: 12{"   "}|{"   "}Building: 1 turn
                        </div>
                        <div className="text-foreground/50 dark:text-zinc-500 mb-1">
                          User input:
                        </div>
                        <div className="text-foreground/80 dark:text-zinc-300 mb-3 border-l-2 border-foreground/20 dark:border-zinc-700 pl-4 py-2 bg-muted/50 dark:bg-zinc-900/50">
                          How do I reverse a list in Python?
                        </div>
                        <div className="text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
                          <Check className="w-4 h-4" /> Turn added!
                        </div>
                        <div className="text-foreground/50 dark:text-zinc-500">
                          [Enter] Submit{"  "}[Tab] Switch{"  "}[Esc] Save &
                          exit
                        </div>
                      </div>
                    </div>

                    {/* Example 2 */}
                    <div className="flex flex-col border border-foreground/20 bg-background">
                      <div className="h-10 border-b border-foreground/20 flex items-center px-4 bg-muted/30 gap-2 font-mono text-xs text-foreground/70 uppercase tracking-widest font-bold">
                        <Terminal className="w-4 h-4" />
                        Train
                      </div>
                      <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto bg-background dark:bg-[#111] text-foreground dark:text-zinc-300 flex-1">
                        <div className="text-[#0000EE] dark:text-pink-400 mb-4 font-bold dark:font-normal">
                          $ nanotune train --model mistral-7b
                        </div>
                        <div className="text-green-600 dark:text-green-400 font-bold mb-3">
                          Nanotune - Training
                        </div>
                        <div className="mb-1 whitespace-pre">
                          <span className="text-foreground/50 dark:text-zinc-500">
                            Progress:{" "}
                          </span>
                          <span className="text-green-600 dark:text-green-400">
                            ███████████
                          </span>
                          <span className="text-zinc-300 dark:text-zinc-700">
                            ░░░░░
                          </span>
                          <span className="text-foreground/50 dark:text-zinc-500">
                            {" "}
                            72%
                          </span>
                        </div>
                        <div className="text-foreground/50 dark:text-zinc-500 mb-3">
                          Iteration: 108/150
                        </div>
                        <div className="text-foreground/80 dark:text-zinc-300 mb-4">
                          Train Loss:{" "}
                          <span className="text-green-600 dark:text-green-400">
                            0.184
                          </span>{" "}
                          · Val Loss:{" "}
                          <span className="text-green-600 dark:text-green-400">
                            0.206
                          </span>
                        </div>
                        <div className="text-foreground/50 dark:text-zinc-500">
                          [Ctrl+C] Stop training (checkpoint saved)
                        </div>
                      </div>
                    </div>

                    {/* Example 3 */}
                    <div className="flex flex-col border border-foreground/20 bg-background">
                      <div className="h-10 border-b border-foreground/20 flex items-center px-4 bg-muted/30 gap-2 font-mono text-xs text-foreground/70 uppercase tracking-widest font-bold">
                        <Terminal className="w-4 h-4" />
                        Chat
                      </div>
                      <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto bg-background dark:bg-[#111] text-foreground dark:text-zinc-300 flex-1">
                        <div className="text-[#0000EE] dark:text-pink-400 mb-4 font-bold dark:font-normal">
                          $ nanotune chat
                        </div>
                        <div className="text-green-600 dark:text-green-400 font-bold">
                          Nanotune - Chat
                        </div>
                        <div className="text-foreground/50 dark:text-zinc-500 mb-3">
                          Model: mistral-7b-q4_k_m.gguf • System: system
                        </div>
                        <div className="text-amber-600 dark:text-yellow-400 font-bold">
                          You:
                        </div>
                        <div className="text-foreground/80 dark:text-zinc-300 mb-3">
                          What is a tensor?
                        </div>
                        <div className="text-green-600 dark:text-green-400 font-bold">
                          Model:
                        </div>
                        <div className="text-foreground/80 dark:text-zinc-300 mb-2">
                          A tensor is a multi-dimensional array that generalizes
                          scalars, vectors, and matrices...
                        </div>
                        <div className="text-foreground/50 dark:text-zinc-500">
                          TTFT 187ms · 18.3 tok/s · 92 tokens
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </SectionReveal>

          <QuickStart commands={installCommands} />

          <ReasonsGrid product="Nanotune" reasons={reasons} />

          <SponsorsSection exclude={["Atlas Cloud"]} />

          <FinalCTA docsUrl={DOCS_URL} githubUrl={GITHUB_URL} />
        </main>

        <Footer />
      </div>
    </>
  );
}
