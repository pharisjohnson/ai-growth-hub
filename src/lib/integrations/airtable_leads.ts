/**
 * Airtable Lead Capture Integration for Noon Studio Africa (TypeScript port)
 * Handles storing leads in Airtable via Personal Access Token with spam protection
 */

import { Airtable } from 'airtable';

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

class SpamProtection {
  private static MAX_SUBMISSIONS_PER_HOUR = 5;
  private ipCache: Map<string, number[]> = new Map();

  checkHoneypot(honeypotValue: string): SpamCheckResult {
    if (honeypotValue && honeypotValue.trim()) {
      return { isSpam: true, reason: 'Honeypot triggered' };
    }
    return { isSpam: false, reason: '' };
  }

  checkRateLimit(ip: string): SpamCheckResult {
    const now = Date.now();
    const hourAgo = now - 3600000;
    
    const timestamps = this.ipCache.get(ip) || [];
    const recentTimestamps = timestamps.filter(ts => ts > hourAgo);
    
    if (recentTimestamps.length >= SpamProtection.MAX_SUBMISSIONS_PER_HOUR) {
      return { 
        isSpam: true, 
        reason: `Rate limit exceeded (${recentTimestamps.length}/${SpamProtection.MAX_SUBMISSIONS_PER_HOUR} per hour)` 
      };
    }
    
    recentTimestamps.push(now);
    this.ipCache.set(ip, recentTimestamps);
    
    // Clean up old entries periodically
    if (this.ipCache.size > 1000) {
      for (const [key, value] of this.ipCache.entries()) {
        const filtered = value.filter(ts => ts > hourAgo);
        if (filtered.length === 0) {
          this.ipCache.delete(key);
        } else {
          this.ipCache.set(key, filtered);
        }
      }
    }
    
    return { isSpam: false, reason: '' };
  }

  checkContent(message: string, email: string): SpamCheckResult {
    const spamKeywords = [
      /\b(viagra|cialis|casino|lottery|winner|congratulations)\b/i,
      /\b(click here|buy now|limited time|act now)\b/i,
      /(https?:\/\/\S+){3,}/, // 3+ URLs
      /\b(seo|backlink|guest post|link building)\b.*\b(service|package|offer)\b/i,
    ];

    for (const pattern of spamKeywords) {
      if (pattern.test(message) || pattern.test(email)) {
        return { isSpam: true, reason: 'Suspicious content pattern detected' };
      }
    }

    const suspiciousTlDS = ['.xyz', '.top', '.click', '.loan', '.work', '.party', '.gq', '.ml', '.cf', '.tk'];
    const emailDomain = email.split('@')[1]?.toLowerCase() || '';
    for (const tld of suspiciousTlDS) {
      if (emailDomain.endsWith(tld)) {
        return { isSpam: true, reason: `Suspicious email domain: ${tld}` };
      }
    }

    return { isSpam: false, reason: '' };
  }

  runAllChecks(data: LeadData): { isSpam: boolean; reasons: string[] } {
    const reasons: string[] = [];
    
    const honeypot = this.checkHoneypot(data.honeypot || '');
    if (honeypot.isSpam) reasons.push(honeypot.reason);
    
    const rateLimit = this.checkRateLimit(data.ip || 'unknown');
    if (rateLimit.isSpam) reasons.push(rateLimit.reason);
    
    const content = this.checkContent(data.message, data.email);
    if (content.isSpam) reasons.push(content.reason);
    
    return { isSpam: reasons.length > 0, reasons };
  }
}

class LeadCaptureService {
  private airtable: Airtable | null = null;
  private tableName: string;
  private spamProtection: SpamProtection;

  constructor() {
    this.tableName = process.env.AIRTABLE_TABLE_NAME || 'Leads';
    this.spamProtection = new SpamProtection();
    
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    
    if (apiKey && baseId) {
      this.airtable = new Airtable({ apiKey });
      this.airtable.base(baseId);
    }
  }

  private toAirtableRecord(data: LeadData): Record<string, unknown> {
    const servicesText = data.services && data.services.length > 0 
      ? data.services.join(', ') 
      : 'Not specified';
    
    return {
      'Name': data.name,
      'Email': data.email,
      'Company': data.company || '',
      'Budget': data.budget || '',
      'Services': servicesText,
      'Message': data.message.substring(0, 1000),
      'IP': data.ip || '',
      'User Agent': data.userAgent || '',
      'Status': 'NEW',
      'Spam Reasons': '',
      'Submitted At': data.timestamp || new Date().toISOString(),
      'Follow-up Date': '',
      'Notes': '',
    };
  }

  async processLead(data: LeadData, ip: string, userAgent: string): Promise<{ success: boolean; message: string }> {
    // Enrich data
    const enrichedData: LeadData = {
      ...data,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
      honeypot: data.honeypot || '',
    };

    // Run spam checks
    const spamResult = this.spamProtection.runAllChecks(enrichedData);
    if (spamResult.isSpam) {
      console.log('[LeadCapture] Spam detected:', spamResult.reasons, 'IP:', ip);
      return { 
        success: false, 
        message: 'Submission blocked by spam protection. Please try again later or contact us directly.' 
      };
    }

    // Try to save to Airtable
    if (this.airtable) {
      try {
        const record = this.toAirtableRecord(enrichedData);
        await this.airtable(this.tableName).create(record);
        console.log('[LeadCapture] Lead saved to Airtable:', enrichedData.email);
      } catch (error) {
        console.error('[LeadCapture] Airtable save failed:', error);
        // Don't fail the request - log and continue
      }
    } else {
      console.log('[LeadCapture] Airtable not configured, logging lead:', enrichedData.email);
    }

    // TODO: Send notification emails via Resend if configured
    // This would go here

    return { 
      success: true, 
      message: 'Thanks for reaching out! We\'ll get back to you within one business day.' 
    };
  }
}

let serviceInstance: LeadCaptureService | null = null;

export function createLeadCaptureService(): LeadCaptureService {
  if (!serviceInstance) {
    serviceInstance = new LeadCaptureService();
  }
  return serviceInstance;
}
