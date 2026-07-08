import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
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

const posts = [
  {
    slug: "how-much-website-cost-kenya",
    title: "How Much Does a Website Cost in Kenya? (2026 Guide)",
    excerpt: "A breakdown of what Kenyan businesses actually pay for a professional website — from a simple landing page to a full e-commerce platform.",
    tag: "Web Design",
    date: "2026-07-01",
    readTime: "5 min",
  },
  {
    slug: "ai-marketing-east-african-businesses",
    title: "AI Marketing for East African Businesses: A Practical Guide",
    excerpt: "How Nairobi businesses are using AI tools for customer support, content generation, and lead qualification — without hiring a data science team.",
    tag: "AI Marketing",
    date: "2026-06-15",
    readTime: "6 min",
  },
  {
    slug: "why-senior-led-studio-beats-agency",
    title: "Why a Senior-Led Studio Beats a Traditional Agency",
    excerpt: "The difference between getting account managers and getting the people who actually do the work. And why your business deserves the latter.",
    tag: "Business",
    date: "2026-05-28",
    readTime: "4 min",
  },
];

function BlogIndex() {
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
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="bg-background p-8 group hover:bg-surface transition-colors block"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs text-accent">{p.tag}</span>
                <span className="font-mono text-xs text-muted-foreground">{p.readTime}</span>
              </div>
              <h2 className="display text-2xl text-ink group-hover:text-accent transition-colors">
                {p.title}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {p.excerpt}
              </p>
              <p className="mt-6 font-mono text-xs text-muted-foreground">{p.date}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t hairline">
        <div className="container-page py-20 text-center">
          <h2 className="display text-3xl md:text-5xl text-ink">Want us to build something?</h2>
          <Link to="/contact" className="btn-primary mt-8">Start a project →</Link>
        </div>
      </section>
    </>
  );
}
