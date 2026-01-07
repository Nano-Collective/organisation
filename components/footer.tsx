import Link from "next/link";
import { FaDiscord, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-xl mb-2">Nano Collective</h3>
            <p className="text-sm text-muted-foreground mb-2 font-semibold">
              Building powerful, privacy-first AI tools for everyone.
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Nano Collective.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <nav className="flex gap-4 text-sm">
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog
              </Link>
            </nav>
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
  );
}
