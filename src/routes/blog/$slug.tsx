import { createFileRoute, Link } from "@tanstack/react-router";
import { getPostBySlug, type ContentBlock } from "../../lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = getPostBySlug(params.slug);
    return {
      meta: [
        { title: post ? `${post.title} · Noon Studio Africa` : "Blog · Noon Studio Africa" },
        { name: "description", content: post?.excerpt ?? "" },
        { property: "og:title", content: post?.title ?? "Blog · Noon Studio Africa" },
        { property: "og:description", content: post?.excerpt ?? "" },
        ...(post?.image ? [{ property: "og:image", content: post.image }] : []),
      ],
    };
  },
  component: BlogPost,
});

function renderContent(blocks: ContentBlock[]) {
  return blocks.map((block, i) => {
    switch (block.type) {
      case "h2":
        return <h2 key={i}>{block.text}</h2>;
      case "h3":
        return <h3 key={i}>{block.text}</h3>;
      case "p":
        return <p key={i}>{block.text}</p>;
      case "ul":
        return <ul key={i}>{block.items.map((item, j) => <li key={j}>{item}</li>)}</ul>;
      case "blockquote":
        return <blockquote key={i} className="border-l-2 border-accent pl-4 italic my-6 text-muted-foreground">{block.text}</blockquote>;
      case "note":
        return <div key={i} className="bg-surface border hairline rounded-xl p-6 my-8 text-sm text-ink">{block.text}</div>;
      default:
        return null;
    }
  });
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

  return (
    <>
      <section className="border-b hairline">
        <div className="container-page py-16 md:py-20">
          <Link to="/blog" className="font-mono text-xs text-muted-foreground hover:text-accent">← Back to blog</Link>
          <div className="flex items-center gap-3 mt-8">
            <span className="font-mono text-xs text-accent">{post.tag}</span>
            <span className="font-mono text-xs text-muted-foreground">{post.readTime}</span>
            <span className="font-mono text-xs text-muted-foreground">{post.date}</span>
          </div>
          <h1 className="display text-4xl md:text-6xl mt-6 text-ink max-w-4xl">
            {post.title}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            {post.excerpt}
          </p>
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="mt-10 w-full max-w-3xl rounded-2xl object-cover max-h-96 border hairline"
            />
          ) : null}
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <article className="max-w-2xl mx-auto prose-headings:display prose-headings:text-ink prose-headings:mt-12 prose-headings:mb-4 prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4 prose-a:text-accent prose-a:underline prose-a:underline-offset-4 prose-strong:text-ink prose-ul:text-muted-foreground prose-li:leading-relaxed prose-li:mb-2">
          {renderContent(post.content)}
        </article>

        <div className="max-w-2xl mx-auto mt-20 pt-12 border-t hairline text-center">
          <h2 className="display text-2xl text-ink">Let's build something together</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Need a website, brand system, or AI marketing setup? We'd love to hear about your project.
          </p>
          <Link to="/contact" className="btn-primary mt-6 inline-flex">Start a project →</Link>
        </div>
      </section>
    </>
  );
}
