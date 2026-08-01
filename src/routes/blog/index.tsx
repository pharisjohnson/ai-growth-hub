import { createFileRoute, Link } from "@tanstack/react-router";
import { getPublishedPosts, getScheduledPosts, formatDisplayDate } from "../../lib/blog";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Web Design & AI Marketing Insights · Noon Studio Africa · Nairobi" },
      { name: "description", content: "Web design, branding, and AI marketing insights for Kenyan and East African businesses. Tips on websites, SEO, automation, and digital growth from Noon Studio Africa in Nairobi." },
      { property: "og:title", content: "Blog · Noon Studio Africa · Nairobi" },
      { property: "og:description", content: "Web design, AI marketing, and branding insights from Nairobi for East African businesses." },
    ],
  }),
  component: BlogIndex,
});

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
      className="bg-background p-8 group hover:bg-surface transition-colors block"
    >
      {image ? (
        <img
          src={image}
          alt=""
          loading="lazy"
          className="mb-6 h-44 w-full object-cover rounded-xl"
        />
      ) : (
        <div className="mb-6 h-44 w-full rounded-xl bg-surface border hairline flex items-center justify-center">
          <span className="font-mono text-xs text-muted-foreground">{tag}</span>
        </div>
      )}
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-xs text-accent">{tag}</span>
        {readTime && <span className="font-mono text-xs text-muted-foreground">{readTime}</span>}
      </div>
      <h2 className="display text-2xl text-ink group-hover:text-accent transition-colors">
        {title}
      </h2>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        {excerpt}
      </p>
      <p className="mt-6 font-mono text-xs text-muted-foreground">{date}</p>
    </Link>
  );
}

function BlogIndex() {
  const posts = getPublishedPosts();
  const scheduled = getScheduledPosts();

  return (
    <>
      <section className="border-b hairline">
        <div className="container-page py-20 md:py-28">
          <p className="mono-label">// Blog</p>
          <h1 className="display text-5xl md:text-7xl mt-6 text-ink max-w-4xl">
            Insights for building online.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Web design, branding, and AI marketing — written from Nairobi for African businesses.
          </p>
        </div>
      </section>

      <section className="container-page py-20 md:py-28">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-hairline border hairline">
          {posts.map((p) => (
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
      </section>

      {scheduled.length > 0 && (
        <section className="border-t hairline">
          <div className="container-page py-16 md:py-20">
            <p className="mono-label">// Coming Soon</p>
            <h2 className="display text-3xl md:text-4xl mt-6 text-ink">Up next on the blog</h2>
            <p className="mt-3 text-muted-foreground">New articles every Monday, Wednesday, and Friday.</p>
            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scheduled.map((p) => (
                <div key={p.slug} className="border hairline rounded-xl p-5 opacity-60">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-xs text-accent">{p.tag}</span>
                    <span className="font-mono text-xs text-muted-foreground">{formatDisplayDate(p.date)}</span>
                  </div>
                  <h3 className="font-display text-lg text-ink">{p.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
