import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageCircle, ExternalLink } from "lucide-react";
import { BlogPostDetails } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { marked } from "marked";
import { generateBlogSlug, extractNumberFromSlug } from "@/lib/slugify";
import Footer from "@/components/footer";

interface BlogPostProps {
  post: BlogPostDetails;
}

export default function BlogPost({ post }: BlogPostProps) {
  return (
    <>
      <Head>
        <title>{post.title} - Nano Collective Blog</title>
        <meta name="description" content={post.excerpt || post.title} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.createdAt} />
        <meta property="article:modified_time" content={post.updatedAt} />
        <meta property="article:author" content={post.author.login} />
        {post.labels.map((label) => (
          <meta key={label.id} property="article:tag" content={label.name} />
        ))}
      </Head>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="max-w-4xl mx-auto">
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Blog
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-16">
          {/* Page Header */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {post.labels.map((label) => (
                  <Badge
                    key={label.id}
                    variant="outline"
                    style={{
                      borderColor: `#${label.color}`,
                      color: `#${label.color}`,
                    }}
                  >
                    {label.name}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold">{post.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.createdAt}>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:underline hover:text-foreground transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>
                    {post.commentCount}{" "}
                    {post.commentCount === 1 ? "comment" : "comments"}
                  </span>
                </a>
                <a
                  href={`https://github.com/${post.author.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:underline hover:text-foreground transition-colors"
                >
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.login}
                    className="h-5 w-5 rounded-full"
                  />
                  <span>by {post.author.login}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Main Content */}
            <Card>
              <CardContent className="pt-6">
                <div
                  className="prose prose-neutral dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.bodyHTML }}
                />
              </CardContent>
            </Card>

            {/* Join Discussion CTA */}
            <Card className="bg-accent/5">
              <CardContent className="pt-6 text-center space-y-4">
                <p className="text-muted-foreground">
                  Want to join the discussion? Head over to GitHub to share your
                  thoughts!
                </p>
                <Button asChild>
                  <a href={post.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Discussion on GitHub
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
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
      return {
        paths: [],
        fallback: false,
      };
    }

    const discussions = (await response.json()) as Array<{
      number: number;
      title: string;
    }>;
    const paths = discussions.map((discussion) => ({
      params: { slug: generateBlogSlug(discussion.title, discussion.number) },
    }));

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error("Error fetching discussion paths:", error);
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps<BlogPostProps> = async ({
  params,
}) => {
  const slug = params?.slug as string;

  if (!slug) {
    return {
      notFound: true,
    };
  }

  // Extract the number from the slug
  const number = extractNumberFromSlug(slug);

  if (!number) {
    return {
      notFound: true,
    };
  }

  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    // Add authorization if token is available
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // Fetch all discussions to find the one we need
    const discussionsResponse = await fetch(
      "https://api.github.com/repos/Nano-Collective/organisation/discussions",
      { headers }
    );

    if (!discussionsResponse.ok) {
      console.error(
        "Failed to fetch discussions:",
        discussionsResponse.statusText
      );
      return {
        notFound: true,
      };
    }

    const discussions = (await discussionsResponse.json()) as Array<{
      number: number;
      id: string;
      title: string;
      body?: string;
      created_at: string;
      updated_at?: string;
      html_url: string;
      comments: number;
      category: { name: string; emoji: string; slug: string };
      labels?: Array<{ id: string; name: string; color: string }>;
      user?: { login: string; avatar_url: string };
    }>;
    const discussion = discussions.find((d) => d.number === number);

    if (!discussion) {
      return {
        notFound: true,
      };
    }

    // Convert markdown body to HTML
    const bodyHTML = discussion.body ? await marked(discussion.body) : "";

    // Transform to blog post format
    const post: BlogPostDetails = {
      id: discussion.id,
      number: discussion.number,
      title: discussion.title,
      body: discussion.body || "",
      bodyHTML: bodyHTML,
      excerpt:
        (discussion.body?.substring(0, 200) || "") +
        ((discussion.body?.length ?? 0) > 200 ? "..." : ""),
      createdAt: discussion.created_at,
      updatedAt: discussion.updated_at || discussion.created_at,
      url: discussion.html_url,
      commentCount: discussion.comments,
      category: discussion.category,
      labels: discussion.labels || [],
      author: {
        login: discussion.user?.login || "Unknown",
        avatarUrl: discussion.user?.avatar_url || "/favicon.svg",
      },
    };

    return {
      props: {
        post,
      },
    };
  } catch (error) {
    console.error("Error fetching discussion details:", error);
    return {
      notFound: true,
    };
  }
};
