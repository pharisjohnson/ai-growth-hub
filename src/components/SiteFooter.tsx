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
      <div className="container-page py-6 flex flex-wrap gap-6 md:gap-8 text-sm md:text-xs">
        <div className="min-w-[200px]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="font-mono">noon<span className="text-muted-foreground">/</span>studio</span>
          </div>
          <p className="mt-1 text-muted-foreground">
            Nairobi-based studio building websites, brands, and AI-powered marketing systems.
          </p>
        </div>

        <div>
          <p className="mono-label mb-1">Studio</p>
          <ul className="space-y-0.5">
            <li><Link to="/services" className="hover:text-accent">Services</Link></li>
            <li><Link to="/work" className="hover:text-accent">Work</Link></li>
            <li><Link to="/pricing" className="hover:text-accent">Pricing</Link></li>
            <li><Link to="/about" className="hover:text-accent">About</Link></li>
          </ul>
        </div>

        <div>
          <p className="mono-label mb-1">Resources</p>
          <ul className="space-y-0.5">
            <li><a href="https://freeocrscanner.noonstudio.africa/" className="hover:text-accent" target="_blank" rel="noopener noreferrer">Free Photo to Text Tool</a></li>
          </ul>
        </div>

        <div>
          <p className="mono-label mb-1">Contact</p>
          <ul className="space-y-0.5">
            <li><a href="mailto:matata@noonstudio.africa" className="hover:text-accent">matata@noonstudio.africa</a></li>
            <li><a href="tel:+254740824474" className="hover:text-accent">+254 740 824 474</a></li>
            <li className="text-muted-foreground">Nairobi, Kenya</li>
          </ul>
        </div>
      </div>
      <div className="border-t hairline">
        <div className="container-page py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Noon Studio Africa. All rights reserved.</p>
          <p className="font-mono">{getDaysToChristmas()} days to Christmas</p>
        </div>
      </div>
    </footer>
  );
}