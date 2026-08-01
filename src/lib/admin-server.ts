// Server functions backing the /admin dashboard.
// Requires env vars: ADMIN_PASSWORD (login password) and GITHUB_TOKEN (PAT with repo scope).
// Follows the site's createServerFn pattern (see src/routes/contact.tsx) — node-only
// imports happen dynamically inside handlers so the client bundle stays clean.
import { createServerFn } from "@tanstack/react-start";
import type { ContentBlock, Post } from "./blog";

const REPO = "pharisjohnson/ai-growth-hub";
const CONTENT_DIR = "src/content/blog";
const IMAGES_DIR = "public/images";
const BLOCK_TYPES = new Set(["p", "h2", "h3", "ul", "blockquote", "note"]);

async function cookieHash(password: string): Promise<string> {
  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(password).digest("hex");
}

async function isAuthed(): Promise<boolean> {
  const { getCookie } = await import("@tanstack/react-start/server");
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  return getCookie("noon_admin") === (await cookieHash(pw));
}

async function ghGet(token: string, path: string, branch: string): Promise<{ sha: string; content: string } | null> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=${branch}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET failed: ${res.status}`);
  return res.json();
}

async function ghPut(token: string, path: string, contentB64: string, message: string, branch: string, sha?: string) {
  const body: Record<string, unknown> = { message, content: contentB64, branch };
  if (sha) body.sha = sha;
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GitHub PUT failed: ${res.status} ${t.slice(0, 300)}`);
  }
  return res.json();
}

function validatePost(post: Post): string | null {
  if (!/^[a-z0-9-]+$/.test(post.slug)) return "Slug must be lowercase letters, numbers, and hyphens.";
  if (!post.title?.trim()) return "Title is required.";
  if (!post.excerpt?.trim()) return "Excerpt is required.";
  if (!post.tag?.trim()) return "Tag is required.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)) return "Date must be YYYY-MM-DD.";
  if (!Array.isArray(post.content)) return "Content must be an array of blocks.";
  for (const b of post.content as ContentBlock[]) {
    if (!BLOCK_TYPES.has(b.type)) return `Unknown block type: ${b.type}`;
    if (b.type === "ul") {
      if (!Array.isArray(b.items) || b.items.some((i) => typeof i !== "string")) return "List blocks need an items array of strings.";
    } else {
      if (typeof (b as { text?: unknown }).text !== "string") return `Block "${b.type}" needs a text string.`;
    }
  }
  return null;
}

export const checkAdmin = createServerFn({ method: "GET" }).handler(async ({ data }: { data: undefined }) => {
  const configured = Boolean(process.env.ADMIN_PASSWORD && process.env.GITHUB_TOKEN);
  return { ok: await isAuthed(), configured };
});

export const login = createServerFn({ method: "POST" }).handler(async ({ data }: { data: { password: string } }) => {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return { ok: false as const, error: "Admin not configured. Set the ADMIN_PASSWORD env var in Vercel." };
  if (data.password === pw) {
    const { setCookie } = await import("@tanstack/react-start/server");
    setCookie("noon_admin", await cookieHash(pw), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
    return { ok: true as const };
  }
  return { ok: false as const, error: "Wrong password." };
});

export const logout = createServerFn({ method: "POST" }).handler(async ({ data }: { data: undefined }) => {
  const { setCookie } = await import("@tanstack/react-start/server");
  setCookie("noon_admin", "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return { ok: true as const };
});

export const savePost = createServerFn({ method: "POST" }).handler(async ({ data }: { data: Post }) => {
  if (!(await isAuthed())) return { ok: false as const, error: "Not authorized. Log in again." };
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { ok: false as const, error: "Server not configured. Set the GITHUB_TOKEN env var in Vercel." };
  const invalid = validatePost(data);
  if (invalid) return { ok: false as const, error: invalid };

  const branch = process.env.GITHUB_BRANCH ?? "main";
  const path = `${CONTENT_DIR}/${data.slug}.json`;
  const payload = JSON.stringify(data, null, 2) + "\n";
  try {
    const existing = await ghGet(token, path, branch);
    await ghPut(token, path, Buffer.from(payload, "utf8").toString("base64"), `update post: ${data.slug}`, branch, existing?.sha);
    return { ok: true as const, url: `/blog/${data.slug}` };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Save failed." };
  }
});

export const deletePost = createServerFn({ method: "POST" }).handler(async ({ data }: { data: { slug: string } }) => {
  if (!(await isAuthed())) return { ok: false as const, error: "Not authorized. Log in again." };
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { ok: false as const, error: "Server not configured. Set the GITHUB_TOKEN env var in Vercel." };
  if (!/^[a-z0-9-]+$/.test(data.slug)) return { ok: false as const, error: "Invalid slug." };

  const branch = process.env.GITHUB_BRANCH ?? "main";
  const path = `${CONTENT_DIR}/${data.slug}.json`;
  try {
    const existing = await ghGet(token, path, branch);
    if (!existing) return { ok: false as const, error: "Post not found." };
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: `delete post: ${data.slug}`, branch, sha: existing.sha }),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`GitHub DELETE failed: ${res.status} ${t.slice(0, 300)}`);
    }
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Delete failed." };
  }
});

export const uploadImage = createServerFn({ method: "POST" }).handler(async ({ data }: { data: { dataUrl: string; originalName: string } }) => {
  if (!(await isAuthed())) return { ok: false as const, error: "Not authorized. Log in again." };
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { ok: false as const, error: "Server not configured. Set the GITHUB_TOKEN env var in Vercel." };

  const m = data.dataUrl.match(/^data:(image\/(?:png|jpeg|webp|gif));base64,(.+)$/);
  if (!m) return { ok: false as const, error: "Invalid image. Use PNG, JPEG, WebP, or GIF." };
  const [, mime, b64] = m;
  if (b64.length > 6_000_000) return { ok: false as const, error: "Image too large. Keep it under 4 MB." };
  const ext = mime.split("/")[1] === "jpeg" ? "jpg" : mime.split("/")[1];

  const base =
    data.originalName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "image";
  const filename = `${base}-${Date.now()}.${ext}`;
  const path = `${IMAGES_DIR}/${filename}`;

  const branch = process.env.GITHUB_BRANCH ?? "main";
  try {
    const existing = await ghGet(token, path, branch);
    await ghPut(token, path, b64, `add image: ${filename}`, branch, existing?.sha);
    return { ok: true as const, url: `/images/${filename}` };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Upload failed." };
  }
});
