import { Calendar, MessageCircle } from "lucide-react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/Footer";
import {
  CardHover,
  SectionReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/motion";
import { generateBlogSlug } from "@/lib/slugify";
import type { BlogPost } from "@/types/blog";

interface CategoryInfo {
  name: string;
  emoji: string;
  slug: string;
}

interface BlogProps {
  posts: BlogPost[];
  categories: CategoryInfo[];
}

export default function Blog({ posts, categories }: BlogProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((post) => post.category.slug === selectedCategory);

  const allCategories: CategoryInfo[] = [
    { name: "All", emoji: "", slug: "all" },
    ...categories,
  ];

  return (
    <>
      <Head>
        <title>Blog - Nano Collective</title>
        <meta
          name="description"
          content="Read about the latest updates, features, and discussions from the Nano Collective community. Privacy-first open source AI development."
        />
        <meta property="og:title" content="Blog - Nano Collective" />
        <meta
          property="og:description"
          content="Latest updates and discussions from the Nano Collective community"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nanocollective.org/blog" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:alt" content="Nano Collective Blog" />
      </Head>

      <div className="min-h-screen bg-background font-sans flex flex-col">
        {/* Hero */}
        <SectionReveal>
          <section className="relative pt-12 pb-12 sm:pb-20 px-4 md:px-6 container mx-auto border-b border-foreground/20">
            <div className="space-y-4 sm:space-y-8 max-w-4xl">
              <div className="flex items-center gap-2 text-xs font-semibold font-mono text-muted-foreground uppercase tracking-widest border-b border-foreground/20 pb-2 max-w-[200px]">
                <span className="text-[#0000EE] dark:text-[#A1A1AA] font-bold">
                  &gt;
                </span>
                Blog
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[4rem] leading-[1.05] font-bold tracking-tight text-foreground break-words">
                Updates & discussions
              </h1>

              <p className="text-xs sm:text-lg lg:text-xl text-foreground/70 leading-relaxed max-w-[800px]">
                Latest announcements, project updates, and community discussions
                from the Nano Collective.
              </p>
            </div>
          </section>
        </SectionReveal>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 md:px-6 py-8 sm:py-12 md:py-24">
          {/* Category Filter */}
          <div className="mb-8 sm:mb-16 border-b border-foreground/20 pb-4 sm:pb-8">
            <div className="flex flex-wrap gap-2">
              {allCategories.map((category) => (
                <button
                  type="button"
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase transition-colors rounded-none border ${
                    selectedCategory === category.slug
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground border-foreground/20 hover:bg-muted"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Posts */}
          <StaggerContainer
            key={selectedCategory}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8"
          >
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <StaggerItem key={post.id}>
                  <Link
                    href={`/blog/${generateBlogSlug(post.title, post.number)}`}
                    className="block h-full group"
                  >
                    <CardHover className="flex flex-col h-full bg-background border border-foreground/20 relative overflow-hidden transition-all p-5 sm:p-8">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 dark:opacity-100 pointer-events-none" />
                      <div className="relative z-10 space-y-4 sm:space-y-6 h-full flex flex-col">
                        <div className="space-y-4 flex-1">
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.labels?.map((label) => (
                              <span
                                key={label.id}
                                className="font-mono text-xs font-bold px-2 py-1 uppercase tracking-wider bg-background border"
                                style={{
                                  borderColor: `#${label.color}40`,
                                  color: `#${label.color}`,
                                  backgroundColor: `#${label.color}10`,
                                }}
                              >
                                [ {label.name} ]
                              </span>
                            ))}
                          </div>

                          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight line-clamp-3 group-hover:text-[#0000EE] dark:group-hover:text-[#A1A1AA] transition-colors">
                            {post.title}
                          </h2>
                        </div>

                        <div className="pt-6 mt-auto flex items-center justify-between text-xs font-mono border-t border-foreground/20 text-foreground/70 flex-wrap gap-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={post.createdAt}>
                              {new Date(post.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  timeZone: "UTC",
                                },
                              )}
                            </time>
                          </div>
                          {post.commentCount > 0 && (
                            <div className="flex items-center gap-1.5 text-[#0000EE] dark:text-[#A1A1AA] font-bold">
                              <MessageCircle className="h-4 w-4" />
                              <span>
                                {post.commentCount}{" "}
                                {post.commentCount === 1
                                  ? "comment"
                                  : "comments"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHover>
                  </Link>
                </StaggerItem>
              ))
            ) : (
              <div className="col-span-full py-16 text-center border border-foreground/20 bg-muted">
                <p className="font-mono text-foreground/70">
                  No blog posts in this category. Check back soon!
                </p>
              </div>
            )}
          </StaggerContainer>
        </main>
        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<BlogProps> = async () => {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    // Add authorization if token is available
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const fallbackDiscussions = [
      {
        id: "1",
        number: 101,
        title: "Introducing Nano Collective: A new era of privacy-first AI",
        created_at: new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        updated_at: new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        comments: 12,
        category: { name: "Announcements", emoji: "📢", slug: "announcements" },
        labels: [{ id: "l1", name: "launch", color: "0000EE" }],
      },
      {
        id: "2",
        number: 102,
        title: "How to build local-first RAG pipelines with NanoTuner",
        created_at: new Date(
          Date.now() - 14 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        updated_at: new Date(
          Date.now() - 14 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        comments: 5,
        category: { name: "Tutorials", emoji: "📚", slug: "tutorials" },
        labels: [
          { id: "l2", name: "guide", color: "A1A1AA" },
          { id: "l3", name: "rag", color: "10B981" },
        ],
      },
      {
        id: "3",
        number: 103,
        title: "Community Update: October 2026",
        created_at: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        updated_at: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        comments: 24,
        category: { name: "Community", emoji: "👋", slug: "community" },
        labels: [{ id: "l4", name: "update", color: "F59E0B" }],
      },
      {
        id: "4",
        number: 104,
        title: "The future of distributed model training",
        created_at: new Date(
          Date.now() - 45 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        updated_at: new Date(
          Date.now() - 45 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        comments: 8,
        category: { name: "Research", emoji: "🔬", slug: "research" },
        labels: [{ id: "l5", name: "paper", color: "8B5CF6" }],
      },
    ];

    // Fetch discussions (paginated: GitHub returns max 100 per page)
    const fetched = [];
    try {
      for (let page = 1; page <= 10; page++) {
        const response = await fetch(
          `https://api.github.com/repos/Nano-Collective/organisation/discussions?per_page=100&page=${page}`,
          { headers },
        );

        if (!response.ok) {
          console.error(
            "Failed to fetch discussions:",
            response.statusText,
            "- using fallback data",
          );
          break;
        }

        const batch = await response.json();
        if (!Array.isArray(batch) || batch.length === 0) break;
        fetched.push(...batch);
        if (batch.length < 100) break;
      }
    } catch (e) {
      console.error("Error parsing discussions:", e, "- using fallback data");
    }

    const discussions = fetched.length > 0 ? fetched : fallbackDiscussions;

    // Transform discussions into blog posts
    const posts: BlogPost[] = discussions.map((discussion) => {
      return {
        id: discussion.id,
        number: discussion.number,
        title: discussion.title,
        createdAt: discussion.created_at,
        updatedAt: discussion.updated_at || discussion.created_at,
        commentCount: discussion.comments,
        category: {
          name: discussion.category.name,
          emoji: discussion.category.emoji,
          slug: discussion.category.slug,
        },
        labels: discussion.labels || [],
      };
    });

    // Sort by newest first
    const sortedPosts = posts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // Extract unique categories from all posts
    const categoryMap = new Map<string, CategoryInfo>();
    for (const post of posts) {
      if (!categoryMap.has(post.category.slug)) {
        categoryMap.set(post.category.slug, post.category);
      }
    }
    const categories = Array.from(categoryMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    return {
      props: {
        posts: sortedPosts,
        categories,
      },
    };
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return {
      props: {
        posts: [],
        categories: [],
      },
    };
  }
};
