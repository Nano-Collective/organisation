# Nano Collective Website

The official website for the [Nano Collective](https://nanocollective.org) — a community collective building open-source, privacy-first, local-first AI tooling. Everything we build is open, transparent, and driven by the people who use it.

## About the Collective

The Nano Collective exists to make powerful AI tools more open, trustworthy, and accessible to everyone. We build software that respects the people using it, keeps them in control of their own workflows, and avoids the lock-in, opacity, and short-term incentives that define too much of the AI ecosystem today.

For a fuller introduction, see [Introduction to the Nano Collective](https://doc.nanocollective.org/collective).

### Featured Projects

- **[Nanocoder](https://github.com/Nano-Collective/nanocoder)** — A local-first CLI coding agent with multi-provider AI support.
- **[Nanotune](https://github.com/Nano-Collective/nanotune)** — Tooling focused on fine-tuning and improving small, local models for practical use.
- **[get-md](https://github.com/Nano-Collective/get-md)** — A fast, lightweight HTML to Markdown converter optimised for LLM consumption.
- **[json-up](https://github.com/Nano-Collective/json-up)** — A type-safe JSON migration tool with Zod schema validation.
- **[prompt-scrub](https://github.com/Nano-Collective/prompt-scrubber)** — A local-first PII scrubbing utility for LLM prompts.

## Documentation

Operational documentation for the collective — how we work, what conventions every project follows, and how to get involved — lives on the docs site at **[doc.nanocollective.org/collective](https://doc.nanocollective.org/collective)**.

Key pages:

- **[Introduction to the Nano Collective](https://doc.nanocollective.org/collective)** — Who we are, what we stand for, and what we build.
- **[Creating a New Project](https://doc.nanocollective.org/collective/creating-a-new-project)** — Conventions every Nano Collective project should follow: repo structure, CI, licensing, testing, docs, release.
- **[Stack Suggestions](https://doc.nanocollective.org/collective/stack-suggestions)** — Recommended tooling per language stack (currently TypeScript / Node).
- **[Community](https://doc.nanocollective.org/collective/community)** — Where we talk, how to contribute, and how to support the collective.

These docs are primarily operational — a shared reference for how the collective works. They are published openly because transparency is one of our values, but their main audience is contributors and maintainers. The source lives in the [`Nano-Collective/docs`](https://github.com/Nano-Collective/docs) repository; if something is unclear, outdated, or wrong, open an issue or PR there.

## Community

- **[Discord](https://discord.gg/ktPDV6rekE)** — Real-time chat with contributors and maintainers.
- **[GitHub Discussions](https://github.com/Nano-Collective/website/discussions)** — Announcements, roadmaps, and longer-form discussion from the core team.
- **GitHub Issues** — Per-project bug reports and feature requests, on each project's own repo.

See the [Community doc](https://doc.nanocollective.org/collective/community) for a fuller breakdown of how to get involved.

## For Developers

This site is built with Next.js 15, React 19, and TypeScript 5. To run it locally:

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

Open [http://localhost:3000](http://localhost:3000) to view the site. The page auto-reloads as you edit files. Main page content is in `pages/index.tsx`.

For contribution details — coding standards, PR process, review expectations — see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT License with Attribution. See [LICENSE.md](LICENSE.md) for full details. When using this software, please include attribution to Nano Collective and contributors.

---

**Join us in building AI tools that respect your privacy.** Start a discussion, contribute an idea, or just say hello in our [Discord community](https://discord.gg/ktPDV6rekE).
