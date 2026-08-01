// Extract posts from $slug.tsx into content/blog/<slug>.json
const fs = require("fs");
const path = require("path");

const src = fs.readFileSync("src/routes/blog/$slug.tsx", "utf8");

function extract(pattern, label) {
  const m = src.match(pattern);
  if (!m) throw new Error("Could not extract " + label);
  return new Function("return " + m[1])();
}

// posts array: const posts = [ ... ]; (one entry per line, ends with "];")
const posts = extract(/const posts = (\[[\s\S]*?\n\]);/, "posts array");

// postContent object: const postContent = { ... };  // close postContent
const postContent = extract(
  /const postContent = (\{[\s\S]*?\});\s*\/\/ close postContent/,
  "postContent"
);

const outDir = "src/content/blog";
fs.mkdirSync(outDir, { recursive: true });

let count = 0;
for (const p of posts) {
  const content = postContent[p.slug];
  if (!content) {
    console.log("SKIP (no content):", p.slug);
    continue;
  }
  const post = {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    tag: p.tag,
    date: p.date,
    readTime: p.readTime,
    published: p.published,
    image: "",
    content: content.map((b) => ({ ...b })),
  };
  fs.writeFileSync(path.join(outDir, p.slug + ".json"), JSON.stringify(post, null, 2) + "\n");
  count++;
}
console.log(`Wrote ${count} posts to ${outDir}/`);
console.log("Slugs:", posts.map((p) => p.slug).join(", "));
