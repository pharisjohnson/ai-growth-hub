import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Web, Brand, AI & Marketing · Noon Studio Africa" },
      { name: "description", content: "Web design, AI automation, digital marketing, branding, social media and SEO — built for African businesses." },
      { property: "og:title", content: "Services · Noon Studio Africa" },
      { property: "og:description", content: "Six integrated capabilities, one senior-led studio in Nairobi." },
    ],
  }),
  component: Services,
});

const services = [
  {
    n: "01",
    title: "Web Design & Development",
    body: "Custom, responsive websites that turn visitors into customers. Marketing sites, landing pages, e-commerce platforms and lightweight web apps.",
    bullets: ["Strategy & UX", "Design systems", "Headless & WordPress", "Performance & accessibility"],
  },
  {
    n: "02",
    title: "AI Automation",
    body: "Replace busywork with intelligent systems. Custom GPTs, AI chat agents, content pipelines, lead qualification and CRM automations.",
    bullets: ["Custom GPTs & agents", "Workflow automation (n8n / Make / Zapier)", "AI content pipelines", "CRM & ops integration"],
  },
  {
    n: "03",
    title: "Digital Marketing",
    body: "Strategic campaigns across paid search, display, email and funnels — engineered around measurable ROI and clean attribution.",
    bullets: ["Google & Meta Ads", "Email marketing & funnels", "Landing-page CRO", "Analytics & reporting"],
  },
  {
    n: "04",
    title: "Branding & Graphics",
    body: "Logo design, brand identity systems, visual guidelines and marketing collateral that communicate your values consistently.",
    bullets: ["Logo & identity", "Brand guidelines", "Pitch decks", "Print & packaging"],
  },
  {
    n: "05",
    title: "Social Media Management",
    body: "Full-service management — strategy, content creation, scheduling, community engagement and performance reporting.",
    bullets: ["Content strategy", "Creative production", "Community management", "Monthly reporting"],
  },
  {
    n: "06",
    title: "SEO & Content",
    body: "On-page and off-page SEO, keyword strategy, technical audits and content production that grow qualified organic traffic.",
    bullets: ["Technical audits", "Keyword & topic research", "Content production", "Link building"],
  },
];

function Services() {
  return (
    <>
      <section className="border-b hairline">
        <div className="container-page py-20 md:py-28">
          <p className="mono-label">// Services</p>
          <h1 className="display text-5xl md:text-7xl mt-6 text-ink max-w-4xl">
            Everything you need to grow online — under one roof.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Most agencies do one thing. We bring strategy, design, marketing and AI together so the work actually compounds.
          </p>
        </div>
      </section>

      <section className="container-page py-20 md:py-28 space-y-16">
        {services.map((s, i) => (
          <article key={s.n} className="grid md:grid-cols-12 gap-8 pb-16 border-b hairline last:border-b-0">
            <div className="md:col-span-4">
              <p className="font-mono text-xs text-accent">{s.n} / 06</p>
              <h2 className="display text-3xl md:text-4xl mt-3 text-ink">{s.title}</h2>
            </div>
            <div className="md:col-span-5">
              <p className="text-base text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
            <div className="md:col-span-3">
              <ul className="space-y-2 text-sm">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-accent">+</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      <section className="border-t hairline bg-surface">
        <div className="container-page py-20 text-center">
          <h2 className="display text-3xl md:text-5xl text-ink">Need a custom mix?</h2>
          <p className="mt-4 text-muted-foreground">Most engagements combine 2–3 services. Tell us the goal — we'll suggest the shape.</p>
          <Link to="/contact" className="btn-primary mt-8">Brief us →</Link>
        </div>
      </section>
    </>
  );
}
