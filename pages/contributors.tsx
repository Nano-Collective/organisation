import Head from "next/head";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CONTRIBUTORS, type Contributor } from "@/lib/contributors";

/**
 * Contributors Page
 *
 * This page displays all contributors to the Nano Collective project.
 * Contributors are pulled from the CONTRIBUTORS array in @/lib/contributors.ts
 *
 * To add yourself as a contributor:
 * 1. Add your photo to /public/contributors/
 * 2. Add your entry to CONTRIBUTORS array in @/lib/contributors.ts
 * 3. Submit a pull request!
 */

function ContributorCard({ contributor }: { contributor: Contributor }) {
  const initials = contributor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardContent className="flex flex-col items-center text-center p-6 space-y-4">
        {/* Avatar */}
        <Avatar className="size-24 border-2 border-border group-hover:border-primary transition-colors">
          <AvatarImage
            src={`/contributors/${contributor.photo}`}
            alt={contributor.name}
            className="object-cover"
          />
          <AvatarFallback className="text-2xl font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Name */}
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{contributor.name}</h3>
          {contributor.bio && (
            <p className="text-sm text-muted-foreground">{contributor.bio}</p>
          )}
        </div>

        {/* Links */}
        <div className="flex gap-2 w-full">
          {contributor.github && (
            <Button asChild variant="outline" size="sm" className="flex-1">
              <a
                href={`https://github.com/${contributor.github}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${contributor.name}'s GitHub profile`}
              >
                <FaGithub className="size-4 mr-2" />
                GitHub
              </a>
            </Button>
          )}
          {contributor.website && (
            <Button asChild variant="outline" size="sm" className="flex-1">
              <a
                href={contributor.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${contributor.name}'s website`}
              >
                <ExternalLink className="size-4 mr-2" />
                Website
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ContributorsPage() {
  return (
    <>
      <Head>
        <title>Contributors - Nano Collective</title>
        <meta
          name="description"
          content="Meet the contributors who make Nano Collective possible. Join our open-source AI tools collective."
        />
      </Head>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-16">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Contributors</h1>
            <p className="text-lg text-muted-foreground">
              Meet the amazing people who contribute to the Nano Collective.
              Everyone is welcome to join our open-source community!
            </p>
            <div className="flex flex-col lg:flex-row gap-4 justify-center pt-4">
              <Button asChild variant="default">
                <a
                  href="https://github.com/nano-collective"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="mr-2 size-4" />
                  View on GitHub
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link href="#how-to-contribute">How to Contribute</Link>
              </Button>
            </div>
          </div>

          {/* Contributors Grid */}
          {CONTRIBUTORS.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
              {CONTRIBUTORS.map((contributor) => (
                <ContributorCard
                  key={contributor.name}
                  contributor={contributor}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 mb-20">
              <p className="text-muted-foreground text-lg">
                No contributors yet. Be the first to add yourself!
              </p>
            </div>
          )}

          {/* How to Contribute Section */}
          <div id="how-to-contribute" className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-8 space-y-6">
                <h2 className="text-2xl font-bold">
                  Contributed? Add yourself!
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <div className="space-y-2">
                    <h3 className="text-foreground font-semibold">
                      1. Prepare your photo
                    </h3>
                    <p>
                      Add a square photo (recommended: 400x400px) to the{" "}
                      <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                        /public/contributors/
                      </code>{" "}
                      directory. Use a clear filename like{" "}
                      <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                        yourname.jpg
                      </code>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-foreground font-semibold">
                      2. Add your entry
                    </h3>
                    <p>
                      Open{" "}
                      <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                        /lib/contributors.ts
                      </code>{" "}
                      and add your details to the CONTRIBUTORS array following
                      the existing format. Include your name, photo filename,
                      GitHub username, and optionally your website and bio.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-foreground font-semibold">
                      3. Submit a pull request
                    </h3>
                    <p>
                      Fork the repository, commit your changes, and submit a
                      pull request. We'll review and merge it as soon as
                      possible!
                    </p>
                  </div>
                </div>
                <div className="pt-4">
                  <Button asChild variant="default" className="w-full">
                    <a
                      href="https://github.com/nano-collective/website/blob/main/CONTRIBUTING.md"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read Full Contributing Guide
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <h3 className="font-bold text-xl mb-2">Nano Collective</h3>
                <p className="text-sm text-muted-foreground mb-2 font-semibold">
                  Building powerful, local-first AI tools for everyone.
                </p>
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Nano Collective.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
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
          </div>
        </footer>
      </div>
    </>
  );
}
