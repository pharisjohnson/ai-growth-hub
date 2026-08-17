#!/usr/bin/env python3
"""
Check Gmail for emails involving matata@noonstudio.africa in last 4 hours.
Outputs a concise summary for Telegram.
"""
import os
import sys
import json
from datetime import datetime, timedelta, timezone
import dateutil.parser

# Add src to path
sys.path.insert(0, "/root/ai-growth-hub/src")

# Use environment variables for secrets (set in environment, not in code)
# AIRTABLE_API_KEY, AIRTABLE_BASE_ID, RESEND_API_KEY should be set in env

import subprocess

def run_himalaya(args):
    """Run himalaya command and return JSON output"""
    cmd = ["/root/.local/bin/himalaya"] + args
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error running himalaya: {result.stderr}", file=sys.stderr)
        return None
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        print(f"Failed to parse JSON: {result.stdout}", file=sys.stderr)
        return None

def main():
    four_hours_ago = datetime.now(timezone.utc) - timedelta(hours=4)
    
    # Get recent emails from Gmail account
    data = run_himalaya(["envelope", "list", "--account", "gmail", "--page", "1", "--page-size", "50", "--json"])
    
    if not data:
        print("Failed to fetch emails")
        return 1
    
    relevant = []
    for env in data.get('envelopes', []):
        try:
            env_date = dateutil.parser.parse(env['date'])
        except:
            continue
        
        if env_date < four_hours_ago:
            continue
        
        # Check TO, CC, FROM for matata@noonstudio.africa
        found = False
        for field in ['to', 'cc', 'from']:
            for addr in env.get(field, []):
                if addr.get('email', '').lower() == 'matata@noonstudio.africa':
                    found = True
                    break
            if found:
                break
        
        if not found:
            continue
        
        flags = [f['iana'] for f in env.get('flags', [])]
        unread = 'UNREAD' if 'seen' not in flags else 'read'
        
        relevant.append({
            'status': unread,
            'sender': env['from'][0].get('email', ''),
            'subject': env['subject'],
            'date': env['date'],
            'has_attachment': env.get('has-attachment')
        })
    
    if not relevant:
        print("No emails for matata@noonstudio.africa in last 4 hours")
        return 0
    
    # Format for Telegram
    print("📧 *Noon Studio Email Check (4hr)*")
    print(f"Found {len(relevant)} email(s) for matata@noonstudio.africa\n")
    
    for email in relevant:
        # Flag important emails
        flag = ""
        subject_lower = email['subject'].lower()
        if any(kw in subject_lower for kw in ['rfq', 'quote', 'invoice', 'proposal', 'payment', 'urgent', 'contract']):
            flag = " ⚠️ *NEEDS ATTENTION*"
        
        print(f"*{email['status']}* {flag}")
        print(f"From: {email['sender']}")
        print(f"Subject: {email['subject']}")
        print(f"Date: {email['date']}")
        if email['has_attachment']:
            print("📎 Has attachment")
        print()
    
    return 0

if __name__ == "__main__":
    sys.exit(main())