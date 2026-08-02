# Noon Studio SEO Content Framework v1

Framework: **Topic Cluster + E-E-A-T + Structured Data** (2026 standard).

Every article on the Noon Studio blog follows this exact structure. Target length:
**1,200-2,500 words** of body content (measured by the content blocks, not metadata).

## Why this framework

- **Topic clusters** beat isolated posts. Each article links to 2-4 related posts
  (internal link blocks) and is itself linked from the cluster hub, building
  topical authority for the site's core entities (web design, branding, SEO,
  AI marketing, e-commerce in Kenya/East Africa).
- **E-E-A-T** (Experience, Expertise, Authoritativeness, Trust) is made visible:
  named author, studio bio box, updated dates, local Kenyan examples, no
  fabricated stats.
- **Structured data** (JSON-LD Article + FAQPage) is auto-generated from the
  post's metadata and FAQ blocks, enabling rich results.
- **Answer-first content** captures position zero: the first paragraph answers
  the searcher's question directly, and the Key takeaways box summarizes the
  whole article for scanners.

## Article anatomy (required blocks, in order)

1. **Metadata** — title with primary keyword + year/qualifier; excerpt is a
   complete sentence, 150-160 chars, keyword-led, ends with a period.
2. **Intro (2-3 paragraphs)** — hook + direct answer to the query in the first
   100 words. State the number/price/answer plainly, then qualify.
3. **takeaways block** — 3-5 bullet key takeaways (the TL;DR).
4. **h2: "What is / How it works"** — define the entity, plain language.
5. **h2: "Why it matters"** (or "Why [topic] in Kenya/East Africa") — local
   relevance, observable truths, 1-2 real examples (Nairobi, Mombasa, Kisumu,
   Kampala, Dar es Salaam).
6. **h2: Options / pricing / process** — use a `table` block when comparing
   options, costs, or tools. Use `ol` for step-by-step processes.
7. **h2: "Common mistakes"** (or "What to avoid") — list with `ul`.
8. **h2: "FAQ"** — 3-5 Q&A pairs in a `faq` block (feeds FAQPage schema).
   Questions phrased the way people actually search: "How much does...",
   "Is X worth it in Kenya?", "How long does...".
9. **Conclusion paragraph + CTA** — recap value, direct reader to contact.
10. **2-4 `link` blocks** — internal links to related posts (topic cluster).
    Place them naturally: one early (after takeaways), one mid-article, one
    near the end.

Optional blocks anywhere: `image` (with alt + caption), `blockquote`,
`note` (highlighted callout), `h3` sub-headings under h2s.

## Writing rules (Matata's standards)

- **NO em-dashes (—).** Never. Use commas, periods, or "and".
- Short sentences, active voice, warm professional tone. Write like a
  knowledgeable colleague, not a professor.
- Use "you" and "we". One idea per paragraph. Paragraphs of 2-4 sentences.
- Real local examples: Kenyan cities, businesses, prices in KES. Never
  fabricate statistics. Use "we've seen", "in our experience", "across
  Kenya" instead of invented numbers.
- Every post gets a unique image from **Pexels or Pixabay** (NEVER Unsplash).
  Image URL goes in the `image` metadata field; use Pexels CDN format:
  `https://images.pexels.com/photos/{ID}/pexels-photo-{ID}.jpeg?auto=compress&cs=tinysrgb&w=1200`
  Verify the URL returns 200 before using.
- Metadata excerpt: complete sentence, proper punctuation, 150-160 chars.
- Read time is computed automatically from content; the `readTime` field
  should be left accurate (or computed via computeReadTime).

## ContentBlock schema

```json
{ "type": "p", "text": "..." }
{ "type": "h2", "text": "..." }
{ "type": "h3", "text": "..." }
{ "type": "ul", "items": ["...", "..."] }
{ "type": "ol", "items": ["...", "..."] }
{ "type": "blockquote", "text": "..." }
{ "type": "note", "text": "..." }
{ "type": "takeaways", "items": ["...", "..."] }
{ "type": "table", "headers": ["A", "B"], "rows": [["a1", "b1"], ...] }
{ "type": "faq", "items": [{ "q": "...", "a": "..." }, ...] }
{ "type": "image", "src": "https://...", "alt": "...", "caption": "..." }
{ "type": "link", "text": "How much does a website cost in Kenya?", "href": "/blog/how-much-website-cost-kenya", "label": "Related reading" }
```

## Internal link map (topic clusters)

| Cluster | Posts |
|---|---|
| Web Design | how-much-website-cost-kenya, web-design-nairobi-kenya, ecommerce-website-kenya, website-redesign-when |
| Branding | branding-agency-kenya, why-senior-led-studio-beats-agency |
| SEO | seo-services-kenya, content-marketing-east-africa, content-calendar-kenya |
| AI Marketing | ai-marketing-east-african-businesses, ai-tools-small-business-kenya, business-automation-kenya, digital-operations-tools-kenya |
| Marketing Ops | digital-marketing-agency-kenya, social-media-marketing-kenya, google-ads-kenya, blog-management-tools |

Link within and across clusters naturally (2-4 links per post minimum).

## Verification

- Word count 1200-2500 via `countWords` (node script).
- Zero em-dashes: `grep -r "—" src/content/blog/` returns nothing.
- All `link.href` values exist as post slugs.
- All `image.src` URLs return HTTP 200.
- Local build passes: `npm run build`.
