import { Calendar, ExternalLink, MessageCircle } from "lucide-react";
import { marked } from "marked";
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { SectionReveal } from "@/components/ui/motion";
import { extractNumberFromSlug, generateBlogSlug } from "@/lib/slugify";
import type { BlogPostDetails } from "@/types/blog";

interface BlogPostProps {
  post: BlogPostDetails;
}

export default function BlogPost({ post }: BlogPostProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <>
      <Head>
        <title>{post.title} - Nano Collective Blog</title>
        <meta name="description" content={post.excerpt || post.title} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://nanocollective.org/blog/${generateBlogSlug(post.title, post.number)}`}
        />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:alt" content={`Blog post: ${post.title}`} />
        <meta property="article:published_time" content={post.createdAt} />
        <meta property="article:modified_time" content={post.updatedAt} />
        <meta property="article:author" content={post.author.login} />
        {post.labels.map((label) => (
          <meta key={label.id} property="article:tag" content={label.name} />
        ))}
      </Head>

      <div className="min-h-screen bg-background font-sans flex flex-col">
        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 md:px-6 py-8 sm:py-12 max-w-4xl">
          <SectionReveal>
            {/* Back link */}
            <div className="mb-8 sm:mb-12">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase hover:text-[#0000EE] dark:hover:text-[#A1A1AA] transition-colors"
              >
                &lt; Back to Blogs
              </Link>
            </div>

            {/* Minimal Header */}
            <header className="mb-8 sm:mb-12 space-y-4 sm:space-y-6">
              <div className="flex flex-wrap gap-2 font-mono text-xs font-bold tracking-widest uppercase">
                {post.labels.map((label) => (
                  <span key={label.id} style={{ color: `#${label.color}` }}>
                    [{label.name}]
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight break-words">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-muted-foreground border-y border-foreground/10 py-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.createdAt}>{formattedDate}</time>
                </div>

                <div className="hidden sm:block opacity-50">|</div>

                <a
                  href={`https://github.com/${post.author.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  {/* biome-ignore lint/performance/noImgElement: static export uses unoptimized images */}
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.login}
                    className="h-5 w-5 rounded-sm"
                  />
                  <span>@{post.author.login}</span>
                </a>

                <div className="hidden sm:block opacity-50">|</div>

                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-[#0000EE] dark:hover:text-[#A1A1AA] transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.commentCount} comments</span>
                </a>
              </div>
            </header>
          </SectionReveal>

          <div className="space-y-16">
            {/* Clean Article Content */}
            <article
              className="prose prose-neutral dark:prose-invert max-w-none md:prose-lg leading-relaxed
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
                prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-foreground/10 prose-h2:pb-4
                prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-foreground/80 prose-p:mb-6
                prose-a:text-[#0000EE] dark:prose-a:text-[#A1A1AA] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-[#0000EE] dark:prose-blockquote:border-[#A1A1AA] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-foreground/70
                prose-code:font-mono prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none
                prose-pre:rounded-none prose-pre:bg-muted/30 prose-pre:border prose-pre:border-foreground/20 prose-pre:p-6
                prose-img:rounded-none prose-img:border prose-img:border-foreground/20 prose-img:my-10
                prose-ul:my-6 prose-li:my-2 prose-li:marker:text-foreground/40
                prose-strong:font-bold prose-strong:text-foreground
                prose-table:border-collapse prose-table:w-full prose-table:my-8
                prose-th:border-b-2 prose-th:border-foreground prose-th:text-left prose-th:p-3
                prose-td:border-b prose-td:border-foreground/10 prose-td:p-3"
              dangerouslySetInnerHTML={{ __html: post.bodyHTML }}
            />

            {/* Minimal CTA */}
            <div className="border-t border-foreground/10 pt-12">
              <div className="bg-muted/30 border border-foreground/20 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight">
                    Join the discussion
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Have thoughts on this post? Head over to our GitHub
                    discussions to share your feedback.
                  </p>
                </div>

                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-widest px-6 py-3 bg-[#0000EE] dark:bg-foreground text-white dark:text-background hover:opacity-90 transition-colors shrink-0"
                >
                  <span>View on GitHub</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
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

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // Paginate: GitHub returns max 100 discussions per page
    const discussions: Array<{ number: number; title: string }> = [];
    for (let page = 1; page <= 10; page++) {
      const response = await fetch(
        `https://api.github.com/repos/Nano-Collective/organisation/discussions?per_page=100&page=${page}`,
        { headers },
      );

      if (!response.ok) {
        if (page === 1) {
          return {
            paths: [
              { params: { slug: "nanocoder-hit-2000-github-stars-50" } },
              {
                params: {
                  slug: "introducing-nano-collective-a-new-era-of-privacy-first-ai-101",
                },
              },
            ],
            fallback: false,
          };
        }
        break;
      }

      const batch = (await response.json()) as Array<{
        number: number;
        title: string;
      }>;
      if (!Array.isArray(batch) || batch.length === 0) break;
      discussions.push(...batch);
      if (batch.length < 100) break;
    }

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
      paths: [
        { params: { slug: "nanocoder-hit-2000-github-stars-50" } },
        {
          params: {
            slug: "introducing-nano-collective-a-new-era-of-privacy-first-ai-101",
          },
        },
      ],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps<BlogPostProps> = async ({
  params,
}) => {
  const slug = params?.slug as string;

  if (!slug) {
    return { notFound: true };
  }

  const number = extractNumberFromSlug(slug);

  if (!number) {
    return { notFound: true };
  }

  const generateDummyPost = (): BlogPostProps => {
    if (
      slug === "introducing-nano-collective-a-new-era-of-privacy-first-ai-101"
    ) {
      return {
        post: {
          id: "dummy-2",
          number: 101,
          title: "Introducing Nano Collective: A new era of privacy-first AI",
          body: 'Today, we are thrilled to announce Nano Collective. Our mission is to build local-first, privacy-respecting AI tools that run entirely on your own hardware.\n\nFor too long, developers have had to compromise their codebase IP by sending it to third-party cloud LLMs. We believe there is a better way. With the rapid advancement of local models like Llama 3, the future of development is undeniably local.\n\n> "The future of AI development isn\'t in the cloud. It\'s executing directly on your local silicon, completely detached from external telemetry."\n> \n> — The Nano Collective Team\n\n## The Problem with Cloud AI\n\nWhen you use cloud-based AI assistants, you are implicitly trusting external servers with your most valuable asset: your source code. Every keystroke, every proprietary algorithm, and every trade secret is sent over the wire. This introduces massive security risks, compliance nightmares, and a fundamental loss of control.\n\nFurthermore, cloud solutions are subject to:\n- Unexpected outages and rate limits.\n- Latency issues that disrupt your `flow state`.\n- Silent model updates that break your established prompts.\n\n## Core Philosophy\n\nAt Nano Collective, we are building a suite of tools designed around three core pillars:\n\n1. **100% Local Processing:** Your code never leaves your machine. We leverage optimized local inference to run powerful models directly on your GPU or CPU.\n2. **Zero Telemetry:** We don\'t track your keystrokes, your usage patterns, or your projects. What you build is your business.\n3. **Open Source:** Transparency is critical for developer trust. Our core orchestration layers and IDE plugins are open source, allowing the community to audit, fork, and improve the ecosystem.\n\n## Introducing NanoTuner\n\nOur flagship product, `NanoTuner`, is a local-first RAG (Retrieval-Augmented Generation) pipeline specifically tuned for codebases. It indexes your local repository, creates a highly optimized vector store, and feeds relevant context to your local LLM of choice (like Ollama or LM Studio).\n\n### Why NanoTuner is Different\n\nUnlike other RAG solutions that rely on generic chunking strategies, NanoTuner understands the syntax of over 40 programming languages. It chunks code by function, class, and module, ensuring that the context provided to the LLM is semantically meaningful.\n\n```python\n# Example of how NanoTuner understands your code\ndef analyze_data(dataset):\n    """\n    This entire function is treated as a single semantic chunk,\n    preserving the relationship between the docstring and implementation.\n    """\n    clean_data = preprocess(dataset)\n    results = model.predict(clean_data)\n    return results\n```\n\n### Feature Comparison\n\n| Feature | Cloud AI | NanoTuner |\n| :--- | :--- | :--- |\n| Data Privacy | Sent to server | **100% Local** |\n| Latency | High (Network) | Low (Hardware) |\n| Telemetry | Extensive | **None** |\n| Cost | Monthly Subscription | **Free & Open Source** |\n\n## The Road Ahead\n\nThis is just the beginning. Over the next few months, we will be rolling out:\n- Deep integrations with VS Code and Neovim.\n- A decentralized model-sharing hub for custom code generation models.\n- Advanced context window management for massive enterprise codebases.\n\nWe invite you to join us on this journey. The future of AI is local. Welcome to the collective.',
          bodyHTML:
            '<p>Today, we are thrilled to announce Nano Collective. Our mission is to build local-first, privacy-respecting AI tools that run entirely on your own hardware.</p><p>For too long, developers have had to compromise their codebase IP by sending it to third-party cloud LLMs. We believe there is a better way. With the rapid advancement of local models like Llama 3, the future of development is undeniably local.</p><blockquote><p>"The future of AI development isn\'t in the cloud. It\'s executing directly on your local silicon, completely detached from external telemetry."</p><p>— The Nano Collective Team</p></blockquote><h2>The Problem with Cloud AI</h2><p>When you use cloud-based AI assistants, you are implicitly trusting external servers with your most valuable asset: your source code. Every keystroke, every proprietary algorithm, and every trade secret is sent over the wire. This introduces massive security risks, compliance nightmares, and a fundamental loss of control.</p><p>Furthermore, cloud solutions are subject to:</p><ul><li>Unexpected outages and rate limits.</li><li>Latency issues that disrupt your <code>flow state</code>.</li><li>Silent model updates that break your established prompts.</li></ul><h2>Core Philosophy</h2><p>At Nano Collective, we are building a suite of tools designed around three core pillars:</p><ol><li><strong>100% Local Processing:</strong> Your code never leaves your machine. We leverage optimized local inference to run powerful models directly on your GPU or CPU.</li><li><strong>Zero Telemetry:</strong> We don\'t track your keystrokes, your usage patterns, or your projects. What you build is your business.</li><li><strong>Open Source:</strong> Transparency is critical for developer trust. Our core orchestration layers and IDE plugins are open source, allowing the community to audit, fork, and improve the ecosystem.</li></ol><h2>Introducing NanoTuner</h2><p>Our flagship product, <code>NanoTuner</code>, is a local-first RAG (Retrieval-Augmented Generation) pipeline specifically tuned for codebases. It indexes your local repository, creates a highly optimized vector store, and feeds relevant context to your local LLM of choice (like Ollama or LM Studio).</p><h3>Why NanoTuner is Different</h3><p>Unlike other RAG solutions that rely on generic chunking strategies, NanoTuner understands the syntax of over 40 programming languages. It chunks code by function, class, and module, ensuring that the context provided to the LLM is semantically meaningful.</p><pre><code class="language-python"># Example of how NanoTuner understands your code\ndef analyze_data(dataset):\n    """\n    This entire function is treated as a single semantic chunk,\n    preserving the relationship between the docstring and implementation.\n    """\n    clean_data = preprocess(dataset)\n    results = model.predict(clean_data)\n    return results\n</code></pre><h3>Feature Comparison</h3><table><thead><tr><th align="left">Feature</th><th align="left">Cloud AI</th><th align="left">NanoTuner</th></tr></thead><tbody><tr><td align="left">Data Privacy</td><td align="left">Sent to server</td><td align="left"><strong>100% Local</strong></td></tr><tr><td align="left">Latency</td><td align="left">High (Network)</td><td align="left">Low (Hardware)</td></tr><tr><td align="left">Telemetry</td><td align="left">Extensive</td><td align="left"><strong>None</strong></td></tr><tr><td align="left">Cost</td><td align="left">Monthly Subscription</td><td align="left"><strong>Free &amp; Open Source</strong></td></tr></tbody></table><h2>The Road Ahead</h2><p>This is just the beginning. Over the next few months, we will be rolling out:</p><ul><li>Deep integrations with VS Code and Neovim.</li><li>A decentralized model-sharing hub for custom code generation models.</li><li>Advanced context window management for massive enterprise codebases.</li></ul><p>We invite you to join us on this journey. The future of AI is local. Welcome to the collective.</p>',
          excerpt:
            "Today, we are thrilled to announce Nano Collective. Our mission is to build local-first, privacy-respecting AI tools that run entirely on your own hardware...",
          createdAt: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          updatedAt: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          url: "https://github.com/Nano-Collective/organisation/discussions/101",
          commentCount: 12,
          category: {
            name: "Announcements",
            emoji: "📢",
            slug: "announcements",
          },
          labels: [{ id: "l1", name: "launch", color: "0000EE" }],
          author: {
            login: "akram",
            avatarUrl: "https://github.com/ghost.png",
          },
        },
      };
    }

    return {
      post: {
        id: "dummy-1",
        number: 50,
        title: "Nanocoder hit 2000 github stars",
        body: "Nanocoder has hit 2000 stars on GitHub! This is a huge milestone for our privacy-first local AI development tool. \n\nWe want to thank our amazing community for the support, issues, and PRs. This validates our belief that developers want absolute control over their codebase without leaking IP to external APIs.\n\n## What's Next?\n\nWe are currently working on V2, which will include better context resolution and full integration with local LLMs via Ollama.",
        bodyHTML:
          "<p>Nanocoder has hit 2000 stars on GitHub! This is a huge milestone for our privacy-first local AI development tool.</p><p>We want to thank our amazing community for the support, issues, and PRs. This validates our belief that developers want absolute control over their codebase without leaking IP to external APIs.</p><h2>What's Next?</h2><p>We are currently working on V2, which will include better context resolution and full integration with local LLMs via Ollama.</p>",
        excerpt:
          "Nanocoder has hit 2000 stars on GitHub! This is a huge milestone for our privacy-first local AI development tool...",
        createdAt: "2026-06-15T10:00:00Z",
        updatedAt: "2026-06-15T10:00:00Z",
        url: "https://github.com/Nano-Collective/organisation/discussions/50",
        commentCount: 24,
        category: { name: "Announcements", emoji: "📢", slug: "announcements" },
        labels: [
          { id: "l1", name: "milestone", color: "F59E0B" },
          { id: "l2", name: "community", color: "10B981" },
        ],
        author: {
          login: "akram",
          avatarUrl: "https://github.com/ghost.png",
        },
      },
    };
  };

  if (
    slug === "introducing-nano-collective-a-new-era-of-privacy-first-ai-101"
  ) {
    return { props: generateDummyPost() };
  }

  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    type DiscussionItem = {
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
    };

    // Paginate: GitHub returns max 100 discussions per page
    const discussions: DiscussionItem[] = [];
    for (let page = 1; page <= 10; page++) {
      const discussionsResponse = await fetch(
        `https://api.github.com/repos/Nano-Collective/organisation/discussions?per_page=100&page=${page}`,
        { headers },
      );

      if (!discussionsResponse.ok) {
        console.error(
          "Failed to fetch discussions:",
          discussionsResponse.statusText,
        );
        if (page === 1) {
          if (
            slug === "nanocoder-hit-2000-github-stars-50" ||
            slug ===
              "introducing-nano-collective-a-new-era-of-privacy-first-ai-101"
          ) {
            return { props: generateDummyPost() };
          }
          return { notFound: true };
        }
        break;
      }

      const batch = (await discussionsResponse.json()) as DiscussionItem[];
      if (!Array.isArray(batch) || batch.length === 0) break;
      discussions.push(...batch);
      if (batch.length < 100) break;
    }

    const discussion = discussions.find((d) => d.number === number);

    if (!discussion) {
      if (
        slug === "nanocoder-hit-2000-github-stars-50" ||
        slug === "introducing-nano-collective-a-new-era-of-privacy-first-ai-101"
      ) {
        return { props: generateDummyPost() };
      }
      return { notFound: true };
    }

    const bodyHTML = discussion.body ? await marked(discussion.body) : "";

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
    if (
      slug === "nanocoder-hit-2000-github-stars-50" ||
      slug === "introducing-nano-collective-a-new-era-of-privacy-first-ai-101"
    ) {
      return { props: generateDummyPost() };
    }
    return { notFound: true };
  }
};
