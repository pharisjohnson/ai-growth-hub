import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    return {
      meta: [
        { title: post ? `${post.title} · Noon Studio Africa` : "Blog · Noon Studio Africa" },
        { name: "description", content: post?.excerpt ?? "" },
        { property: "og:title", content: post?.title ?? "Blog · Noon Studio Africa" },
        { property: "og:description", content: post?.excerpt ?? "" },
      ],
    };
  },
  component: BlogPost,
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

function BlogPost() {
  const { slug } = Route.useParams();
  const post = posts.find((p) => p.slug === slug);

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

  const content = postContent[post.slug as keyof typeof postContent];

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
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <article className="max-w-2xl mx-auto prose-headings:display prose-headings:text-ink prose-headings:mt-12 prose-headings:mb-4 prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4 prose-a:text-accent prose-a:underline prose-a:underline-offset-4 prose-strong:text-ink prose-ul:text-muted-foreground prose-li:leading-relaxed prose-li:mb-2">
          {content ? (
            renderContent(content)
          ) : (
            <p>This post is being written. Check back soon.</p>
          )}
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

type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "blockquote"; text: string }
  | { type: "note"; text: string };

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

const postContent = {
  "how-much-website-cost-kenya": [
    { type: "p", text: "If you're a business owner in Nairobi wondering what a website actually costs in 2026, you've probably seen quotes ranging from KES 30,000 to KES 3 million. That's not helpful." },
    { type: "p", text: "The truth is: what you pay depends entirely on what you're buying. A template site slapped together in an afternoon is not the same as a custom-built marketing engine. Both are called 'websites.' Both are priced very differently." },
    { type: "h2", text: "The Three Tiers of Websites in Kenya" },
    { type: "h3", text: "1. DIY or Template (KES 15k — 60k)" },
    { type: "p", text: "Platforms like GoDaddy, Wix, or a freelancer on Upwork. You get a pre-built template, stock images, and basic hosting. Fine for a very early-stage business that just needs a digital business card." },
    { type: "note", text: "Good for: Sole proprietors, proof-of-concept, temporary landing pages. Not good for: Businesses that need to compete, rank on Google, or convert visitors." },
    { type: "h3", text: "2. Professional Custom Build (KES 120k — 500k)" },
    { type: "p", text: "A professionally designed and developed website built to your brand. Custom layouts, performance optimization, SEO foundation, analytics setup, and a CMS you can actually use. This is what most serious Nairobi businesses should budget for." },
    { type: "ul", items: ["Custom design (not a template)", "Responsive on all devices", "Basic SEO setup", "Analytics and form integration", "30-60 days of post-launch support"] },
    { type: "h3", text: "3. Platform or E-Commerce (KES 400k — 1.5M+)" },
    { type: "p", text: "A full e-commerce platform, membership site, or custom web application. Product catalogs, payment integration, inventory management, user accounts — the whole stack. These projects typically take 2-4 months and involve ongoing maintenance." },
    { type: "h2", text: "What You're Really Paying For" },
    { type: "p", text: "A website quote covers more than just 'making a site.' You're paying for:" },
    { type: "ul", items: ["Strategy: Understanding your audience, goals, and competitive landscape", "Design: Layout, typography, color, imagery — the look and feel", "Development: Code that works across browsers and devices", "Content: Copywriting, photography, or illustration", "Testing: Making sure everything works before launch", "Ongoing support: Fixes, updates, and optimizations after launch"] },
    { type: "p", text: "When a studio quotes KES 320k for a 10-15 page site, they're selling all of the above. When a freelancer quotes KES 30k, they're selling a template and hoping you don't ask for revisions." },
    { type: "blockquote", text: "\"The bitterness of poor quality remains long after the sweetness of low price is forgotten.\" — Benjamin Franklin" },
    { type: "h2", text: "Why Nairobi Businesses Overpay (or Under-Invest)" },
    { type: "p", text: "Two mistakes we see often:" },
    { type: "p", text: "First, businesses under-invest by going with the cheapest option, then spend six months frustrated that their site doesn't generate leads. They end up rebuilding — spending more in total." },
    { type: "p", text: "Second, businesses overpay by going to a large agency with a big team, high overheads, and account managers who pad the bill. The work isn't better — you're just paying for the sales process." },
    { type: "p", text: "A senior-led studio (like ours) sits in the middle. You pay for experienced people doing the work directly — not for account management theatre." },
    { type: "h2", text: "The Real Number to Budget" },
    { type: "p", text: "For most Nairobi SMEs looking for a professional website that actually generates business: budget KES 200k-500k for a solid custom site." },
    { type: "p", text: "That gets you a professional outcome, a partner who cares about results, and a site that earns its keep — rather than sitting there as a digital brochure nobody visits." },
  ],
  "ai-marketing-east-african-businesses": [
    { type: "p", text: "AI marketing sounds like something Silicon Valley startups do. But in 2026, the most practical AI tools are being used by Nairobi businesses with small teams and lean budgets." },
    { type: "p", text: "Here's what's actually working for East African businesses right now — no data science team required." },
    { type: "h2", text: "1. Customer Support Chatbots" },
    { type: "p", text: "The most common AI adoption we're seeing: custom GPTs trained on a business's own content. A hotel in Kilifi uses a chatbot to answer booking questions 24/7. A Nairobi SaaS company uses one to qualify leads before they reach the sales team." },
    { type: "p", text: "Setup cost: KES 30k-80k. Ongoing cost: minimal. Result: response time drops from hours to seconds." },
    { type: "h2", text: "2. Automated Content Pipelines" },
    { type: "p", text: "Businesses that need regular content (blog posts, social media, email newsletters) are using AI to generate first drafts, then having a human polish and approve. The result: 3-4x more content output without hiring a full-time writer." },
    { type: "note", text: "Key insight: AI replaces the blank page problem, not the editor. The best results come from businesses that treat AI as a junior writer and keep a senior person reviewing output." },
    { type: "h2", text: "3. Lead Qualification and Routing" },
    { type: "p", text: "AI agents can now handle inbound enquiries, ask qualifying questions, and route serious leads to the right person. One Nairobi retail brand uses an AI workflow that books qualified leads directly into the sales team's calendar — no back-and-forth." },
    { type: "p", text: "The result: sales teams spend less time on tyre-kickers and more time on actual buyers." },
    { type: "h2", text: "The Prerequisites" },
    { type: "p", text: "AI tools produce results proportional to the quality of your data and processes. Before adopting AI:" },
    { type: "ul", items: ["Clean up your customer data", "Document your standard operating procedures", "Have a clear definition of a qualified lead", "Be ready to review and iterate"] },
    { type: "p", text: "AI amplifies good processes. It does not fix bad ones." },
  ],
  "why-senior-led-studio-beats-agency": [
    { type: "p", text: "Here's how most agencies work: A salesperson sells you the dream. An account manager briefs a junior designer. The junior designer produces something average. Revise three times. The account manager bills you for the back-and-forth." },
    { type: "p", text: "Repeat every month." },
    { type: "h2", text: "The Problem with the Agency Model" },
    { type: "p", text: "The traditional agency model is built for the agency's benefit, not yours. Billable hours. Account management layers. Junior staff doing the work while senior people sell the work. It creates an incentive to drag projects out and staff them with the cheapest available talent." },
    { type: "p", text: "If you've worked with agencies before, you know the pattern. The people in the pitch meeting are rarely the people touching the files." },
    { type: "h2", text: "What a Senior-Led Studio Does Differently" },
    { type: "p", text: "A senior-led studio works the opposite way:" },
    { type: "ul", items: ["The people who sell the work are the people who do the work", "No account manager buffer between you and the team", "Fewer revisions because decisions are made by people who understand the craft", "Faster turnaround because knowledge isn't lost in handoffs", "Fixed pricing because experienced people estimate accurately"] },
    { type: "p", text: "The result: better work, faster, for the same or less money." },
    { type: "h2", text: "Why It Matters for Your Business" },
    { type: "p", text: "When you hire a senior-led studio, you're buying judgement, not just execution. A senior designer knows when to stop iterating. A senior developer knows which approach will scale. A senior strategist knows which marketing channels will actually work for your specific business." },
    { type: "p", text: "That judgement comes from years of making mistakes. You don't get it from a junior following a playbook." },
    { type: "blockquote", text: "\"I've worked with three agencies before. Noon was the first where senior people actually did the work, start to finish. No account-manager runaround.\" — Founder, Nairobi SaaS" },
    { type: "h2", text: "When to Choose Which" },
    { type: "p", text: "Big agencies make sense when you need a large team for a massive project (think: a full brand rollout across 15 countries). For most businesses — a website, a brand identity, a marketing system — a senior-led studio delivers better value." },
    { type: "p", text: "You get senior people. You skip the theatre. And your project gets the attention it deserves." },
  ],
};
