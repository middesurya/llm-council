import { logWithContext } from '@/lib/observability';

export enum ContentFilterResult {
  ALLOWED = 'allowed',
  BLOCKED = 'blocked',
  FLAGGED = 'flagged',
}

interface FilterCheck {
  result: ContentFilterResult;
  reason?: string;
  severity?: 'low' | 'medium' | 'high';
}

// Basic content moderation
export const moderateContent = (content: string, domain: string): FilterCheck => {
  // Check for PII (basic patterns)
  const piiPatterns = [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN pattern
    /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/, // Credit card pattern
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email pattern
  ];

  for (const pattern of piiPatterns) {
    if (pattern.test(content)) {
      logWithContext.warn('PII detected in content', { domain });
      return {
        result: ContentFilterResult.FLAGGED,
        reason: 'Personal information detected',
        severity: 'medium',
      };
    }
  }

  // Check for toxic content (basic keyword list)
  const toxicKeywords = [
    'hate',
    'kill',
    'violence',
    'terrorism',
    'self-harm',
    'suicide',
  ];

  const lowerContent = content.toLowerCase();
  for (const keyword of toxicKeywords) {
    if (lowerContent.includes(keyword)) {
      logWithContext.warn('Toxic content detected', { domain, keyword });
      return {
        result: ContentFilterResult.BLOCKED,
        reason: `Inappropriate content: ${keyword}`,
        severity: 'high',
      };
    }
  }

  return { result: ContentFilterResult.ALLOWED };
};

// Domain-specific content checks
export const checkDomainContent = (content: string, domain: string): FilterCheck => {
  switch (domain) {
    case 'healthcare':
      return checkHealthcareContent(content);
    case 'finance':
      return checkFinanceContent(content);
    default:
      return { result: ContentFilterResult.ALLOWED };
  }
};

// Healthcare-specific checks
const checkHealthcareContent = (content: string): FilterCheck => {
  const lowerContent = content.toLowerCase();

  // Check for direct request for diagnosis (flag for human review)
  const diagnosisPatterns = [
    /do i have/i,
    /what disease do i have/i,
    /diagnose me/i,
    /tell me my diagnosis/i,
  ];

  for (const pattern of diagnosisPatterns) {
    if (pattern.test(content)) {
      logWithContext.info('Diagnosis request detected - adding disclaimer', { domain: 'healthcare' });
      return {
        result: ContentFilterResult.FLAGGED,
        reason: 'Direct diagnosis request',
        severity: 'low',
      };
    }
  }

  // Check for emergency keywords
  const emergencyKeywords = [
    'emergency',
    'call 911',
    'ambulance',
    'chest pain',
    'heart attack',
    'stroke',
    'suicide',
    'overdose',
  ];

  for (const keyword of emergencyKeywords) {
    if (lowerContent.includes(keyword)) {
      logWithContext.warn('Emergency keywords detected', { domain: 'healthcare', keyword });
      return {
        result: ContentFilterResult.FLAGGED,
        reason: 'Emergency situation - provide immediate help resources',
        severity: 'high',
      };
    }
  }

  return { result: ContentFilterResult.ALLOWED };
};

// Finance-specific checks
const checkFinanceContent = (content: string): FilterCheck => {
  const lowerContent = content.toLowerCase();

  // Check for investment advice requests
  const advicePatterns = [
    /what should i invest in/i,
    /should i buy/i,
    /recommend a stock/i,
    /investment advice/i,
    /financial advice/i,
  ];

  for (const pattern of advicePatterns) {
    if (pattern.test(content)) {
      logWithContext.info('Investment advice request detected - adding disclaimer', { domain: 'finance' });
      return {
        result: ContentFilterResult.FLAGGED,
        reason: 'Investment advice request - add disclaimer',
        severity: 'low',
      };
    }
  }

  // Check for insider trading or illegal activities
  const illegalPatterns = [
    /insider trading/i,
    /insider information/i,
    /tax evasion/i,
    /money laundering/i,
    /fraud/i,
  ];

  for (const pattern of illegalPatterns) {
    if (pattern.test(content)) {
      logWithContext.warn('Illegal activity keywords detected', { domain: 'finance', pattern: pattern.source });
      return {
        result: ContentFilterResult.BLOCKED,
        reason: 'Inappropriate request',
        severity: 'high',
      };
    }
  }

  return { result: ContentFilterResult.ALLOWED };
};

// Generate disclaimers based on content
export const generateDisclaimer = (domain: string, content: string): string | null => {
  const healthcareDisclaimer = 'NOT MEDICAL ADVICE: This information is for educational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.';
  const financeDisclaimer = 'NOT FINANCIAL ADVICE: This information is for educational purposes only and does not constitute financial advice. Consult with a qualified financial advisor before making investment decisions.';

  switch (domain) {
    case 'healthcare':
      return healthcareDisclaimer;
    case 'finance':
      return financeDisclaimer;
    default:
      return null;
  }
};

// Check content and return appropriate response
export const checkContent = (content: string, domain: string): {
  allowed: boolean;
  disclaimer?: string | null;
  warning?: string | null;
} => {
  const moderationResult = moderateContent(content, domain);
  const domainResult = checkDomainContent(content, domain);

  // If blocked, return with error
  if (moderationResult.result === ContentFilterResult.BLOCKED ||
      domainResult.result === ContentFilterResult.BLOCKED) {
    return {
      allowed: false,
      warning: moderationResult.reason || domainResult.reason || 'Content cannot be processed',
    };
  }

  // If flagged but allowed, return with disclaimer
  const disclaimer = generateDisclaimer(domain, content);
  const warnings = [];

  if (moderationResult.result === ContentFilterResult.FLAGGED) {
    warnings.push(moderationResult.reason!);
  }
  if (domainResult.result === ContentFilterResult.FLAGGED) {
    warnings.push(domainResult.reason!);
  }

  return {
    allowed: true,
    disclaimer: disclaimer || undefined,
    warning: warnings.length > 0 ? warnings.join('; ') : undefined,
  };
};
