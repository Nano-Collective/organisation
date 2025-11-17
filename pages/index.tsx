import Head from "next/head";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code2,
  Terminal,
  Zap,
  Users,
  Lock,
  Sparkles,
  Package,
} from "lucide-react";
import Footer from "@/components/footer";
import NanocoderTerminal from "@/components/NanocoderTerminal";
import WhatsNextSection from "@/components/WhatsNextSection";
import Link from "next/link";
import { GetStaticProps } from "next";
import { Discussion } from "@/types/discussion";
import { FaDiscord, FaGithub } from "react-icons/fa";

interface HomeProps {
  discussions: Discussion[];
}

export default function Home({ discussions }: HomeProps) {
  return (
    <>
      <Head>
        <title>Nano Collective - Open Source Privacy-First AI Tools</title>
        <meta
          name="description"
          content="Creating powerful, privacy-first AI tools, developed by the community for the community. Privacy-first, open source AI that runs on your machine."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-background font-sans">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
          <div className="container mx-auto px-4 py-20 sm:py-32 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-block">
                <Badge variant="secondary" className="mb-4 text-sm px-4 py-1.5">
                  Open Source AI
                </Badge>
              </div>
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                Nano Collective
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Creating powerful, privacy-first AI tools, developed by the
                community for the community
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 w-full sm:w-auto">
                <Button
                  size="lg"
                  className="group text-base w-full sm:w-auto"
                  asChild
                >
                  <a
                    href="https://github.com/Nano-Collective"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    View on GitHub
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="group text-base w-full sm:w-auto"
                  asChild
                >
                  <a
                    href="https://github.com/Nano-Collective/nanocoder"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Terminal className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Try Nanocoder
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="pt-20 pb-10 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe AI is too powerful to be in the hands of big
                corporations alone. Everyone should have access to advanced AI
                tools that respect privacy, run locally, and are shaped by the
                community. Everything we build is open source, transparent, and
                designed to empower developers and users alike.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Privacy First</CardTitle>
                  <CardDescription className="text-base">
                    Your data should stay on your machine. We're building
                    privacy-first architectures to ensure complete control.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Community Driven</CardTitle>
                  <CardDescription className="text-base">
                    Built by developers, for developers. We're doing true open
                    source and transparent work from day one.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>New Capabilities</CardTitle>
                  <CardDescription className="text-base">
                    We're building the next generation of AI tools that run
                    locally and offline. Powerful, flexible, and private.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Nanocoder Showcase */}
        <section className="py-20 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center space-y-4 mb-12">
                <Badge variant="outline" className="mb-2">
                  Featured Project
                </Badge>
                <h2 className="text-4xl sm:text-5xl font-bold">Nanocoder</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  A beautiful privacy-first coding agent running in your
                  terminal
                </p>
              </div>

              <div className="space-y-8">
                {/* Terminal Demo */}
                <NanocoderTerminal />

                {/* Features List */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Code2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="mb-2">
                            Multi-Provider Support
                          </CardTitle>
                          <CardDescription>
                            Works with OpenAI-style APIs, local models (Ollama,
                            LM Studio), and cloud providers (OpenRouter)
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Terminal className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="mb-2">
                            Advanced Tool System
                          </CardTitle>
                          <CardDescription>
                            Built-in file operations and command execution,
                            extensible via Model Context Protocol (MCP)
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="mb-2">
                            Custom Commands
                          </CardTitle>
                          <CardDescription>
                            Create markdown-based custom prompts with template
                            variables and namespace support
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Zap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="mb-2">Enhanced UX</CardTitle>
                          <CardDescription>
                            Smart autocomplete, configurable logging, and
                            development mode toggles for the best experience
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </div>

                {/* CTA */}
                <div className="text-center pt-8">
                  <Button
                    size="lg"
                    className="group text-base w-full sm:w-auto"
                    asChild
                  >
                    <a
                      href="https://github.com/Nano-Collective/nanocoder"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                      Explore Nanocoder
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Packages Section */}
        <section className="py-20 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center space-y-3 mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  Featured Packages
                </h2>
                <p className="text-base text-muted-foreground">
                  Lightweight utilities built by the community
                </p>
              </div>

              <div className="grid md:grid-cols-1 gap-4">
                <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <CardTitle className="text-lg">get-md</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            TypeScript
                          </Badge>
                        </div>
                        <CardDescription className="text-sm leading-relaxed">
                          A fast, lightweight HTML to Markdown converter
                          optimized for LLM consumption. Clean, well-structured
                          markdown with intelligent content extraction.
                        </CardDescription>
                        <div className="mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="group"
                            asChild
                          >
                            <a
                              href="https://github.com/Nano-Collective/get-md"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaGithub className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                              View on GitHub
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* What's Next Section */}
        <WhatsNextSection discussions={discussions} />

        {/* Get Involved Section */}
        <section className="py-20 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl sm:text-5xl font-bold">Get Involved</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We welcome contributions in code, documentation, design, and
                marketing. Join our community and help shape the future of
                privacy-first AI tools.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto pt-4">
                <Button size="lg" className="group w-full" asChild>
                  <a
                    href="https://github.com/Nano-Collective"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Contribute on GitHub
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="group w-full"
                  asChild
                >
                  <a
                    href="https://discord.gg/ktPDV6rekE"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaDiscord className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Join Discord
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="group w-full sm:col-span-2"
                  asChild
                >
                  <Link href="/contributors">
                    <Users className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    View Contributors
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    // Add authorization if token is available
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(
      "https://api.github.com/repos/Nano-Collective/organisation/discussions",
      { headers }
    );

    if (!response.ok) {
      console.error("Failed to fetch discussions:", response.statusText);
      return {
        props: {
          discussions: [],
        },
      };
    }

    const discussions: Discussion[] = await response.json();

    // Sort by newest first
    const sortedDiscussions = discussions.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return {
      props: {
        discussions: sortedDiscussions,
      },
    };
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return {
      props: {
        discussions: [],
      },
    };
  }
};
