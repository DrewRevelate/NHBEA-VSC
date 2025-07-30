# 10. Security

## 10.1 Security Architecture Overview
The application implements a **Defense in Depth** strategy with multiple security layers:

## 10.2 Authentication & Authorization

### Public Access Model
- **No user authentication** required for MVP
- All forms are publicly accessible
- Payment confirmation via email only

### Admin Access
- **FireCMS Portal**: Separate admin authentication
- **Service Account**: Server-side operations use Firebase Admin SDK
- **API Key Protection**: All keys stored in environment variables

## 10.3 Data Security

### Firestore Security Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for content
    match /content/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    
    // Write-only for submissions
    match /newsletterSubscribers/{document=**} {
      allow read: if false;
      allow create: if request.resource.data.email is string 
        && request.resource.data.email.matches('^[^@]+@[^@]+\\.[^@]+$');
      allow update, delete: if false;
    }
    
    // Protected collections
    match /members/{document=**} {
      allow read: if false;
      allow write: if false; // Server-side only
    }
  }
}
```

### Data Encryption
- **At Rest**: Firestore automatic encryption (AES256)
- **In Transit**: TLS 1.3 for all connections
- **PII Handling**: 
  - No SSN or government IDs collected
  - Email/phone stored encrypted
  - No data exported to third parties

## 10.4 Application Security

### Input Validation & Sanitization
```typescript
// Example validation middleware
export async function validateRequest<T>(
  schema: ZodSchema<T>,
  data: unknown
): Promise<T> {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError('Invalid input', error);
    }
    throw error;
  }
}

// Sanitization rules
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .slice(0, 1000); // Max length
};
```

### OWASP Top 10 Mitigations

| Vulnerability | Mitigation Strategy |
|--------------|---------------------|
| Injection | Parameterized Firestore queries, Zod validation |
| Broken Authentication | N/A - No user auth in MVP |
| Sensitive Data Exposure | HTTPS only, no sensitive data in logs |
| XML External Entities | JSON only, no XML processing |
| Broken Access Control | Firestore rules, server-side validation |
| Security Misconfiguration | Secure defaults, environment configs |
| XSS | React auto-escaping, Content Security Policy |
| Insecure Deserialization | JSON schema validation |
| Vulnerable Components | Automated dependency scanning |
| Insufficient Logging | Structured logging, no PII in logs |

## 10.5 Payment Security

### PCI Compliance Strategy
- **SAQ A Compliance**: Redirect to Square hosted pages
- **No Card Data**: Never touch credit card information
- **Tokenization**: Square handles all tokenization
- **Webhook Security**: Signature verification on all webhooks

### Payment Flow Security
```typescript
// Webhook signature verification
export async function verifySquareWebhook(
  body: string,
  signature: string
): Promise<boolean> {
  const hmac = crypto.createHmac('sha256', process.env.SQUARE_WEBHOOK_SECRET!);
  hmac.update(body);
  const expectedSignature = hmac.digest('base64');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

## 10.6 Infrastructure Security

### Environment Security
- **Secret Management**: GitHub Secrets for CI/CD
- **Environment Isolation**: Separate projects for dev/staging/prod
- **Access Control**: Principle of least privilege for service accounts

### Content Security Policy
```typescript
// next.config.js CSP headers
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.square.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://*.firebaseio.com https://square.com;
  frame-src https://square.com;
`;
```

## 10.7 Security Monitoring

### Logging Strategy
- **What to Log**: Authentication attempts, payment events, errors
- **What NOT to Log**: Passwords, payment details, PII
- **Log Retention**: 30 days for operational logs

### Security Incident Response
1. **Detection**: Monitor error rates and security logs
2. **Containment**: Disable affected features via feature flags
3. **Investigation**: Review logs and audit trails
4. **Remediation**: Deploy fixes through standard CI/CD
5. **Lessons Learned**: Update security practices

## 10.8 Security Testing Requirements

### Automated Security Testing
- **SAST**: ESLint security plugin in CI/CD
- **Dependency Scanning**: npm audit on every build
- **Secret Scanning**: git-secrets pre-commit hooks

### Manual Security Reviews
- Code review for all payment-related changes
- Quarterly dependency updates
- Annual penetration testing (post-MVP)
