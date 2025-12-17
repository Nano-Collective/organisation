import {
	Card,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MessageCircle } from "lucide-react";
import { Discussion } from "@/types/discussion";
import Link from "next/link";
import { generateBlogSlug } from "@/lib/slugify";

interface WhatsNextSectionProps {
	discussions: Discussion[];
}

// Define website published categories
const DISCUSSION_CATEGORIES = [
	{ name: "Nanocoder", emoji: "🧑‍💻", slug: "nanocoder" },
	{ name: "Packages", emoji: "📦", slug: "packages" },
];

export default function WhatsNextSection({
	discussions,
}: WhatsNextSectionProps) {
	return (
		<section className="py-20 border-t border-border/40">
			<div className="container mx-auto px-4">
				<div className="max-w-6xl mx-auto">
					<div className="text-center space-y-4 mb-12">
						<h2 className="text-4xl sm:text-5xl font-bold">What's Next</h2>
						<p className="text-xl text-muted-foreground">
							See what we're planning and join the discussion
						</p>
						<div className="flex gap-4 justify-center pt-4">
							<Button asChild variant="default">
								<Link href="/blog">View All Posts</Link>
							</Button>
							<Button asChild variant="outline">
								<a
									href="https://github.com/Nano-Collective/organisation/discussions"
									target="_blank"
									rel="noopener noreferrer"
								>
									<ExternalLink className="mr-2 h-4 w-4" />
									GitHub Discussions
								</a>
							</Button>
						</div>
					</div>

					<div className="space-y-6">
						{DISCUSSION_CATEGORIES.map((category) => {
							const categoryDiscussions = discussions.filter(
								(discussion) => discussion.category.slug === category.slug,
							);

							return (
								<div key={category.slug} className="space-y-3">
									<h3 className="text-xl font-semibold text-foreground">
										{category.emoji} {category.name}
									</h3>
                                    <div className="space-y-2">
                                        <Card>
                                            <CardHeader className="py-3">
                                                {categoryDiscussions.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {categoryDiscussions.slice(0, 5).map((discussion) => {
                                                            const isReleased = discussion.labels?.some(
                                                                (label) =>
                                                                    label.name.toLowerCase() === "released",
                                                            );

                                                            return (
                                                                <Link
                                                                    key={discussion.id}
                                                                    href={`/blog/${generateBlogSlug(discussion.title, discussion.number)}`}
                                                                    className="flex items-start gap-3 py-3 group hover:bg-accent/5 -mx-4 px-4 rounded transition-colors cursor-pointer"
                                                                >
                                                                    <div className="flex items-center mt-0.5">
                                                                        <div
                                                                            className={`h-4 w-4 rounded border flex items-center justify-center ${
                                                                                isReleased
                                                                                    ? "bg-primary border-primary"
                                                                                    : "border-border"
                                                                            }`}
                                                                        >
                                                                            {isReleased && (
                                                                                <svg
                                                                                    className="h-3 w-3 text-primary-foreground"
                                                                                    fill="none"
                                                                                    viewBox="0 0 24 24"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth={3}
                                                                                >
                                                                                    <title>check</title>
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        d="M5 13l4 4L19 7"
                                                                                    />
                                                                                </svg>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="text-sm font-semibold group-hover:text-primary transition-colors">
                                                                            {discussion.title}
                                                                        </div>
                                                                        {discussion.labels &&
                                                                            discussion.labels.length > 0 && (
                                                                                <div className="flex flex-wrap gap-1.5 mt-1">
                                                                                    {discussion.labels.map((label) => (
                                                                                        <Badge
                                                                                            key={label.id}
                                                                                            variant="outline"
                                                                                            style={{
                                                                                                borderColor: `#${label.color}`,
                                                                                                color: `#${label.color}`,
                                                                                            }}
                                                                                            className="text-[10px] h-4 px-1.5"
                                                                                        >
                                                                                            {label.name}
                                                                                        </Badge>
                                                                                    ))}

                                                                                    {discussion.comments > 0 && (
                                                                                        <div className="flex items-center gap-1 text-xs opacity-50 whitespace-nowrap">
                                                                                            <MessageCircle
                                                                                                className="h-3 w-3 transform -translate-y-0.25"
                                                                                                strokeWidth={3}
                                                                                            />
                                                                                            <span className="font-bold">
                                                                                                {discussion.comments} {
                                                                                                    discussion.comments > 1
                                                                                                        ? "comments"
                                                                                                        : "comment"}
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                    </div>
                                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground whitespace-nowrap mt-0.5">
                                                                        <span>
                                                                            {new Date(
                                                                                discussion.created_at,
                                                                            ).toLocaleDateString(undefined, {
                                                                                month: "short",
                                                                                day: "numeric",
                                                                            })}
                                                                        </span>
                                                                    </div>
                                                                </Link>
                                                            );
                                                        })}

                                                        {categoryDiscussions.length > 5 && (
                                                            <div className="px-4 pb-4">
                                                                <Button
                                                                    asChild
                                                                    variant="outline"
                                                                    className="w-full"
                                                                >
                                                                    <Link
                                                                        href={`/blog?category=${category.slug}`}
                                                                    >
                                                                        View More ({categoryDiscussions.length - 5} more)
                                                                    </Link>
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <CardDescription className="text-center text-sm py-2">
                                                        Plans are coming...
                                                    </CardDescription>
                                                )}
                                            </CardHeader>
                                        </Card>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
