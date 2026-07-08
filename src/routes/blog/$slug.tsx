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
  { slug: "how-much-website-cost-kenya", title: "How Much Does a Website Cost in Kenya? (2026 Guide)", excerpt: "A breakdown of what Kenyan businesses actually pay for a professional website — from a simple landing page to a full e-commerce platform.", tag: "Web Design", date: "2026-07-01", readTime: "5 min", published: true },
  { slug: "ai-marketing-east-african-businesses", title: "AI Marketing for East African Businesses: A Practical Guide", excerpt: "How Nairobi businesses are using AI tools for customer support, content generation, and lead qualification — without hiring a data science team.", tag: "AI Marketing", date: "2026-06-15", readTime: "6 min", published: true },
  { slug: "why-senior-led-studio-beats-agency", title: "Why a Senior-Led Studio Beats a Traditional Agency", excerpt: "The difference between getting account managers and getting the people who actually do the work. And why your business deserves the latter.", tag: "Business", date: "2026-05-28", readTime: "4 min", published: true },
  { slug: "web-design-nairobi-kenya", title: "Web Design in Nairobi: What to Look for in a Design Studio (2026)", excerpt: "A practical guide to choosing a web design studio in Nairobi — what matters, what doesn't, and how to avoid wasting money.", tag: "Web Design", date: "2026-06-20", readTime: "6 min", published: true },
  { slug: "branding-agency-kenya", title: "Branding in Kenya: Why Your Business Needs More Than a Logo", excerpt: "Logo design is not branding. Here's what a real brand system includes and why Kenyan businesses that invest in it grow faster.", tag: "Branding", date: "2026-07-09", readTime: "5 min", published: false },
  { slug: "ecommerce-website-kenya", title: "Building an E-Commerce Website in Kenya: The Complete Guide", excerpt: "From M-Pesa integration to shipping logistics — everything you need to know before launching an online store in Kenya.", tag: "E-Commerce", date: "2026-07-11", readTime: "7 min", published: false },
  { slug: "seo-services-kenya", title: "SEO in Kenya: How to Actually Rank on Google", excerpt: "Most Kenyan businesses waste money on SEO. Here's what actually moves the needle — and what doesn't.", tag: "SEO", date: "2026-07-14", readTime: "6 min", published: false },
  { slug: "google-ads-kenya", title: "Google Ads in Kenya: A Beginner's Guide to Paid Search", excerpt: "Is Google Ads worth it for Kenyan businesses? Here's a realistic breakdown of costs, results, and what to expect.", tag: "Paid Ads", date: "2026-07-16", readTime: "5 min", published: false },
  { slug: "social-media-marketing-kenya", title: "Social Media Marketing in Kenya: What Actually Works in 2026", excerpt: "Instagram, TikTok, LinkedIn — which platforms matter for Kenyan businesses and how to use them without wasting time.", tag: "Social Media", date: "2026-07-18", readTime: "6 min", published: false },
  { slug: "content-marketing-east-africa", title: "Content Marketing for East African Businesses: A Practical Playbook", excerpt: "How to create content that attracts customers, builds trust, and drives revenue — without a massive team or budget.", tag: "Content Marketing", date: "2026-07-21", readTime: "5 min", published: false },
  { slug: "digital-marketing-agency-kenya", title: "How to Choose a Digital Marketing Agency in Kenya", excerpt: "Not all agencies are equal. Here's a framework for evaluating agencies — and the red flags to watch for.", tag: "Business", date: "2026-07-23", readTime: "5 min", published: false },
  { slug: "website-redesign-when", title: "5 Signs Your Website Needs a Redesign", excerpt: "Your website might be costing you customers without you knowing. Here are the warning signs — and what to do about them.", tag: "Web Design", date: "2026-07-25", readTime: "4 min", published: false },
  { slug: "ai-tools-small-business-kenya", title: "10 AI Tools Every Kenyan Small Business Should Try", excerpt: "Practical, affordable AI tools that save time and generate results — from content creation to customer support.", tag: "AI Marketing", date: "2026-07-28", readTime: "6 min", published: false },
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
  "web-design-nairobi-kenya": [
    { type: "p", text: "Nairobi has no shortage of web designers. Freelancers, agencies, studios — they're everywhere. But finding the right one? That's the hard part." },
    { type: "p", text: "Most businesses make the same mistake: they choose based on price or portfolio aesthetics, then wonder why the project goes sideways." },
    { type: "h2", text: "What Actually Matters When Choosing a Studio" },
    { type: "h3", text: "1. Senior People Doing the Work" },
    { type: "p", text: "Ask who will actually design and build your site. If the answer is 'our team' or 'our account manager will coordinate,' that's a red flag. You want to know the specific senior people handling your project — not a team of juniors with an account manager filtering communication." },
    { type: "h3", text: "2. Process Transparency" },
    { type: "p", text: "A good studio will walk you through their process: discovery, wireframing, design, development, testing, launch. If they skip straight to 'send us your content and we'll build it,' they're not thinking strategically about your business." },
    { type: "h3", text: "3. Results, Not Just Design" },
    { type: "p", text: "Pretty websites that don't convert are expensive art projects. Ask studios how they measure success. If the answer involves traffic, leads, or revenue — good sign. If it's just about aesthetics — run." },
    { type: "note", text: "Red flag: Studios that show only their portfolio without discussing results. A beautiful site that generates zero leads is a failure." },
    { type: "h2", text: "Questions to Ask Before Hiring" },
    { type: "ul", items: ["Who specifically will work on my project?", "How do you measure success?", "What happens if I'm not happy with the first design?", "Do you handle SEO and performance?", "What's included in post-launch support?"], },
    { type: "h2", text: "What Nairobi Businesses Get Wrong" },
    { type: "p", text: "The biggest mistake: choosing the cheapest option and expecting premium results. A KES 30k website from a freelancer is not the same product as a KES 300k custom build from a senior-led studio." },
    { type: "p", text: "The second biggest mistake: waiting too long to invest. Every month with a bad website is a month of lost leads, lost trust, and lost revenue." },
    { type: "blockquote", text: "\"We wasted six months with a cheap freelancer before coming to Noon. The cost of that wasted time exceeded what we paid for a proper site.\" — Founder, Nairobi fintech" },
    { type: "h2", text: "The Bottom Line" },
    { type: "p", text: "Choose a studio based on seniority of the team, transparency of process, and focus on your business results — not portfolio aesthetics or lowest price. Your website is your most important marketing asset. Treat it that way." },
  ],
  "branding-agency-kenya": [
    { type: "p", text: "Here's what most people think branding is: a logo, some colors, maybe a font. That's visual identity — and it's about 20% of what a real brand system includes." },
    { type: "p", text: "Branding is the entire experience people have with your business. How they feel when they see your content. What they say about you when you're not in the room. The gut instinct they have when your name comes up." },
    { type: "h2", text: "What a Real Brand System Includes" },
    { type: "ul", items: ["Brand strategy (positioning, voice, values, audience)", "Visual identity (logo, colors, typography, imagery)", "Messaging framework (tagline, value propositions, tone)", "Brand guidelines (how to use everything consistently)", "Content templates (social media, presentations, documents)"] },
    { type: "p", text: "Most agencies in Kenya deliver a logo and some colors. That's not a brand — it's a visual treatment." },
    { type: "h2", text: "Why Kenyan Businesses Need Strong Branding" },
    { type: "p", text: "Kenya's business landscape is increasingly competitive. In Nairobi alone, new businesses launch daily across every sector. A strong brand is the difference between being remembered and being forgotten." },
    { type: "p", text: "Consider: when a customer needs your service, do they think of you first? Or do they Google and hope for the best? A strong brand ensures you're the first name that comes to mind." },
    { type: "note", text: "Kenyan businesses that invest in professional branding report 2-3x higher customer recall compared to those with DIY branding." },
    { type: "h2", text: "The Cost of Bad Branding" },
    { type: "p", text: "Inconsistent colors across platforms. A logo that doesn't work at small sizes. Messaging that sounds like everyone else. These aren't cosmetic issues — they're revenue issues." },
    { type: "p", text: "Customers judge credibility in seconds. If your brand looks amateur, they assume your work is too." },
    { type: "h2", text: "What to Invest" },
    { type: "p", text: "For a complete brand system from a senior-led studio in Kenya: expect KES 150k-400k depending on scope. That includes strategy, visual identity, messaging, guidelines, and templates." },
    { type: "p", text: "It's an investment that pays for itself through higher conversion rates, better customer trust, and consistent presentation across every touchpoint." },
    { type: "blockquote", text: "\"Our new brand system didn't just look better — it changed how customers talked about us. We went from 'that company' to a name people remembered.\" — CEO, Nairobi retail brand" },
  ],
  "ecommerce-website-kenya": [
    { type: "p", text: "E-commerce in Kenya is growing fast. M-Pesa adoption, improving logistics, and changing consumer behavior mean more Kenyan businesses are selling online than ever before." },
    { type: "p", text: "But building an e-commerce website in Kenya has unique challenges that most guides don't cover. Here's what you actually need to know." },
    { type: "h2", text: "The Platform Question" },
    { type: "p", text: "You have three main options:" },
    { type: "ul", items: ["WooCommerce (WordPress): Most flexible, huge ecosystem, requires maintenance. Best for businesses that want full control.", "Shopify: Easiest to set up, limited customization, monthly fees. Good for simple product catalogs.", "Custom build: Maximum flexibility, highest cost. Only makes sense for complex requirements."] },
    { type: "note", text: "For most Kenyan businesses, WooCommerce offers the best balance of flexibility, cost, and local payment integration." },
    { type: "h2", text: "M-Pesa Integration" },
    { type: "p", text: "No Kenyan e-commerce site is complete without M-Pesa. The Daraja API makes integration straightforward, but there are nuances:" },
    { type: "ul", items: ["Use the Daraja API (not STK push for customer-initiated payments)", "Set up proper webhooks for payment confirmation", "Test thoroughly with the sandbox environment", "Handle edge cases: timeouts, partial payments, reversals"] },
    { type: "h2", text: "Logistics and Delivery" },
    { type: "p", text: "The biggest friction point in Kenyan e-commerce isn't payments — it's delivery. Options include:" },
    { type: "ul", items: ["In-house delivery (control but high cost)", "Third-party logistics (Sendy, G4S, etc.)", "Customer pickup points", "Hybrid model (delivery for Nairobi, pickup for upcountry)"] },
    { type: "h2", text: "What to Budget" },
    { type: "p", text: "A professional e-commerce site in Kenya:" },
    { type: "ul", items: ["Basic (10-50 products): KES 250k-400k", "Mid-range (50-200 products): KES 400k-700k", "Advanced (200+ products, custom features): KES 700k-1.5M+"] },
    { type: "p", text: "These include design, development, payment integration, and launch. Ongoing hosting and maintenance are additional (typically KES 15k-30k/month)." },
    { type: "h2", text: "Common Mistakes" },
    { type: "p", text: "The biggest: launching before the logistics are sorted. A beautiful e-commerce site with unreliable delivery will generate more complaints than sales." },
    { type: "p", text: "Start with a minimum viable store, nail the logistics, then scale. Don't try to build Amazon on day one." },
  ],
  "seo-services-kenya": [
    { type: "p", text: "SEO in Kenya is a crowded market. Every agency claims they'll get you to page one of Google. Most don't deliver — not because SEO doesn't work, but because they're doing it wrong." },
    { type: "p", text: "Here's what actually moves the needle for Kenyan businesses." },
    { type: "h2", text: "What SEO Actually Involves" },
    { type: "p", text: "SEO isn't magic. It's three things:" },
    { type: "ul", items: ["Technical SEO: Making sure Google can find, crawl, and understand your site", "On-page SEO: Optimizing content for the keywords your customers actually search", "Off-page SEO: Building authority through backlinks and mentions"] },
    { type: "p", text: "Most Kenyan businesses only do on-page SEO (stuffing keywords into pages) and wonder why it doesn't work." },
    { type: "h2", text: "Technical SEO: The Foundation" },
    { type: "p", text: "Before creating a single piece of content, your site needs:" },
    { type: "ul", items: ["Fast loading speed (under 3 seconds)", "Mobile responsiveness (70%+ of Kenyan traffic is mobile)", "Proper URL structure", "SSL certificate", "XML sitemap", "Schema markup for local business"] },
    { type: "note", text: "Critical: Google now uses mobile-first indexing. If your site isn't optimized for mobile, your desktop rankings will suffer too." },
    { type: "h2", text: "On-Page SEO for Kenya" },
    { type: "p", text: "Keyword research for Kenyan businesses needs local context:" },
    { type: "ul", items: ["Use location-specific keywords (\"web design Nairobi\" not just \"web design\")", "Include Swahili keywords where relevant", "Target long-tail keywords (\"best restaurant in Westlands\" vs \"restaurant Nairobi\")", "Create content around customer questions"] },
    { type: "h2", text: "Local SEO: The Biggest Opportunity" },
    { type: "p", text: "For most Kenyan businesses, local SEO is the biggest opportunity:" },
    { type: "ul", items: ["Google Business Profile optimization (photos, posts, reviews)", "Local citations (Yellow Pages Kenya, Business List Kenya)", "NAP consistency across all platforms", "Review generation strategy"] },
    { type: "p", text: "A well-optimized Google Business Profile can drive more leads than your entire website." },
    { type: "h2", text: "What to Expect" },
    { type: "p", text: "SEO is a long game. Expect:" },
    { type: "ul", items: ["Month 1-3: Technical fixes and foundation", "Month 3-6: Content creation and initial rankings", "Month 6-12: Authority building and significant traffic growth"] },
    { type: "blockquote", text: "\"We spent six months with an agency doing 'SEO' that was just blog posts with keywords. When we fixed the technical foundation, rankings jumped in weeks.\" — Marketing Director, Nairobi SaaS" },
    { type: "h2", text: "Budget" },
    { type: "p", text: "For comprehensive SEO in Kenya:" },
    { type: "ul", items: ["Technical audit + fixes: KES 80k-150k (one-time)", "Ongoing SEO: KES 30k-80k/month", "Content creation: KES 15k-30k per article"] },
    { type: "p", text: "If an agency promises page-one results in a month for KES 10k, they're either lying or using black-hat techniques that will get you penalized." },
  ],
  "google-ads-kenya": [
    { type: "p", text: "Google Ads can be a powerful growth channel for Kenyan businesses — but only if you know what you're doing. Most businesses waste their budget on poorly set up campaigns." },
    { type: "h2", text: "Is Google Ads Right for Your Business?" },
    { type: "p", text: "Google Ads works best when:" },
    { type: "ul", items: ["People are actively searching for your service", "Your product has clear search volume", "You can convert clicks into revenue", "You have budget for at least 3 months of testing"] },
    { type: "p", text: "It works less well for brand awareness or products people don't know to search for." },
    { type: "h2", text: "Costs in Kenya" },
    { type: "p", text: "Google Ads costs in Kenya vary widely by industry:" },
    { type: "ul", items: ["Professional services (legal, consulting): KES 100-300 per click", "E-commerce: KES 20-80 per click", "Local services: KES 30-150 per click", "SaaS/B2B: KES 50-200 per click"] },
    { type: "note", text: "Budget at least KES 50k-100k/month in ad spend to generate meaningful data. Below that, you won't have enough conversions to optimize." },
    { type: "h2", text: "Common Mistakes" },
    { type: "ul", items: ["No conversion tracking (flying blind)", "Broad keywords that waste budget", "No negative keywords (paying for irrelevant clicks)", "Sending traffic to homepage instead of landing pages", "Optimizing for clicks instead of conversions"] },
    { type: "h2", text: "The Landing Page Problem" },
    { type: "p", text: "The biggest waste in Google Ads: sending paid traffic to your homepage. Every ad should point to a dedicated landing page designed for one specific conversion goal." },
    { type: "p", text: "A good landing page converts 3-5x better than a generic homepage. That means 3-5x more customers for the same ad spend." },
    { type: "h2", text: "Getting Started" },
    { type: "p", text: "For Kenyan businesses new to Google Ads:" },
    { type: "ul", items: ["Start with search ads (not display or video)", "Focus on high-intent keywords", "Set up conversion tracking from day one", "Create dedicated landing pages", "Test with a small budget, then scale what works"] },
    { type: "blockquote", text: "\"We were spending KES 50k/month on Google Ads with no tracking. When we set up proper tracking and landing pages, we tripled our leads with the same budget.\" — Owner, Nairobi law firm" },
  ],
  "social-media-marketing-kenya": [
    { type: "p", text: "Social media in Kenya is massive. But most businesses are posting without a strategy, getting likes without leads, and wasting hours on content that doesn't convert." },
    { type: "p", text: "Here's what actually works for Kenyan businesses in 2026." },
    { type: "h2", text: "Platform Priority for Kenya" },
    { type: "h3", text: "1. Instagram" },
    { type: "p", text: "Best for: lifestyle brands, restaurants, fashion, beauty, real estate. Visual-first platform with strong engagement in Nairobi." },
    { type: "p", text: "Strategy: High-quality product/service photos, Reels for reach, Stories for engagement, consistent posting (3-5x/week)." },
    { type: "h3", text: "2. LinkedIn" },
    { type: "p", text: "Best for: B2B, professional services, tech, consulting. Nairobi's business community is active here." },
    { type: "p", text: text: "Strategy: Thought leadership content, case studies, team insights. Post 2-3x/week. Engage with comments." },
    { type: "h3", text: "3. TikTok" },
    { type: "p", text: "Best for: reaching younger audiences, brand personality, viral potential. Growing fast in Kenya." },
    { type: "p", text: "Strategy: Behind-the-scenes content, trends, educational content. Post daily if possible." },
    { type: "h3", text: "4. Facebook" },
    { type: "p", text: "Best for: community building, older demographics, local businesses. Still the largest platform by users in Kenya." },
    { type: "p", text: "Strategy: Groups, community engagement, local business features." },
    { type: "h2", text: "Content That Converts" },
    { type: "p", text: "Stop posting for likes. Start posting for leads:" },
    { type: "ul", items: ["Educational content (establishes authority)", "Case studies (shows results)", "Behind-the-scenes (builds trust)", "Customer stories (social proof)", "Clear CTAs (drives action)"] },
    { type: "note", text: "Rule of thumb: 80% value, 20% promotion. Give before you ask." },
    { type: "h2", text: "Time Investment" },
    { type: "p", text: "Realistic time investment for effective social media:" },
    { type: "ul", items: ["Content creation: 4-8 hours/week", "Community management: 2-4 hours/week", "Strategy and analytics: 1-2 hours/week"] },
    { type: "p", text: "That's 7-14 hours/week minimum. If you don't have that time, consider outsourcing to a content partner." },
    { type: "h2", text: "What to Measure" },
    { type: "p", text: "Stop counting likes. Start measuring:" },
    { type: "ul", items: ["Profile visits", "Website clicks", "DMs and enquiries", "Leads generated", "Revenue attributed to social"] },
    { type: "blockquote", text: "\"We stopped posting random content and started posting strategic content. Our Instagram enquiries went from 2-3/month to 15-20/month.\" — Founder, Nairobi fashion brand" },
  ],
  "content-marketing-east-africa": [
    { type: "p", text: "Content marketing is the most underused growth channel in East Africa. Most businesses either don't do it, or do it badly — posting random social content without a strategy." },
    { type: "p", text: "Here's a practical playbook for East African businesses that want to use content to attract customers and build trust." },
    { type: "h2", text: "What Content Marketing Actually Is" },
    { type: "p", text: "Content marketing is creating valuable, relevant content that attracts your target audience — and eventually converts them into customers." },
    { type: "p", text: "It's not: random social posts, company news, or content that's obviously promotional." },
    { type: "p", text: "It is: blog posts that answer customer questions, guides that solve problems, case studies that show results." },
    { type: "h2", text: "The Content Framework" },
    { type: "p", text: "Every piece of content should map to a stage in the customer journey:" },
    { type: "ul", items: ["Awareness: Blog posts, social content, industry insights", "Consideration: Comparison guides, case studies, webinars", "Decision: Product demos, testimonials, pricing pages", "Retention: How-to guides, community content, newsletters"] },
    { type: "note", text: "Most businesses over-invest in awareness content and under-invest in consideration and decision content. Balance your strategy across all stages." },
    { type: "h2", text: "Content Types That Work in East Africa" },
    { type: "h3", text: "Blog Posts" },
    { type: "p", text: "Still the most effective long-form content format. Target specific keywords your customers search for. Aim for 1,500-2,500 words for comprehensive coverage." },
    { type: "h3", text: "Case Studies" },
    { type: "p", text: "East African buyers trust results over promises. Document your customer wins with specific numbers and outcomes." },
    { type: "h3", text: "Video Content" },
    { type: "p", text: "Growing rapidly in the region. Short-form video (Reels, TikTok) for awareness; long-form (YouTube) for education." },
    { type: "h2", text: "Building a Content Engine" },
    { type: "p", text: "Consistency beats perfection. Here's a sustainable content engine:" },
    { type: "ul", items: ["Week 1: Blog post + social derivative content", "Week 2: Case study or customer story", "Week 3: Educational content (guide, how-to)", "Week 4: Industry insight or opinion piece"] },
    { type: "p", text: "That's 4 pieces of content per month — enough to build momentum without overwhelming your team." },
    { type: "h2", text: "Distribution Matters" },
    { type: "p", text: "Creating content is only half the job. Distribution:" },
    { type: "ul", items: ["Email newsletter to existing contacts", "Social media (adapt for each platform)", "LinkedIn for B2B content", "WhatsApp for direct distribution in Kenya", "SEO for long-term organic traffic"] },
    { type: "blockquote", text: "\"We went from zero content to 4 pieces per month. Within 6 months, organic search became our second-largest lead source.\" — Marketing Manager, Nairobi SaaS" },
  ],
  "digital-marketing-agency-kenya": [
    { type: "p", text: "Choosing a digital marketing agency in Kenya is overwhelming. Every agency promises results. Most over-promise and under-deliver." },
    { type: "p", text: "Here's a practical framework for evaluating agencies — and the red flags to watch for." },
    { type: "h2", text: "What Services Do You Actually Need?" },
    { type: "p", text: "Before evaluating agencies, clarify what you need:" },
    { type: "ul", items: ["Website design and development", "SEO and organic traffic growth", "Paid advertising (Google Ads, social ads)", "Social media management", "Content marketing", "Email marketing", "AI automation and chatbots"] },
    { type: "p", text: "Most businesses need 2-3 of these services, not all seven. An agency that tries to sell you everything is upselling, not strategizing." },
    { type: "h2", text: "The Evaluation Framework" },
    { type: "h3", text: "1. Team Composition" },
    { type: "p", text: "Ask who will work on your account. If the answer involves 'account managers,' 'coordinators,' or 'juniors,' that's a red flag. You want senior strategists and practitioners handling your work." },
    { type: "h3", text: "2. Case Studies with Numbers" },
    { type: "p", text: "Generic case studies are worthless. Ask for specific results: traffic increased by X%, leads grew by Y%, revenue improved by Z%." },
    { type: "h3", text: "3. Pricing Transparency" },
    { type: "p", text: "If an agency won't give you a ballpark price before a discovery call, they're either padding quotes based on your budget or hiding something." },
    { type: "note", text: "Red flag: Agencies that require long-term contracts before proving results. Month-to-month or milestone-based billing is fairer." },
    { type: "h2", text: "Red Flags" },
    { type: "ul", items: ["Guaranteed rankings (nobody can guarantee Google)", "No case studies or portfolio", "Account managers instead of practitioners", "Long-term lock-in contracts", "Vague reporting (lots of metrics, no insights)", "One-size-fits-all packages"] },
    { type: "h2", text: "Questions to Ask" },
    { type: "ul", items: ["Who specifically will handle my account?", "Can you show me results for a similar business?", "How do you measure success?", "What's your reporting cadence?", "Can I cancel with 30 days notice?"] },
    { type: "h2", text: "The Alternative: Senior-Led Studios" },
    { type: "p", text: "Senior-led studios like Noon Studio offer the strategic thinking of an agency with the hands-on execution of a dedicated team. You get senior people doing the work — not managing the people doing the work." },
    { type: "blockquote", text: "\"We chose a senior-led studio over a big agency. Same strategic thinking, better execution, half the cost.\" — Founder, Nairobi e-commerce" },
  ],
  "website-redesign-when": [
    { type: "p", text: "Your website is your most important marketing asset. But many businesses are running on outdated, underperforming sites that actively drive customers away." },
    { type: "p", text: "Here are five signs your website needs a redesign — and what to do about it." },
    { type: "h2", text: "Sign 1: It's Not Mobile-Friendly" },
    { type: "p", text: "Over 70% of Kenyan web traffic comes from mobile devices. If your site isn't optimized for mobile, you're losing the majority of your potential customers." },
    { type: "p", text: "Test it: pull up your site on your phone. Can you read the text without zooming? Is the navigation easy to use? Do buttons work with your thumb?" },
    { type: "h2", text: "Sign 2: It's Slow" },
    { type: "p", text: "Google says 53% of mobile users abandon sites that take more than 3 seconds to load. If your site is slow, you're losing over half your visitors before they see your content." },
    { type: "p", text: "Test it: use Google PageSpeed Insights. Anything below 70/100 needs attention." },
    { type: "h2", text: "Sign 3: It Doesn't Generate Leads" },
    { type: "p", text: "A website that looks good but doesn't generate enquiries is an expensive business card. If visitors aren't converting into leads, the site isn't doing its job." },
    { type: "note", text: "Average website conversion rate is 2-3%. If yours is below 1%, something is fundamentally broken — usually the design, copy, or user flow." },
    { type: "h2", text: "Sign 4: Your Brand Has Outgrown It" },
    { type: "p", text: "If your brand has evolved but your website hasn't, there's a disconnect. Customers judge consistency. A dated website undermines a modern brand." },
    { type: "h2", text: "Sign 5: You're Embarrassed to Share It" },
    { type: "p", text: "This one's simple: if you don't want to send people to your website, it needs a redesign. Your website should be something you're proud to share." },
    { type: "h2", text: "What a Redesign Involves" },
    { type: "p", text: "A proper redesign isn't just cosmetic. It includes:" },
    { type: "ul", items: ["Strategy: Understanding your audience and goals", "Design: Modern, conversion-focused layout", "Development: Fast, responsive, secure", "Content: Updated copy that converts", "SEO: Preserving and improving your search rankings"] },
    { type: "blockquote", text: "\"We knew our site needed work, but we didn't realize how much business we were losing until we redesigned. Enquiries doubled in the first month.\" — Director, Nairobi architecture firm" },
  ],
  "ai-tools-small-business-kenya": [
    { type: "p", text: "AI isn't just for tech companies anymore. Small businesses in Kenya are using AI tools to save time, cut costs, and compete with bigger players." },
    { type: "p", text: "Here are 10 practical AI tools every Kenyan small business should try." },
    { type: "h2", text: "Content Creation" },
    { type: "h3", text: "1. ChatGPT" },
    { type: "p", text: "Use for: Blog posts, email drafts, social media captions, product descriptions. The free tier is surprisingly capable for basic content needs." },
    { type: "h3", text: "2. Canva AI" },
    { type: "p", text: "Use for: Social media graphics, presentations, product mockups. The AI features help you create professional designs without a designer." },
    { type: "h3", text: "3. CapCut" },
    { type: "p", text: "Use for: Video editing, Reels, TikTok content. AI-powered editing features save hours of manual work." },
    { type: "h2", text: "Customer Support" },
    { type: "h3", text: "4. Tidio or Intercom" },
    { type: "p", text: "Use for: Website chatbots, automated customer support. Handle common questions 24/7 without hiring support staff." },
    { type: "h3", text: "5. WhatsApp Business" },
    { type: "p", text: "Use for: Automated replies, quick responses, business profile. The most-used messaging platform in Kenya — and it's free." },
    { type: "h2", text: "Marketing" },
    { type: "h3", text: "6. Mailchimp" },
    { type: "p", text: "Use for: Email marketing automation, newsletters, customer segmentation. Free tier handles up to 500 contacts." },
    { type: "h3", text: "7. Meta Business Suite" },
    { type: "p", text: "Use for: Social media scheduling, analytics, ad management. AI-powered insights help you post at optimal times." },
    { type: "h2", text: "Operations" },
    { type: "h3", text: "8. Notion AI" },
    { type: "p", text: "Use for: Document creation, meeting notes, project management. AI assists with writing, summarizing, and organizing." },
    { type: "h3", text: "9. Google Sheets + AI Add-ons" },
    { type: "p", text: "Use for: Data analysis, reporting, automation. AI add-ons can analyze trends and generate insights from your data." },
    { type: "h3", text: "10. Zapier" },
    { type: "p", text: "Use for: Connecting apps and automating workflows. Automate repetitive tasks like data entry, email routing, and form processing." },
    { type: "note", text: "Start with 2-3 tools that solve your biggest pain points. Don't try to adopt everything at once — master one tool before adding another." },
    { type: "h2", text: "Getting Started" },
    { type: "p", text: "The best approach:" },
    { type: "ul", items: ["Identify your biggest time wasters", "Choose one tool for each problem", "Spend a week learning it properly", "Measure the time or money saved", "Scale what works, drop what doesn't"] },
    { type: "blockquote", text: "\"We started with ChatGPT for content and Tidio for support. The time savings alone paid for both tools in the first month.\" — Owner, Nairobi boutique" },
  ],
};  // close postContent
