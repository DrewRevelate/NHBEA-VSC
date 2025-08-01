# Architecture & Deployment

[← Back to Index](./index.md) | [← Previous: Validation](./05-validation-standards.md)

## File Structure Guidelines

```
src/
├── app/                     # Next.js app router
│   ├── (auth)/             # Auth route group
│   │   ├── login/
│   │   └── signup/
│   ├── admin/              # Admin CMS routes
│   │   ├── dashboard/
│   │   ├── members/
│   │   ├── membership-types/
│   │   └── settings/
│   ├── api/                # API routes
│   │   ├── auth/
│   │   ├── members/
│   │   ├── payments/
│   │   └── webhooks/
│   ├── about/
│   ├── awards/
│   ├── conference/
│   ├── hall-of-fame/
│   └── membership/
│       ├── professional/
│       └── student/
├── components/
│   ├── enhanced/           # New enhanced components
│   │   ├── HallOfFameGrid/
│   │   ├── AwardsDisplay/
│   │   └── ConferenceLayout/
│   ├── forms/              # Dynamic form system
│   │   ├── DynamicForm/
│   │   ├── FormField/
│   │   ├── FormBuilder/
│   │   └── FormProgress/
│   ├── cms/                # Admin CMS components
│   │   ├── MembershipEditor/
│   │   ├── ContentEditor/
│   │   └── AnalyticsDashboard/
│   ├── ui/                 # Base UI components
│   │   ├── Button/
│   │   ├── Modal/
│   │   ├── Skeleton/
│   │   └── ErrorBoundary/
│   └── analytics/          # Analytics tracking
│       ├── EventTracker/
│       └── PerformanceMonitor/
├── lib/
│   ├── repositories/       # Data access layer
│   │   ├── MembershipRepository.ts
│   │   ├── PaymentRepository.ts
│   │   └── ContentRepository.ts
│   ├── services/           # Business logic
│   │   ├── MembershipService.ts
│   │   ├── PaymentService.ts
│   │   ├── EmailService.ts
│   │   └── AnalyticsService.ts
│   ├── validation/         # Input validation
│   │   ├── schemas/
│   │   └── sanitizers/
│   └── utils/              # Utility functions
│       ├── formatting.ts
│       ├── constants.ts
│       └── helpers.ts
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts
│   ├── useFormPersistence.ts
│   ├── useLoadingStates.ts
│   └── useNetworkStatus.ts
├── types/                  # TypeScript definitions
│   ├── membership.ts
│   ├── payment.ts
│   ├── cms.ts
│   └── api.ts
└── store/                  # State management
    ├── authStore.ts
    ├── membershipStore.ts
    └── uiStore.ts
```

## Environment Variables Required

### Development Environment
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nhbea-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nhbea-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nhbea-dev.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=nhbea-dev
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xyz@nhbea-dev.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Square Payment Integration
SQUARE_ACCESS_TOKEN=your_sandbox_access_token
SQUARE_LOCATION_ID=your_location_id
SQUARE_ENVIRONMENT=sandbox
SQUARE_WEBHOOK_SIGNATURE_KEY=your_webhook_signature_key

# Analytics & Monitoring
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXX
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_for_development
NEXTAUTH_URL=http://localhost:3000

# Email Configuration (Optional for dev)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Production Environment
```bash
# Firebase Configuration (Production)
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nhbea-org.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nhbea-org
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nhbea-org.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=987654321
NEXT_PUBLIC_FIREBASE_APP_ID=1:987654321:web:production

# Firebase Admin (Production)
FIREBASE_PROJECT_ID=nhbea-org
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-prod@nhbea-org.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Square Payment Integration (Production)
SQUARE_ACCESS_TOKEN=your_production_access_token
SQUARE_LOCATION_ID=your_production_location_id
SQUARE_ENVIRONMENT=production
SQUARE_WEBHOOK_SIGNATURE_KEY=your_production_webhook_signature_key

# Production Settings
NEXT_PUBLIC_APP_URL=https://nhbea.org
NEXTAUTH_SECRET=your_secure_production_secret
NEXTAUTH_URL=https://nhbea.org

# Production Email
SMTP_HOST=your-production-smtp-host
SMTP_PORT=587
SMTP_USER=noreply@nhbea.org
SMTP_PASS=your-secure-email-password
```

## Deployment Process

### 1. Pre-deployment Checklist
```bash
# Run full test suite
npm run test
npm run test:e2e
npm run test:accessibility

# Check TypeScript compilation
npm run type-check

# Run linting
npm run lint

# Build application
npm run build

# Analyze bundle size
npm run analyze

# Run security audit
npm audit
```

### 2. Firebase Functions Deployment
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy functions only
firebase deploy --only functions

# Deploy with specific function
firebase deploy --only functions:handleSquareWebhook

# View function logs
firebase functions:log
```

### 3. Next.js Application Deployment
```bash
# Build optimized production bundle
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy specific site (if using multiple sites)
firebase deploy --only hosting:nhbea-org

# Preview deployment before going live
firebase hosting:channel:deploy preview-$(date +%Y%m%d-%H%M%S)
```

### 4. Database Migration (if needed)
```bash
# Run Firestore index deployment
firebase deploy --only firestore:indexes

# Update security rules
firebase deploy --only firestore:rules

# Run data migration script (if needed)
npm run migrate:data
```

### 5. Post-deployment Verification
```bash
# Run smoke tests against production
npm run test:smoke -- --baseURL=https://nhbea.org

# Check Core Web Vitals
npm run test:performance -- --url=https://nhbea.org

# Verify critical user journeys
npm run test:critical-path -- --env=production
```

## CI/CD Pipeline Configuration

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run TypeScript check
        run: npm run type-check
        
      - name: Run linting
        run: npm run lint
        
      - name: Run unit tests
        run: npm run test
        
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Build application
        run: npm run build
        
      - name: Run bundle analysis
        run: npm run analyze -- --no-open
        
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          # ... other environment variables
          
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: nhbea-org
          channelId: live
```

## Monitoring & Observability

### Performance Monitoring Setup
```typescript
// lib/monitoring/performance.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

interface WebVitalMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
}

function sendToAnalytics(metric: WebVitalMetric) {
  // Send to Google Analytics
  gtag('event', metric.name, {
    event_category: 'Web Vitals',
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_label: metric.id,
    non_interaction: true,
  });

  // Send to custom analytics service
  analytics.track('Web Vital', {
    metric: metric.name,
    value: metric.value,
    id: metric.id,
    page: window.location.pathname,
    timestamp: Date.now()
  });
}

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
};
```

### Error Monitoring
```typescript
// lib/monitoring/errors.ts
import * as Sentry from '@sentry/nextjs';

export const initErrorMonitoring = () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    beforeSend(event) {
      // Filter out development errors
      if (process.env.NODE_ENV === 'development') {
        return null;
      }
      
      // Don't send network errors for offline users
      if (event.exception?.values?.[0]?.type === 'NetworkError' && !navigator.onLine) {
        return null;
      }
      
      return event;
    }
  });
};

// Custom error boundary with Sentry integration
export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.withScope((scope) => {
      scope.setTag('component', 'ErrorBoundary');
      scope.setContext('errorInfo', errorInfo);
      Sentry.captureException(error);
    });
  }
  
  render() {
    // Error UI
  }
}
```

### Business Metrics Dashboard
```typescript
// lib/analytics/businessMetrics.ts
export class BusinessMetricsService {
  async trackMembershipApplication(type: 'professional' | 'student') {
    analytics.track('Membership Application Started', {
      membershipType: type,
      timestamp: Date.now(),
      page: window.location.pathname
    });
  }

  async trackMembershipCompletion(membershipId: string, amount: number) {
    analytics.track('Membership Application Completed', {
      membershipId,
      amount,
      timestamp: Date.now()
    });
  }

  async trackFormAbandonment(formId: string, completionPercentage: number) {
    analytics.track('Form Abandoned', {
      formId,
      completionPercentage,
      timestamp: Date.now(),
      page: window.location.pathname
    });
  }

  async trackNewsletterSignup(email: string) {
    analytics.track('Newsletter Signup', {
      timestamp: Date.now(),
      page: window.location.pathname
    });
  }

  async trackAwardNomination(awardType: string) {
    analytics.track('Award Nomination Submitted', {
      awardType,
      timestamp: Date.now()
    });
  }
}
```

## Key Architectural Principles

### 1. Progressive Enhancement
Start with working functionality, add enhancements
```typescript
// Base functionality works without JavaScript
const NewsletterSignup = () => {
  return (
    <form action="/api/newsletter" method="POST">
      <input type="email" name="email" required />
      <button type="submit">Subscribe</button>
    </form>
  );
};

// Enhanced with JavaScript
const EnhancedNewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      await submitNewsletter(email);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      // Fallback to server-side form submission
      const form = e.target as HTMLFormElement;
      form.submit();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} action="/api/newsletter" method="POST">
      <input 
        type="email" 
        name="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required 
      />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
};
```

### 2. Configuration Over Code
Make everything admin-configurable
```typescript
// Instead of hardcoded values
const MEMBERSHIP_PRICE = 50;

// Use configuration
const membershipConfig = await getMembershipTypeById('professional');
const price = membershipConfig.pricing.amount / 100; // Convert from cents
```

### 3. Performance First
Optimize for Core Web Vitals
```typescript
// Lazy load non-critical components
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false
});

// Preload critical resources
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

// Optimize images
<Image
  src={member.photoUrl}
  alt={member.name}
  width={300}
  height={300}
  priority={index < 3} // Only for above-the-fold images
  placeholder="blur"
/>
```

### 4. Accessibility Always
WCAG 2.1 AA compliance minimum
```typescript
// Proper semantic HTML and ARIA labels
<nav role="navigation" aria-label="Main navigation">
  <ul>
    <li><a href="/about" aria-current={pathname === '/about' ? 'page' : undefined}>About</a></li>
  </ul>
</nav>

// Keyboard navigation support
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleClick();
  }
};
```

### 5. Type Safety
Strict TypeScript throughout
```typescript
// Strict interfaces
interface MembershipFormData {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly membershipType: 'professional' | 'student';
}

// Type guards
const isMembershipFormData = (data: unknown): data is MembershipFormData => {
  return typeof data === 'object' && 
         data !== null &&
         'firstName' in data &&
         'lastName' in data &&
         'email' in data &&
         'membershipType' in data;
};
```

---

**Remember:** This is a transformation of an already excellent platform (9.3/10) into an exceptional one (9.7+/10). Focus on precision, quality, and user experience above all else. Every change should be measurable and contribute to the overall success metrics.

**Questions or clarifications needed?** Reference the complete architecture document at `/Users/drewlambert/Desktop/NHBEA/docs/architecture.md` for detailed specifications and context.

---

[← Back to Index](./index.md)