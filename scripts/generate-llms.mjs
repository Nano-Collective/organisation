/**
 * Post-build script that emits an LLM-friendly index alongside the static
 * export, following https://llmstxt.org/ — the same convention the docs site
 * uses (see ../../docs/scripts/generate-llms-content.ts).
 *
 *   1. Write /llms.txt at the site root: a single index of every meaningful
 *      page with a title, short description, and link.
 *   2. For blog posts (the only Markdown content on the site — sourced from
 *      GitHub Discussions) write a raw `.md` mirror at /blog/<slug>.md and
 *      point llms.txt at it, so the content can be fetched and parsed without
 *      HTML rendering.
 *
 * Runs after `next build` (see the build script in package.json) and writes
 * into the static `dist/` export directory.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const SITE_URL = "https://nanocollective.org";
const OUT_DIR = join(process.cwd(), "dist");

// Only these Discussion categories are published as blog posts.
const DISCUSSION_CATEGORIES = ["nanocoder", "packages"];

// The Collective's mission summary, mirrored from the docs site's llms.txt.
const SUMMARY =
  "The Nano Collective is a community-led group of developers, designers, and maintainers building open-source AI tools for the people who use them. We build not for profit, but for the community. Every tool we ship aims to be privacy-respecting, local-first, and open for all.";

// Curated index of the site's pages. Descriptions mirror each page's meta
// description so the index stays in sync with what the pages say.
const PRODUCTS = [
  {
    route: "/nanocoder",
    title: "Nanocoder",
    description:
      "An open coding agent for your terminal, built by a community collective rather than a company.",
  },
  {
    route: "/nanotune",
    title: "Nanotune",
    description:
      "A simple, interactive CLI for fine-tuning small language models on Apple Silicon.",
  },
  {
    route: "/get-md",
    title: "get-md",
    description:
      "A fast, lightweight HTML, PDF, DOCX, and Markdown to Markdown converter optimized for LLM consumption.",
  },
  {
    route: "/prompt-scrub",
    title: "prompt-scrub",
    description:
      "Local-first PII scrubbing for LLM prompts. Maps emails, secrets, and paths to stable placeholders and rehydrates model responses locally.",
  },
];

const PAGES = [
  {
    route: "/",
    title: "Nano Collective",
    description:
      "Privacy-respecting, local-first AI tools that help developers build, automate, and ship faster without surrendering control.",
  },
  {
    route: "/pipeline",
    title: "Project Pipeline",
    description:
      "Whitepapers and projects in flight under the Nano Collective. From idea to shipped v0.1, in the open.",
  },
  {
    route: "/growth",
    title: "Package Growth Tracker",
    description:
      "Track Nano Collective package growth metrics, download statistics, and release impact.",
  },
  {
    route: "/sponsor",
    title: "Sponsorship",
    description:
      "Sponsor the Nano Collective. Fund the community fund that pays bounties to OSS contributors building privacy-respecting, local-first AI tooling.",
  },
  {
    route: "/contributors",
    title: "Contributors",
    description:
      "Meet the contributors who make Nano Collective possible. Join our open-source AI tools collective.",
  },
  {
    route: "/blog",
    title: "Blog",
    description:
      "Updates, features, and discussions from the Nano Collective community.",
  },
  {
    route: "/privacy",
    title: "Privacy Policy",
    description: "Privacy policy for Nano Collective and its tools.",
  },
];

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function generateBlogSlug(title, number) {
  return `${slugify(title)}-${number}`;
}

async function fetchDiscussions() {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(
    "https://api.github.com/repos/Nano-Collective/organisation/discussions",
    { headers },
  );

  if (!response.ok) {
    console.error("Failed to fetch discussions:", response.statusText);
    return [];
  }

  const discussions = await response.json();
  return discussions.filter((d) =>
    DISCUSSION_CATEGORIES.includes(d.category.slug),
  );
}

/**
 * Write a raw Markdown mirror of a blog post into the export and return an
 * index entry pointing at it.
 */
function writeBlogMirror(discussion) {
  const slug = generateBlogSlug(discussion.title, discussion.number);
  const route = `/blog/${slug}`;
  const outPath = join(OUT_DIR, `${route.replace(/^\//, "")}.md`);

  const body = discussion.body?.trim() || "";
  const content = `# ${discussion.title}\n\n${body}\n`;

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, content);

  const firstLine = body
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 0);
  let description = firstLine ? firstLine.replace(/^#+\s*/, "") : undefined;
  if (description && description.length > 160) {
    description = `${description.slice(0, 160).replace(/\s+\S*$/, "")}…`;
  }

  return { route: `${route}.md`, title: discussion.title, description };
}

function line(entry) {
  const desc = entry.description ? `: ${entry.description}` : "";
  return `- [${entry.title}](${SITE_URL}${entry.route})${desc}`;
}

function generateLlmsTxt(blogEntries) {
  const lines = [];

  lines.push("# Nano Collective");
  lines.push("");
  lines.push(`> ${SUMMARY}`);
  lines.push("");
  lines.push(
    "This file indexes the Nano Collective website. Blog links point to the post's raw Markdown so it can be fetched and parsed directly without HTML rendering.",
  );
  lines.push("");

  lines.push("## Products");
  lines.push("");
  for (const entry of PRODUCTS) lines.push(line(entry));
  lines.push("");

  lines.push("## Pages");
  lines.push("");
  for (const entry of PAGES) lines.push(line(entry));
  lines.push("");

  if (blogEntries.length > 0) {
    lines.push("## Blog");
    lines.push("");
    for (const entry of blogEntries) lines.push(line(entry));
    lines.push("");
  }

  return lines.join("\n");
}

async function main() {
  console.log("Generating llms.txt...");

  const discussions = await fetchDiscussions();
  const sorted = discussions.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const blogEntries = sorted.map(writeBlogMirror);
  console.log(`Wrote ${blogEntries.length} blog markdown mirrors`);

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, "llms.txt"), generateLlmsTxt(blogEntries));
  console.log("Generated: dist/llms.txt");
}

main().catch((error) => {
  console.error("Error generating llms.txt:", error);
  process.exit(1);
});
