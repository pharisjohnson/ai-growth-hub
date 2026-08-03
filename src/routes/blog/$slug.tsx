import { createFileRoute, Link } from "@tanstack/react-router";
import { getPostBySlug, getRelatedPosts, formatFullDate, type ContentBlock } from "../../lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = getPostBySlug(params.slug);
    const faqItems =
      post?.content.filter((b): b is Extract<ContentBlock, { type: "faq" }> => b.type === "faq") ?? [];
    const faqSchema = faqItems.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.flatMap((f) =>
            f.items.map((i) => ({
              "@type": "Question",
              name: i.q,
              acceptedAnswer: { "@type": "Answer", text: i.a },
            }))
          ),
        }
      : null;
    const articleSchema = post
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          ...(post.updated ? { dateModified: post.updated } : {}),
          ...(post.author ? { author: { "@type": "Organization", name: post.author } } : {}),
          publisher: { "@type": "Organization", name: "Noon Studio Africa" },
          ...(post.image ? { image: post.image } : {}),
          mainEntityOfPage: `https://www.noonstudio.africa/blog/${post.slug}`,
        }
      : null;
    return {
      meta: [
        { title: post ? `${post.title} · Noon Studio Africa` : "Blog · Noon Studio Africa" },
        { name: "description", content: post?.excerpt ?? "" },
        { property: "og:title", content: post?.title ?? "Blog · Noon Studio Africa" },
        { property: "og:description", content: post?.excerpt ?? "" },
        { property: "og:type", content: "article" },
        ...(post?.image ? [{ property: "og:image", content: post.image }] : []),
        { property: "article:published_time", content: post?.date ?? "" },
        ...(post?.updated ? [{ property: "article:modified_time", content: post.updated }] : []),
      ],
      links: post
        ? [{ rel: "canonical", href: `https://www.noonstudio.africa/blog/${post.slug}` }]
        : [],
      scripts: [
        ...(articleSchema ? [{ type: "application/ld+json", children: JSON.stringify(articleSchema) }] : []),
        ...(faqSchema ? [{ type: "application/ld+json", children: JSON.stringify(faqSchema) }] : []),
      ],
    };
  },
  component: BlogPost,
});

function TableOfContents({ blocks }: { blocks: ContentBlock[] }) {
  const headings = blocks.filter((b): b is Extract<ContentBlock, { type: "h2" }> => b.type === "h2");
  if (headings.length < 2) return null;

  return (
    <nav className="rounded-2xl border hairline bg-surface/60 p-5" aria-label="Table of contents">
      <p className="mono-label">// On this page</p>
      <ul className="mt-4 space-y-2.5">
        {headings.map((h) => {
          const id = h.text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                className="text-sm leading-snug text-muted-foreground transition-colors hover:text-accent"
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function renderContent(blocks: ContentBlock[]) {
  return blocks.map((block, i) => {
    switch (block.type) {
      case "h2": {
        const id = block.text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        return (
          <h2 key={i} id={id} className="mt-14 mb-6 scroll-mt-24 font-display text-3xl text-ink">
            {block.text}
          </h2>
        );
      }
      case "h3":
        return <h3 key={i} className="mt-12 mb-5 font-display text-2xl text-ink">{block.text}</h3>;
      case "p":
        return (
          <p key={i} className="mb-5 leading-relaxed text-muted-foreground [&_strong]:text-ink">
            {block.text}
          </p>
        );
      case "ul":
        return (
          <ul key={i} className="my-8 list-disc space-y-2 pl-12 pr-4 text-muted-foreground">
            {block.items.map((item, j) => (
              <li key={j} className="leading-relaxed pl-1">{item}</li>
            ))}
          </ul>
        );
      case "ol":
        return (
          <ol key={i} className="my-8 list-decimal space-y-2 pl-12 pr-4 text-muted-foreground">
            {block.items.map((item, j) => (
              <li key={j} className="leading-relaxed pl-1">{item}</li>
            ))}
          </ol>
        );
      case "blockquote":
        return <blockquote key={i} className="my-10 border-l-2 border-accent pl-5 italic leading-relaxed text-muted-foreground">{block.text}</blockquote>;
      case "note":
        return <div key={i} className="my-10 rounded-xl border hairline bg-surface p-6 text-sm leading-relaxed text-ink">{block.text}</div>;
      case "takeaways":
        return (
          <div key={i} className="my-8 rounded-2xl border hairline bg-surface p-6">
            <p className="mono-label">// Key takeaways</p>
            <ul className="mt-4 space-y-2">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-3 text-sm leading-relaxed text-ink">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      case "table":
        return (
          <div key={i} className="my-8 overflow-x-auto rounded-xl border hairline">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b hairline bg-surface">
                  {block.headers.map((h, j) => (
                    <th key={j} className="px-4 py-3 font-mono text-xs font-medium uppercase tracking-wide text-ink">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, j) => (
                  <tr key={j} className="border-b hairline last:border-0">
                    {row.map((cell, k) => (
                      <td key={k} className="px-4 py-3 align-top text-muted-foreground">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "faq":
        return (
          <div key={i} className="my-8 space-y-3">
            {block.items.map((item, j) => (
              <details key={j} className="group rounded-xl border hairline bg-card">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-ink [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="shrink-0 font-mono text-accent transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="border-t hairline px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        );
      case "image":
        return (
          <figure key={i} className="my-8">
            <img
              src={block.src}
              alt={block.alt}
              loading="lazy"
              className="w-full rounded-2xl border hairline object-cover"
            />
            {block.caption ? (
              <figcaption className="mt-3 text-center font-mono text-xs text-muted-foreground">
                {block.caption}
              </figcaption>
            ) : null}
          </figure>
        );
      case "link":
        return (
          <a
            key={i}
            href={block.href}
            className="group my-8 flex items-center justify-between gap-4 rounded-2xl border hairline bg-surface p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div>
              {block.label && <p className="mono-label">{block.label}</p>}
              <p className="mt-1 text-sm font-medium text-ink transition-colors group-hover:text-accent">
                {block.text}
              </p>
            </div>
            <span className="shrink-0 font-mono text-accent transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        );
      default:
        return null;
    }
  });
}

function ShareButtons({ slug, title }: { slug: string; title: string }) {
  const url = `https://www.noonstudio.africa/blog/${slug}`;
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const links = [
    { label: "X", href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${encodedTitle}%20${encoded}` },
  ];
  return (
    <div className="flex items-center gap-2">
      <span className="mono-label">// Share</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border hairline bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-ink"
        >
          {l.label}
        </a>
      ))}
      <button
        onClick={() => {
          navigator.clipboard?.writeText(url);
        }}
        className="rounded-full border hairline bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-ink"
      >
        Copy link
      </button>
    </div>
  );
}

function BlogPost() {
  const { slug } = Route.useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <section className="border-b hairline">
        <div className="container-page py-28 text-center">
          <h1 className="display text-5xl text-ink">Post not found</h1>
          <Link to="/blog" className="btn-ghost mt-8 inline-flex">← Back to blog</Link>
        </div>
      </section>
    );
  }

  const related = getRelatedPosts(post);

  return (
    <>
      <section className="border-b hairline">
        <div className="container-page py-12 md:py-16">
          <Link to="/blog" className="font-mono text-xs text-muted-foreground hover:text-accent">← All articles</Link>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-ink px-3 py-1 text-xs font-medium text-background">{post.tag}</span>
            <span className="font-mono text-xs text-muted-foreground">{post.readTime}</span>
            <span className="font-mono text-xs text-muted-foreground">{formatFullDate(post.date)}</span>
            {post.updated && (
              <span className="font-mono text-xs text-muted-foreground">Updated {formatFullDate(post.updated)}</span>
            )}
          </div>
          <h1 className="display mt-6 max-w-4xl text-4xl text-ink md:text-6xl">
            {post.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="mt-10 w-full max-w-4xl rounded-2xl object-cover border hairline max-h-96"
            />
          ) : null}
        </div>
      </section>

      <section className="container-page py-14 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[16rem_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <TableOfContents blocks={post.content} />
                <ShareButtons slug={post.slug} title={post.title} />
              </div>
            </aside>

            <div>
              <article className="mx-auto max-w-2xl">
                {renderContent(post.content)}
              </article>

              <div className="mx-auto mt-12 max-w-2xl lg:hidden">
                <TableOfContents blocks={post.content} />
              </div>

              <div className="mx-auto mt-10 max-w-2xl border-t hairline pt-8">
                <ShareButtons slug={post.slug} title={post.title} />
              </div>

              {post.author && (
                <div className="mx-auto mt-12 flex max-w-2xl items-start gap-4 rounded-2xl border hairline bg-surface/60 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink font-display text-lg text-background">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-display text-lg text-ink">{post.author}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Noon Studio Africa is a senior-led studio in Nairobi building websites, brands, and AI
                      marketing systems for businesses across East Africa.
                    </p>
                  </div>
                </div>
              )}

              <div className="mx-auto mt-20 max-w-2xl rounded-3xl bg-ink p-10 text-center text-background">
                <h2 className="font-display text-3xl">Let's build something together</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-background/70">
                  Need a website, brand system, or AI marketing setup? We'd love to hear about your project.
                </p>
                <Link to="/contact" className="mt-8 inline-flex rounded-full bg-background px-6 py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5">
                  Start a project →
                </Link>
              </div>

              {related.length > 0 && (
                <div className="mx-auto mt-20 max-w-2xl">
                  <p className="mono-label">// Keep reading</p>
                  <h2 className="display mt-4 text-3xl text-ink">Related articles</h2>
                  <div className="mt-6 space-y-4">
                    {related.map((p) => (
                      <Link
                        key={p.slug}
                        to="/blog/$slug"
                        params={{ slug: p.slug }}
                        className="group flex items-center justify-between gap-6 rounded-2xl border hairline bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-accent">{p.tag}</span>
                            <span className="font-mono text-xs text-muted-foreground">{p.readTime}</span>
                          </div>
                          <h3 className="mt-2 font-display text-lg leading-snug text-ink transition-colors group-hover:text-accent">
                            {p.title}
                          </h3>
                        </div>
                        <span className="shrink-0 font-mono text-accent transition-transform group-hover:translate-x-0.5">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
