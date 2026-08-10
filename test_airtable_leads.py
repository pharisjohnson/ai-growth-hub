#!/usr/bin/env python3
"""
Test script for Airtable Lead Capture Integration
"""

import os
import sys

# Add src to path
sys.path.insert(0, "/root/ai-growth-hub/src")

# Set test environment variables
os.environ["AIRTABLE_API_KEY"] = "your_pat_here"
# You'll need to set your Base ID here:
# os.environ["AIRTABLE_BASE_ID"] = "appXXXXXXXXXXXXXX"
os.environ["RESEND_API_KEY"] = "test_key"  # Won't actually send without real key

from lib.integrations.airtable_leads import (
    create_lead_capture_service,
    LeadData,
    SpamProtection,
    AirtableLeadStore
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

def test_airtable_connection():
    """Test Airtable connection (requires Base ID)"""
    print("\n" + "=" * 60)
    print("Testing Airtable Connection")
    print("=" * 60)
    
    base_id = os.getenv("AIRTABLE_BASE_ID")
    if not base_id:
        print("⚠️  Skipping Airtable test - AIRTABLE_BASE_ID not set")
        print("   Set it with: export AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX")
        return
    
    try:
        store = AirtableLeadStore()
        # Test connection by trying to get leads (empty is fine)
        leads = store.get_leads(limit=1)
        print(f"✅ Airtable connection successful! Found {len(leads)} existing leads")
        
        # Test storing a lead
        lead = LeadData(
            name="Airtable Test",
            email="airtable-test@example.com",
            company="Test Corp",
            message="Testing Airtable integration",
            budget="100k-200k",
            services=["Web Design"],
            ip="127.0.0.1"
        )
        stored = store.store_lead(lead)
        print(f"Store lead result: {stored}")
        if stored:
            print("✅ Lead stored successfully in Airtable!")
        
    except Exception as e:
        print(f"❌ Airtable connection failed: {e}")
        print("   Check your Base ID and PAT permissions")

if __name__ == "__main__":
    test_spam_protection()
    test_airtable_connection()
    print("\n" + "=" * 60)
    print("All tests completed!")
    print("=" * 60)