import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getPublishedPosts, getScheduledPosts, getTags, formatDisplayDate, formatFullDate } from "../../lib/blog";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Web Design & AI Marketing Insights · Noon Studio Africa · Nairobi" },
      { name: "description", content: "Web design, branding, and AI marketing insights for Kenyan and East African businesses. Tips on websites, SEO, automation, and digital growth from Noon Studio Africa in Nairobi." },
      { property: "og:title", content: "Blog · Noon Studio Africa · Nairobi" },
      { property: "og:description", content: "Web design, AI marketing, and branding insights from Nairobi for East African businesses." },
    ],
    links: [{ rel: "canonical", href: "https://www.noonstudio.africa/blog" }],
  }),
  component: BlogIndex,
});

const TAG_COLORS: Record<string, string> = {
  "Web Design": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  "Branding": "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  "SEO": "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  "AI Marketing": "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  "Content Marketing": "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  "E-Commerce": "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  "Paid Ads": "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  "Social Media": "bg-pink-500/10 text-pink-700 dark:text-pink-300",
  "Business": "bg-teal-500/10 text-teal-700 dark:text-teal-300",
};

function TagBadge({ tag }: { tag: string }) {
  const cls = TAG_COLORS[tag] ?? "bg-surface text-muted-foreground";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {tag}
    </span>
  );
}

function PostCard({
  slug,
  title,
  excerpt,
  tag,
  date,
  readTime,
  image,
}: {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  readTime?: string;
  image?: string;
}) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border hairline bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/5"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-surface">
        {image ? (
          <img
            src={image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-mono text-xs text-muted-foreground">{tag}</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3">
          <TagBadge tag={tag} />
          {readTime && <span className="font-mono text-xs text-muted-foreground">{readTime}</span>}
        </div>
        <h2 className="mt-4 font-display text-xl leading-snug text-ink transition-colors group-hover:text-accent">
          {title}
        </h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {excerpt}
        </p>
        <p className="mt-5 font-mono text-xs text-muted-foreground">{formatFullDate(date)}</p>
      </div>
    </Link>
  );
}

function FeaturedPost({
  slug,
  title,
  excerpt,
  tag,
  date,
  readTime,
  image,
}: {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  readTime?: string;
  image?: string;
}) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug }}
      className="group grid overflow-hidden rounded-3xl border hairline bg-card transition-all hover:shadow-xl hover:shadow-ink/5 lg:grid-cols-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface lg:aspect-auto lg:min-h-[22rem]">
        {image ? (
          <img
            src={image}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-mono text-xs text-muted-foreground">{tag}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center p-8 md:p-12">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-background">Featured</span>
          <TagBadge tag={tag} />
          {readTime && <span className="font-mono text-xs text-muted-foreground">{readTime}</span>}
        </div>
        <h2 className="mt-5 font-display text-3xl leading-tight text-ink transition-colors group-hover:text-accent md:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{excerpt}</p>
        <div className="mt-8 flex items-center gap-4">
          <span className="font-mono text-xs text-muted-foreground">{formatFullDate(date)}</span>
          <span className="inline-flex items-center gap-1 font-mono text-xs text-accent">
            Read article <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

function BlogIndex() {
  const posts = getPublishedPosts();
  const scheduled = getScheduledPosts();
  const tags = getTags();
  const [activeTag, setActiveTag] = useState<string>("All");

  const filtered = activeTag === "All" ? posts : posts.filter((p) => p.tag === activeTag);
  const [featured, ...rest] = filtered;

  return (
    <>
      <section className="border-b hairline">
        <div className="container-page py-16 md:py-24">
          <p className="mono-label">// Blog</p>
          <h1 className="display mt-6 max-w-4xl text-5xl text-ink md:text-7xl">
            Insights for building online.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Web design, branding, and AI marketing. Practical guides written from Nairobi for African businesses.
          </p>
        </div>
      </section>

      <section className="container-page py-14 md:py-20">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTag("All")}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              activeTag === "All"
                ? "border-ink bg-ink text-background"
                : "border-hairline bg-card text-muted-foreground hover:text-ink"
            }`}
          >
            All
          </button>
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                activeTag === t
                  ? "border-ink bg-ink text-background"
                  : "border-hairline bg-card text-muted-foreground hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {featured && (
          <div className="mt-10">
            <FeaturedPost
              slug={featured.slug}
              title={featured.title}
              excerpt={featured.excerpt}
              tag={featured.tag}
              date={featured.date}
              readTime={featured.readTime}
              image={featured.image || undefined}
            />
          </div>
        )}

        {rest.length > 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <PostCard
                key={p.slug}
                slug={p.slug}
                title={p.title}
                excerpt={p.excerpt}
                tag={p.tag}
                date={p.date}
                readTime={p.readTime}
                image={p.image || undefined}
              />
            ))}
          </div>
        )}
      </section>

      <section className="border-y hairline bg-surface">
        <div className="container-page py-16 md:py-20 text-center">
          <p className="mono-label">// Newsletter</p>
          <h2 className="display mt-5 text-3xl text-ink md:text-4xl">
            Practical growth tips, twice a month.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            One email with the web, brand, and AI marketing lessons we learn building for Nairobi businesses. No spam.
          </p>
          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement)?.value;
              if (email) window.location.href = `mailto:matata@noonstudio.africa?subject=Newsletter%20signup&body=Email:%20${encodeURIComponent(email)}`;
            }}
          >
            <input
              name="email"
              type="email"
              required
              placeholder="you@company.co.ke"
              className="flex-1 rounded-full border hairline bg-background px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/40"
            />
            <button type="submit" className="btn-primary justify-center">Subscribe</button>
          </form>
        </div>
      </section>

      {scheduled.length > 0 && (
        <section className="container-page py-16 md:py-20">
          <p className="mono-label">// Coming Soon</p>
          <h2 className="display mt-5 text-3xl text-ink md:text-4xl">Up next on the blog</h2>
          <p className="mt-3 text-muted-foreground">Fresh articles landing every week.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {scheduled.map((p) => (
              <div key={p.slug} className="rounded-xl border hairline bg-card p-5 opacity-70">
                <div className="flex items-center justify-between">
                  <TagBadge tag={p.tag} />
                  <span className="font-mono text-xs text-muted-foreground">{formatDisplayDate(p.date)}</span>
                </div>
                <h3 className="mt-3 font-display text-lg leading-snug text-ink">{p.title}</h3>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
