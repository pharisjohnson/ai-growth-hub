import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Websites, Branding & AI Marketing · Noon Studio Africa" },
      { name: "description", content: "Noon Studio Africa is a Nairobi studio helping SMEs and entrepreneurs across East Africa win customers online. Websites, branding, and AI marketing, built by the people you talk to." },
      { property: "og:title", content: "About · Noon Studio Africa · Nairobi, Kenya" },
      { property: "og:description", content: "Websites, branding and AI marketing for East African businesses that want customers, not brochures." },
    ],
    links: [{ rel: "canonical", href: "https://noonstudio.africa/about" }],
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
              We help small businesses win customers online, without the agency runaround.
            </h1>
          </div>
        </div>
      </section>

      <section className="container-page py-20 md:py-28 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4 space-y-6">
          <p className="mono-label">Mission</p>
          <p className="text-lg text-ink display">
            To give East African small businesses the websites, brands and marketing they need to win customers and grow.
          </p>
          <p className="mono-label pt-6">Vision</p>
          <p className="text-lg text-ink display">
            To be the most trusted digital partner for SMEs across East Africa.
          </p>
        </div>
        <div className="md:col-span-8 space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Noon Studio Africa is a Nairobi-based studio helping small and growing businesses win customers online.
            We build websites, brands, social media, SEO and AI automation, all in one place, so you don't need
            four different vendors to get the job done.
          </p>
          <p>
            No bloated teams. No account-manager theatre. You work directly with the people building your
            website, and you always know what you are paying for and why.
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
