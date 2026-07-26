import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE_URL = "https://nanocollective.org";

// Categories to include in the sitemap
const DISCUSSION_CATEGORIES = ["nanocoder", "packages"];

// Static pages (explicit list - no Next.js internal routes)
const STATIC_PAGES = [
  { loc: "", priority: "1.0", changefreq: "daily" },
  { loc: "blog", priority: "0.9", changefreq: "daily" },
  { loc: "contributors", priority: "0.7", changefreq: "weekly" },
  { loc: "growth", priority: "0.8", changefreq: "daily" },
  { loc: "screen-record", priority: "0.6", changefreq: "monthly" },
  { loc: "sponsor", priority: "0.6", changefreq: "monthly" },
  { loc: "pipeline", priority: "0.7", changefreq: "weekly" },
  // Product pages
  { loc: "nanocoder", priority: "0.9", changefreq: "weekly" },
  { loc: "nanotune", priority: "0.8", changefreq: "weekly" },
  { loc: "sentinel", priority: "0.8", changefreq: "weekly" },
  { loc: "get-md", priority: "0.8", changefreq: "weekly" },
  { loc: "prompt-scrub", priority: "0.8", changefreq: "weekly" },
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

  // Paginate: GitHub returns max 100 discussions per page
  const discussions = [];
  for (let page = 1; page <= 10; page++) {
    const response = await fetch(
      `https://api.github.com/repos/Nano-Collective/organisation/discussions?per_page=100&page=${page}`,
      { headers },
    );

    if (!response.ok) {
      console.error("Failed to fetch discussions:", response.statusText);
      break;
    }

    const batch = await response.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    discussions.push(...batch);
    if (batch.length < 100) break;
  }

  return discussions.filter((d) =>
    DISCUSSION_CATEGORIES.includes(d.category.slug),
  );
}

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateSitemap(discussions) {
  const lastmod = new Date().toISOString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

  // Static pages
  for (const page of STATIC_PAGES) {
    const loc = page.loc ? `${SITE_URL}/${page.loc}` : SITE_URL;
    xml += `<url><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod><changefreq>${page.changefreq}</changefreq><priority>${page.priority}</priority></url>
`;
  }

  // Blog posts
  for (const discussion of discussions) {
    const slug = generateBlogSlug(discussion.title, discussion.number);
    const loc = `${SITE_URL}/blog/${slug}`;
    xml += `<url><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>
`;
  }

  xml += "</urlset>";
  return xml;
}

async function generateSitemapFile() {
  console.log("Generating sitemap.xml...");

  const discussions = await fetchDiscussions();
  console.log(`Found ${discussions.length} blog posts`);

  // Ensure public directory exists
  const publicDir = join(process.cwd(), "public");
  mkdirSync(publicDir, { recursive: true });

  const sitemap = generateSitemap(discussions);
  writeFileSync(join(publicDir, "sitemap.xml"), sitemap, "utf-8");
  console.log("Generated: public/sitemap.xml");
}

generateSitemapFile().catch((error) => {
  console.error("Error generating sitemap:", error);
  process.exit(1);
});
