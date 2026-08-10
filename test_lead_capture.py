#!/usr/bin/env python3
"""
Test script for Google Sheets Lead Capture Integration

Run this after setting up credentials and spreadsheet:
1. Copy service account JSON to /root/ai-growth-hub/google-sheets-credentials.json
2. Set GOOGLE_SHEETS_SPREADSHEET_ID env var
3. Run: python test_lead_capture.py
"""

import os
import sys

# Add src to path
sys.path.insert(0, "/root/ai-growth-hub/src")

from lib.integrations.google_sheets_leads import (
    create_lead_capture_service,
    LeadData,
    SpamProtection
)

def test_spam_protection():
    """Test spam protection layers"""
    print("=" * 60)
    print("Testing Spam Protection")
    print("=" * 60)
    
    spam = SpamProtection()
    
    # Test 1: Clean lead
    lead = LeadData(
        name="John Doe",
        email="john@company.com",
        company="Acme Corp",
        message="We need a new website for our business.",
        budget="200k-500k",
        services=["Web Design"],
        ip="192.168.1.1"
    )
    is_spam, reasons = spam.validate(lead)
    print(f"Clean lead: is_spam={is_spam}, reasons={reasons}")
    assert not is_spam, "Clean lead should not be flagged"
    
    # Test 2: Honeypot triggered
    lead.honeypot = "bot-filled-this"
    is_spam, reasons = spam.validate(lead)
    print(f"Honeypot lead: is_spam={is_spam}, reasons={reasons}")
    assert is_spam, "Honeypot should trigger spam"
    assert "Honeypot triggered" in reasons
    
    # Test 3: Suspicious TLD
    lead.honeypot = ""
    lead.email = "spam@bad.xyz"
    is_spam, reasons = spam.validate(lead)
    print(f"Suspicious TLD: is_spam={is_spam}, reasons={reasons}")
    assert is_spam, "Suspicious TLD should trigger spam"
    
    # Test 4: Spam keywords
    lead.email = "john@company.com"
    lead.message = "Buy viagra now! Click here for limited time offer!"
    is_spam, reasons = spam.validate(lead)
    print(f"Spam keywords: is_spam={is_spam}, reasons={reasons}")
    assert is_spam, "Spam keywords should trigger spam"
    
    # Test 5: Rate limiting
    lead.message = "Normal message"
    for i in range(6):
        is_spam, reasons = spam.validate(lead)
    print(f"Rate limit (6th request): is_spam={is_spam}, reasons={reasons}")
    assert is_spam, "Rate limit should trigger on 6th request"
    
    print("\n✅ All spam protection tests passed!")

def test_lead_capture():
    """Test full lead capture flow (requires credentials)"""
    print("\n" + "=" * 60)
    print("Testing Lead Capture Service")
    print("=" * 60)
    
    # Check if credentials are configured
    creds_path = os.getenv("GOOGLE_SHEETS_CREDENTIALS")
    spreadsheet_id = os.getenv("GOOGLE_SHEETS_SPREADSHEET_ID")
    resend_key = os.getenv("RESEND_API_KEY")
    
    if not creds_path or not os.path.exists(creds_path):
        print("⚠️  Skipping Google Sheets test - credentials not found")
        print(f"   Expected: {creds_path}")
        return
    
    if not spreadsheet_id:
        print("⚠️  Skipping Google Sheets test - spreadsheet ID not set")
        return
    
    if not resend_key:
        print("⚠️  Skipping email test - RESEND_API_KEY not set")
        return
    
    print("Credentials found, testing full flow...")
    
    service = create_lead_capture_service()
    
    # Test valid lead
    result = service.process_lead({
        "name": "Test User",
        "email": "test@example.com",
        "company": "Test Company",
        "message": "This is a test lead from the integration test script.",
        "budget": "100k-200k",
        "services": ["Web Design", "AI Automation"],
        "website": ""  # honeypot
    }, ip="127.0.0.1", user_agent="Test Script")
    
    print(f"Result: {result}")
    assert result["success"], "Lead capture should succeed"
    assert not result["is_spam"], "Valid lead should not be spam"
    
    print("✅ Lead capture test passed! Check Google Sheets for new row.")

if __name__ == "__main__":
    test_spam_protection()
    test_lead_capture()
    print("\n" + "=" * 60)
    print("All tests completed!")
    print("=" * 60)