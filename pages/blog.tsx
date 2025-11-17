import Head from "next/head";
import { GetStaticProps } from "next";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar } from "lucide-react";
import { BlogPost } from "@/types/blog";
import Footer from "@/components/footer";
import { generateBlogSlug } from "@/lib/slugify";

// Define website published categories
const DISCUSSION_CATEGORIES = [
  { name: "Nanocoder", emoji: "🧑‍💻", slug: "nanocoder" },
  { name: "Packages", emoji: "📦", slug: "packages" },
];

interface BlogProps {
  posts: BlogPost[];
}

export default function Blog({ posts }: BlogProps) {
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
      </Head>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="max-w-4xl mx-auto">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-16">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Blog</h1>
            <p className="text-lg text-muted-foreground">
              Updates, discussions, and announcements from the Nano Collective
              community
            </p>
          </div>

          {/* Blog Posts */}
          <div className="max-w-4xl mx-auto space-y-8">
            {DISCUSSION_CATEGORIES.map((category) => {
              const categoryPosts = posts.filter(
                (post) => post.category.slug === category.slug
              );

              if (categoryPosts.length === 0) return null;

              return (
                <div key={category.slug} className="space-y-4 mb-20">
                  <h2 className="text-2xl font-bold text-foreground">
                    {category.emoji} {category.name}
                  </h2>
                  <div className="space-y-4">
                    {categoryPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${generateBlogSlug(
                          post.title,
                          post.number
                        )}`}
                        className="block group"
                      >
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="space-y-3">
                              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                {post.title}
                              </CardTitle>

                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-4 w-4" />
                                  <time dateTime={post.createdAt}>
                                    {new Date(
                                      post.createdAt
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </time>
                                </div>
                                {post.commentCount > 0 && (
                                  <div className="flex items-center gap-1.5">
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

                              {post.labels && post.labels.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {post.labels.map((label) => (
                                    <Badge
                                      key={label.id}
                                      variant="outline"
                                      style={{
                                        borderColor: `#${label.color}`,
                                        color: `#${label.color}`,
                                      }}
                                      className="text-xs"
                                    >
                                      {label.name}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </CardHeader>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}

            {posts.length === 0 && (
              <Card>
                <CardHeader>
                  <CardDescription className="text-center py-8">
                    No blog posts yet. Check back soon!
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
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

    const response = await fetch(
      "https://api.github.com/repos/Nano-Collective/organisation/discussions",
      { headers }
    );

    if (!response.ok) {
      console.error("Failed to fetch discussions:", response.statusText);
      return {
        props: {
          posts: [],
        },
      };
    }

    const discussions = (await response.json()) as Array<{
      id: string;
      number: number;
      title: string;
      created_at: string;
      updated_at?: string;
      comments: number;
      category: { name: string; emoji: string; slug: string };
      labels?: Array<{ id: string; name: string; color: string }>;
    }>;

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
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      props: {
        posts: sortedPosts,
      },
    };
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return {
      props: {
        posts: [],
      },
    };
  }
};
