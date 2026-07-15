/**
 * Post-build script that emits LLM-friendly content alongside the static
 * export, following https://llmstxt.org/ — the same convention the docs site
 * uses (see ../../docs/scripts/generate-llms-content.ts).
 *
 *   1. For every page, write a raw Markdown mirror at the page's URL plus
 *      `.md` (e.g. /nanocoder -> /nanocoder.md). Page mirrors are produced by
 *      extracting the built page's main content and converting it to Markdown;
 *      blog posts use their raw Markdown source (GitHub Discussions) directly.
 *   2. Emit /llms.txt at the site root: a single index of every page with a
 *      title, short description, and a link to its raw Markdown.
 *
 * Runs after `next build` (see the build script in package.json) and writes
 * into the static `dist/` export directory.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import TurndownService from "turndown";

const SITE_URL = "https://nanocollective.org";
const OUT_DIR = join(process.cwd(), "dist");

// Only these Discussion categories are published as blog posts.
const DISCUSSION_CATEGORIES = ["nanocoder", "packages"];

// The Collective's mission summary, mirrored from the docs site's llms.txt.
const SUMMARY =
  "The Nano Collective is a community-led group of developers, designers, and maintainers building open-source AI tools for the people who use them. We build not for profit, but for the community. Every tool we ship aims to be privacy-respecting, local-first, and open for all.";

// Curated index of the site's pages. `file` is the built HTML file in dist/;
// `route` is the public path (also where the `.md` mirror is written).
// Descriptions mirror each page's meta description.
const PRODUCTS = [
  {
    route: "/nanocoder",
    file: "nanocoder.html",
    title: "Nanocoder",
    description:
      "An open coding agent for your terminal, built by a community collective rather than a company.",
  },
  {
    route: "/nanotune",
    file: "nanotune.html",
    title: "Nanotune",
    description:
      "A simple, interactive CLI for fine-tuning small language models on Apple Silicon.",
  },
  {
    route: "/get-md",
    file: "get-md.html",
    title: "get-md",
    description:
      "A fast, lightweight HTML, PDF, DOCX, and Markdown to Markdown converter optimized for LLM consumption.",
  },
  {
    route: "/prompt-scrub",
    file: "prompt-scrub.html",
    title: "prompt-scrub",
    description:
      "Local-first PII scrubbing for LLM prompts. Maps emails, secrets, and paths to stable placeholders and rehydrates model responses locally.",
  },
];

const PAGES = [
  {
    route: "/",
    file: "index.html",
    title: "Nano Collective",
    description:
      "Privacy-respecting, local-first AI tools that help developers build, automate, and ship faster without surrendering control.",
  },
  {
    route: "/pipeline",
    file: "pipeline.html",
    title: "Project Pipeline",
    description:
      "Whitepapers and projects in flight under the Nano Collective. From idea to shipped v0.1, in the open.",
  },
  {
    route: "/growth",
    file: "growth.html",
    title: "Package Growth Tracker",
    description:
      "Track Nano Collective package growth metrics, download statistics, and release impact.",
  },
  {
    route: "/sponsor",
    file: "sponsor.html",
    title: "Sponsorship",
    description:
      "Sponsor the Nano Collective. Fund the community fund that pays bounties to OSS contributors building privacy-respecting, local-first AI tooling.",
  },
  {
    route: "/contributors",
    file: "contributors.html",
    title: "Contributors",
    description:
      "Meet the contributors who make Nano Collective possible. Join our open-source AI tools collective.",
  },
  {
    route: "/blog",
    file: "blog.html",
    title: "Blog",
    description:
      "Updates, features, and discussions from the Nano Collective community.",
  },
  {
    route: "/privacy",
    file: "privacy.html",
    title: "Privacy Policy",
    description: "Privacy policy for Nano Collective and its tools.",
  },
];

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});
// Decorative/interactive-only elements carry no meaning in Markdown.
turndown.remove(["script", "style", "svg", "noscript"]);
// Icon-only links (their SVG stripped) would render as empty `[](url)` noise.
turndown.addRule("stripEmptyLinks", {
  filter: (node) => node.nodeName === "A" && !node.textContent.trim(),
  replacement: () => "",
});

/**
 * Isolate a page's readable content: prefer <main>, otherwise fall back to
 * <body> with the shared header and footer stripped out.
 */
function extractContentHtml(html) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  let region = main
    ? main[1]
    : (html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html);

  region = region
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "");

  return region;
}

/** Convert a built HTML page into a Markdown document. */
function htmlPageToMarkdown(page) {
  const htmlPath = join(OUT_DIR, page.file);
  const html = readFileSync(htmlPath, "utf-8");
  const markdown = turndown
    .turndown(extractContentHtml(html))
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return `# ${page.title}\n\n${markdown}\n`;
}

/** Write `<route>.md` into the export for a curated page. */
function writePageMirror(page) {
  const relative = page.route === "/" ? "index" : page.route.replace(/^\//, "");
  const outPath = join(OUT_DIR, `${relative}.md`);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, htmlPageToMarkdown(page));
  return {
    route: `/${relative}.md`,
    title: page.title,
    description: page.description,
  };
}

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
 * Write a raw Markdown mirror of a blog post (its Discussion body is already
 * Markdown) and return an index entry pointing at it.
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

function generateLlmsTxt(productEntries, pageEntries, blogEntries) {
  const lines = [];

  lines.push("# Nano Collective");
  lines.push("");
  lines.push(`> ${SUMMARY}`);
  lines.push("");
  lines.push(
    "This file indexes the Nano Collective website. Every link points to the page's raw Markdown so it can be fetched and parsed directly without HTML rendering.",
  );
  lines.push("");

  lines.push("## Products");
  lines.push("");
  for (const entry of productEntries) lines.push(line(entry));
  lines.push("");

  lines.push("## Pages");
  lines.push("");
  for (const entry of pageEntries) lines.push(line(entry));
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
  console.log("Generating Markdown mirrors and llms.txt...");

  const productEntries = PRODUCTS.map(writePageMirror);
  const pageEntries = PAGES.map(writePageMirror);
  console.log(
    `Wrote ${productEntries.length + pageEntries.length} page markdown mirrors`,
  );

  const discussions = await fetchDiscussions();
  const sorted = discussions.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  const blogEntries = sorted.map(writeBlogMirror);
  console.log(`Wrote ${blogEntries.length} blog markdown mirrors`);

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(
    join(OUT_DIR, "llms.txt"),
    generateLlmsTxt(productEntries, pageEntries, blogEntries),
  );
  console.log("Generated: dist/llms.txt");
}

main().catch((error) => {
  console.error("Error generating llms.txt:", error);
  process.exit(1);
});
