import Head from "next/head";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Terminal, Zap, Users, Lock, Sparkles } from "lucide-react";
import { FaGithub, FaDiscord } from "react-icons/fa";
import NanocoderTerminal from "@/components/NanocoderTerminal";

export default function Home() {
  return (
    <>
      <Head>
        <title>Nano Collective - Open Source Local-First AI Tools</title>
        <meta
          name="description"
          content="Creating powerful, local-first AI tools, developed by the community for the community. Privacy-first, open source AI that runs on your machine."
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
                Creating powerful, local-first AI tools, developed by the
                community for the community
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 w-full sm:w-auto">
                <Button size="lg" className="group text-base w-full sm:w-auto" asChild>
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
                    local-first architectures to ensure complete control.
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
                  A beautiful local-first coding agent running in your terminal
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
                  <Button size="lg" className="group text-base w-full sm:w-auto" asChild>
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

        {/* Get Involved Section */}
        <section className="py-20 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl sm:text-5xl font-bold">Get Involved</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We welcome contributions in code, documentation, design, and
                marketing. Join our community and help shape the future of
                local-first AI tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 w-full sm:w-auto">
                <Button size="lg" className="group w-full sm:w-auto" asChild>
                  <a
                    href="https://github.com/Nano-Collective"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Contribute on GitHub
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="group w-full sm:w-auto" asChild>
                  <a
                    href="https://discord.gg/ktPDV6rekE"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaDiscord className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Join Discord
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/40 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <h3 className="font-bold text-xl mb-2">Nano Collective</h3>
                <p className="text-sm text-muted-foreground">
                  Building powerful, local-first AI tools for everyone
                </p>
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Nano Collective. Open source and
                  community driven.
                </p>
              </div>
              <div className="flex gap-6">
                <a
                  href="https://github.com/Nano-Collective"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <FaGithub className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                </a>
                <a
                  href="https://discord.gg/ktPDV6rekE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <FaDiscord className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
