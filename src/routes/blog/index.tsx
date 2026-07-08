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
    slug: "web-design-nairobi-kenya",
    title: "Web Design in Nairobi: What to Look for in a Design Studio (2026)",
    excerpt: "A practical guide to choosing a web design studio in Nairobi — what matters, what doesn't, and how to avoid wasting money.",
    tag: "Web Design",
    date: "2026-06-20",
    readTime: "6 min",
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

const scheduledPosts = [
  { slug: "branding-agency-kenya", title: "Branding in Kenya: Why Your Business Needs More Than a Logo", tag: "Branding", date: "Jul 9" },
  { slug: "ecommerce-website-kenya", title: "Building an E-Commerce Website in Kenya: The Complete Guide", tag: "E-Commerce", date: "Jul 11" },
  { slug: "seo-services-kenya", title: "SEO in Kenya: How to Actually Rank on Google", tag: "SEO", date: "Jul 14" },
  { slug: "google-ads-kenya", title: "Google Ads in Kenya: A Beginner's Guide to Paid Search", tag: "Paid Ads", date: "Jul 16" },
  { slug: "social-media-marketing-kenya", title: "Social Media Marketing in Kenya: What Actually Works in 2026", tag: "Social Media", date: "Jul 18" },
  { slug: "content-marketing-east-africa", title: "Content Marketing for East African Businesses: A Practical Playbook", tag: "Content Marketing", date: "Jul 21" },
  { slug: "digital-marketing-agency-kenya", title: "How to Choose a Digital Marketing Agency in Kenya", tag: "Business", date: "Jul 23" },
  { slug: "website-redesign-when", title: "5 Signs Your Website Needs a Redesign", tag: "Web Design", date: "Jul 25" },
  { slug: "ai-tools-small-business-kenya", title: "10 AI Tools Every Kenyan Small Business Should Try", tag: "AI Marketing", date: "Jul 28" },
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
        <div className="container-page py-16 md:py-20">
          <p className="mono-label">// Coming Soon</p>
          <h2 className="display text-3xl md:text-4xl mt-6 text-ink">Up next on the blog</h2>
          <p className="mt-3 text-muted-foreground">New articles every Monday, Wednesday, and Friday.</p>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduledPosts.map((p) => (
              <div key={p.slug} className="border hairline rounded-xl p-5 opacity-60">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs text-accent">{p.tag}</span>
                  <span className="font-mono text-xs text-muted-foreground">{p.date}</span>
                </div>
                <h3 className="font-display text-lg text-ink">{p.title}</h3>
              </div>
            ))}
          </div>
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
