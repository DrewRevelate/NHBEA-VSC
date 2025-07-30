# StandardPageLayout Component

The `StandardPageLayout` component is the foundational layout component for all pages in the NHBEA application. It provides consistent structure, hero integration, error handling, loading states, and accessibility features.

## 📋 Overview

- **File**: `/src/components/StandardPageLayout.tsx`
- **Lines**: 125 lines
- **Purpose**: Unified page structure with hero integration and error boundaries
- **Usage**: Replace page-level layout code with standardized component

## 🎯 Key Features

### ✅ Consistent Structure
- Semantic HTML with proper landmark usage
- Skip link for accessibility
- Main content area with focus management
- Flexible hero integration system

### ✅ Error Handling Integration
- Optional StandardErrorBoundary wrapper
- Consistent error fallback strategies
- Development vs production error display

### ✅ Loading State Management
- Suspense integration for code splitting
- Custom loading component support
- Consistent loading placement

### ✅ SEO & Metadata
- Built-in metadata configuration
- OpenGraph and Twitter Card support
- Structured data integration ready

## 📖 API Reference

### Props Interface

```typescript
interface StandardPageLayoutProps {
  children: React.ReactNode;
  hero?: {
    component: React.ComponentType<any>;
    props?: any;
    variant?: 'default' | 'minimal' | 'conference' | 'form';
  };
  main?: {
    id?: string;
    className?: string;
    focusable?: boolean;
  };
  meta?: {
    title: string;
    description: string;
    openGraph?: boolean;
    twitterCard?: boolean;
    structuredData?: any;
  };
  loading?: {
    enabled?: boolean;
    component?: React.ComponentType;
  };
  error?: {
    boundary?: boolean;
    fallback?: React.ComponentType<{error: string}>;
  };
  className?: string;
}
```

### Prop Details

#### `children` (required)
- **Type**: `React.ReactNode`
- **Description**: Main page content to be rendered within the layout

#### `hero` (optional)
- **Type**: `{ component, props?, variant? }`
- **Description**: Hero component configuration
- **Example**:
```tsx
hero={{
  component: FlexibleHero,
  props: {
    variant: 'home',
    content: homepageContent
  }
}}
```

#### `main` (optional)
- **Type**: `{ id?, className?, focusable? }`
- **Default**: `{ id: 'main-content', focusable: true }`
- **Description**: Main element configuration for accessibility
- **Example**:
```tsx
main={{
  id: 'custom-main',
  className: 'custom-main-styles',
  focusable: false
}}
```

#### `meta` (optional)
- **Type**: `{ title, description, openGraph?, twitterCard?, structuredData? }`
- **Description**: SEO metadata configuration
- **Example**:
```tsx
meta={{
  title: 'About Us - NHBEA',
  description: 'Learn about our mission and team',
  openGraph: true,
  twitterCard: true
}}
```

#### `loading` (optional)
- **Type**: `{ enabled?, component? }`
- **Default**: `{ enabled: true }`
- **Description**: Loading state configuration
- **Example**:
```tsx
loading={{
  enabled: true,
  component: CustomLoadingSpinner
}}
```

#### `error` (optional)
- **Type**: `{ boundary?, fallback? }`
- **Default**: `{ boundary: true }`
- **Description**: Error boundary configuration
- **Example**:
```tsx
error={{
  boundary: true,
  fallback: CustomErrorFallback
}}
```

## 💡 Usage Examples

### Basic Usage

```tsx
import { StandardPageLayout } from '@/components/StandardPageLayout';

export default function BasicPage() {
  return (
    <StandardPageLayout
      meta={{
        title: 'Basic Page - NHBEA',
        description: 'A basic page example'
      }}
    >
      <div className="container mx-auto px-6 py-12">
        <h1>Page Content</h1>
        <p>Your page content goes here.</p>
      </div>
    </StandardPageLayout>
  );
}
```

### With Hero Component

```tsx
import { StandardPageLayout } from '@/components/StandardPageLayout';
import { FlexibleHero } from '@/components/FlexibleHero';

export default function HeroPage() {
  return (
    <StandardPageLayout
      hero={{
        component: FlexibleHero,
        props: {
          variant: 'about',
          title: 'About Our Organization',
          subtitle: 'Leading business education in New Hampshire'
        }
      }}
      meta={{
        title: 'About - NHBEA',
        description: 'Learn about NHBEA mission and values',
        openGraph: true
      }}
    >
      <main className="container mx-auto px-6 py-12">
        {/* Page content */}
      </main>
    </StandardPageLayout>
  );
}
```

### With Error Boundaries and Loading

```tsx
import { StandardPageLayout } from '@/components/StandardPageLayout';
import { FlexibleHero } from '@/components/FlexibleHero';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function FullFeaturedPage() {
  return (
    <StandardPageLayout
      hero={{
        component: FlexibleHero,
        props: { variant: 'conference' }
      }}
      error={{ 
        boundary: true 
      }}
      loading={{ 
        enabled: true,
        component: () => <LoadingSpinner variant="page" message="Loading page..." />
      }}
      meta={{
        title: 'Conference - NHBEA',
        description: 'Annual conference information and registration',
        openGraph: true,
        twitterCard: true
      }}
    >
      {/* Page content with error boundaries */}
    </StandardPageLayout>
  );
}
```

### Homepage Implementation Example

```tsx
// Based on actual homepage migration
import { StandardPageLayout } from '@/components/StandardPageLayout';
import { FlexibleHero } from '@/components/FlexibleHero';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { StandardErrorBoundary } from '@/components/StandardErrorBoundary';

export default function Homepage({ content, sponsors }) {
  return (
    <StandardPageLayout
      hero={{
        component: FlexibleHero,
        props: {
          variant: 'home' as const,
          content: content
        }
      }}
      error={{ boundary: true }}
      loading={{ enabled: true }}
      meta={{
        title: 'New Hampshire Business Educators Association - NHBEA',
        description: content.heroSubtitle || 'Promoting excellence in business education...',
        openGraph: true,
        twitterCard: true
      }}
    >
      <ResponsiveGrid gap="lg" className="space-y-16">
        <StandardErrorBoundary>
          <StatisticsSection />
        </StandardErrorBoundary>
        
        <StandardErrorBoundary>
          <EnhancedMissionSection
            title={content.missionTitle}
            content={content.missionContent}
          />
        </StandardErrorBoundary>
        
        {/* Additional sections... */}
      </ResponsiveGrid>
    </StandardPageLayout>
  );
}
```

## 🔧 Implementation Details

### HTML Structure

```html
<div className={className}>
  <!-- Skip Link -->
  <a href="#main-content" className="sr-only focus:not-sr-only...">
    Skip to main content
  </a>
  
  <!-- Hero Section (if provided) -->
  {hero && <HeroComponent {...hero.props} />}
  
  <!-- Main Content -->
  <main id="main-content" tabIndex="-1" aria-label="Main content">
    {/* Error Boundary Wrapper (if enabled) */}
    {/* Suspense Wrapper (if loading enabled) */}
    {children}
  </main>
</div>
```

### Accessibility Features

- **Skip Link**: Allows keyboard users to skip to main content
- **ARIA Landmarks**: Proper main landmark with aria-label
- **Focus Management**: Main content is focusable for screen readers
- **Semantic HTML**: Uses proper HTML5 semantic elements

### SEO Integration

- **Title Management**: Integrates with Next.js head management
- **Meta Descriptions**: Configurable page descriptions
- **OpenGraph Support**: Social media sharing optimization
- **Twitter Cards**: Twitter-specific metadata
- **Structured Data**: Ready for JSON-LD integration

## 🧪 Testing

### Test Coverage
- **11 test cases** covering all major functionality
- **Accessibility testing** with screen reader simulation
- **Prop validation** with TypeScript interface testing
- **Error boundary integration** testing

### Key Test Scenarios

```typescript
describe('StandardPageLayout', () => {
  it('renders children correctly');
  it('renders with default main element configuration');
  it('renders with custom main element configuration');
  it('renders skip link with correct href');
  it('renders hero component when provided');
  it('applies custom className');
  it('wraps content with error boundary when enabled');
  it('does not wrap content with error boundary when disabled');
  it('renders with loading disabled');
  it('has proper accessibility structure');
});
```

## ⚡ Performance Considerations

### Bundle Impact
- **Minimal overhead**: Core layout logic with optional features
- **Tree-shakable**: Unused features are eliminated in builds
- **Lazy loading ready**: Supports Suspense for code splitting

### Loading Optimization
- **Conditional error boundaries**: Only loads when needed
- **Flexible hero loading**: Heroes can be lazy-loaded
- **Metadata efficiency**: Only renders required meta tags

## 🚨 Common Issues & Solutions

### Issue: Skip link not working
**Solution**: Ensure the main element has the correct ID that matches the skip link href.

### Issue: Hero component not rendering
**Solution**: Verify the hero component is properly imported and props are correctly typed.

### Issue: Metadata not appearing
**Solution**: Check that Next.js Head management is properly configured in your app.

### Issue: Error boundary not catching errors
**Solution**: Ensure error boundary is enabled with `error={{ boundary: true }}`.

## 🔄 Migration Guide

### From Custom Layout Components

**Before**:
```tsx
export default function OldPage() {
  return (
    <div className="min-h-screen">
      <HeroSection content={content} />
      <main id="main-content" className="focus:outline-none" tabIndex={-1}>
        {/* content */}
      </main>
    </div>
  );
}
```

**After**:
```tsx
export default function NewPage() {
  return (
    <StandardPageLayout
      hero={{ component: FlexibleHero, props: { variant: 'home', content } }}
      meta={{ title: 'Page Title', description: 'Page description' }}
    >
      {/* content */}
    </StandardPageLayout>
  );
}
```

### Migration Checklist

- [ ] Replace custom layout wrapper with StandardPageLayout
- [ ] Move hero component to hero prop configuration
- [ ] Add metadata configuration for SEO
- [ ] Enable error boundaries for better error handling
- [ ] Configure loading states for better UX
- [ ] Test accessibility with keyboard navigation
- [ ] Verify error handling works correctly
- [ ] Check performance impact with bundle analyzer

## 📚 Related Components

- **[FlexibleHero](./FlexibleHero.md)** - Hero component variants for different page types
- **[StandardErrorBoundary](./StandardErrorBoundary.md)** - Error handling and recovery
- **[LoadingSpinner](./LoadingComponents.md)** - Loading state components
- **[ResponsiveGrid](./ResponsiveGrid.md)** - Content layout and spacing

---

*For more examples, see the homepage implementation in `/src/app/page.tsx`*