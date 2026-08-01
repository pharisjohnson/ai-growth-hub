import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { getAllPosts, type ContentBlock, type Post } from "../lib/blog";
import { checkAdmin, deletePost, login, logout, savePost, uploadImage } from "../lib/admin-server";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Noon Studio Africa" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Msg = { type: "ok" | "err"; text: string };

function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [configured, setConfigured] = useState(true);
  const [editing, setEditing] = useState<Post | null>(null);

  useEffect(() => {
    checkAdmin({ data: undefined }).then((r) => {
      setAuthed(r.ok);
      setConfigured(r.configured);
    });
  }, []);

  if (authed === null) {
    return (
      <section className="border-b hairline min-h-screen">
        <div className="container-page py-28 text-center">
          <p className="mono-label">// Admin</p>
          <p className="mt-6 text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  if (!authed) {
    return <Login configured={configured} onLogin={() => setAuthed(true)} />;
  }

  if (editing) {
    return <Editor post={editing} onBack={() => setEditing(null)} />;
  }

  return <List onEdit={(p) => setEditing(p)} onLogout={() => logout({ data: undefined }).then(() => setAuthed(false))} />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="border-b hairline min-h-screen">
      <div className="container-page py-16 md:py-20 max-w-3xl">{children}</div>
    </section>
  );
}

function Login({ configured, onLogin }: { configured: boolean; onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await login({ data: { password: pw } });
    if (r.ok) onLogin();
    else setErr(r.error ?? "Wrong password.");
    setBusy(false);
  }

  return (
    <Shell>
      <p className="mono-label">// Admin</p>
      <h1 className="display text-4xl mt-6 text-ink">Blog dashboard</h1>
      {!configured && (
        <div className="mt-6 bg-surface border hairline rounded-xl p-6 text-sm text-ink">
          <p className="font-semibold mb-2">Not configured yet.</p>
          <p>In the Vercel dashboard (Project → Settings → Environment Variables), add:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li><code className="font-mono text-xs">ADMIN_PASSWORD</code> — the login password</li>
            <li><code className="font-mono text-xs">GITHUB_TOKEN</code> — a GitHub PAT with repo scope</li>
          </ul>
          <p className="mt-2">Then redeploy. This page will pick them up automatically.</p>
        </div>
      )}
      <form onSubmit={submit} className="mt-10 max-w-sm">
        <label className="font-mono text-xs text-muted-foreground">PASSWORD</label>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="mt-2 w-full border hairline rounded-lg bg-background px-4 py-3 text-ink focus:outline-none focus:border-accent"
          placeholder="Enter admin password"
        />
        {err && <p className="mt-3 text-sm text-red-500">{err}</p>}
        <button type="submit" disabled={busy} className="btn-primary mt-6 inline-flex disabled:opacity-50">
          {busy ? "Checking..." : "Log in"}
        </button>
      </form>
      <p className="mt-10 text-sm text-muted-foreground">
        <Link to="/blog" className="hover:text-accent">← Back to blog</Link>
      </p>
    </Shell>
  );
}

function StatusBadge({ published }: { published: boolean }) {
  return published ? (
    <span className="font-mono text-xs text-green-600">published</span>
  ) : (
    <span className="font-mono text-xs text-muted-foreground">draft</span>
  );
}

function List({ onEdit, onLogout }: { onEdit: (p: Post) => void; onLogout: () => void }) {
  const all = getAllPosts();
  const published = all.filter((p) => p.published).sort((a, b) => b.date.localeCompare(a.date));
  const drafts = all.filter((p) => !p.published).sort((a, b) => a.date.localeCompare(b.date));
  const [msg, setMsg] = useState<Msg | null>(null);

  function newPost() {
    onEdit({
      slug: "",
      title: "",
      excerpt: "",
      tag: "",
      date: new Date().toISOString().slice(0, 10),
      readTime: "4 min",
      published: false,
      image: "",
      content: [{ type: "p", text: "" }],
    });
  }

  function Row({ p }: { p: Post }) {
    return (
      <div className="flex items-center gap-4 border hairline rounded-xl p-4 hover:bg-surface transition-colors">
        {p.image ? (
          <img src={p.image} alt="" className="h-12 w-16 object-cover rounded-md border hairline" />
        ) : (
          <div className="h-12 w-16 rounded-md bg-surface border hairline flex items-center justify-center">
            <span className="font-mono text-[10px] text-muted-foreground">no img</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-display text-sm text-ink truncate">{p.title || "(untitled)"}</p>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            {p.tag} · {p.date} · {p.readTime} · <StatusBadge published={p.published} />
          </p>
        </div>
        <button onClick={() => onEdit(p)} className="btn-ghost text-sm">Edit</button>
      </div>
    );
  }

  return (
    <Shell>
      <div className="flex items-center justify-between">
        <p className="mono-label">// Admin</p>
        <button onClick={onLogout} className="font-mono text-xs text-muted-foreground hover:text-accent">Log out</button>
      </div>
      <h1 className="display text-4xl mt-6 text-ink">Blog dashboard</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Edit posts here. Saving pushes a commit to GitHub, and Vercel deploys it automatically.
      </p>
      {msg && <p className={`mt-4 text-sm ${msg.type === "ok" ? "text-green-600" : "text-red-500"}`}>{msg.text}</p>}
      <button onClick={newPost} className="btn-primary mt-8 inline-flex">+ New post</button>

      <h2 className="font-mono text-xs text-muted-foreground mt-12 mb-4">PUBLISHED ({published.length})</h2>
      <div className="space-y-3">
        {published.map((p) => <Row key={p.slug} p={p} />)}
        {published.length === 0 && <p className="text-sm text-muted-foreground">Nothing published yet.</p>}
      </div>

      <h2 className="font-mono text-xs text-muted-foreground mt-12 mb-4">DRAFTS ({drafts.length})</h2>
      <div className="space-y-3">
        {drafts.map((p) => <Row key={p.slug} p={p} />)}
        {drafts.length === 0 && <p className="text-sm text-muted-foreground">No drafts.</p>}
      </div>
    </Shell>
  );
}

const BLOCK_LABELS: Record<string, string> = {
  p: "Paragraph",
  h2: "Heading 2",
  h3: "Heading 3",
  ul: "List",
  blockquote: "Quote",
  note: "Note box",
};

function Editor({ post, onBack }: { post: Post; onBack: () => void }) {
  const [form, setForm] = useState<Post>(() => ({
    ...post,
    content: post.content.map((b) =>
      b.type === "ul" ? { type: "ul" as const, items: [...b.items] } : { ...(b as { type: "p" | "h2" | "h3" | "blockquote" | "note"; text: string }) }
    ),
  }));
  const [msg, setMsg] = useState<Msg | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function setField<K extends keyof Post>(key: K, value: Post[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setBlock(i: number, patch: Partial<ContentBlock>) {
    setForm((f) => ({
      ...f,
      content: f.content.map((b, j) => (j === i ? ({ ...b, ...patch } as ContentBlock) : b)),
    }));
  }

  function addBlock(type: string) {
    const block: ContentBlock =
      type === "ul"
        ? { type: "ul", items: [""] }
        : { type: type as "p" | "h2" | "h3" | "blockquote" | "note", text: "" };
    setForm((f) => ({ ...f, content: [...f.content, block] }));
  }

  function removeBlock(i: number) {
    setForm((f) => ({ ...f, content: f.content.filter((_, j) => j !== i) }));
  }

  function moveBlock(i: number, dir: -1 | 1) {
    setForm((f) => {
      const content = [...f.content];
      const j = i + dir;
      if (j < 0 || j >= content.length) return f;
      [content[i], content[j]] = [content[j], content[i]];
      return { ...f, content };
    });
  }

  function blockToText(b: ContentBlock): string {
    return b.type === "ul" ? b.items.join("\n") : (b as { text: string }).text;
  }

  function textToBlock(type: string, raw: string): ContentBlock {
    if (type === "ul") return { type: "ul", items: raw.split("\n").map((s) => s.trim()).filter(Boolean) };
    return { type: type as "p" | "h2" | "h3" | "blockquote" | "note", text: raw };
  }

  async function handleFile(f: File | null) {
    if (!f) return;
    if (f.size > 4 * 1024 * 1024) {
      setMsg({ type: "err", text: "Image too large. Keep it under 4 MB." });
      return;
    }
    const dataUrl = await new Promise<string>((res) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.readAsDataURL(f);
    });
    setMsg(null);
    const r = await uploadImage({ data: { dataUrl, originalName: f.name } });
    if (r.ok && r.url) {
      setField("image", r.url);
      setMsg({ type: "ok", text: "Image uploaded." });
    } else {
      setMsg({ type: "err", text: r.error ?? "Upload failed." });
    }
  }

  async function handleSave() {
    setSaving(true);
    setMsg(null);
    const r = await savePost({ data: form });
    if (r.ok) {
      setMsg({ type: "ok", text: "Saved. Deploying to the site..." });
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setMsg({ type: "err", text: r.error ?? "Save failed." });
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${form.title}"? This removes the post and cannot be undone.`)) return;
    setDeleting(true);
    setMsg(null);
    const r = await deletePost({ data: { slug: form.slug } });
    if (r.ok) {
      setMsg({ type: "ok", text: "Deleted. Deploying to the site..." });
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setMsg({ type: "err", text: r.error ?? "Delete failed." });
      setDeleting(false);
    }
  }

  const inputCls = "mt-2 w-full border hairline rounded-lg bg-background px-4 py-3 text-ink focus:outline-none focus:border-accent text-sm";
  const labelCls = "font-mono text-xs text-muted-foreground";

  return (
    <Shell>
      <div className="flex items-center justify-between">
        <p className="mono-label">// Admin</p>
        <button onClick={onBack} className="font-mono text-xs text-muted-foreground hover:text-accent">← Back to list</button>
      </div>
      <h1 className="display text-3xl mt-6 text-ink">Edit post</h1>
      {msg && <p className={`mt-4 text-sm ${msg.type === "ok" ? "text-green-600" : "text-red-500"}`}>{msg.text}</p>}

      <div className="mt-10 grid gap-6">
        <div>
          <label className={labelCls}>TITLE</label>
          <input className={inputCls} value={form.title} onChange={(e) => setField("title", e.target.value)} />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>SLUG (URL)</label>
            <input className={inputCls} value={form.slug} onChange={(e) => setField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} />
          </div>
          <div>
            <label className={labelCls}>TAG</label>
            <input className={inputCls} value={form.tag} onChange={(e) => setField("tag", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>DATE (YYYY-MM-DD)</label>
            <input className={inputCls} value={form.date} onChange={(e) => setField("date", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>READ TIME</label>
            <input className={inputCls} value={form.readTime} onChange={(e) => setField("readTime", e.target.value)} placeholder="5 min" />
          </div>
        </div>
        <div>
          <label className={labelCls}>EXCERPT</label>
          <textarea className={inputCls} rows={3} value={form.excerpt} onChange={(e) => setField("excerpt", e.target.value)} />
        </div>

        <div>
          <label className={labelCls}>FEATURED IMAGE</label>
          <div className="mt-2 flex items-center gap-4">
            {form.image ? (
              <img src={form.image} alt="" className="h-20 w-28 object-cover rounded-lg border hairline" />
            ) : (
              <div className="h-20 w-28 rounded-lg bg-surface border hairline flex items-center justify-center">
                <span className="font-mono text-[10px] text-muted-foreground">no image</span>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
              <button onClick={() => fileRef.current?.click()} className="btn-ghost text-sm">Upload image</button>
              {form.image && (
                <button onClick={() => setField("image", "")} className="font-mono text-xs text-red-500 hover:underline">Remove image</button>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className={labelCls}>STATUS</label>
          <div className="mt-2 flex items-center gap-3">
            <button
              onClick={() => setField("published", !form.published)}
              className={`relative h-6 w-11 rounded-full transition-colors ${form.published ? "bg-accent" : "bg-muted"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${form.published ? "left-[22px]" : "left-0.5"}`} />
            </button>
            <span className="text-sm text-muted-foreground">{form.published ? "Published (shown on blog)" : "Draft (hidden until published)"}</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className={labelCls}>CONTENT BLOCKS</label>
            <div className="flex items-center gap-2">
              <select className="border hairline rounded-lg bg-background px-3 py-2 text-xs text-ink" defaultValue="p" onChange={(e) => addBlock(e.target.value)}>
                {Object.entries(BLOCK_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <button onClick={() => addBlock("p")} className="btn-ghost text-sm">+ Add</button>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {form.content.map((b, i) => (
              <div key={i} className="border hairline rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <select
                    className="border hairline rounded-lg bg-background px-3 py-1.5 text-xs text-ink"
                    value={b.type}
                    onChange={(e) => setBlock(i, textToBlock(e.target.value, blockToText(b)) as Partial<ContentBlock>)}
                  >
                    {Object.entries(BLOCK_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveBlock(i, -1)} className="font-mono text-xs text-muted-foreground hover:text-accent px-1" title="Move up">↑</button>
                    <button onClick={() => moveBlock(i, 1)} className="font-mono text-xs text-muted-foreground hover:text-accent px-1" title="Move down">↓</button>
                    <button onClick={() => removeBlock(i)} className="font-mono text-xs text-red-500 px-1" title="Remove">×</button>
                  </div>
                </div>
                <textarea
                  className={inputCls}
                  rows={b.type === "ul" ? Math.max(2, b.items.length) : 2}
                  value={blockToText(b)}
                  onChange={(e) => setBlock(i, textToBlock(b.type, e.target.value) as Partial<ContentBlock>)}
                  placeholder={b.type === "ul" ? "One item per line" : "Text"}
                />
              </div>
            ))}
            {form.content.length === 0 && (
              <p className="text-sm text-muted-foreground">No blocks yet. Add one above.</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t hairline">
          <div className="flex items-center gap-4">
            <button onClick={handleSave} disabled={saving} className="btn-primary inline-flex disabled:opacity-50">
              {saving ? "Saving..." : "Save post"}
            </button>
            <button onClick={onBack} className="btn-ghost">Cancel</button>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="font-mono text-xs text-red-500 hover:underline disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete post"}
          </button>
        </div>
      </div>
    </Shell>
  );
}
