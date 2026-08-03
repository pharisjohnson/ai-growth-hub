import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  const getDaysToChristmas = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const christmas = new Date(currentYear, 11, 25); // December 25

    if (today > christmas) {
      christmas.setFullYear(currentYear + 1);
    }

    const timeDiff = christmas.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  return (
    <footer className="border-t hairline mt-12">
      {/* Full-width statement band */}
      <div className="border-b hairline">
        <div className="container-page py-12 md:py-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <p className="mono-label mb-3">// Noon Studio Africa</p>
            <p className="display text-3xl md:text-5xl">Built to earn its keep.</p>
            <p className="mt-4 text-muted-foreground">
              Websites, brands, and AI-powered marketing systems for East African
              businesses that want to grow.
            </p>
          </div>
          <Link to="/contact" className="btn-primary text-xs shrink-0">
            Start a project
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      {/* Spacious link grid */}
      <div className="container-page py-10 md:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="font-mono">noon<span className="text-muted-foreground">/</span>studio</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground leading-relaxed">
              A Nairobi-based studio designing websites and building AI automation
              that pays for itself.
            </p>
          </div>

          <div>
            <p className="mono-label mb-3">Studio</p>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-accent">About</Link></li>
              <li><Link to="/services" className="hover:text-accent">Services</Link></li>
              <li><Link to="/work" className="hover:text-accent">Work</Link></li>
              <li><Link to="/pricing" className="hover:text-accent">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <p className="mono-label mb-3">Journal</p>
            <ul className="space-y-2">
              <li><Link to="/blog" className="hover:text-accent">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="mono-label mb-3">Contact</p>
            <ul className="space-y-2">
              <li>
                <a href="mailto:matata@noonstudio.africa" className="hover:text-accent break-all">
                  matata@noonstudio.africa
                </a>
              </li>
              <li>
                <a href="tel:+254740824474" className="hover:text-accent">
                  +254 740 824 474
                </a>
              </li>
              <li className="text-muted-foreground">Nairobi, Kenya</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t hairline">
        <div className="container-page py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Noon Studio Africa. All rights reserved.</p>
          <p className="font-mono">{getDaysToChristmas()} days to Christmas</p>
        </div>
      </div>
    </footer>
  );
}
