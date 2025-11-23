import { Feed } from "feed";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const SITE_URL = "https://nanocollective.org";
const SITE_TITLE = "Nano Collective";
const SITE_DESCRIPTION =
  "Updates, discussions, and announcements from the Nano Collective community. Privacy-first open source AI development.";

// Categories to include in the feed
const DISCUSSION_CATEGORIES = ["nanocoder", "packages"];

interface Discussion {
  id: string;
  number: number;
  title: string;
  body: string;
  created_at: string;
  updated_at?: string;
  category: { name: string; emoji: string; slug: string };
  user: { login: string; avatar_url: string };
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function generateBlogSlug(title: string, number: number): string {
  return `${slugify(title)}-${number}`;
}

async function fetchDiscussions(): Promise<Discussion[]> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(
    "https://api.github.com/repos/Nano-Collective/organisation/discussions",
    { headers }
  );

  if (!response.ok) {
    console.error("Failed to fetch discussions:", response.statusText);
    return [];
  }

  const discussions = (await response.json()) as Discussion[];

  // Filter to only include blog categories
  return discussions.filter((d) =>
    DISCUSSION_CATEGORIES.includes(d.category.slug)
  );
}

async function generateFeed() {
  console.log("Generating RSS/Atom feeds...");

  const discussions = await fetchDiscussions();

  const feed = new Feed({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    id: SITE_URL,
    link: SITE_URL,
    language: "en",
    image: `${SITE_URL}/logo.png`,
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Nano Collective`,
    feedLinks: {
      rss2: `${SITE_URL}/feed.xml`,
      atom: `${SITE_URL}/feed.atom`,
    },
    author: {
      name: "Nano Collective",
      link: SITE_URL,
    },
  });

  // Sort discussions by date (newest first)
  const sortedDiscussions = discussions.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  for (const discussion of sortedDiscussions) {
    const slug = generateBlogSlug(discussion.title, discussion.number);
    const url = `${SITE_URL}/blog/${slug}`;

    feed.addItem({
      title: discussion.title,
      id: url,
      link: url,
      description: discussion.body?.slice(0, 500) || discussion.title,
      content: discussion.body || "",
      author: [
        {
          name: discussion.user.login,
        },
      ],
      date: new Date(discussion.created_at),
      category: [
        {
          name: discussion.category.name,
        },
      ],
    });
  }

  // Ensure public directory exists
  const publicDir = join(process.cwd(), "public");
  mkdirSync(publicDir, { recursive: true });

  // Write RSS 2.0 feed
  writeFileSync(join(publicDir, "feed.xml"), feed.rss2());
  console.log("Generated: public/feed.xml");

  // Write Atom feed
  writeFileSync(join(publicDir, "feed.atom"), feed.atom1());
  console.log("Generated: public/feed.atom");

  console.log(`Added ${sortedDiscussions.length} posts to feeds`);
}

generateFeed().catch((error) => {
  console.error("Error generating feed:", error);
  process.exit(1);
});
