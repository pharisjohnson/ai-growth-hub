import { createFileRoute, Link } from "@tanstack/react-router";
import chariot from "@/assets/work-chariot.png";
import eika from "@/assets/work-eika.png";
import eve from "@/assets/work-explorewitheve.png";
import miji from "@/assets/work-miji.png";
import krish from "@/assets/work-krish.png";
import comfy from "@/assets/work-comfy.png";

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
  { tag: "Web · Photography", title: "Chariot Creations", year: "2025", body: "Brand-forward portfolio and booking site for a Mombasa photography studio.", img: chariot, href: "https://chariotcreations.com/" },
  { tag: "Web · Travel", title: "Eik Africa Experience", year: "2025", body: "Multi-destination travel site for safaris, beach getaways and cultural tours.", img: eika, href: "https://www.eikafricaexperience.com/" },
  { tag: "Web · Tourism", title: "Explore With Eve", year: "2025", body: "Editorial-style experiences site spotlighting the Kenyan coast and beyond.", img: eve, href: "https://explorewitheve.com/" },
  { tag: "Web · Innovation", title: "Miji Africa", year: "2024", body: "Living Lab platform supporting inclusive innovation across African cities.", img: miji, href: "https://mijiafrica.com/" },
  { tag: "Web · Music", title: "Krish-Kenya", year: "2025", body: "Bold artist site and booking funnel for an East African electronic DJ.", img: krish, href: "https://www.krishkenya.com/" },
  { tag: "Web · Hospitality", title: "Comfy Dhows Hotel", year: "2024", body: "Conversion-focused site for a coastal hotel in Kilifi — bookings, rooms, dining.", img: comfy, href: "https://comfydhowshotel.co.ke/" },
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
            <a
              key={p.title}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-background p-6 md:p-10 group cursor-pointer hover:bg-surface transition-colors block"
            >
              <div className="aspect-[16/10] rounded-md bg-surface relative overflow-hidden border hairline">
                <img
                  src={p.img}
                  alt={`${p.title} website screenshot`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute bottom-3 left-3 font-mono text-xs text-ink/80 bg-background/90 backdrop-blur px-2 py-1 rounded">
                  {p.tag}
                </div>
              </div>
              <div className="mt-6 flex items-baseline justify-between gap-4">
                <h3 className="display text-2xl md:text-3xl text-ink">{p.title}</h3>
                <span className="font-mono text-xs text-muted-foreground">{p.year}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </a>
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
