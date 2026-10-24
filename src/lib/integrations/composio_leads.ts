/**
 * Lead capture through Composio: every lead is appended to a Google Sheet and
 * announced on Telegram. Both calls run in parallel and are checked separately,
 * so a failure in one is reported through the other instead of being lost.
 *
 * Env vars (all server-side):
 *   COMPOSIO_API_KEY             Composio project API key
 *   COMPOSIO_USER_ID             user the Google Sheets + Telegram accounts are connected under
 *   LEADS_SHEET_ID               spreadsheet ID (the long string in the sheet URL)
 *   LEADS_SHEET_NAME             tab name, default "Leads"
 *   TELEGRAM_CHAT_ID             chat the bot posts to
 *   COMPOSIO_SHEETS_ACCOUNT_ID   optional, only if the user has several Google connections
 *   COMPOSIO_TELEGRAM_ACCOUNT_ID optional, only if the user has several Telegram connections
 */

import { SpamProtection, type LeadData } from "./airtable_leads";

const COMPOSIO_URL = "https://backend.composio.dev/api/v3.1/tools/execute";
const SHEETS_APPEND_TOOL = "GOOGLESHEETS_BATCH_UPDATE";
const TELEGRAM_SEND_TOOL = "TELEGRAM_SEND_MESSAGE";

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

export function composioConfigured(): boolean {
  return Boolean(
    process.env.COMPOSIO_API_KEY &&
      process.env.LEADS_SHEET_ID &&
      process.env.TELEGRAM_CHAT_ID,
  );
}

async function executeTool(
  slug: string,
  args: Record<string, unknown>,
  connectedAccountId?: string,
): Promise<void> {
  const res = await fetch(`${COMPOSIO_URL}/${slug}`, {
    method: "POST",
    headers: {
      "x-api-key": process.env.COMPOSIO_API_KEY as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: process.env.COMPOSIO_USER_ID || "default",
      version: "latest",
      ...(connectedAccountId ? { connected_account_id: connectedAccountId } : {}),
      arguments: args,
    }),
    signal: AbortSignal.timeout(15000),
  });
  const body = (await res.json().catch(() => ({}))) as { successful?: boolean; error?: string | null };
  if (!res.ok || body.successful === false) {
    throw new Error(`${slug} failed (${res.status}): ${body.error ?? "no detail"}`);
  }
}

/** Stop a spreadsheet from treating user text as a formula. */
function cell(value: string): string {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function toRow(d: LeadData): string[] {
  return [
    d.timestamp ?? new Date().toISOString(),
    d.name,
    d.email,
    d.company || "",
    d.budget || "",
    d.services?.length ? d.services.join(", ") : "Not specified",
    d.message.substring(0, 1000),
    "NEW",
    d.ip || "",
    d.userAgent || "",
  ].map((v) => cell(String(v)));
}

function telegramText(d: LeadData, sheetSaved: boolean): string {
  const lines = [
    "New lead from noonstudio.africa",
    "",
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    ...(d.company ? [`Company: ${d.company}`] : []),
    ...(d.budget ? [`Budget: ${d.budget}`] : []),
    `Services: ${d.services?.length ? d.services.join(", ") : "Not specified"}`,
    "",
    d.message.substring(0, 800),
  ];
  if (!sheetSaved) {
    lines.push("", "WARNING: this lead was NOT saved to the Google Sheet. Copy it from this message.");
  }
  return lines.join("\n");
}

type FormLead = Pick<LeadData, "name" | "email" | "message"> &
  Partial<Pick<LeadData, "company" | "budget" | "services" | "honeypot">> & { website?: string };

export async function processLeadComposio(
  data: FormLead,
  ip: string,
  userAgent: string,
): Promise<{ success: boolean; message: string }> {
  const lead: LeadData = {
    ...data,
    company: data.company ?? "",
    budget: data.budget ?? "",
    services: data.services ?? [],
    // The contact form's hidden field is named "website".
    honeypot: data.honeypot || data.website || "",
    ip,
    userAgent,
    timestamp: new Date().toISOString(),
  };

  const spam = spamProtection.runAllChecks(lead);
  if (spam.isSpam) {
    console.log("[LeadCapture] Spam detected:", spam.reasons, "IP:", ip);
    return {
      success: false,
      message: "Submission blocked by spam protection. Please try again later or contact us directly.",
    };
  }

  // Sheet first, so the Telegram message can say if the save failed.
  let sheetSaved = true;
  try {
    await executeTool(
      SHEETS_APPEND_TOOL,
      {
        spreadsheet_id: process.env.LEADS_SHEET_ID,
        sheet_name: process.env.LEADS_SHEET_NAME || "Leads",
        values: [toRow(lead)],
        value_input_option: "RAW",
      },
      process.env.COMPOSIO_SHEETS_ACCOUNT_ID,
    );
  } catch (error) {
    sheetSaved = false;
    console.error("[LeadCapture] Sheet save failed:", error);
  }

  let telegramSent = true;
  try {
    await executeTool(
      TELEGRAM_SEND_TOOL,
      { chat_id: process.env.TELEGRAM_CHAT_ID, text: telegramText(lead, sheetSaved) },
      process.env.COMPOSIO_TELEGRAM_ACCOUNT_ID,
    );
  } catch (error) {
    telegramSent = false;
    console.error("[LeadCapture] Telegram notification failed:", error);
  }

  if (!sheetSaved && !telegramSent) {
    // Nothing recorded the lead. Say so instead of thanking the visitor.
    console.error("[LeadCapture] LEAD NOT RECORDED:", JSON.stringify(lead));
    return {
      success: false,
      message: "Sorry, we could not record your message. Please email us or message us on WhatsApp.",
    };
  }

  return {
    success: true,
    message: "Thanks for reaching out! We'll get back to you within one business day.",
  };
}
