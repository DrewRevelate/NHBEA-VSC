# Validation & Standards

[← Back to Index](./index.md) | [← Previous: Phase 3](./04-phase3-advanced-ux.md) | [Next: Architecture →](./06-architecture-deployment.md)

## Critical Success Criteria

### Phase 1 Validation
- [ ] All statistics elements completely removed from site
- [ ] Hall of Fame aesthetic quality rated 9.5+/10 by design review
- [ ] Conference page engagement metrics improve by 25%
- [ ] Newsletter signup retention increases by 40%
- [ ] Membership forms have identical visual design
- [ ] Awards page simplified to 2-award layout

### Phase 2 Validation
- [ ] Admin users can modify membership pricing without developer involvement
- [ ] New membership types can be created and published within 1 hour
- [ ] Form configuration changes reflect immediately on public site
- [ ] Payment processing adapts automatically to pricing changes
- [ ] 80% of content updates handled through admin interface

### Phase 3 Validation
- [ ] Form abandonment rates decrease by 30%
- [ ] Auto-save functionality prevents data loss
- [ ] Character counters appear on all applicable fields
- [ ] Loading states provide smooth user experience
- [ ] Performance metrics meet targets (sub-2s page loads)

## Code Quality Requirements

### TypeScript Standards
- All new code must use strict TypeScript with explicit types
- No `any` types except for dynamic form data
- All async operations must have proper error handling
- Comprehensive JSDoc comments for complex functions

```typescript
// ✅ Good Example
interface MembershipFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  membershipType: 'professional' | 'student';
}

/**
 * Validates membership form data according to NHBEA requirements
 * @param data - The form data to validate
 * @returns Promise resolving to validation result
 * @throws ValidationError if data is invalid
 */
async function validateMembershipData(data: MembershipFormData): Promise<ValidationResult> {
  // Implementation with proper error handling
}

// ❌ Bad Example
async function validateForm(data: any) {
  // Missing types, error handling, and documentation
}
```

### Component Standards
- All components must be memo-wrapped for performance
- Props must have explicit TypeScript interfaces
- Loading and error states must be handled
- Accessibility (ARIA labels, keyboard navigation) is mandatory

```typescript
// ✅ Good Example
interface MembershipFormProps {
  config: MembershipTypeConfig;
  onSubmit: (data: MembershipFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export const MembershipForm = memo<MembershipFormProps>(({ 
  config, 
  onSubmit, 
  isLoading = false, 
  error = null 
}) => {
  // Component implementation with proper accessibility
  return (
    <form 
      onSubmit={handleSubmit}
      role="form"
      aria-labelledby="membership-form-title"
      aria-describedby={error ? "form-error" : undefined}
    >
      <h2 id="membership-form-title">{config.name} Application</h2>
      {error && (
        <div 
          id="form-error" 
          role="alert" 
          aria-live="polite"
          className="text-red-600"
        >
          {error}
        </div>
      )}
      {/* Form fields */}
    </form>
  );
});

MembershipForm.displayName = 'MembershipForm';
```

### Error Handling Standards

```typescript
// ✅ Comprehensive Error Handling
class MembershipService {
  async createMembership(data: MembershipFormData): Promise<MembershipResult> {
    try {
      // Validate input
      const validationResult = await this.validateData(data);
      if (!validationResult.isValid) {
        throw new ValidationError(validationResult.errors);
      }

      // Process payment
      const paymentResult = await this.processPayment(data);
      if (!paymentResult.success) {
        throw new PaymentError(paymentResult.error);
      }

      // Create membership record
      const membership = await this.createMembershipRecord(data, paymentResult.paymentId);
      
      // Send confirmation
      await this.sendConfirmationEmail(data.email, membership.id);
      
      return { success: true, membershipId: membership.id };
      
    } catch (error) {
      // Log error for monitoring
      console.error('Membership creation failed:', error);
      
      // Handle specific error types
      if (error instanceof ValidationError) {
        throw new Error(`Invalid data: ${error.message}`);
      } else if (error instanceof PaymentError) {
        throw new Error(`Payment failed: ${error.message}`);
      } else {
        throw new Error('Membership creation failed. Please try again.');
      }
    }
  }
}
```

## Testing Requirements

### Unit Tests
- Unit tests for all business logic functions
- Target: 90% code coverage for critical paths
- Test error conditions and edge cases

```typescript
// Example unit test
describe('MembershipService', () => {
  describe('validateMembershipData', () => {
    it('should validate required fields', async () => {
      const invalidData = { firstName: '', lastName: '', email: 'invalid-email' };
      
      await expect(validateMembershipData(invalidData))
        .rejects
        .toThrow(ValidationError);
    });

    it('should accept valid professional membership data', async () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '555-0123',
        membershipType: 'professional' as const
      };
      
      const result = await validateMembershipData(validData);
      expect(result.isValid).toBe(true);
    });
  });
});
```

### Integration Tests
- Integration tests for form workflows
- Payment processing end-to-end tests
- CMS configuration change tests

```typescript
// Example integration test
describe('Membership Application Flow', () => {
  it('should complete professional membership application', async () => {
    // Navigate to membership page
    await page.goto('/membership/professional');
    
    // Fill form
    await page.fill('[name="firstName"]', 'John');
    await page.fill('[name="lastName"]', 'Doe');
    await page.fill('[name="email"]', 'john@example.com');
    
    // Submit and verify payment redirect
    await page.click('[type="submit"]');
    await expect(page).toHaveURL(/square\.com/);
    
    // Verify membership creation (webhook simulation)
    const membership = await getMembershipByEmail('john@example.com');
    expect(membership).toBeDefined();
    expect(membership.status).toBe('active');
  });
});
```

### E2E Tests
- E2E tests for critical user journeys
- Accessibility testing with axe-core
- Cross-browser compatibility testing

```typescript
// Example E2E test
describe('Critical User Journeys', () => {
  it('should allow user to complete membership application and receive confirmation', async () => {
    // Complete application
    await completeApplicationFlow();
    
    // Verify confirmation email sent
    const emails = await getTestEmails();
    expect(emails).toHaveLength(1);
    expect(emails[0].subject).toContain('Welcome to NHBEA');
    
    // Verify membership appears in admin panel
    await loginAsAdmin();
    await page.goto('/admin/members');
    await expect(page.locator('[data-testid="member-list"]')).toContainText('John Doe');
  });
});
```

### Visual Regression Tests
- Visual regression tests for redesigned pages
- Component screenshot testing
- Cross-device visual consistency

```typescript
// Example visual regression test
describe('Visual Regression', () => {
  it('should match Hall of Fame page design', async () => {
    await page.goto('/hall-of-fame');
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot).toMatchSnapshot('hall-of-fame-page.png');
  });

  it('should match membership form design across devices', async () => {
    const devices = ['iPhone 12', 'iPad', 'Desktop'];
    
    for (const device of devices) {
      await page.setViewportSize(getDeviceViewport(device));
      await page.goto('/membership/professional');
      await page.waitForLoadState('networkidle');
      
      const screenshot = await page.screenshot();
      expect(screenshot).toMatchSnapshot(`membership-form-${device.toLowerCase()}.png`);
    }
  });
});
```

## Performance Standards

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint):** < 2s
- **FID (First Input Delay):** < 50ms
- **CLS (Cumulative Layout Shift):** < 0.05

### Performance Monitoring

```typescript
// Performance monitoring setup
const performanceObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'largest-contentful-paint') {
      analytics.track('Core Web Vital', {
        metric: 'LCP',
        value: entry.startTime,
        page: window.location.pathname
      });
    }
  }
});

performanceObserver.observe({ entryTypes: ['largest-contentful-paint'] });

// Bundle size monitoring in CI/CD
const bundleAnalyzer = require('webpack-bundle-analyzer');

module.exports = {
  // webpack config
  plugins: [
    process.env.ANALYZE && new bundleAnalyzer.BundleAnalyzerPlugin()
  ].filter(Boolean)
};
```

### Optimization Requirements
- Bundle size must not increase beyond current baseline
- All images must be optimized with next/image
- Critical CSS must be inlined
- Non-critical JavaScript must be lazy-loaded

```typescript
// ✅ Optimized Image Usage
import Image from 'next/image';

export const MemberPhoto = ({ member }: { member: Member }) => {
  return (
    <Image
      src={member.photoUrl}
      alt={`${member.name} - ${member.title}`}
      width={300}
      height={300}
      className="rounded-full object-cover"
      priority={member.featured} // Only for above-the-fold images
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/..."
    />
  );
};

// ✅ Lazy Loading Components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <ComponentSkeleton />,
  ssr: false
});
```

## Accessibility Standards

### WCAG 2.1 AA Compliance
- All interactive elements must be keyboard accessible
- Color contrast ratios must meet WCAG standards (4.5:1 for normal text)
- All images must have descriptive alt text
- Form fields must have proper labels and error messages

```typescript
// ✅ Accessible Form Component
export const AccessibleFormField = ({ field, error }: {
  field: FormFieldConfig;
  error?: string;
}) => {
  const fieldId = `field-${field.id}`;
  const errorId = `${fieldId}-error`;
  const helpId = `${fieldId}-help`;

  return (
    <div className="space-y-2">
      <label 
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-900"
      >
        {field.label}
        {field.required && (
          <span className="text-red-500 ml-1" aria-label="required">*</span>
        )}
      </label>
      
      <input
        id={fieldId}
        type={field.type}
        required={field.required}
        aria-describedby={`${field.helpText ? helpId : ''} ${error ? errorId : ''}`.trim()}
        aria-invalid={error ? 'true' : 'false'}
        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      
      {field.helpText && (
        <p id={helpId} className="text-sm text-gray-600">
          {field.helpText}
        </p>
      )}
      
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
```

### Automated Accessibility Testing

```typescript
// Accessibility test setup
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should not have accessibility violations', async () => {
    render(<MembershipForm config={mockConfig} onSubmit={jest.fn()} />);
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });

  it('should be keyboard navigable', async () => {
    render(<MembershipForm config={mockConfig} onSubmit={jest.fn()} />);
    
    // Tab through all interactive elements
    const interactiveElements = screen.getAllByRole(/button|textbox|combobox/);
    
    for (let i = 0; i < interactiveElements.length; i++) {
      fireEvent.keyDown(document.body, { key: 'Tab' });
      expect(interactiveElements[i]).toHaveFocus();
    }
  });
});
```

## Security Standards

### Input Validation
- All user inputs must be validated and sanitized
- SQL injection prevention (using parameterized queries)
- XSS prevention (proper escaping and CSP)

```typescript
// ✅ Input Validation
import { z } from 'zod';
import DOMPurify from 'dompurify';

const MembershipSchema = z.object({
  firstName: z.string().min(1).max(50).regex(/^[a-zA-Z\s-']+$/),
  lastName: z.string().min(1).max(50).regex(/^[a-zA-Z\s-']+$/),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[\d\s-()]+$/),
  bio: z.string().max(1000).optional()
});

export const validateAndSanitizeMembershipData = (data: unknown) => {
  // Validate structure
  const validated = MembershipSchema.parse(data);
  
  // Sanitize text fields
  return {
    ...validated,
    firstName: DOMPurify.sanitize(validated.firstName),
    lastName: DOMPurify.sanitize(validated.lastName),
    bio: validated.bio ? DOMPurify.sanitize(validated.bio) : undefined
  };
};
```

### Authentication & Authorization
- Secure admin routes with proper authentication
- Role-based access control for CMS features
- Secure session management

```typescript
// ✅ Protected Admin Route
export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !user.roles?.includes('admin'))) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) return <LoadingSpinner />;
  if (!user || !user.roles?.includes('admin')) return null;

  return <>{children}</>;
};
```

---

**Next:** [Architecture & Deployment →](./06-architecture-deployment.md)