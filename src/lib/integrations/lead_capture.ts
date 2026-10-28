/**
 * Lead capture for the contact form.
 *
 * Every lead goes to up to three independent channels. A channel is used only
 * when its env vars are set, and the lead counts as recorded if ANY channel
 * succeeds. The visitor only sees an error when nothing recorded the lead.
 *
 *   1. Email (Resend)       -> notification to the studio inbox, reply-to = lead
 *   2. Google Sheet         -> via Composio GOOGLESHEETS_SPREADSHEETS_VALUES_APPEND
 *   3. Telegram             -> via Composio TELEGRAM_SEND_MESSAGE
 *
 * Env vars (all server-side):
 *   Email
 *     RESEND_API or RESEND_API_KEY  Resend API key (noonstudio.africa must be a verified domain in Resend)
 *     LEADS_NOTIFY_TO               comma-separated inboxes, default matata@noonstudio.africa
 *     LEADS_FROM                    default "Noon Studio Africa <contact@noonstudio.africa>"
 *     LEADS_AUTOREPLY               "true" to also send the visitor a short confirmation email
 *   Composio (Sheet + Telegram)
 *     COMPOSIO_API_KEY              Composio project API key
 *     COMPOSIO_USER_ID              default Composio user the accounts are connected under
 *     COMPOSIO_SHEETS_USER_ID       optional override for Google Sheets
 *     COMPOSIO_TELEGRAM_USER_ID     optional override for Telegram
 *     COMPOSIO_SHEETS_ACCOUNT_ID    optional connected account id (ca_...) for Google Sheets
 *     COMPOSIO_TELEGRAM_ACCOUNT_ID  optional connected account id (ca_...) for Telegram
 *     LEADS_SHEET_ID                spreadsheet ID (the long string in the sheet URL)
 *     LEADS_SHEET_NAME              tab name, default "Leads"
 *     TELEGRAM_CHAT_ID              chat the bot posts to
 */

export interface LeadData {
  name: string;
  email: string;
  company: string;
  message: string;
  budget: string;
  services: string[];
  honeypot?: string;
  timestamp?: string;
  ip?: string;
  userAgent?: string;
}

interface SpamCheckResult {
  isSpam: boolean;
  reason: string;
}

export class SpamProtection {
  private static MAX_SUBMISSIONS_PER_HOUR = 5;
  // Per serverless instance only. Good enough to stop a single bot hammering
  // one warm function; not a global limit.
  private ipCache: Map<string, number[]> = new Map();

  checkHoneypot(honeypotValue: string): SpamCheckResult {
    if (honeypotValue && honeypotValue.trim()) {
      return { isSpam: true, reason: "Honeypot triggered" };
    }
    return { isSpam: false, reason: "" };
  }

  checkRateLimit(ip: string): SpamCheckResult {
    const now = Date.now();
    const hourAgo = now - 3600000;
    const recent = (this.ipCache.get(ip) || []).filter((ts) => ts > hourAgo);

    if (recent.length >= SpamProtection.MAX_SUBMISSIONS_PER_HOUR) {
      return { isSpam: true, reason: `Rate limit exceeded (${recent.length}/${SpamProtection.MAX_SUBMISSIONS_PER_HOUR} per hour)` };
    }

    recent.push(now);
    this.ipCache.set(ip, recent);

    if (this.ipCache.size > 1000) {
      for (const [key, value] of this.ipCache.entries()) {
        const filtered = value.filter((ts) => ts > hourAgo);
        if (filtered.length === 0) this.ipCache.delete(key);
        else this.ipCache.set(key, filtered);
      }
    }
    return { isSpam: false, reason: "" };
  }

  /**
   * Content heuristics. These only FLAG a lead; they never drop it, because a
   * real prospect asking about "SEO service packages" looks like spam to a regex.
   */
  checkContent(message: string, email: string): SpamCheckResult {
    const patterns = [
      /\b(viagra|cialis|casino|lottery|crypto airdrop)\b/i,
      /(https?:\/\/\S+[\s\S]*){3,}/, // 3+ URLs
      /\b(backlinks?|guest posts?|link building)\b/i,
    ];
    for (const p of patterns) {
      if (p.test(message)) return { isSpam: true, reason: "Suspicious content pattern" };
    }
    const suspiciousTlds = [".xyz", ".top", ".click", ".loan", ".work", ".party", ".gq", ".ml", ".cf", ".tk"];
    const domain = email.split("@")[1]?.toLowerCase() || "";
    for (const tld of suspiciousTlds) {
      if (domain.endsWith(tld)) return { isSpam: true, reason: `Suspicious email domain: ${tld}` };
    }
    return { isSpam: false, reason: "" };
  }
}

const COMPOSIO_URL = "https://backend.composio.dev/api/v3.1/tools/execute";
const SHEETS_APPEND_TOOL = "GOOGLESHEETS_SPREADSHEETS_VALUES_APPEND";
const TELEGRAM_SEND_TOOL = "TELEGRAM_SEND_MESSAGE";
const RESEND_URL = "https://api.resend.com/emails";

export const SHEET_HEADERS = [
  "Submitted At",
  "Name",
  "Email",
  "Company",
  "Budget",
  "Services",
  "Message",
  "Status",
  "IP",
  "User Agent",
];

const spamProtection = new SpamProtection();

const env = (k: string) => process.env[k]?.trim() || undefined;
const resendKey = () => env("RESEND_API_KEY") || env("RESEND_API");

export function channelsConfigured() {
  return {
    email: Boolean(resendKey()),
    sheet: Boolean(env("COMPOSIO_API_KEY") && env("LEADS_SHEET_ID")),
    telegram: Boolean(env("COMPOSIO_API_KEY") && env("TELEGRAM_CHAT_ID")),
  };
}

/** Turn whatever an API returned into a readable one-liner for the logs. */
function describe(value: unknown): string {
  if (value == null) return "no detail";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value).slice(0, 500);
  } catch {
    return String(value);
  }
}

async function executeComposioTool(
  slug: string,
  args: Record<string, unknown>,
  userId: string | undefined,
  connectedAccountId?: string,
): Promise<void> {
  const res = await fetch(`${COMPOSIO_URL}/${slug}`, {
    method: "POST",
    headers: {
      "x-api-key": env("COMPOSIO_API_KEY") as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId || env("COMPOSIO_USER_ID") || "default",
      version: "latest",
      ...(connectedAccountId ? { connected_account_id: connectedAccountId } : {}),
      arguments: args,
    }),
    signal: AbortSignal.timeout(15000),
  });
  const body = (await res.json().catch(() => ({}))) as { successful?: boolean; error?: unknown; message?: unknown };
  if (!res.ok || body.successful === false) {
    throw new Error(`${slug} failed (${res.status}): ${describe(body.error ?? body.message ?? body)}`);
  }
}

async function sendEmail(payload: Record<string, unknown>): Promise<void> {
  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey()}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`Resend failed (${res.status}): ${describe(body)}`);
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

/** Stop a spreadsheet from treating user text as a formula. */
function cell(value: string): string {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function servicesText(d: LeadData) {
  return d.services?.length ? d.services.join(", ") : "Not specified";
}

function toRow(d: LeadData, status: string): string[] {
  return [
    d.timestamp ?? new Date().toISOString(),
    d.name,
    d.email,
    d.company || "",
    d.budget || "",
    servicesText(d),
    d.message.substring(0, 2000),
    status,
    d.ip || "",
    d.userAgent || "",
  ].map((v) => cell(String(v)));
}

function leadLines(d: LeadData): string[] {
  return [
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    ...(d.company ? [`Company: ${d.company}`] : []),
    ...(d.budget ? [`Budget: ${d.budget}`] : []),
    `Services: ${servicesText(d)}`,
  ];
}

function telegramText(d: LeadData, flag: string, sheetSaved: boolean | null): string {
  const lines = [`New lead from noonstudio.africa${flag ? ` (${flag})` : ""}`, "", ...leadLines(d), "", d.message.substring(0, 800)];
  if (sheetSaved === false) lines.push("", "WARNING: not saved to the Google Sheet. Copy it from this message.");
  return lines.join("\n");
}

function notificationEmail(d: LeadData, flag: string, sheetSaved: boolean | null) {
  const to = (env("LEADS_NOTIFY_TO") || "matata@noonstudio.africa").split(",").map((s) => s.trim()).filter(Boolean);
  const rows = leadLines(d).map((l) => `<p style="margin:4px 0">${escapeHtml(l)}</p>`).join("");
  const warning =
    sheetSaved === false
      ? `<p style="color:#b42318"><strong>Not saved to the Google Sheet.</strong> This email is the only copy.</p>`
      : "";
  return {
    from: env("LEADS_FROM") || "Noon Studio Africa <contact@noonstudio.africa>",
    to,
    reply_to: d.email,
    subject: `${flag ? `[${flag}] ` : ""}New enquiry: ${d.company || d.name}`,
    html: `<div style="font-family:Inter,Arial,sans-serif;max-width:600px">
      <h2 style="color:#05893E;margin:0 0 12px">New enquiry from noonstudio.africa</h2>
      ${warning}
      <div style="background:#f5f5f5;padding:16px;border-radius:8px">${rows}</div>
      <h3>Message</h3>
      <p style="white-space:pre-wrap">${escapeHtml(d.message)}</p>
      <p style="color:#888;font-size:12px">${escapeHtml(d.timestamp || "")} · IP ${escapeHtml(d.ip || "unknown")}</p>
      <p style="color:#888;font-size:12px">Hit reply to answer ${escapeHtml(d.name)} directly.</p>
    </div>`,
    text: [...leadLines(d), "", d.message].join("\n"),
  };
}

function autoReplyEmail(d: LeadData) {
  const first = d.name.split(" ")[0] || d.name;
  return {
    from: env("LEADS_FROM") || "Noon Studio Africa <contact@noonstudio.africa>",
    to: [d.email],
    reply_to: (env("LEADS_NOTIFY_TO") || "matata@noonstudio.africa").split(",")[0].trim(),
    subject: "We got your message · Noon Studio Africa",
    text: `Hi ${first},

Thanks for getting in touch. Your message reached us and we'll reply within one business day (Mon to Fri, 9:00 to 18:00 EAT).

If it's urgent, WhatsApp or call us on +254 740 824 474.

Noon Studio Africa
noonstudio.africa`,
  };
}

type FormLead = Pick<LeadData, "name" | "email" | "message"> &
  Partial<Pick<LeadData, "company" | "budget" | "services" | "honeypot">> & { website?: string };

const FAIL_MESSAGE =
  "Sorry, we could not record your message. Please email matata@noonstudio.africa or WhatsApp +254 740 824 474.";
const OK_MESSAGE = "Thanks for reaching out! We'll get back to you within one business day.";

export async function processLead(
  data: FormLead,
  ip: string,
  userAgent: string,
): Promise<{ success: boolean; message: string }> {
  const lead: LeadData = {
    ...data,
    name: data.name.trim(),
    email: data.email.trim(),
    message: data.message.trim(),
    company: data.company?.trim() ?? "",
    budget: data.budget?.trim() ?? "",
    services: data.services ?? [],
    // The contact form's hidden field is named "website".
    honeypot: data.honeypot || data.website || "",
    ip,
    userAgent,
    timestamp: new Date().toISOString(),
  };

  // Bots: pretend it worked so they don't adapt, but record nothing.
  if (spamProtection.checkHoneypot(lead.honeypot || "").isSpam) {
    console.log("[LeadCapture] Honeypot triggered, dropped. IP:", ip);
    return { success: true, message: OK_MESSAGE };
  }

  const rate = spamProtection.checkRateLimit(ip);
  if (rate.isSpam) {
    console.log("[LeadCapture]", rate.reason, "IP:", ip);
    return { success: false, message: "Too many messages from your connection. Please try again in an hour, or email us directly." };
  }

  const content = spamProtection.checkContent(lead.message, lead.email);
  const flag = content.isSpam ? "POSSIBLE SPAM" : "";
  const status = content.isSpam ? "SPAM?" : "NEW";

  const ch = channelsConfigured();
  if (!ch.email && !ch.sheet && !ch.telegram) {
    console.error("[LeadCapture] No channel configured. LEAD NOT RECORDED:", JSON.stringify(lead));
    return { success: false, message: FAIL_MESSAGE };
  }

  // Sheet first, so the other channels can say if the save failed.
  let sheetSaved: boolean | null = null;
  if (ch.sheet) {
    try {
      await executeComposioTool(
        SHEETS_APPEND_TOOL,
        {
          spreadsheetId: env("LEADS_SHEET_ID"),
          range: `${env("LEADS_SHEET_NAME") || "Leads"}!A1`,
          valueInputOption: "RAW",
          insertDataOption: "INSERT_ROWS",
          values: [toRow(lead, status)],
        },
        env("COMPOSIO_SHEETS_USER_ID"),
        env("COMPOSIO_SHEETS_ACCOUNT_ID"),
      );
      sheetSaved = true;
    } catch (error) {
      sheetSaved = false;
      console.error("[LeadCapture] Sheet save failed:", error instanceof Error ? error.message : error);
    }
  }

  const [tg, mail] = await Promise.allSettled([
    ch.telegram
      ? executeComposioTool(
          TELEGRAM_SEND_TOOL,
          { chat_id: env("TELEGRAM_CHAT_ID"), text: telegramText(lead, flag, sheetSaved) },
          env("COMPOSIO_TELEGRAM_USER_ID"),
          env("COMPOSIO_TELEGRAM_ACCOUNT_ID"),
        )
      : Promise.reject(new Error("not configured")),
    ch.email ? sendEmail(notificationEmail(lead, flag, sheetSaved)) : Promise.reject(new Error("not configured")),
  ]);

  const telegramSent = tg.status === "fulfilled";
  const emailSent = mail.status === "fulfilled";
  if (ch.telegram && tg.status === "rejected") console.error("[LeadCapture] Telegram failed:", tg.reason?.message ?? tg.reason);
  if (ch.email && mail.status === "rejected") console.error("[LeadCapture] Email failed:", mail.reason?.message ?? mail.reason);

  if (!sheetSaved && !telegramSent && !emailSent) {
    console.error("[LeadCapture] LEAD NOT RECORDED:", JSON.stringify(lead));
    return { success: false, message: FAIL_MESSAGE };
  }

  console.log("[LeadCapture] Recorded", { sheet: sheetSaved, telegram: telegramSent, email: emailSent, flagged: content.isSpam });

  if (emailSent && !content.isSpam && env("LEADS_AUTOREPLY") === "true") {
    await sendEmail(autoReplyEmail(lead)).catch((e) => console.error("[LeadCapture] Auto-reply failed:", e?.message ?? e));
  }

  return { success: true, message: OK_MESSAGE };
}
