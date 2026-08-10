"""
Airtable Lead Capture Integration for Noon Studio Africa

This module handles:
1. Storing leads in Airtable via Personal Access Token
2. Spam protection (honeypot, rate limiting)
3. Auto-responses (internal notification + prospect auto-reply)
"""

import os
import json
import time
import re
from datetime import datetime
from typing import Dict, Optional, Tuple, List
from dataclasses import dataclass

from airtable import Airtable


@dataclass
class LeadData:
    """Structured lead data from contact form"""
    name: str
    email: str
    company: str
    message: str
    budget: str
    services: list
    honeypot: str = ""  # Hidden field for spam detection
    timestamp: str = ""
    ip: str = ""
    user_agent: str = ""

    def __post_init__(self):
        if not self.timestamp:
            self.timestamp = datetime.utcnow().isoformat() + "Z"

    def to_airtable_record(self) -> dict:
        """Convert to Airtable record format - uses all structured fields"""
        services_text = ", ".join(self.services) if self.services else "Not specified"
        return {
            "Name": self.name,
            "Email": self.email,
            "Company": self.company or "",
            "Budget": self.budget or "",
            "Services": services_text,
            "Message": self.message[:1000],
            "IP": self.ip or "",
            "User Agent": self.user_agent or "",
            "Status": "NEW",
            "Spam Reasons": "",
            "Submitted At": self.timestamp,
            "Follow-up Date": "",
            "Notes": "",
        }


class SpamProtection:
    """Multi-layer spam protection"""
    
    # Rate limit: max submissions per IP per hour
    MAX_SUBMISSIONS_PER_HOUR = 5
    
    # Suspicious patterns
    SPAM_KEYWORDS = [
        r"\b(viagra|cialis|casino|lottery|winner|congratulations)\b",
        r"\b(click here|buy now|limited time|act now)\b",
        r"(https?://\S+){3,}",  # 3+ URLs
        r"\b(seo|backlink|guest post|link building)\b.*\b(service|package|offer)\b",
    ]
    
    # Known spam domains/tlds
    SUSPICIOUS_TLDS = [".xyz", ".top", ".click", ".loan", ".work", ".party", ".gq", ".ml", ".cf", ".tk"]
    
    def __init__(self, redis_client=None):
        self.redis = redis_client
        self.ip_cache = {}  # Fallback in-memory cache
    
    def check_honeypot(self, honeypot_value: str) -> Tuple[bool, str]:
        """Check if honeypot field was filled (bot indicator)"""
        if honeypot_value and honeypot_value.strip():
            return True, "Honeypot triggered"
        return False, ""
    
    def check_rate_limit(self, ip: str) -> Tuple[bool, str]:
        """Check if IP has exceeded rate limit"""
        now = time.time()
        hour_ago = now - 3600
        
        if self.redis:
            key = f"rate_limit:{ip}"
            self.redis.zremrangebyscore(key, 0, hour_ago)
            count = self.redis.zcard(key)
            if count >= self.MAX_SUBMISSIONS_PER_HOUR:
                return True, f"Rate limit exceeded ({count}/{self.MAX_SUBMISSIONS_PER_HOUR} per hour)"
            self.redis.zadd(key, {str(now): now})
            self.redis.expire(key, 3600)
        else:
            if ip not in self.ip_cache:
                self.ip_cache[ip] = []
            self.ip_cache[ip] = [t for t in self.ip_cache[ip] if t > hour_ago]
            if len(self.ip_cache[ip]) >= self.MAX_SUBMISSIONS_PER_HOUR:
                return True, f"Rate limit exceeded ({len(self.ip_cache[ip])}/{self.MAX_SUBMISSIONS_PER_HOUR} per hour)"
            self.ip_cache[ip].append(now)
        
        return False, ""
    
    def check_content(self, message: str, email: str) -> Tuple[bool, str]:
        """Check message content for spam patterns"""
        content = f"{message} {email}".lower()
        
        for pattern in self.SPAM_KEYWORDS:
            if re.search(pattern, content, re.IGNORECASE):
                return True, "Suspicious content pattern detected"
        
        for tld in self.SUSPICIOUS_TLDS:
            if email.lower().endswith(tld):
                return True, f"Suspicious email domain ({tld})"
        
        if len(message) > 50:
            caps_ratio = sum(1 for c in message if c.isupper()) / len(message)
            if caps_ratio > 0.5:
                return True, "Excessive capitalization"
        
        return False, ""
    
    def validate(self, lead: LeadData) -> Tuple[bool, list]:
        """Run all spam checks. Returns (is_spam, reasons)"""
        reasons = []
        
        is_spam, reason = self.check_honeypot(lead.honeypot)
        if is_spam:
            reasons.append(reason)
        
        is_spam, reason = self.check_rate_limit(lead.ip)
        if is_spam:
            reasons.append(reason)
        
        is_spam, reason = self.check_content(lead.message, lead.email)
        if is_spam:
            reasons.append(reason)
        
        return len(reasons) > 0, reasons


class AirtableLeadStore:
    """Airtable integration for lead storage"""
    
    def __init__(self, api_key: str = None, base_id: str = None, table_name: str = "Leads"):
        """
        Initialize Airtable connection.
        
        Args:
            api_key: Airtable Personal Access Token (PAT)
            base_id: Airtable Base ID
            table_name: Table name (default: "Leads")
        """
        self.api_key = api_key or os.getenv("AIRTABLE_API_KEY")
        self.base_id = base_id or os.getenv("AIRTABLE_BASE_ID")
        self.table_name = table_name
        self._airtable = None
    
    def _get_airtable(self):
        """Get or create Airtable client"""
        if self._airtable is None:
            if not self.api_key:
                raise ValueError("Airtable API key not configured. Set AIRTABLE_API_KEY")
            if not self.base_id:
                raise ValueError("Airtable Base ID not configured. Set AIRTABLE_BASE_ID")
            
            self._airtable = Airtable(self.base_id, self.table_name, api_key=self.api_key)
        return self._airtable
    
    def store_lead(self, lead: LeadData, is_spam: bool = False, spam_reasons: list = None) -> bool:
            """Store lead in Airtable - gracefully handles missing fields"""
            try:
                airtable = self._get_airtable()
            
                record = lead.to_airtable_record()
                record["Status"] = "SPAM" if is_spam else "NEW"
                if spam_reasons:
                    record["Spam Reasons"] = "; ".join(spam_reasons)
            
                airtable.insert(record)
                return True
            
            except Exception as e:
                print(f"Error storing lead in Airtable: {e}")
                # Try with minimal fields if some structured fields don't exist
                try:
                    minimal_record = {
                        "Status": "SPAM" if is_spam else "NEW",
                        "Notes": f"Name: {lead.name}\nEmail: {lead.email}\nCompany: {lead.company or 'N/A'}\nBudget: {lead.budget or 'N/A'}\nServices: {', '.join(lead.services) if lead.services else 'Not specified'}\nMessage: {lead.message}\nIP: {lead.ip or 'N/A'}\nSubmitted At: {lead.timestamp}" + (f"\n\nSpam Reasons: {'; '.join(spam_reasons)}" if spam_reasons else "")
                    }
                    airtable.insert(minimal_record)
                    return True
                except Exception as e2:
                    print(f"Error storing minimal lead: {e2}")
                    return False
    
    def get_leads(self, status: str = None, limit: int = 100) -> list:
        """Retrieve leads from Airtable"""
        try:
            airtable = self._get_airtable()
            
            formula = None
            if status:
                formula = f"{{Status}} = '{status}'"
            
            records = airtable.get_all(
                formula=formula,
                max_records=limit,
            )
            
            # Sort by createdTime descending (Airtable auto-sets this)
            records.sort(key=lambda x: x.get("createdTime", ""), reverse=True)
            
            return [r["fields"] for r in records]
            
        except Exception as e:
            print(f"Error retrieving leads: {e}")
            return []
    
    def update_lead_status(self, record_id: str, status: str, notes: str = "") -> bool:
        """Update lead status and notes"""
        try:
            airtable = self._get_airtable()
            fields = {"Status": status}
            if notes:
                fields["Notes"] = notes
            airtable.update(record_id, fields)
            return True
        except Exception as e:
            print(f"Error updating lead: {e}")
            return False


class EmailResponder:
    """Handles automated email responses"""
    
    def __init__(self, resend_api_key: str = None):
        self.resend_api_key = resend_api_key or os.getenv("RESEND_API_KEY")
        self._resend = None
    
    def _get_resend(self):
        if self._resend is None:
            from resend import Resend
            self._resend = Resend(self.resend_api_key)
        return self._resend
    
    def send_internal_notification(self, lead: LeadData, is_spam: bool = False, spam_reasons: list = None) -> bool:
        """Send notification to internal team"""
        try:
            resend = self._get_resend()
            
            status = "🚨 SPAM" if is_spam else "✅ NEW LEAD"
            services_text = ", ".join(lead.services) if lead.services else "Not specified"
            spam_text = f"\n\n**Spam Reasons:** {', '.join(spam_reasons)}" if spam_reasons else ""
            
            html = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">{status}</h2>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Name:</strong> {lead.name}</p>
                    <p><strong>Email:</strong> {lead.email}</p>
                    {f'<p><strong>Company:</strong> {lead.company}</p>' if lead.company else ''}
                    {f'<p><strong>Budget:</strong> {lead.budget}</p>' if lead.budget else ''}
                    <p><strong>Services:</strong> {services_text}</p>
                    <p><strong>IP:</strong> {lead.ip or 'Unknown'}</p>
                    <p><strong>Time:</strong> {lead.timestamp}</p>
                </div>
                <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                    <h3>Message:</h3>
                    <p style="white-space: pre-wrap;">{lead.message}</p>
                </div>
                {spam_text}
            </div>
            """
            
            resend.emails.send({
                "from": "Noon Studio Africa <contact@noonstudio.africa>",
                "to": ["matata@noonstudio.africa", "hello@noonstudio.africa"],
                "subject": f"{status} — {lead.company or lead.name}",
                "html": html,
            })
            return True
            
        except Exception as e:
            print(f"Error sending internal notification: {e}")
            return False
    
    def send_auto_reply(self, lead: LeadData) -> bool:
        """Send auto-reply to prospect"""
        try:
            resend = self._get_resend()
            
            services_text = ", ".join(lead.services) if lead.services else "your project"
            
            html = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Thanks for reaching out, {lead.name}!</h2>
                
                <p>We've received your enquiry about <strong>{services_text}</strong> and will get back to you within one business day.</p>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>What happens next?</h3>
                    <ol>
                        <li>Our team reviews your brief</li>
                        <li>We'll email you to schedule a free 30-minute discovery call</li>
                        <li>We'll send a fixed-price proposal based on your needs</li>
                    </ol>
                </div>
                
                <p>In the meantime, you might find these useful:</p>
                <ul>
                    <li><a href="https://noonstudio.africa/work">Our portfolio</a></li>
                    <li><a href="https://noonstudio.africa/pricing">Pricing packages</a></li>
                    <li><a href="https://noonstudio.africa/blog">Insights & guides</a></li>
                </ul>
                
                <p>Best regards,<br>
                Matata Johnson<br>
                Founder, Noon Studio Africa<br>
                <a href="https://noonstudio.africa">noonstudio.africa</a> | +254 740 824 474</p>
            </div>
            """
            
            resend.emails.send({
                "from": "Noon Studio Africa <contact@noonstudio.africa>",
                "to": [lead.email],
                "subject": "Thanks for contacting Noon Studio Africa — we'll be in touch",
                "html": html,
            })
            return True
            
        except Exception as e:
            print(f"Error sending auto-reply: {e}")
            return False


class LeadCaptureService:
    """Main service orchestrating lead capture flow"""
    
    def __init__(
        self,
        airtable_store: AirtableLeadStore = None,
        email_responder: EmailResponder = None,
        spam_protection: SpamProtection = None
    ):
        self.airtable = airtable_store or AirtableLeadStore()
        self.email = email_responder or EmailResponder()
        self.spam = spam_protection or SpamProtection()
    
    def process_lead(self, lead_data: Dict, ip: str = "", user_agent: str = "") -> Dict:
        """
        Process a lead submission.
        
        Returns:
            Dict with: success, message, is_spam, lead_id
        """
        # Build lead object
        lead = LeadData(
            name=lead_data.get("name", "").strip(),
            email=lead_data.get("email", "").strip().lower(),
            company=lead_data.get("company", "").strip(),
            message=lead_data.get("message", "").strip(),
            budget=lead_data.get("budget", "").strip(),
            services=lead_data.get("services", []) if isinstance(lead_data.get("services"), list) else [],
            honeypot=lead_data.get("website", ""),  # Honeypot field name
            ip=ip,
            user_agent=user_agent
        )
        
        # Validate required fields
        if not lead.name or not lead.email or not lead.message:
            return {
                "success": False,
                "message": "Missing required fields",
                "is_spam": False
            }
        
        # Run spam checks
        is_spam, spam_reasons = self.spam.validate(lead)
        
        # Store in Airtable (even spam for review)
        stored = self.airtable.store_lead(lead, is_spam, spam_reasons)
        
        # Send internal notification
        self.email.send_internal_notification(lead, is_spam, spam_reasons)
        
        # Send auto-reply to prospect (only if not spam)
        if not is_spam:
            self.email.send_auto_reply(lead)
        
        return {
            "success": True,
            "message": "Thank you! We'll get back to you within one business day." if not is_spam else "Submission received",
            "is_spam": is_spam,
            "spam_reasons": spam_reasons
        }


# Factory function for easy initialization
def create_lead_capture_service() -> LeadCaptureService:
    """Create configured lead capture service"""
    return LeadCaptureService(
        airtable_store=AirtableLeadStore(),
        email_responder=EmailResponder(),
        spam_protection=SpamProtection()
    )