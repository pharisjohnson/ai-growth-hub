#!/usr/bin/env node
// Validate all blog posts against the SEO content framework.
// Usage: node scripts/validate-posts.mjs [--fix-readtime]
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "src/content/blog");
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
const fixReadTime = process.argv.includes("--fix-readtime");
let errors = 0;

function countWords(blocks) {
  let words = 0;
  for (const b of blocks) {
    switch (b.type) {
      case "p": case "h2": case "h3": case "blockquote": case "note":
        words += (b.text || "").split(/\s+/).filter(Boolean).length; break;
      case "ul": case "ol": case "takeaways":
        words += (b.items || []).join(" ").split(/\s+/).filter(Boolean).length; break;
      case "table":
        words += (b.headers || []).join(" ").split(/\s+/).filter(Boolean).length;
        words += (b.rows || []).flat().join(" ").split(/\s+/).filter(Boolean).length; break;
      case "faq":
        for (const item of b.items || []) words += `${item.q} ${item.a}`.split(/\s+/).filter(Boolean).length; break;
      case "image":
        words += `${b.alt || ""} ${b.caption || ""}`.split(/\s+/).filter(Boolean).length; break;
      case "link":
        words += `${b.text || ""} ${b.label || ""}`.split(/\s+/).filter(Boolean).length; break;
    }
  }
  return words;
}

function countSentences(text) {
  const clean = text.replace(/\b(e\.g|i\.e|vs|Dr|Mr|Mrs|Ms|St|No|Inc|Ltd|Co)\./gi, "$1").replace(/\d\.\d/g, "dd");
  return clean.split(/[.!?]+(?:\s|$)/).filter((s) => s.trim().length > 0).length;
}

const slugs = new Set(files.map((f) => f.replace(".json", "")));

for (const f of files) {
  const post = JSON.parse(readFileSync(join(dir, f), "utf8"));
  const words = countWords(post.content);
  const issues = [];

  if (words < 1200) issues.push(`SHORT: ${words} words (min 1200)`);
  if (words > 2500) issues.push(`LONG: ${words} words (max 2500)`);
  if (!post.image) issues.push("NO IMAGE");
  if (!post.author) issues.push("NO AUTHOR");
  if (!post.content.some((b) => b.type === "takeaways")) issues.push("NO TAKEAWAYS BLOCK");
  const faq = post.content.filter((b) => b.type === "faq");
  if (faq.length === 0) issues.push("NO FAQ BLOCK");
  else if (faq[0].items.length < 3) issues.push(`FAQ HAS ONLY ${faq[0].items.length} ITEMS`);
  const links = post.content.filter((b) => b.type === "link");
  if (links.length < 2) issues.push(`ONLY ${links.length} INTERNAL LINKS (min 2)`);
  for (const l of links) {
    const target = l.href.replace(/^\/blog\//, "").replace(/\/$/, "");
    if (target.startsWith("http") && !target.includes("noonstudio")) {
      // external link: fine, but flag for review
    } else if (!slugs.has(target)) {
      issues.push(`BROKEN INTERNAL LINK -> /blog/${target}`);
    }
  }
  if (post.excerpt.length > 165) issues.push(`EXCERPT ${post.excerpt.length} chars (max 165)`);
  if (/—/.test(JSON.stringify(post.content))) issues.push("EM-DASH PRESENT");

  // Readability: no paragraph over 5 sentences
  for (const b of post.content) {
    if (b.type === "p" && countSentences(b.text) > 5) {
      issues.push(`PARAGRAPH ${post.content.indexOf(b)} HAS ${countSentences(b.text)} SENTENCES (max 5)`);
    }
  }

  // Read time check
  const rt = `${Math.max(1, Math.round(words / 200))} min read`;
  if (post.readTime !== rt) {
    if (fixReadTime) post.readTime = rt;
    else issues.push(`READTIME "${post.readTime}" != computed "${rt}"`);
  }

  if (issues.length) {
    errors++;
    console.log(`✗ ${post.slug} (${words} words)`);
    for (const i of issues) console.log(`    - ${i}`);
  } else {
    console.log(`✓ ${post.slug} (${words} words, ${post.readTime})`);
  }

  if (fixReadTime) {
    writeFileSync(join(dir, f), JSON.stringify(post, null, 2) + "\n");
  }
}

console.log(errors ? `\n${errors} post(s) need attention` : "\nAll posts pass the framework check");
process.exit(errors && !fixReadTime ? 1 : 0);
