export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "blockquote"; text: string }
  | { type: "note"; text: string };

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  readTime: string;
  published: boolean;
  image: string;
  content: ContentBlock[];
}

// Load all posts from src/content/blog/*.json at build time.
const postModules = import.meta.glob("../content/blog/*.json", {
  eager: true,
  import: "default",
}) as Record<string, Post>;

export function getAllPosts(): Post[] {
  return Object.values(postModules);
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPublishedPosts(): Post[] {
  return getAllPosts()
    .filter((p) => p.published)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getScheduledPosts(): Post[] {
  return getAllPosts()
    .filter((p) => !p.published)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function formatDisplayDate(iso: string): string {
  // "2026-08-03" -> "Aug 3"
  const d = new Date(iso + "T00:00:00Z");
  const mon = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  return `${mon} ${d.getUTCDate()}`;
}

export function renderContent(blocks: ContentBlock[]) {
  // Rendered by the route components (JSX) — kept here for shared block logic.
  return blocks;
}
