# NOON STUDIO BLOG POST WRITING SPEC (for subagents)

You are writing blog posts for noonstudio.africa (repo /root/ai-growth-hub).
Posts are JSON files in /root/ai-growth-hub/src/content/blog/<slug>.json.

## MANDATORY: read these before writing

1. The template post (your quality bar, study it block by block):
   /root/ai-growth-hub/src/content/blog/how-much-website-cost-kenya.json
2. This spec.
3. Your assigned post's CURRENT file (you rewrite it in place, preserving slug/tag/date/published).

## Post JSON structure (top-level fields)

{
  "slug": "<same as filename>",
  "title": "<keep existing title unless clearly better; must contain primary keyword>",
  "excerpt": "<complete sentence, 150-160 chars, keyword-led, ends with period>",
  "tag": "<KEEP EXACTLY as in current file>",
  "date": "<KEEP EXACTLY as in current file>",
  "updated": "<only if published:true, use 2026-08-02; omit otherwise>",
  "readTime": "<leave the existing string; a script fixes it later>",
  "published": <KEEP EXACTLY as in current file>,
  "author": "Noon Studio Africa",
  "image": "<assigned Pexels URL from your task context>",
  "content": [ <ContentBlocks, see schema> ]
}

## ContentBlock schema (exact shapes)

{ "type": "p", "text": "..." }
{ "type": "h2", "text": "..." }
{ "type": "h3", "text": "..." }
{ "type": "ul", "items": ["...", "..."] }
{ "type": "ol", "items": ["...", "..."] }
{ "type": "blockquote", "text": "..." }
{ "type": "note", "text": "..." }
{ "type": "takeaways", "items": ["...", "..."] }          // 3-5 bullets, TL;DR box
{ "type": "table", "headers": ["A","B"], "rows": [["a1","b1"],["a2","b2"]] }
{ "type": "faq", "items": [{"q":"...","a":"..."}, ...] }  // 3-5 Q&A
{ "type": "image", "src": "<pexels url>", "alt": "...", "caption": "..." }
{ "type": "link", "text": "<link text>", "href": "/blog/<other-slug>", "label": "Related reading" }

JSON rules: double quotes only, escape internal quotes as \" inside strings, apostrophes fine, NO trailing commas, NO comments, valid JSON.parse.

## Framework: article anatomy (IN THIS ORDER)

1. Intro: 2-3 "p" blocks. First paragraph ANSWERS the question directly (the number/answer/price in plain words). Second gives what the reader will learn.
2. "takeaways" block: 3-5 key takeaways.
3. First "link" block: internal link to a related post (place after takeaways).
4. h2 "What is X / How it works" — define the entity plainly.
5. h2 "Why it matters (in Kenya / for small businesses)" — local relevance, 1-2 real examples (Nairobi, Mombasa, Kisumu, Kampala, Dar es Salaam), observable truths not fabricated stats.
6. h2 with options/pricing/process — use "table" block for comparisons, "ol" for step-by-step.
7. h2 "Common mistakes / What to avoid" — "ul" list.
8. h2 "FAQ" — "faq" block with 3-5 questions phrased as people search ("How much...", "Is X worth it...", "How long...").
9. Conclusion: 1-2 "p" blocks + soft CTA to Noon Studio (contact page).
10. 2-4 "link" blocks TOTAL (one early, one mid, one near end) — internal links to related posts. Place naturally.

Optional: "image" blocks mid-article (max 1-2, use the SAME assigned image URL or another verified Pexels URL), "blockquote" for a memorable line, "note" for callouts, "h3" subheads under h2s.

## Word count: 1,400-1,900 words total across all blocks (validator enforces 1,200-2,500).

## Writing rules (Matata's standards — CRITICAL)

- NO em-dashes (—) ANYWHERE. Use commas, periods, "and". Hyphens only in real compounds (step-by-step, e-commerce).
- Short sentences. Active voice. Warm professional tone. "You" and "we".
- One idea per paragraph, 2-4 sentences. Bullets for lists.
- Real Kenyan/East African context: cities, businesses, KES prices, M-Pesa, WhatsApp, mobile-first internet.
- NEVER fabricate statistics. Use "we've seen", "in our experience", "across Kenya", "most businesses".
- Avoid clichés: "game-changer", "revolutionize", "synergy", "leverage", "unlock", "delve", "elevate".
- Don't repeat the same sentence structure. Vary openings.

## Internal link targets (use ONLY these slugs, href="/blog/<slug>")

web-design-nairobi-kenya, how-much-website-cost-kenya, ecommerce-website-kenya,
website-redesign-when, branding-agency-kenya, why-senior-led-studio-beats-agency,
seo-services-kenya, content-marketing-east-africa, content-calendar-kenya,
blog-management-tools, ai-marketing-east-african-businesses, ai-tools-small-business-kenya,
business-automation-kenya, digital-operations-tools-kenya, digital-marketing-agency-kenya,
social-media-marketing-kenya, google-ads-kenya

Link related topics: web design posts link to each other; AI posts link to AI/automation; content posts link to content/SEO; all may link to how-much-website-cost-kenya or why-senior-led-studio-beats-agency.

## Verification (run before finishing)

1. `node -e "JSON.parse(require('fs').readFileSync('/root/ai-growth-hub/src/content/blog/<slug>.json','utf8'))"` — must not throw.
2. `node /root/ai-growth-hub/scripts/validate-posts.mjs` — your slugs must show ✓ (ignore other slugs' errors; if your slug shows readTime mismatch, ignore, script fixes later; if it shows REAL issues like SHORT/NO FAQ/BROKEN LINK, FIX them).
3. Grep your file: `grep -c "—" /root/ai-growth-hub/src/content/blog/<slug>.json` must be 0.

## Deliverable

Report per post: slug, final word count (from validator output), and confirmation that JSON.parse + no em-dash checks pass. Do NOT run npm build. Do NOT git commit.
