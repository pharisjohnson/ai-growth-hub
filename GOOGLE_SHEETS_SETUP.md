# Google Sheets Lead Capture Setup Guide

## Prerequisites

1. **Google Cloud Project** with Sheets API enabled
2. **Service Account** with Google Sheets permissions
3. **Google Spreadsheet** to store leads
4. **Resend API Key** for emails (already configured)

---

## Step 1: Create Google Cloud Project & Enable APIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing: `noon-studio-leads`
3. Enable APIs:
   - **Google Sheets API**
   - **Google Drive API** (needed for spreadsheet access)

---

## Step 2: Create Service Account

1. Go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
   - Name: `noon-studio-leads-capture`
   - Description: `Service account for capturing leads from noonstudio.africa contact form`
3. Grant roles:
   - **Editor** (or custom: `sheets.editor` + `drive.file`)
4. Create and download **JSON key file**
5. Save as: `/root/ai-growth-hub/google-sheets-credentials.json` (or any secure path)

---

## Step 3: Create Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create new spreadsheet: `Noon Studio Leads`
3. Copy the **Spreadsheet ID** from URL:
   ```
   https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
   ```
4. Share the spreadsheet with the service account email:
   - Open spreadsheet → Share → Add service account email (from JSON key)
   - Permission: **Editor**

---

## Step 4: Configure Environment Variables

Add to Vercel dashboard (Project → Settings → Environment Variables):

| Variable | Value | Environment |
|----------|-------|-------------|
| `GOOGLE_SHEETS_CREDENTIALS` | Path to JSON file (see below) | Production, Preview |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | Your spreadsheet ID | Production, Preview |
| `RESEND_API_KEY` | Your Resend API key | Production, Preview |

**For `GOOGLE_SHEETS_CREDENTIALS` on Vercel:**
- Option A: Base64 encode the JSON and store as env var, decode at runtime
- Option B: Use Vercel's file upload for secrets (Enterprise)
- Option C: Store in a secure location and reference path

**Recommended for Vercel (Option A):**
```bash
# On local machine:
cat google-sheets-credentials.json | base64 -w 0
# Copy output and paste as GOOGLE_SHEETS_CREDENTIALS_B64 env var
```

Then update the Python code to decode:
```python
import base64, json, os
creds_json = base64.b64decode(os.getenv("GOOGLE_SHEETS_CREDENTIALS_B64")).decode()
creds_dict = json.loads(creds_json)
creds = Credentials.from_service_account_info(creds_dict, scopes=SCOPES)
```

---

## Step 5: Local Development Setup

1. Copy credentials file:
   ```bash
   cp /path/to/downloaded/credentials.json /root/ai-growth-hub/google-sheets-credentials.json
   ```

2. Add to `.env.local` (create if not exists):
   ```bash
   GOOGLE_SHEETS_CREDENTIALS=/root/ai-growth-hub/google-sheets-credentials.json
   GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

3. Install dependencies:
   ```bash
   cd /root/ai-growth-hub
   pip install gspread google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
   ```

---

## Step 6: Test the Integration

Run the test script:
```bash
cd /root/ai-growth-hub
python3 -c "
from src.lib.integrations.google_sheets_leads import create_lead_capture_service
service = create_lead_capture_service()
result = service.process_lead({
    'name': 'Test User',
    'email': 'test@example.com',
    'company': 'Test Corp',
    'message': 'This is a test lead submission',
    'budget': '200k-500k',
    'services': ['Web Design', 'SEO & Content'],
    'website': ''  # honeypot
}, ip='127.0.0.1', user_agent='Test Agent')
print(result)
"
```

Check your Google Sheet - should see a new row in "Leads" tab.

---

## Step 7: Deploy to Vercel

1. Push changes to GitHub
2. Vercel auto-deploys
3. Verify environment variables in Vercel dashboard
4. Test contact form on production

---

## Spam Protection Features Included

| Layer | Description |
|-------|-------------|
| **Honeypot** | Hidden `website` field - bots fill it, humans don't see it |
| **Rate Limiting** | Max 5 submissions/IP/hour (in-memory, Redis-ready) |
| **Content Analysis** | Keyword patterns, suspicious TLDs, excessive caps |
| **Spam Logging** | Spam submissions stored in Sheets with "SPAM" status for review |

---

## Auto-Response Emails

| Trigger | Recipient | Template |
|---------|-----------|----------|
| New lead (not spam) | Internal: `matata@noonstudio.africa`, `hello@noonstudio.africa` | Full lead details + spam status |
| New lead (not spam) | Prospect (form email) | Thank you + next steps + portfolio/pricing links |
| Spam detected | Internal only | Flagged with reasons |

---

## Lead Management in Google Sheets

The "Leads" sheet has columns:
- Timestamp, Name, Email, Company, Budget, Services, Message, IP, User Agent, Status, Spam Reasons, Follow-up Date, Notes

**Status values:** `NEW`, `SPAM`, `CONTACTED`, `QUALIFIED`, `PROPOSAL_SENT`, `CLOSED_WON`, `CLOSED_LOST`

Use Google Sheets filters/views to manage pipeline.