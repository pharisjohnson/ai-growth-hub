import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t hairline mt-24">
      <div className="container-page py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="font-mono text-sm">noon<span className="text-muted-foreground">/</span>studio</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            A Nairobi-based studio building websites, brands, and AI-powered marketing systems for businesses across Africa.
          </p>
        </div>

        <div>
          <p className="mono-label mb-3">Studio</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services" className="hover:text-accent">Services</Link></li>
            <li><Link to="/work" className="hover:text-accent">Work</Link></li>
            <li><Link to="/pricing" className="hover:text-accent">Pricing</Link></li>
            <li><Link to="/about" className="hover:text-accent">About</Link></li>
          </ul>
        </div>

        <div>
          <p className="mono-label mb-3">Contact</p>
          <ul className="space-y-2 text-sm">
            <li><a href="mailto:matata@noonstudio.africa" className="hover:text-accent">matata@noonstudio.africa</a></li>
            <li><a href="tel:+254740824474" className="hover:text-accent">+254 740 824 474</a></li>
            <li className="text-muted-foreground">Nairobi, Kenya</li>
          </ul>
        </div>
      </div>
      <div className="border-t hairline">
        <div className="container-page py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Noon Studio Africa. All rights reserved.</p>
          <p className="font-mono">Made in Nairobi · 01°N</p>
        </div>
      </div>
    </footer>
  );
}
