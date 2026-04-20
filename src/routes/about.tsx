import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — A Senior-led Studio in Nairobi · Noon Studio Africa" },
      { name: "description", content: "Noon Studio Africa is a Nairobi-based marketing consultancy. Lean, senior-led, and built for African businesses." },
      { property: "og:title", content: "About · Noon Studio Africa" },
      { property: "og:description", content: "Lean, senior-led marketing consultancy based in Nairobi." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="border-b hairline">
        <div className="container-page py-20 md:py-28 grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <p className="mono-label">// About</p>
          </div>
          <div className="md:col-span-8">
            <h1 className="display text-4xl md:text-6xl text-ink">
              We help African businesses look — and operate — like the best in the world.
            </h1>
          </div>
        </div>
      </section>

      <section className="container-page py-20 md:py-28 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4 space-y-6">
          <p className="mono-label">Mission</p>
          <p className="text-lg text-ink display">
            To empower businesses across Africa with world-class digital tools, creative branding and AI-driven marketing that drive real outcomes.
          </p>
          <p className="mono-label pt-6">Vision</p>
          <p className="text-lg text-ink display">
            To be the leading creative and AI-native studio in East Africa.
          </p>
        </div>
        <div className="md:col-span-8 space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Noon Studio Africa is a Nairobi-based marketing consultancy specialising in web design, digital marketing,
            branding, social media management, SEO and AI automation. Founded as a sole proprietorship, we work with
            clients across Kenya and the broader East African region.
          </p>
          <p>
            We combine creative excellence with strategic thinking and modern tooling — delivering work that is
            visually impactful, technically rigorous, and commercially effective. No bloated teams, no
            account-management theatre. Just senior people doing the work.
          </p>

          <div className="grid sm:grid-cols-2 gap-px bg-hairline border hairline mt-10">
            {[
              ["Local insight", "Deep understanding of Kenyan and East African digital behaviour."],
              ["Integrated", "Strategy → design → build → marketing → AI, in one place."],
              ["Transparent", "Clear scope, clear pricing, clear comms throughout."],
              ["Accountable", "We measure what matters and report against it."],
            ].map(([t, d]) => (
              <div key={t} className="bg-background p-6">
                <p className="display text-xl text-ink">{t}</p>
                <p className="text-sm text-muted-foreground mt-2">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t hairline">
        <div className="container-page py-20 text-center">
          <h2 className="display text-3xl md:text-5xl text-ink">Let's talk.</h2>
          <Link to="/contact" className="btn-primary mt-8">Start a conversation →</Link>
        </div>
      </section>
    </>
  );
}
