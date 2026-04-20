import type { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  intro,
  children,
  id,
}: {
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="container-page py-20 md:py-28">
      {(eyebrow || title || intro) && (
        <div className="grid md:grid-cols-12 gap-8 mb-12 md:mb-16">
          <div className="md:col-span-4">
            {eyebrow && <p className="mono-label">{eyebrow}</p>}
          </div>
          <div className="md:col-span-8 space-y-4">
            {title && <h2 className="display text-3xl md:text-5xl text-ink">{title}</h2>}
            {intro && <p className="text-base md:text-lg text-muted-foreground max-w-2xl">{intro}</p>}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}
