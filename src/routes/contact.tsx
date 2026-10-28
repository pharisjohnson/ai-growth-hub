import { createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Valid email is required").max(200),
  company: z.string().max(160).optional(),
  message: z.string().trim().min(1, "Message is required").max(5000),
  budget: z.string().max(80).optional(),
  services: z.array(z.string().max(60)).max(10).optional(),
  // Honeypot field - hidden from users, filled by bots
  website: z.string().max(500).optional(),
});

const submitLead = createServerFn({ method: "POST" })
  .inputValidator(contactSchema)
  .handler(async ({ data }) => {
    const { processLead } = await import("@/lib/integrations/lead_capture");

    // Extract client info from the request
    const { getRequest } = await import("@tanstack/react-start/server");
    const request = getRequest();
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
      || request.headers.get("x-real-ip") 
      || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    
    const result = await processLead(data, ip, userAgent);
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return result;
  });

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Start a Project · Noon Studio Africa · Nairobi" },
      { name: "description", content: "Contact Noon Studio Africa in Nairobi, Kenya. Tell us about your web design, branding or AI marketing project — we reply within one business day." },
      { property: "og:title", content: "Contact · Noon Studio Africa · Nairobi" },
      { property: "og:description", content: "Start a project with Noon Studio Africa in Nairobi. Web design, branding, AI marketing and more." },
    ],
    links: [{ rel: "canonical", href: "https://noonstudio.africa/contact" }],
  }),
  component: Contact,
});

const interests = ["Web Design", "AI Automation", "Digital Marketing", "Branding", "Social Media", "SEO & Content"];

function Contact() {
  const [selected, setSelected] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string; fallback?: string }>({ type: null, message: '' });
  const submitLeadFn = useServerFn(submitLead);

  const toggle = (i: string) =>
    setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      company: fd.get("company") as string,
      message: fd.get("message") as string,
      budget: fd.get("budget") as string,
      services: selected,
      // Honeypot field - hidden from users
      website: fd.get("website") as string,
    };

    try {
      const result = await submitLeadFn({ data });
      setSubmitStatus({ 
        type: 'success', 
        message: result.message 
      });
      // Reset form
      form.reset();
      setSelected([]);
    } catch (error) {
      // Keep the visitor's words: hand them a pre-filled email so the lead is not lost.
      const body = [
        data.message,
        "",
        `Name: ${data.name}`,
        data.company ? `Company: ${data.company}` : "",
        data.budget ? `Budget: ${data.budget}` : "",
        selected.length ? `Services: ${selected.join(", ")}` : "",
      ].filter(Boolean).join("\n");
      const raw = error instanceof Error ? error.message : "";
      setSubmitStatus({
        type: 'error',
        message: raw && raw.length < 200 && !/fetch|network|internal/i.test(raw)
          ? raw
          : "We couldn't send your message just now. Your details are still here, use one of the options below.",
        fallback: `mailto:matata@noonstudio.africa?subject=${encodeURIComponent(`Project enquiry: ${data.company || data.name}`)}&body=${encodeURIComponent(body)}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="border-b hairline">
        <div className="container-page py-20 md:py-28">
          <p className="mono-label">// Contact</p>
          <h1 className="display text-5xl md:text-7xl mt-6 text-ink max-w-4xl">
            Start a project.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Tell us a little about what you're building. We typically reply within one business day.
          </p>
        </div>
      </section>

      <section className="container-page py-20 md:py-24 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4 space-y-8">
          <div>
            <p className="mono-label mb-2">Email</p>
            <a href="mailto:matata@noonstudio.africa" className="text-lg display text-ink hover:text-accent break-all">
              matata@noonstudio.africa
            </a>
          </div>
          <div>
            <p className="mono-label mb-2">Phone</p>
            <a href="tel:+254740824474" className="text-lg display text-ink hover:text-accent">
              +254 740 824 474
            </a>
          </div>
          <div>
            <p className="mono-label mb-2">WhatsApp</p>
            <a href="https://wa.me/254740824474" target="_blank" rel="noopener noreferrer" className="text-lg display text-ink hover:text-accent">
              Chat on WhatsApp →
            </a>
          </div>
          <div>
            <p className="mono-label mb-2">Studio</p>
            <p className="text-ink">Nairobi, Kenya</p>
            <p className="text-muted-foreground text-sm mt-1">Mon–Fri, 9:00–18:00 EAT</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="md:col-span-8 space-y-8">
          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="Your name" name="name" required autoComplete="name" maxLength={120} />
            <Field label="Company" name="company" autoComplete="organization" maxLength={160} />
            <Field label="Email" name="email" type="email" required autoComplete="email" maxLength={200} />
            <Field label="Budget (KES)" name="budget" placeholder="e.g. 200k–500k" />
          </div>

          <div>
            <p className="mono-label mb-3">What do you need?</p>
            <div className="flex flex-wrap gap-2">
              {interests.map((i) => {
                const on = selected.includes(i);
                return (
                  <button
                    type="button"
                    key={i}
                    onClick={() => toggle(i)}
                    className={`px-4 py-2 rounded-full text-sm border transition ${
                      on ? "bg-ink text-background border-ink" : "border-hairline hover:bg-surface"
                    }`}
                  >
                    {i}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mono-label mb-2 block">Tell us about the project</label>
            <textarea
              name="message"
              required
              maxLength={5000}
              rows={6}
              className="w-full bg-transparent border-b hairline py-3 text-base focus:outline-none focus:border-accent transition resize-none"
              placeholder="Goals, timeline, anything you want us to know…"
            />
          </div>

          {/* Honeypot field - hidden from users via CSS */}
          <div style={{ display: "none" }} aria-hidden="true">
            <label htmlFor="website">Website (leave blank)</label>
            <input type="text" name="website" id="website" tabIndex={-1} autoComplete="off" />
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send enquiry →'}
          </button>
          {submitStatus.type && (
            <div role="status" aria-live="polite" className={`p-4 rounded-lg border ${
              submitStatus.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <p>{submitStatus.message}</p>
              {submitStatus.fallback && (
                <div className="mt-3 flex flex-wrap gap-3">
                  <a href={submitStatus.fallback} className="underline font-medium">Send it by email</a>
                  <a href="https://wa.me/254740824474" target="_blank" rel="noopener noreferrer" className="underline font-medium">WhatsApp us</a>
                </div>
              )}
            </div>
          )}
        </form>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", required, placeholder, autoComplete, maxLength }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string; autoComplete?: string; maxLength?: number }) {
  return (
    <label className="block">
      <span className="mono-label mb-2 block">{label}{required && " *"}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className="w-full bg-transparent border-b hairline py-3 text-base focus:outline-none focus:border-accent transition"
      />
    </label>
  );
}