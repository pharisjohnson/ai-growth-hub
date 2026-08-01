// End-to-end auth + write test of the admin server functions against the local dev server.
// Mimics the TanStack Start client RPC protocol (seroval JSON body).
import { toJSONAsync } from "seroval";
import { defaultSerovalPlugins } from "@tanstack/router-core";

const BASE = "http://[::1]:3001/_serverFn/";
const SERVER_FN_FILE = "/@id/src/lib/admin-server.ts?tss-serverfn-split";
function fnId(name) {
  return Buffer.from(JSON.stringify({ file: SERVER_FN_FILE, export: `${name}_createServerFn_handler` }), "utf8").toString("base64url");
}

let cookie = null;
const cookiesSeen = [];

async function rpc(name, data) {
  const body = JSON.stringify(await toJSONAsync({ data }, { plugins: defaultSerovalPlugins }));
  const headers = { "content-type": "application/json" };
  if (cookie) headers.cookie = cookie;
  const res = await fetch(BASE + fnId(name), { method: "POST", headers, body });
  const sc = res.headers.get("set-cookie");
  if (sc) {
    cookiesSeen.push(sc.split(";")[0]);
    cookie = sc.split(";")[0];
  }
  const text = await res.text();
  console.log(`${name} -> ${res.status} | cookie-set: ${!!sc} | ${text.slice(0, 160)}`);
  return { status: res.status, text };
}

// 1. Unauthenticated save must be rejected (no login yet)
await rpc("savePost", {
  slug: "should-not-exist", title: "x", excerpt: "x", tag: "x", date: "2026-08-02", readTime: "1 min", published: false, image: "", content: [],
});

// 2. Wrong password must fail and NOT set a cookie
await rpc("login", { password: "wrongpass" });

// 3. Correct password must set a cookie
await rpc("login", { password: "testpass123" });

// 4. Now save a valid test post
await rpc("savePost", {
  slug: "dashboard-test-post",
  title: "Dashboard Test Post",
  excerpt: "A temporary post created by the admin dashboard end-to-end test. Delete me.",
  tag: "Test",
  date: "2026-08-02",
  readTime: "2 min",
  published: false,
  image: "",
  content: [
    { type: "p", text: "Hello from the admin dashboard test." },
    { type: "ul", items: ["item one", "item two"] },
    { type: "blockquote", text: "Testing quotes work." },
  ],
});

// 5. Invalid slug must be rejected with a validation message
await rpc("savePost", {
  slug: "BAD SLUG!", title: "x", excerpt: "x", tag: "x", date: "2026-08-02", readTime: "1 min", published: false, image: "", content: [],
});

// 6. Upload a tiny PNG
const tinyPng =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
await rpc("uploadImage", { dataUrl: tinyPng, originalName: "test-image.png" });

console.log("\ncookies set during run:", JSON.stringify(cookiesSeen.map((c) => c.slice(0, 24) + "...")));
