import { Link } from "@tanstack/react-router";

const message = "Is your website exposed to the PHP2Shell flaw? Noon Studio Africa can check it and keep it safe.";

function Item({ hidden }: { hidden?: boolean }) {
  return (
    <span className="flex items-center gap-4 px-8 py-2.5" aria-hidden={hidden || undefined}>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-foreground" />
      <span>{message}</span>
      <span className="font-semibold underline underline-offset-4">Reach out for help →</span>
    </span>
  );
}

export function SecurityBanner() {
  return (
    <div className="security-banner overflow-hidden bg-accent text-accent-foreground" role="region" aria-label="Website security help">
      <Link
        to="/blog/$slug"
        params={{ slug: "php-hack-kenya-website-owners" }}
        className="block whitespace-nowrap font-mono text-xs sm:text-sm focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-accent-foreground"
      >
        <div className="security-banner-track flex w-max">
          <Item />
          <Item hidden />
          <Item hidden />
          <Item hidden />
        </div>
      </Link>
    </div>
  );
}
