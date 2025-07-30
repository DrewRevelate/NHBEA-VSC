# Standardized Page Architecture Framework

## Overview

This document defines the standardized page template architecture for the NHBEA website, addressing the structural inconsistencies identified in the site audit. The framework establishes consistent patterns for hero sections, main content areas, error handling, loading states, and responsive breakpoints.

## 1. Standard Page Layout Component

### 1.1 Core Architecture

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

export function StandardPageLayout({
  children,
  hero,
  main = { id: 'main-content', focusable: true },
  meta,
  loading = { enabled: true },
  error = { boundary: true },
  className = 'min-h-screen'
}: StandardPageLayoutProps) {
  return (
    <div className={className}>
      {/* Hero Section */}
      {hero && (
        <hero.component {...hero.props} />
      )}
      
      {/* Main Content */}
      <main 
        id={main.id}
        className={`focus:outline-none ${main.className || ''}`}
        tabIndex={main.focusable ? -1 : undefined}
      >
        {children}
      </main>
    </div>
  );
}
```

### 1.2 Usage Examples

**Homepage Implementation:**
```typescript
export default function HomePage({ content, sponsors }) {
  return (
    <StandardPageLayout
      hero={{
        component: FlexibleHero,
        props: { variant: 'home', content }
      }}
      meta={{
        title: 'NHBEA - New Hampshire Business Educators Association',
        description: content.missionContent,
        openGraph: true,
        twitterCard: true
      }}
    >
      <StatisticsSection />
      <EnhancedMissionSection />
      <SponsorsSection sponsors={sponsors} />
    </StandardPageLayout>
  );
}
```

**Conference Implementation:**
```typescript
export default function ConferencePage({ conference }) {
  return (
    <StandardPageLayout
      hero={{
        component: FlexibleHero,
        props: { variant: 'conference', conference, theme: conference.theme }
      }}
      meta={{
        title: `${conference.title} | NHBEA Conference`,
        description: conference.description,
        openGraph: true,
        twitterCard: true,
        structuredData: generateEventStructuredData(conference)
      }}
      className="min-h-screen"
    >
      <ConferenceAgenda />
      <SpeakersSection />
      <VenueInformation />
    </StandardPageLayout>
  );
}
```

## 2. Flexible Hero Component System

### 2.1 Hero Component Architecture

```typescript
interface FlexibleHeroProps {
  variant: 'home' | 'about' | 'conference' | 'membership' | 'hall-of-fame' | 'awards';
  title?: string;
  subtitle?: string;
  content?: any;
  theme?: ConferenceTheme;
  stats?: {
    totalMembers?: number;
    latestYear?: number;
    [key: string]: any;
  };
  actions?: {
    primary?: {
      text: string;
      href: string;
      external?: boolean;
    };
    secondary?: {
      text: string;
      href: string;
      external?: boolean;
    };
  };
  media?: {
    image?: string;
    video?: string;
    background?: string;
  };
  className?: string;
}

export function FlexibleHero({
  variant,
  title,
  subtitle,
  content,
  theme,
  stats,
  actions,
  media,
  className
}: FlexibleHeroProps) {
  const variants = {
    home: <HomeHeroVariant {...props} />,
    about: <AboutHeroVariant {...props} />,
    conference: <ConferenceHeroVariant {...props} />,
    membership: <MembershipHeroVariant {...props} />,
    'hall-of-fame': <HallOfFameHeroVariant {...props} />,
    awards: <AwardsHeroVariant {...props} />
  };

  return (
    <section className={`relative overflow-hidden ${className || ''}`}>
      {variants[variant]}
    </section>
  );
}
```

### 2.2 Hero Variant Specifications

**Home Hero Variant:**
- Full-width gradient background using royal blue brand colors
- Content-driven with mission statement and key statistics
- Dual CTA buttons (primary membership, secondary learn more)
- Responsive typography scaling

**About Hero Variant:**
- Conservative professional presentation
- Leadership focus with board member highlights
- Single primary CTA to board member section
- Heritage and mission emphasis

**Conference Hero Variant:**
- Dynamic theming support via ConferenceThemeProvider
- Registration availability and pricing display
- Early bird pricing notifications
- Theme-aware gradient backgrounds

**Membership Hero Variant:**
- Form-focused minimal design
- Clear value proposition and pricing
- Professional trust indicators
- Streamlined conversion path

**Hall of Fame Hero Variant:**
- Achievement-focused design with statistics
- Latest induction year highlighting
- Member count and recognition emphasis
- Academic gold accent integration

**Awards Hero Variant:**
- Recognition and achievement theme
- Nomination deadline awareness
- Past winner showcases
- Call-to-action for nominations

### 2.3 Responsive Hero Patterns

```typescript
const heroResponsivePatterns = {
  // Mobile (320px - 768px)
  mobile: {
    padding: 'py-16 px-4',
    typography: {
      title: 'text-3xl md:text-4xl',
      subtitle: 'text-lg md:text-xl'
    },
    layout: 'flex flex-col space-y-6',
    actions: 'flex flex-col space-y-4 w-full'
  },
  
  // Tablet (768px - 1024px)
  tablet: {
    padding: 'py-20 px-6',
    typography: {
      title: 'text-4xl lg:text-5xl',
      subtitle: 'text-xl lg:text-2xl'
    },
    layout: 'grid lg:grid-cols-2 gap-8 items-center',
    actions: 'flex flex-row space-x-4'
  },
  
  // Desktop (1024px+)
  desktop: {
    padding: 'py-24 px-8',
    typography: {
      title: 'text-5xl xl:text-6xl',
      subtitle: 'text-2xl xl:text-3xl'
    },
    layout: 'grid lg:grid-cols-2 gap-12 items-center',
    actions: 'flex flex-row space-x-6'
  }
};
```

## 3. Standardized Error Handling

### 3.1 Unified Error Boundary

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{error: string; retry?: () => void}>;
  onError?: (error: Error, errorInfo: any) => void;
}

export class StandardErrorBoundary extends React.Component<ErrorBoundaryProps> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Page Error:', error);
    this.props.onError?.(error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || StandardErrorFallback;
      return <FallbackComponent error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}
```

### 3.2 Standard Error Fallback Component

```typescript
interface StandardErrorFallbackProps {
  error: string;
  retry?: () => void;
  variant?: 'page' | 'section' | 'inline';
}

export function StandardErrorFallback({
  error,
  retry,
  variant = 'section'
}: StandardErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const variants = {
    page: 'min-h-screen flex items-center justify-center',
    section: 'py-16 px-4',
    inline: 'py-4 px-4'
  };

  return (
    <div className={variants[variant]}>
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {variant === 'page' ? 'Page Unavailable' : 'Content Unavailable'}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {isDevelopment 
            ? `Development Notice: ${error}`
            : 'We apologize for the inconvenience. Please try again.'}
        </p>
        
        {retry && (
          <button
            onClick={retry}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
```

## 4. Consistent Loading States

### 4.1 Standard Loading Spinner

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'page' | 'section' | 'inline';
  message?: string;
}

export function LoadingSpinner({
  size = 'md',
  variant = 'section',
  message
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const variants = {
    page: 'min-h-screen flex items-center justify-center',
    section: 'py-12 flex items-center justify-center',
    inline: 'flex items-center justify-center'
  };

  return (
    <div className={variants[variant]}>
      <div className="text-center">
        <div className={`${sizes[size]} animate-spin rounded-full border-b-2 border-blue-600 mx-auto`}></div>
        {message && (
          <p className="mt-4 text-gray-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
```

### 4.2 Advanced Loading Skeletons

```typescript
interface LoadingSkeletonProps {
  variant: 'hero' | 'content' | 'grid' | 'list';
  count?: number;
}

export function LoadingSkeleton({ variant, count = 1 }: LoadingSkeletonProps) {
  const skeletons = {
    hero: (
      <div className="animate-pulse py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-16 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="flex space-x-4">
            <div className="h-12 bg-gray-200 rounded w-32"></div>
            <div className="h-12 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    ),
    
    content: (
      <div className="animate-pulse py-8">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    ),
    
    grid: (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    ),
    
    list: (
      <div className="space-y-4">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="animate-pulse flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  };

  return <div>{skeletons[variant]}</div>;
}
```

## 5. Responsive Design Standards

### 5.1 Breakpoint System

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

### 5.2 Responsive Typography Scale

```typescript
export const responsiveTypography = {
  heading1: 'text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
  heading2: 'text-2xl md:text-3xl lg:text-4xl xl:text-5xl',
  heading3: 'text-xl md:text-2xl lg:text-3xl xl:text-4xl',
  heading4: 'text-lg md:text-xl lg:text-2xl xl:text-3xl',
  body: 'text-base md:text-lg lg:text-xl',
  small: 'text-sm md:text-base lg:text-lg',
  caption: 'text-xs md:text-sm lg:text-base'
};
```

### 5.3 Layout Grid System

```typescript
interface ResponsiveGridProps {
  children: React.ReactNode;
  variant: 'auto' | 'equal' | 'masonry';
  breakpoints?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

export function ResponsiveGrid({
  children,
  variant = 'auto',
  breakpoints = { mobile: 1, tablet: 2, desktop: 3, wide: 4 },
  gap = 'md'
}: ResponsiveGridProps) {
  const gaps = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };

  const gridCols = `grid-cols-${breakpoints.mobile} md:grid-cols-${breakpoints.tablet} lg:grid-cols-${breakpoints.desktop} xl:grid-cols-${breakpoints.wide}`;

  return (
    <div className={`grid ${gridCols} ${gaps[gap]}`}>
      {children}
    </div>
  );
}
```

## 6. Standard Footer and Navigation Patterns

### 6.1 Page Footer Consistency

```typescript
interface StandardFooterProps {
  variant?: 'default' | 'minimal' | 'newsletter';
  showNewsletter?: boolean;
  customSections?: React.ReactNode;
}

export function StandardFooter({
  variant = 'default',
  showNewsletter = true,
  customSections
}: StandardFooterProps) {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-blue-900 text-white">
      {showNewsletter && variant !== 'minimal' && (
        <NewsletterSignup />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FooterContent variant={variant} />
        {customSections}
      </div>
      
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <FooterCopyright />
        </div>
      </div>
    </footer>
  );
}
```

### 6.2 Navigation Accessibility Standards

```typescript
interface NavigationProps {
  variant: 'primary' | 'secondary' | 'breadcrumb';
  items: NavigationItem[];
  currentPath?: string;
}

export function StandardNavigation({
  variant,
  items,
  currentPath
}: NavigationProps) {
  return (
    <nav
      role="navigation"
      aria-label={`${variant} navigation`}
      className={getNavigationStyles(variant)}
    >
      <ul className="flex space-x-4">
        {items.map((item, index) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`${getItemStyles(variant)} ${
                currentPath === item.href ? 'aria-current-page' : ''
              }`}
              aria-current={currentPath === item.href ? 'page' : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

## 7. Migration Strategy

### 7.1 Phase 1: Core Components
1. Create `StandardPageLayout` component
2. Implement `FlexibleHero` system
3. Develop shared `ErrorFallback` and `LoadingSpinner`

### 7.2 Phase 2: Page Migrations
1. Convert homepage to use standardized components
2. Migrate about page with enhanced metadata
3. Update conference page with new architecture
4. Standardize membership pages
5. Enhance hall-of-fame page structure

### 7.3 Phase 3: Testing and Optimization
1. Comprehensive accessibility testing
2. Performance validation
3. Cross-browser compatibility verification
4. SEO impact assessment

## 8. Benefits and Expected Outcomes

**Development Benefits:**
- 80% reduction in duplicate page structure code
- Consistent development patterns across all pages
- Faster new page development with standardized templates
- Easier maintenance and updates

**User Experience Benefits:**
- Consistent navigation and interaction patterns
- Improved accessibility across all pages
- Faster loading times through optimized components
- Better SEO performance with standardized metadata

**Technical Benefits:**
- Reduced bundle size through component consolidation
- Better TypeScript support with standardized interfaces
- Improved error handling and user feedback
- Enhanced responsive design consistency

This standardized architecture provides a solid foundation for consistent, maintainable, and scalable page development across the NHBEA website.