import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// Prints all canonical URLs for IndexNow submission (all pages + published posts).
const SITE = "https://noonstudio.africa";
const blogDir = join(process.cwd(), "src/content/blog");

const pages = ["/", "/services", "/work", "/pricing", "/about", "/blog", "/contact"];

const posts = readdirSync(blogDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(blogDir, f), "utf8")))
  .filter((p) => p.published)
  .map((p) => `/blog/${p.slug}`);

console.log([...pages, ...posts].map((loc) => `${SITE}${loc}`).join("\n"));
