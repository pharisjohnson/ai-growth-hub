import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Noon Studio Africa — Web, Brand & AI Marketing Studio · Nairobi" },
      { name: "description", content: "We design websites, build brands and ship AI automations that grow African businesses. Based in Nairobi, working across East Africa." },
      { property: "og:title", content: "Noon Studio Africa — Web, Brand & AI Marketing" },
      { property: "og:description", content: "Websites, brand systems, and AI automations for businesses across Africa." },
    ],
  }),
  component: Home,
});

const services = [
  { n: "01", title: "Web Design & Development", body: "Custom, responsive sites and e-commerce built to convert — from landing pages to full platforms." },
  { n: "02", title: "AI Automation", body: "Custom GPTs, chatbots, lead-routing and workflow automations that replace busywork." },
  { n: "03", title: "Digital Marketing", body: "Paid search, display, and email funnels engineered around measurable ROI." },
  { n: "04", title: "Branding & Graphics", body: "Logos, identity systems and collateral that hold up across every touchpoint." },
  { n: "05", title: "Social Media", body: "Strategy, content, scheduling, community and reporting — handled end to end." },
  { n: "06", title: "SEO & Content", body: "Technical audits, keyword strategy and content that grows organic visibility." },
];

const sectors = ["Retail & E-commerce", "Financial Services", "Technology & SaaS", "Hospitality & Tourism", "Healthcare", "Education", "NGOs & Development", "Professional Services"];

const process = [
  { n: "01", t: "Discover", d: "Goals, audience, competitors." },
  { n: "02", t: "Strategise", d: "A plan you can defend." },
  { n: "03", t: "Create", d: "Design, build, write, automate." },
  { n: "04", t: "Launch", d: "Ship with confidence." },
  { n: "05", t: "Optimise", d: "Measure, iterate, compound." },
];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b hairline">
        <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
        <div className="container-page relative pt-20 pb-24 md:pt-32 md:pb-40">
          <div className="flex items-center gap-3 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <p className="mono-label">Nairobi · accepting Q3 projects</p>
          </div>
          <h1 className="display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-ink max-w-5xl">
            A studio for the<br />
            <span className="italic text-accent">internet-native</span> African business.
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground">
            We design websites, build brands and ship AI automations that turn attention into revenue.
            One small team. Senior work only.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link to="/contact" className="btn-primary">Start a project <span aria-hidden>→</span></Link>
            <Link to="/work" className="btn-ghost">See the work</Link>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 border-t hairline pt-10">
            {[
              ["6+", "Service lines"],
              ["100%", "Senior-led"],
              ["EAC", "Regional reach"],
              ["AI-native", "Workflow"],
            ].map(([k, v]) => (
              <div key={v}>
                <p className="display text-3xl md:text-4xl text-ink">{k}</p>
                <p className="mono-label mt-1">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="container-page py-24 md:py-32">
        <div className="grid md:grid-cols-12 gap-8 mb-14">
          <div className="md:col-span-4">
            <p className="mono-label">// Services</p>
          </div>
          <div className="md:col-span-8">
            <h2 className="display text-3xl md:text-5xl text-ink max-w-2xl">
              Six capabilities, one integrated studio.
            </h2>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 border-t border-l hairline">
          {services.map((s) => (
            <div key={s.n} className="border-b border-r hairline p-8 group hover:bg-surface transition-colors">
              <p className="mono-label">{s.n}</p>
              <h3 className="display text-2xl mt-4 text-ink">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link to="/services" className="btn-ghost">All services →</Link>
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-t hairline bg-surface">
        <div className="container-page py-24 md:py-32">
          <div className="grid md:grid-cols-12 gap-8 mb-14">
            <div className="md:col-span-4">
              <p className="mono-label">// Process</p>
            </div>
            <div className="md:col-span-8">
              <h2 className="display text-3xl md:text-5xl text-ink max-w-2xl">
                A predictable path from blank page to compounding growth.
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-5 gap-px bg-hairline border hairline">
            {process.map((p) => (
              <div key={p.n} className="bg-surface p-6">
                <p className="font-mono text-xs text-accent">{p.n}</p>
                <p className="display text-xl mt-2 text-ink">{p.t}</p>
                <p className="text-sm text-muted-foreground mt-2">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTORS */}
      <section className="container-page py-24 md:py-32">
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <p className="mono-label">// Sectors</p>
            <h2 className="display text-3xl md:text-4xl mt-4 text-ink">Where we do our best work.</h2>
          </div>
          <div className="md:col-span-8 grid sm:grid-cols-2 gap-px bg-hairline border hairline">
            {sectors.map((s) => (
              <div key={s} className="bg-background p-5 flex items-center justify-between">
                <span className="text-sm">{s}</span>
                <span className="font-mono text-xs text-muted-foreground">→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t hairline">
        <div className="container-page py-24 md:py-32 text-center">
          <p className="mono-label">// Ready when you are</p>
          <h2 className="display text-4xl md:text-6xl mt-4 text-ink max-w-3xl mx-auto">
            Let's build something that earns its keep.
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/contact" className="btn-primary">Start a project →</Link>
            <a href="mailto:matata@noonstudio.africa" className="btn-ghost">matata@noonstudio.africa</a>
          </div>
        </div>
      </section>
    </>
  );
}
