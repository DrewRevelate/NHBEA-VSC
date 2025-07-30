# NHBEA Standardized Components Migration Guide

This guide provides step-by-step instructions for migrating existing pages to use the new standardized component architecture implemented in Story 5.2.

## 📋 Overview

### Migration Goals
- ✅ **Consistent Architecture**: Standardize all pages to use `StandardPageLayout`
- ✅ **Hero Consolidation**: Replace individual hero components with `FlexibleHero` variants
- ✅ **Error Handling**: Implement `StandardErrorBoundary` throughout all sections
- ✅ **Loading States**: Standardize loading with `LoadingSpinner` and `LoadingSkeleton`
- ✅ **Responsive Layout**: Use `ResponsiveGrid` for consistent spacing and alignment

### Pages to Migrate
Based on the current codebase, the following pages need migration:
- [ ] `/about` - About page
- [ ] `/conference` - Conference information page  
- [ ] `/conference/register` - Conference registration
- [ ] `/membership/professional` - Professional membership
- [ ] `/membership/student` - Student membership
- [ ] `/awards` - Awards information
- [ ] `/awards/nominate` - Award nomination
- [ ] `/hall-of-fame` - Hall of Fame listings
- [x] `/` - Homepage *(Already migrated as reference)*

## 🚀 Quick Migration Checklist

For each page migration, follow this checklist:

### 📋 Pre-Migration Assessment
- [ ] Identify current layout structure and hero component
- [ ] Document existing functionality and visual design
- [ ] Note any custom error handling or loading states
- [ ] Check for any page-specific styling requirements
- [ ] Verify TypeScript interfaces for data requirements

### 📋 Component Migration
- [ ] Replace page wrapper with `StandardPageLayout`
- [ ] Migrate hero to appropriate `FlexibleHero` variant
- [ ] Wrap sections with `StandardErrorBoundary`
- [ ] Replace custom loading with standardized components
- [ ] Implement `ResponsiveGrid` for content layout
- [ ] Configure metadata for SEO optimization

### 📋 Testing & Validation
- [ ] Test all functionality works correctly
- [ ] Verify visual design consistency
- [ ] Check accessibility with keyboard navigation
- [ ] Validate error handling with simulated failures
- [ ] Test loading states with network throttling
- [ ] Run automated test suite
- [ ] Performance check with bundle analyzer

## 🎯 Step-by-Step Migration Process

### Step 1: Analyze Current Implementation

**Example**: Migrating the About page

First, examine the current implementation:

```tsx
// Current about page structure
export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AboutHeroSection 
        title="About NHBEA"
        subtitle="Our mission and history"
      />
      <main className="container mx-auto px-6 py-12">
        <MissionSection />
        <HistorySection />
        <BoardSection />
      </main>
    </div>
  );
}
```

**Document**: Current functionality, props, and visual design.

### Step 2: Plan Component Mapping

Map current components to standardized equivalents:

| Current Component | Standardized Component | Notes |
|-------------------|------------------------|-------|
| `<div>` wrapper | `StandardPageLayout` | Add metadata config |
| `AboutHeroSection` | `FlexibleHero variant="about"` | Map props to variant interface |
| `<main>` wrapper | Handled by `StandardPageLayout` | Remove manual main element |
| Section components | Wrap with `StandardErrorBoundary` | Add error handling |
| No loading states | Add `LoadingSpinner` for async data | Improve UX |

### Step 3: Import Standardized Components

```tsx
// New imports for standardized architecture
import { StandardPageLayout } from '@/components/StandardPageLayout';
import { FlexibleHero } from '@/components/FlexibleHero';
import { StandardErrorBoundary } from '@/components/StandardErrorBoundary';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { LoadingSpinner } from '@/components/LoadingSpinner';
```

### Step 4: Implement New Structure

```tsx
export default function AboutPage() {
  return (
    <StandardPageLayout
      hero={{
        component: FlexibleHero,
        props: {
          variant: 'about',
          title: 'About NHBEA',
          subtitle: 'Dedicated to advancing business education throughout New Hampshire since 1960',
          boardCount: 15,
          establishedYear: 1960
        }
      }}
      error={{ boundary: true }}
      loading={{ enabled: true }}
      meta={{
        title: 'About - NHBEA',
        description: 'Learn about NHBEA mission, history, and leadership team',
        openGraph: true,
        twitterCard: true
      }}
    >
      <ResponsiveGrid gap="lg" className="space-y-16">
        <StandardErrorBoundary>
          <MissionSection />
        </StandardErrorBoundary>
        
        <StandardErrorBoundary>
          <HistorySection />
        </StandardErrorBoundary>
        
        <StandardErrorBoundary>
          <BoardSection />
        </StandardErrorBoundary>
      </ResponsiveGrid>
    </StandardPageLayout>
  );
}
```

### Step 5: Test and Validate

- **Functionality Test**: Verify all features work as before
- **Visual Test**: Compare before/after screenshots
- **Accessibility Test**: Use keyboard navigation and screen readers
- **Performance Test**: Check bundle size impact
- **Error Test**: Simulate component failures

## 📖 Page-Specific Migration Guides

### About Page Migration

**Current Structure**:
```tsx
// /src/app/about/page.tsx - Current
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <AboutHeroSection />
      <main className="container mx-auto px-6 py-16">
        <EnhancedMissionSection />
        <ValuesImpactSection />
        <BoardMembersSection />
        <PastPresidentsSection />
      </main>
    </div>
  );
}
```

**Migrated Structure**:
```tsx
// /src/app/about/page.tsx - Migrated
export default function AboutPage() {
  return (
    <StandardPageLayout
      hero={{
        component: FlexibleHero,
        props: {
          variant: 'about',
          title: 'About NHBEA',
          subtitle: 'Dedicated to advancing business education throughout New Hampshire since 1960'
        }
      }}
      meta={{
        title: 'About - NHBEA',
        description: 'Learn about our mission, values, and leadership team'
      }}
    >
      <ResponsiveGrid gap="xl" className="space-y-20">
        <StandardErrorBoundary>
          <EnhancedMissionSection />
        </StandardErrorBoundary>
        
        <StandardErrorBoundary>
          <ValuesImpactSection />
        </StandardErrorBoundary>
        
        <StandardErrorBoundary>
          <Suspense fallback={<LoadingSkeleton variant="grid" count={6} />}>
            <BoardMembersSection />
          </Suspense>
        </StandardErrorBoundary>
        
        <StandardErrorBoundary>
          <Suspense fallback={<LoadingSkeleton variant="list" count={5} />}>
            <PastPresidentsSection />
          </Suspense>
        </StandardErrorBoundary>
      </ResponsiveGrid>
    </StandardPageLayout>
  );
}
```

### Conference Page Migration

**FlexibleHero Configuration**:
```tsx
hero={{
  component: FlexibleHero,
  props: {
    variant: 'conference',
    conference: {
      title: 'Annual Conference 2024',
      date: 'March 15, 2024',
      location: 'Manchester, NH',
      registrationOpen: true,
      earlyBirdDeadline: 'February 1, 2024',
      theme: {
        primaryColor: '#1e40af',
        secondaryColor: '#1e3a8a'
      }
    }
  }
}}
```

### Membership Pages Migration

**Professional Membership**:
```tsx
hero={{
  component: FlexibleHero,
  props: {
    variant: 'membership',
    membershipType: 'professional',
    pricing: {
      amount: 50,
      currency: '$',
      period: 'year'
    },
    benefits: [
      'Professional development opportunities',
      'Networking events',
      'Career advancement resources',
      'Access to industry publications'
    ]
  }
}}
```

**Student Membership**:
```tsx
hero={{
  component: FlexibleHero,
  props: {
    variant: 'membership',
    membershipType: 'student',
    pricing: {
      amount: 25,
      currency: '$',
      period: 'year'
    },
    benefits: [
      'Student development programs',
      'Networking opportunities',
      'Career guidance',
      'Scholarship opportunities'
    ]
  }
}}
```

### Awards Page Migration

```tsx
hero={{
  component: FlexibleHero,
  props: {
    variant: 'awards',
    nominationDeadline: 'March 1, 2024',
    activeAwards: 5
  }
}}
```

### Hall of Fame Migration

```tsx
hero={{
  component: FlexibleHero,
  props: {
    variant: 'hall-of-fame',
    stats: {
      totalMembers: 150,
      latestYear: 2024
    }
  }
}}
```

## 🔧 Advanced Migration Patterns

### Handling Async Data Loading

**Pattern**: Loading states for data-dependent sections

```tsx
async function DataDependentPage() {
  let data = null;
  let error = null;

  try {
    data = await fetchPageData();
  } catch (err) {
    error = err;
  }

  return (
    <StandardPageLayout hero={{ /* config */ }}>
      <ResponsiveGrid gap="lg">
        <StandardErrorBoundary>
          <Suspense fallback={<LoadingSkeleton variant="content" />}>
            {error ? (
              <ErrorFallback error={error.message} />
            ) : (
              <DataSection data={data} />
            )}
          </Suspense>
        </StandardErrorBoundary>
      </ResponsiveGrid>
    </StandardPageLayout>
  );
}
```

### Form Pages with Loading States

**Pattern**: Forms with submission loading states

```tsx
function FormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <StandardPageLayout hero={{ /* config */ }}>
      <ResponsiveGrid gap="md">
        <StandardErrorBoundary>
          {isSubmitting ? (
            <LoadingSpinner 
              variant="section" 
              message="Processing your request..." 
            />
          ) : (
            <FormComponent onSubmit={() => setIsSubmitting(true)} />
          )}
        </StandardErrorBoundary>
      </ResponsiveGrid>
    </StandardPageLayout>
  );
}
```

### Performance Optimized Pages

**Pattern**: Code splitting with lazy loading

```tsx
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));
const ChartComponent = lazy(() => import('./ChartComponent'));

function OptimizedPage() {
  return (
    <StandardPageLayout hero={{ /* config */ }}>
      <ResponsiveGrid gap="lg">
        <StandardErrorBoundary>
          <CriticalContent />
        </StandardErrorBoundary>
        
        <StandardErrorBoundary>
          <Suspense fallback={<LoadingSkeleton variant="content" />}>
            <HeavyComponent />
          </Suspense>
        </StandardErrorBoundary>
        
        <StandardErrorBoundary>
          <Suspense fallback={<LoadingSkeleton variant="grid" count={4} />}>
            <ChartComponent />
          </Suspense>
        </StandardErrorBoundary>
      </ResponsiveGrid>
    </StandardPageLayout>
  );
}
```

## 🚨 Common Migration Issues

### Issue: TypeScript Errors with FlexibleHero Props

**Problem**: TypeScript compilation fails with variant-specific props

**Solution**: Use proper discriminated union typing
```tsx
// ❌ Incorrect - will cause TypeScript errors
<FlexibleHero 
  variant="about" 
  content={homepageContent} // Wrong prop for about variant
/>

// ✅ Correct - proper variant-specific props
<FlexibleHero 
  variant="about"
  title="About Us"
  subtitle="Our story"
/>
```

### Issue: CSS Classes Not Applied

**Problem**: Tailwind classes not working after migration

**Solution**: Ensure Tailwind config includes new component paths
```js
// tailwind.config.js
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx}', // Include component directory
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  // ...
}
```

### Issue: Error Boundaries Not Catching Errors

**Problem**: Errors not being caught by StandardErrorBoundary

**Solution**: Ensure error boundaries wrap the correct component tree
```tsx
// ❌ Incorrect - error boundary outside async component
<StandardErrorBoundary>
  <Suspense fallback={<LoadingSpinner />}>
    <AsyncComponent />
  </Suspense>
</StandardErrorBoundary>

// ✅ Correct - error boundary inside Suspense
<Suspense fallback={<LoadingSpinner />}>
  <StandardErrorBoundary>
    <AsyncComponent />
  </StandardErrorBoundary>
</Suspense>
```

### Issue: SEO Metadata Not Working

**Problem**: Page metadata not appearing in browser or social media

**Solution**: Verify Next.js App Router metadata configuration
```tsx
// For App Router, use metadata export
export const metadata = {
  title: 'Page Title - NHBEA',
  description: 'Page description',
};

// Or use StandardPageLayout meta prop
<StandardPageLayout
  meta={{
    title: 'Page Title - NHBEA',
    description: 'Page description',
    openGraph: true
  }}
>
```

## 📊 Migration Progress Tracking

### Progress Checklist

Track migration progress across all pages:

| Page | Status | Hero Migrated | Error Boundaries | Loading States | Testing Complete |
|------|--------|---------------|------------------|----------------|------------------|
| Homepage | ✅ Complete | ✅ | ✅ | ✅ | ✅ |
| About | 🚧 In Progress | ⏳ | ⏳ | ⏳ | ⏳ |
| Conference | ⏳ Pending | ❌ | ❌ | ❌ | ❌ |
| Conference Register | ⏳ Pending | ❌ | ❌ | ❌ | ❌ |
| Professional Membership | ⏳ Pending | ❌ | ❌ | ❌ | ❌ |
| Student Membership | ⏳ Pending | ❌ | ❌ | ❌ | ❌ |
| Awards | ⏳ Pending | ❌ | ❌ | ❌ | ❌ |
| Awards Nominate | ⏳ Pending | ❌ | ❌ | ❌ | ❌ |
| Hall of Fame | ⏳ Pending | ❌ | ❌ | ❌ | ❌ |

### Success Metrics

Track these metrics during migration:

- **Bundle Size Impact**: Monitor JavaScript bundle size changes
- **Core Web Vitals**: Measure LCP, FID, and CLS improvements
- **Error Reduction**: Track error rates before/after migration  
- **Loading Performance**: Monitor page load times
- **Accessibility Score**: Use Lighthouse accessibility audits
- **Test Coverage**: Maintain >85% test coverage

## 🎓 Best Practices

### Migration Order
1. **Start with simple pages** (static content)
2. **Move to complex pages** (forms, dynamic content)
3. **Test thoroughly** at each step
4. **Update documentation** as you go

### Code Quality
- **Follow TypeScript patterns** established in standardized components
- **Maintain accessibility compliance** throughout migration
- **Write tests** for migrated components
- **Document any custom implementations**

### Performance
- **Use lazy loading** for non-critical sections
- **Implement proper error boundaries** for robustness
- **Monitor bundle size impact** during migration
- **Optimize images** and assets

### Team Coordination
- **Migrate one page at a time** to avoid conflicts
- **Use feature branches** for each page migration
- **Review migrations** before merging
- **Update team** on progress and issues

## 📚 Resources

### Reference Examples
- **Homepage Migration**: `/src/app/page.tsx` - Complete reference implementation
- **Component Tests**: `/src/__tests__/components/` - Testing patterns
- **Component Documentation**: `/docs/components/` - Usage examples

### Testing Resources
- **Component Test Examples**: See existing test files for patterns
- **Accessibility Testing**: Use jest-axe and manual keyboard testing
- **Performance Testing**: Bundle analyzer and Lighthouse

### Troubleshooting
- **Common Issues**: See troubleshooting guide for solutions
- **TypeScript Help**: Check API reference for proper interfaces
- **Performance Issues**: See performance guide for optimization strategies

---

*This migration guide is part of Story 5.2 - Core Standardized Components Implementation. Update this document as migration patterns evolve.*