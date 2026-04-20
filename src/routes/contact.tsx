import { createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  company: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  budget: z.string().optional(),
  services: z.array(z.string()).optional(),
});

const sendContactEmail = createServerFn({ method: "POST" })
  .inputValidator(contactSchema)
  .handler(async ({ data }) => {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { name, email, company, message, budget, services } = data;
    const servicesText = services && services.length > 0 ? services.join(", ") : "Not specified";

    const { error } = await resend.emails.send({
      from: "Noon Studio Africa <contact@noonstudio.africa>",
      to: ["matata@noonstudio.africa"],
      subject: `New project enquiry — ${company || name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Project Enquiry</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
            ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ""}
            <p><strong>Services:</strong> ${servicesText}</p>
          </div>
          <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
            <h3>Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error("Failed to send email");
    }

    return { success: true, message: "Email sent successfully" };
  });

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Start a Project · Noon Studio Africa" },
      { name: "description", content: "Tell us about your project. We'll reply within one business day. Nairobi, Kenya." },
      { property: "og:title", content: "Contact · Noon Studio Africa" },
      { property: "og:description", content: "Brief the studio. Replies within one business day." },
    ],
  }),
  component: Contact,
});

const interests = ["Web Design", "AI Automation", "Digital Marketing", "Branding", "Social Media", "SEO & Content"];

function Contact() {
  const [selected, setSelected] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const sendContactEmailFn = useServerFn(sendContactEmail);

  const toggle = (i: string) =>
    setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      company: fd.get("company") as string,
      message: fd.get("message") as string,
      budget: fd.get("budget") as string,
      services: selected,
    };

    try {
      await sendContactEmailFn({ data });
      setSubmitStatus({ type: 'success', message: 'Thank you! We\'ll get back to you within one business day.' });
      // Reset form
      (e.target as HTMLFormElement).reset();
      setSelected([]);
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
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
            <p className="mono-label mb-2">Studio</p>
            <p className="text-ink">Nairobi, Kenya</p>
            <p className="text-muted-foreground text-sm mt-1">Mon–Fri, 9:00–18:00 EAT</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="md:col-span-8 space-y-8">

          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="Your name" name="name" required />
            <Field label="Company" name="company" />
            <Field label="Email" name="email" type="email" required />
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
              rows={6}
              className="w-full bg-transparent border-b hairline py-3 text-base focus:outline-none focus:border-accent transition resize-none"
              placeholder="Goals, timeline, anything you want us to know…"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send enquiry →'}
          </button>
          {submitStatus.type && (
            <div className={`p-4 rounded-lg border ${
              submitStatus.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {submitStatus.message}
            </div>
          )}
        </form>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mono-label mb-2 block">{label}{required && " *"}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-transparent border-b hairline py-3 text-base focus:outline-none focus:border-accent transition"
      />
    </label>
  );
}
