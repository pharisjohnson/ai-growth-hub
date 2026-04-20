import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — Selected Projects · Noon Studio Africa" },
      { name: "description", content: "A selection of recent web, brand, AI and marketing work by Noon Studio Africa." },
      { property: "og:title", content: "Work · Noon Studio Africa" },
      { property: "og:description", content: "Selected projects across web, brand, AI and marketing." },
    ],
  }),
  component: Work,
});

const projects = [
  { tag: "Web · E-commerce", title: "Savanna Goods", year: "2026", body: "Headless storefront and brand refresh for a Nairobi specialty grocer.", color: "from-amber-200 to-orange-300" },
  { tag: "AI · Automation", title: "Acacia Capital", year: "2026", body: "Custom GPT for client onboarding and an automated KYC pipeline.", color: "from-stone-300 to-stone-500" },
  { tag: "Brand · Identity", title: "Mara Health", year: "2025", body: "Visual identity and patient-facing collateral for a clinic group.", color: "from-emerald-200 to-teal-400" },
  { tag: "Marketing · Funnel", title: "Tatu SaaS", year: "2025", body: "Paid acquisition + landing-page CRO that 3.2× qualified demos.", color: "from-sky-200 to-indigo-400" },
  { tag: "Social · Content", title: "Ndani Hospitality", year: "2025", body: "Full social management and reels production for a boutique group.", color: "from-rose-200 to-pink-400" },
  { tag: "SEO · Content", title: "Pamba EdTech", year: "2024", body: "Technical SEO + content engine — 4× organic traffic in 6 months.", color: "from-lime-200 to-green-400" },
];

function Work() {
  return (
    <>
      <section className="border-b hairline">
        <div className="container-page py-20 md:py-28">
          <p className="mono-label">// Selected work</p>
          <h1 className="display text-5xl md:text-7xl mt-6 text-ink max-w-4xl">
            Quiet craft. Loud results.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            A snapshot of recent engagements. Full case studies available on request.
          </p>
        </div>
      </section>

      <section className="container-page py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-px bg-hairline border hairline">
          {projects.map((p) => (
            <article key={p.title} className="bg-background p-6 md:p-10 group cursor-pointer hover:bg-surface transition-colors">
              <div className={`aspect-[16/10] rounded-md bg-gradient-to-br ${p.color} relative overflow-hidden`}>
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div className="absolute bottom-4 left-4 font-mono text-xs text-ink/70 bg-background/80 backdrop-blur px-2 py-1 rounded">
                  {p.tag}
                </div>
              </div>
              <div className="mt-6 flex items-baseline justify-between gap-4">
                <h3 className="display text-2xl md:text-3xl text-ink">{p.title}</h3>
                <span className="font-mono text-xs text-muted-foreground">{p.year}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t hairline">
        <div className="container-page py-20 text-center">
          <h2 className="display text-3xl md:text-5xl text-ink">Have a project in mind?</h2>
          <Link to="/contact" className="btn-primary mt-8">Tell us about it →</Link>
        </div>
      </section>
    </>
  );
}
