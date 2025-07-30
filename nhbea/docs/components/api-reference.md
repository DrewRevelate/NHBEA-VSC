# NHBEA Standardized Components API Reference

Complete TypeScript interface documentation and prop usage patterns for all standardized components.

## 📋 Overview

This reference provides comprehensive API documentation for:
- **StandardPageLayout** - Main page layout component
- **FlexibleHero** - Unified hero system with 6 variants  
- **StandardErrorBoundary** - Error handling and recovery
- **LoadingSpinner & LoadingSkeleton** - Loading state components
- **ResponsiveGrid** - Flexible grid system with utilities

## 🔧 StandardPageLayout API

### Interface Definition

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

### Prop Specifications

#### `children`
- **Type**: `React.ReactNode`
- **Required**: Yes
- **Description**: Main page content to be rendered within the layout
- **Example**: 
```tsx
<StandardPageLayout>
  <div>Your page content</div>
</StandardPageLayout>
```

#### `hero`
- **Type**: `{ component: React.ComponentType<any>, props?: any, variant?: string }`
- **Required**: No
- **Description**: Hero component configuration for page header
- **Properties**:
  - `component`: Hero component to render (typically FlexibleHero)
  - `props`: Props to pass to the hero component
  - `variant`: Hero variant type (optional styling hint)
- **Example**:
```tsx
hero={{
  component: FlexibleHero,
  props: {
    variant: 'home',
    content: homepageContent
  },
  variant: 'default'
}}
```

#### `main`
- **Type**: `{ id?: string, className?: string, focusable?: boolean }`
- **Required**: No
- **Default**: `{ id: 'main-content', focusable: true }`
- **Description**: Main element configuration for accessibility
- **Properties**:
  - `id`: HTML id attribute for skip link targeting
  - `className`: Additional CSS classes for main element
  - `focusable`: Whether main element should be focusable (tabIndex=-1)
- **Example**:
```tsx
main={{
  id: 'custom-main',
  className: 'custom-styles',
  focusable: true
}}
```

#### `meta`
- **Type**: `{ title: string, description: string, openGraph?: boolean, twitterCard?: boolean, structuredData?: any }`
- **Required**: No
- **Description**: SEO metadata configuration
- **Properties**:
  - `title`: Page title for browser tab and SEO
  - `description`: Meta description for search engines and social media
  - `openGraph`: Enable OpenGraph metadata for social media sharing
  - `twitterCard`: Enable Twitter Card metadata
  - `structuredData`: JSON-LD structured data object
- **Example**:
```tsx
meta={{
  title: 'About - NHBEA',
  description: 'Learn about our mission and team',
  openGraph: true,
  twitterCard: true,
  structuredData: {
    "@type": "Organization",
    "name": "NHBEA"
  }
}}
```

#### `loading`
- **Type**: `{ enabled?: boolean, component?: React.ComponentType }`
- **Required**: No
- **Default**: `{ enabled: true }`
- **Description**: Loading state configuration for Suspense boundaries
- **Properties**:
  - `enabled`: Whether to enable Suspense wrapping
  - `component`: Custom loading component (defaults to LoadingSpinner)
- **Example**:
```tsx
loading={{
  enabled: true,
  component: () => <LoadingSpinner variant="page" message="Loading..." />
}}
```

#### `error`
- **Type**: `{ boundary?: boolean, fallback?: React.ComponentType<{error: string}> }`
- **Required**: No
- **Default**: `{ boundary: true }`
- **Description**: Error boundary configuration
- **Properties**:
  - `boundary`: Whether to wrap content with StandardErrorBoundary
  - `fallback`: Custom error fallback component
- **Example**:
```tsx
error={{
  boundary: true,
  fallback: ({ error }) => <div>Custom error: {error}</div>
}}
```

#### `className`
- **Type**: `string`
- **Required**: No
- **Description**: Additional CSS classes for the root wrapper div
- **Example**:
```tsx
className="custom-layout-class"
```

## 🎭 FlexibleHero API

### Base Interface

```typescript
interface FlexibleHeroProps {
  variant: 'home' | 'about' | 'conference' | 'membership' | 'hall-of-fame' | 'awards';
  className?: string;
}
```

### Variant-Specific Interfaces

#### Home Variant

```typescript
interface HomeHeroProps extends FlexibleHeroProps {
  variant: 'home';
  content: HomepageContent;
}

interface HomepageContent {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageURL?: string;
  missionTitle: string;
  missionContent: string;
  aboutTitle: string;
  aboutContent: string;
  aboutImageURL?: string;
}
```

**Usage**:
```tsx
<FlexibleHero
  variant="home"
  content={{
    heroTitle: "NHBEA",
    heroSubtitle: "Promoting business education excellence",
    heroImageURL: "/images/hero.jpg",
    missionTitle: "Our Mission",
    missionContent: "To advance business education...",
    aboutTitle: "About Us",
    aboutContent: "Founded in 1960...",
    aboutImageURL: "/images/about.jpg"
  }}
/>
```

#### About Variant

```typescript
interface AboutHeroProps extends FlexibleHeroProps {
  variant: 'about';
  title?: string;
  subtitle?: string;
  boardCount?: number;
  establishedYear?: number;
}
```

**Usage**:
```tsx
<FlexibleHero
  variant="about"
  title="About NHBEA"
  subtitle="Dedicated to advancing business education"
  boardCount={15}
  establishedYear={1960}
/>
```

#### Conference Variant

```typescript
interface ConferenceHeroProps extends FlexibleHeroProps {
  variant: 'conference';
  conference?: {
    title: string;
    date: string;
    location: string;
    registrationOpen: boolean;
    earlyBirdDeadline?: string;
    theme?: {
      primaryColor: string;
      secondaryColor: string;
    };
  };
}
```

**Usage**:
```tsx
<FlexibleHero
  variant="conference"
  conference={{
    title: "Annual Conference 2024",
    date: "March 15, 2024",
    location: "Manchester, NH",
    registrationOpen: true,
    earlyBirdDeadline: "February 1, 2024",
    theme: {
      primaryColor: "#1e40af",
      secondaryColor: "#1e3a8a"
    }
  }}
/>
```

#### Membership Variant

```typescript
interface MembershipHeroProps extends FlexibleHeroProps {
  variant: 'membership';
  membershipType?: 'professional' | 'student';
  pricing?: {
    amount: number;
    currency: string;
    period: string;
  };
  benefits?: string[];
}
```

**Usage**:
```tsx
<FlexibleHero
  variant="membership"
  membershipType="professional"
  pricing={{
    amount: 50,
    currency: "$",
    period: "year"
  }}
  benefits={[
    "Professional development",
    "Networking events",
    "Career resources"
  ]}
/>
```

#### Hall of Fame Variant

```typescript
interface HallOfFameHeroProps extends FlexibleHeroProps {
  variant: 'hall-of-fame';
  stats?: {
    totalMembers: number;
    latestYear: number;
  };
}
```

**Usage**:
```tsx
<FlexibleHero
  variant="hall-of-fame"
  stats={{
    totalMembers: 150,
    latestYear: 2024
  }}
/>
```

#### Awards Variant

```typescript
interface AwardsHeroProps extends FlexibleHeroProps {
  variant: 'awards';
  nominationDeadline?: string;
  activeAwards?: number;
}
```

**Usage**:
```tsx
<FlexibleHero
  variant="awards"
  nominationDeadline="March 1, 2024"
  activeAwards={5}
/>
```

### Discriminated Union Type

```typescript
type FlexibleHeroProps = 
  | HomeHeroProps 
  | AboutHeroProps 
  | ConferenceHeroProps 
  | MembershipHeroProps 
  | HallOfFameHeroProps 
  | AwardsHeroProps;
```

## 🚨 StandardErrorBoundary API

### Component Interface

```typescript
interface StandardErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: string; retry?: () => void }>;
  onError?: (error: Error, errorInfo: any) => void;
}
```

### Props Specification

#### `children`
- **Type**: `React.ReactNode`
- **Required**: Yes
- **Description**: Components to wrap with error boundary

#### `fallback`
- **Type**: `React.ComponentType<{ error: string; retry?: () => void }>`
- **Required**: No
- **Default**: `StandardErrorFallback`
- **Description**: Custom error fallback component
- **Example**:
```tsx
fallback={({ error, retry }) => (
  <div>
    <p>Custom error: {error}</p>
    {retry && <button onClick={retry}>Retry</button>}
  </div>
)}
```

#### `onError`
- **Type**: `(error: Error, errorInfo: any) => void`
- **Required**: No
- **Description**: Callback function called when error occurs
- **Example**:
```tsx
onError={(error, errorInfo) => {
  console.error('Error caught:', error);
  // Send to monitoring service
}}
```

### StandardErrorFallback Interface

```typescript
interface StandardErrorFallbackProps {
  error: string;
  retry?: () => void;
  variant?: 'page' | 'section' | 'inline';
}
```

**Usage**:
```tsx
<StandardErrorBoundary>
  <ComponentThatMightFail />
</StandardErrorBoundary>
```

## 🔄 LoadingSpinner API

### LoadingSpinner Interface

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'page' | 'section' | 'inline';
  message?: string;
}
```

### Props Specification

#### `size`
- **Type**: `'sm' | 'md' | 'lg' | 'xl'`
- **Required**: No
- **Default**: `'md'`
- **Description**: Spinner size variant
- **Values**:
  - `'sm'`: 16x16px (w-4 h-4)
  - `'md'`: 32x32px (w-8 h-8)  
  - `'lg'`: 48x48px (w-12 h-12)
  - `'xl'`: 64x64px (w-16 h-16)

#### `variant`
- **Type**: `'page' | 'section' | 'inline'`
- **Required**: No
- **Default**: `'section'`
- **Description**: Layout variant for different contexts
- **Values**:
  - `'page'`: Full-height page loading with min-h-screen
  - `'section'`: Section loading with py-12
  - `'inline'`: Inline loading with py-4

#### `message`
- **Type**: `string`
- **Required**: No
- **Description**: Optional loading message displayed below spinner
- **Example**:
```tsx
<LoadingSpinner 
  size="lg" 
  variant="page" 
  message="Loading your data..." 
/>
```

### LoadingSkeleton Interface

```typescript
interface LoadingSkeletonProps {
  variant: 'hero' | 'content' | 'grid' | 'list';
  count?: number;
}
```

### Props Specification

#### `variant`
- **Type**: `'hero' | 'content' | 'grid' | 'list'`
- **Required**: Yes
- **Description**: Skeleton type for different content layouts
- **Values**:
  - `'hero'`: Hero section skeleton with title, subtitle, and buttons
  - `'content'`: Content skeleton with heading and paragraph lines
  - `'grid'`: Grid skeleton with image and text placeholders
  - `'list'`: List skeleton with avatar and text placeholders

#### `count`
- **Type**: `number`
- **Required**: No
- **Default**: `1`
- **Description**: Number of skeleton items to render (for grid and list variants)
- **Example**:
```tsx
<LoadingSkeleton variant="grid" count={6} />
<LoadingSkeleton variant="list" count={4} />
```

## 📐 ResponsiveGrid API

### ResponsiveGrid Interface

```typescript
interface ResponsiveGridProps {
  children: React.ReactNode;
  variant?: 'auto' | 'equal' | 'masonry';
  breakpoints?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  'data-testid'?: string;
}
```

### Props Specification

#### `children`
- **Type**: `React.ReactNode`
- **Required**: Yes
- **Description**: Grid items to be laid out

#### `variant`
- **Type**: `'auto' | 'equal' | 'masonry'`
- **Required**: No
- **Default**: `'auto'`
- **Description**: Grid layout variant (currently all variants use same implementation)

#### `breakpoints`
- **Type**: `{ mobile?: number, tablet?: number, desktop?: number, wide?: number }`
- **Required**: No
- **Default**: `{ mobile: 1, tablet: 2, desktop: 3, wide: 4 }`
- **Description**: Number of columns at each breakpoint
- **Example**:
```tsx
breakpoints={{
  mobile: 1,    // 1 column on mobile (default)
  tablet: 2,    // 2 columns on tablet (768px+)
  desktop: 3,   // 3 columns on desktop (1024px+)
  wide: 4       // 4 columns on wide screens (1440px+)
}}
```

#### `gap`
- **Type**: `'sm' | 'md' | 'lg' | 'xl'`
- **Required**: No
- **Default**: `'md'`
- **Description**: Grid gap size
- **Values**:
  - `'sm'`: 16px (gap-4)
  - `'md'`: 24px (gap-6)
  - `'lg'`: 32px (gap-8)
  - `'xl'`: 48px (gap-12)

### Container Interface

```typescript
interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  'data-testid'?: string;
}
```

### Container Props Specification

#### `size`
- **Type**: `'sm' | 'md' | 'lg' | 'xl' | 'full'`
- **Required**: No
- **Default**: `'lg'`
- **Description**: Maximum width constraint
- **Values**:
  - `'sm'`: max-w-2xl (672px)
  - `'md'`: max-w-4xl (896px)
  - `'lg'`: max-w-6xl (1152px)
  - `'xl'`: max-w-7xl (1280px)
  - `'full'`: max-w-full (no constraint)

#### `padding`
- **Type**: `'sm' | 'md' | 'lg' | 'xl'`
- **Required**: No
- **Default**: `'md'`
- **Description**: Horizontal padding
- **Values**:
  - `'sm'`: px-4
  - `'md'`: px-6 lg:px-8
  - `'lg'`: px-8 lg:px-12
  - `'xl'`: px-12 lg:px-16

### Typography Utilities

```typescript
export const responsiveTypography = {
  heading1: 'text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold',
  heading2: 'text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold',
  heading3: 'text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold',
  heading4: 'text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold',
  body: 'text-base md:text-lg lg:text-xl',
  small: 'text-sm md:text-base lg:text-lg',
  caption: 'text-xs md:text-sm lg:text-base'
};
```

**Usage**:
```tsx
<h1 className={responsiveTypography.heading1}>
  Responsive Heading
</h1>
```

### Breakpoint Utilities

```typescript
export const breakpoints = {
  mobile: {
    min: '320px',
    max: '767px',
    container: 'max-w-sm mx-auto px-4',
    grid: 'grid-cols-1',
    spacing: 'space-y-8'
  },
  tablet: {
    min: '768px', 
    max: '1023px',
    container: 'max-w-4xl mx-auto px-6',
    grid: 'grid-cols-2',
    spacing: 'space-y-12'
  },
  desktop: {
    min: '1024px',
    max: '1439px', 
    container: 'max-w-6xl mx-auto px-8',
    grid: 'grid-cols-3',
    spacing: 'space-y-16'
  },
  wide: {
    min: '1440px',
    container: 'max-w-7xl mx-auto px-8',
    grid: 'grid-cols-4',
    spacing: 'space-y-20'
  }
};
```

## 🔗 Usage Patterns

### Complete Page Example

```typescript
import { StandardPageLayout } from '@/components/StandardPageLayout';
import { FlexibleHero } from '@/components/FlexibleHero';
import { StandardErrorBoundary } from '@/components/StandardErrorBoundary';
import { ResponsiveGrid, Container } from '@/components/ResponsiveGrid';
import { LoadingSpinner, LoadingSkeleton } from '@/components/LoadingSpinner';

interface PageProps {
  data: PageData;
}

export default function ExamplePage({ data }: PageProps) {
  return (
    <StandardPageLayout
      hero={{
        component: FlexibleHero,
        props: {
          variant: 'about' as const,
          title: data.title,
          subtitle: data.subtitle
        }
      }}
      error={{ boundary: true }}
      loading={{ enabled: true }}
      meta={{
        title: `${data.title} - NHBEA`,
        description: data.description,
        openGraph: true,
        twitterCard: true
      }}
    >
      <Container size="lg" padding="md">
        <ResponsiveGrid 
          gap="lg" 
          breakpoints={{ mobile: 1, tablet: 1, desktop: 2, wide: 2 }}
        >
          <StandardErrorBoundary>
            <Suspense fallback={<LoadingSkeleton variant="content" />}>
              <MainContent data={data.content} />
            </Suspense>
          </StandardErrorBoundary>
          
          <StandardErrorBoundary>
            <Suspense fallback={<LoadingSkeleton variant="list" count={3} />}>
              <SidebarContent data={data.sidebar} />
            </Suspense>
          </StandardErrorBoundary>
        </ResponsiveGrid>
      </Container>
    </StandardPageLayout>
  );
}
```

### Type-Safe Variant Handling

```typescript
// Type-safe FlexibleHero usage with discriminated unions
function renderHero(pageType: string, data: any) {
  switch (pageType) {
    case 'home':
      return (
        <FlexibleHero
          variant="home"
          content={data as HomepageContent} // Type assertion safe here
        />
      );
    
    case 'about':
      return (
        <FlexibleHero
          variant="about"
          title={data.title}
          subtitle={data.subtitle}
          // TypeScript ensures only valid props for about variant
        />
      );
    
    default:
      return null;
  }
}
```

### Error Handling Pattern

```typescript
// Comprehensive error handling with custom fallbacks
<StandardErrorBoundary
  onError={(error, errorInfo) => {
    // Log to monitoring service
    console.error('Component error:', error);
    analytics.track('component_error', {
      error: error.message,
      component: errorInfo.componentStack
    });
  }}
  fallback={({ error, retry }) => (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="text-red-800 font-semibold mb-2">
        Something went wrong
      </h3>
      <p className="text-red-700 mb-4">
        {process.env.NODE_ENV === 'development' ? error : 'Please try again'}
      </p>
      {retry && (
        <button 
          onClick={retry}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      )}
    </div>
  )}
>
  <YourComponent />
</StandardErrorBoundary>
```

## 📚 Related Documentation

- **[Component Usage Guide](./README.md)** - Overview and quick start
- **[Migration Guide](./migration-guide.md)** - Step-by-step migration instructions
- **[Testing Guide](./testing-guide.md)** - Testing patterns and examples
- **[Troubleshooting](./troubleshooting.md)** - Common issues and solutions

---

*This API reference reflects the implementation in Story 5.2 - Core Standardized Components. Keep this documentation updated as interfaces evolve.*