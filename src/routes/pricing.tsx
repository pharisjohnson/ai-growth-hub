import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Packages & Engagements · Noon Studio Africa" },
      { name: "description", content: "Transparent packages for web, branding, AI automation and ongoing marketing retainers. Built for African SMEs." },
      { property: "og:title", content: "Pricing · Noon Studio Africa" },
      { property: "og:description", content: "Transparent packages for web, brand, AI and ongoing marketing." },
    ],
  }),
  component: Pricing,
});

const tiers = [
  {
    name: "Launch",
    price: "From KES 120k",
    tag: "One-off",
    body: "A focused starter project — perfect for new brands or single-page launches.",
    features: ["Up to 5-page website", "Brand starter kit", "Basic SEO setup", "Analytics & forms", "30-day post-launch support"],
    cta: "Start small",
  },
  {
    name: "Growth",
    price: "From KES 320k",
    tag: "Most popular",
    featured: true,
    body: "A full digital foundation: site, brand and the automations that run behind it.",
    features: ["10–15 page custom website", "Full brand identity system", "1 AI automation (chatbot or workflow)", "On-page SEO + content brief", "60-day optimisation window"],
    cta: "Build the engine",
  },
  {
    name: "Studio Retainer",
    price: "From KES 180k / mo",
    tag: "Ongoing",
    body: "An embedded team for marketing, content, AI ops and continuous improvement.",
    features: ["Dedicated strategist", "Social + content production", "Paid media management", "AI/automation iteration", "Monthly reporting & reviews"],
    cta: "Partner with us",
  },
];

function Pricing() {
  return (
    <>
      <section className="border-b hairline">
        <div className="container-page py-20 md:py-28">
          <p className="mono-label">// Pricing</p>
          <h1 className="display text-5xl md:text-7xl mt-6 text-ink max-w-4xl">
            Fair pricing, no surprises.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Indicative packages — every engagement is scoped to your goals. Most clients combine a project with an ongoing retainer.
          </p>
        </div>
      </section>

      <section className="container-page py-20 md:py-28">
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative p-8 rounded-xl border hairline flex flex-col ${
                t.featured ? "bg-ink text-background border-ink" : "bg-background"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className={`mono-label ${t.featured ? "text-background/60" : ""}`}>{t.tag}</p>
                {t.featured && <span className="h-2 w-2 rounded-full bg-accent" />}
              </div>
              <h3 className="display text-3xl mt-6">{t.name}</h3>
              <p className={`mt-2 font-mono text-sm ${t.featured ? "text-background/70" : "text-muted-foreground"}`}>{t.price}</p>
              <p className={`mt-4 text-sm ${t.featured ? "text-background/80" : "text-muted-foreground"}`}>{t.body}</p>

              <ul className="mt-6 space-y-2.5 text-sm flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className={t.featured ? "text-accent" : "text-accent"}>+</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/contact"
                className={`mt-8 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition ${
                  t.featured
                    ? "bg-background text-ink hover:opacity-90"
                    : "border hairline hover:bg-surface"
                }`}
              >
                {t.cta} →
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Need something custom? <Link to="/contact" className="text-accent underline underline-offset-4">Brief us</Link> — we'll come back with a tailored proposal.
        </p>
      </section>
    </>
  );
}
