export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "blockquote"; text: string }
  | { type: "note"; text: string }
  | { type: "takeaways"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "faq"; items: { q: string; a: string }[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "link"; text: string; href: string; label?: string };

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  readTime: string;
  published: boolean;
  /** preview:true = private draft, only reachable by direct URL, hidden from sitemap and blog index */
  preview?: boolean;
  image: string;
  author?: string;
  updated?: string;
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
    .filter((p) => !p.published && !p.preview)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Private drafts: not yet approved, only reachable by direct URL. */
export function getPreviewPosts(): Post[] {
  return getAllPosts().filter((p) => !p.published && p.preview);
}

export function getTags(): string[] {
  const tags = new Set<string>();
  for (const p of getAllPosts()) {
    if (p.tag) tags.add(p.tag);
  }
  return Array.from(tags).sort();
}

export function getRelatedPosts(post: Post, count = 3): Post[] {
  return getPublishedPosts()
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const aSame = a.tag === post.tag ? 1 : 0;
      const bSame = b.tag === post.tag ? 1 : 0;
      if (aSame !== bSame) return bSame - aSame;
      return b.date.localeCompare(a.date);
    })
    .slice(0, count);
}

export function formatDisplayDate(iso: string): string {
  // "2026-08-03" -> "Aug 3"
  const d = new Date(iso + "T00:00:00Z");
  const mon = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  return `${mon} ${d.getUTCDate()}`;
}

export function formatFullDate(iso: string): string {
  // "2026-08-03" -> "August 3, 2026"
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export function countWords(blocks: ContentBlock[]): number {
  let words = 0;
  for (const b of blocks) {
    switch (b.type) {
      case "p":
      case "h2":
      case "h3":
      case "blockquote":
      case "note":
        words += b.text.split(/\s+/).filter(Boolean).length;
        break;
      case "ul":
      case "ol":
      case "takeaways":
        words += b.items.join(" ").split(/\s+/).filter(Boolean).length;
        break;
      case "table":
        words += b.headers.join(" ").split(/\s+/).filter(Boolean).length;
        words += b.rows.flat().join(" ").split(/\s+/).filter(Boolean).length;
        break;
      case "faq":
        for (const item of b.items) {
          words += `${item.q} ${item.a}`.split(/\s+/).filter(Boolean).length;
        }
        break;
      case "image":
        words += `${b.alt} ${b.caption ?? ""}`.split(/\s+/).filter(Boolean).length;
        break;
      case "link":
        words += `${b.text} ${b.label ?? ""}`.split(/\s+/).filter(Boolean).length;
        break;
    }
  }
  return words;
}

export function computeReadTime(blocks: ContentBlock[]): string {
  const words = countWords(blocks);
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function renderContent(blocks: ContentBlock[]) {
  // Rendered by the route components (JSX) — kept here for shared block logic.
  return blocks;
}
