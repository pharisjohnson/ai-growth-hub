#!/usr/bin/env node
// Generate public/sitemap.xml including all published blog posts.
// Run as part of the build (see package.json) so new posts are always indexed.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://noonstudio.africa";
const blogDir = join(process.cwd(), "src/content/blog");

const pages = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/services", priority: "0.8", changefreq: "weekly" },
  { loc: "/work", priority: "0.8", changefreq: "weekly" },
  { loc: "/pricing", priority: "0.7", changefreq: "monthly" },
  { loc: "/about", priority: "0.6", changefreq: "monthly" },
  { loc: "/contact", priority: "0.6", changefreq: "monthly" },
  { loc: "/blog", priority: "0.9", changefreq: "weekly" },
];

// Include published posts; scheduled drafts are excluded until they go live.
const posts = readdirSync(blogDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(blogDir, f), "utf8")))
  .filter((p) => p.published)
  .sort((a, b) => b.date.localeCompare(a.date));

for (const p of posts) {
  pages.push({
    loc: `/blog/${p.slug}`,
    priority: "0.8",
    changefreq: p.updated ? "monthly" : "yearly",
    lastmod: p.updated ?? p.date,
  });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (u) => `  <url>
    <loc>${SITE}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync(join(process.cwd(), "public/sitemap.xml"), xml);
console.log(`sitemap.xml written: ${pages.length} URLs (${posts.length} blog posts)`);
