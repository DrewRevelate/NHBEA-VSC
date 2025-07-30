# FlexibleHero Component

The `FlexibleHero` component is a unified hero system that replaces 6 individual hero components with a single, variant-based implementation. It supports all page types while maintaining brand consistency and Epic 4 design system integration.

## 📋 Overview

- **File**: `/src/components/FlexibleHero.tsx`
- **Lines**: 408 lines
- **Purpose**: Unified hero system with 6 distinct variants
- **Achievement**: 83% component reduction (6 → 1 with variants)

## 🎯 Key Features

### ✅ Variant-Based Architecture
- **6 distinct variants**: home, about, conference, membership, hall-of-fame, awards
- **TypeScript discriminated unions** for type-safe variant-specific props
- **Consistent visual design** across all variants

### ✅ Brand Integration
- **Epic 4 design system** compliance with CSS custom properties
- **Royal blue gradients** consistently applied
- **60-30-10 color rule** maintained across variants
- **Inter + Georgia typography** hierarchy preserved

### ✅ Responsive Design
- **Mobile-first approach** with progressive enhancement
- **Consistent breakpoints** (320px, 768px, 1024px, 1440px+)
- **Touch-optimized** interaction patterns
- **Accessibility-first** design principles

## 📖 API Reference

### Base Props Interface

```typescript
interface FlexibleHeroProps {
  variant: 'home' | 'about' | 'conference' | 'membership' | 'hall-of-fame' | 'awards';
  className?: string;
}
```

### Variant-Specific Props

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

#### Awards Variant
```typescript
interface AwardsHeroProps extends FlexibleHeroProps {
  variant: 'awards';
  nominationDeadline?: string;
  activeAwards?: number;
}
```

## 💡 Usage Examples

### Home Variant

```tsx
import { FlexibleHero } from '@/components/FlexibleHero';

export default function HomePage({ content }) {
  return (
    <FlexibleHero
      variant="home"
      content={{
        heroTitle: "New Hampshire Business Educators Association",
        heroSubtitle: "Promoting excellence in business education throughout New Hampshire",
        heroImageURL: "/images/nhbea-educators.jpg",
        missionTitle: "Our Mission",
        missionContent: "To advance business education through professional development...",
        aboutTitle: "About NHBEA",
        aboutContent: "Founded in 1960, NHBEA serves business educators...",
        aboutImageURL: "/images/about-nhbea.jpg"
      }}
    />
  );
}
```

### About Variant

```tsx
import { FlexibleHero } from '@/components/FlexibleHero';

export default function AboutPage() {
  return (
    <FlexibleHero
      variant="about"
      title="About NHBEA"
      subtitle="Dedicated to advancing business education throughout New Hampshire since 1960"
      boardCount={15}
      establishedYear={1960}
    />
  );
}
```

### Conference Variant

```tsx
import { FlexibleHero } from '@/components/FlexibleHero';

export default function ConferencePage({ conference }) {
  return (
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
  );
}
```

### Membership Variant

```tsx
import { FlexibleHero } from '@/components/FlexibleHero';

export default function MembershipPage() {
  return (
    <FlexibleHero
      variant="membership"
      membershipType="professional"
      pricing={{
        amount: 50,
        currency: "$",
        period: "year"
      }}
      benefits={[
        "Professional development opportunities",
        "Networking events",
        "Career advancement resources",
        "Access to industry publications"
      ]}
    />
  );
}
```

### Hall of Fame Variant

```tsx
import { FlexibleHero } from '@/components/FlexibleHero';

export default function HallOfFamePage() {
  return (
    <FlexibleHero
      variant="hall-of-fame"
      stats={{
        totalMembers: 150,
        latestYear: 2024
      }}
    />
  );
}
```

### Awards Variant

```tsx
import { FlexibleHero } from '@/components/FlexibleHero';

export default function AwardsPage() {
  return (
    <FlexibleHero
      variant="awards"
      nominationDeadline="March 1, 2024"
      activeAwards={5}
    />
  );
}
```

## 🎨 Visual Design Patterns

### Home Variant Features
- **Full-width gradient background** with royal blue theme
- **Mission content integration** with dual CTA buttons
- **Value propositions grid** with Professional Development, Networking, Career Growth
- **Hero image support** with responsive optimization
- **Dual call-to-action** buttons for membership and events

### About Variant Features
- **Professional presentation** with leadership focus
- **Board member statistics** with dynamic counts
- **Established year highlighting** for credibility
- **Clean typography hierarchy** with consistent spacing

### Conference Variant Features
- **Dynamic theming support** with custom color schemes
- **Registration availability display** with status indicators
- **Early bird pricing notifications** with deadline awareness
- **Event details integration** (date, location, theme)

### Membership Variant Features
- **Form-focused design** optimized for conversion
- **Value proposition display** with pricing emphasis
- **Benefits list integration** with clear typography
- **Professional trust indicators** and credibility elements

### Hall of Fame Variant Features
- **Achievement focus** with statistics display
- **Latest induction year highlighting** for currency
- **Honor and recognition theme** with appropriate styling
- **Statistics cards** for member counts and years

### Awards Variant Features
- **Recognition theme** with award-focused messaging
- **Nomination deadline awareness** with countdown elements
- **Past winner showcases** integration ready
- **Award categories display** with active counts

## 🔧 Implementation Details

### TypeScript Discriminated Unions

```typescript
type FlexibleHeroProps = 
  | HomeHeroProps 
  | AboutHeroProps 
  | ConferenceHeroProps 
  | MembershipHeroProps 
  | HallOfFameHeroProps 
  | AwardsHeroProps;

export function FlexibleHero(props: FlexibleHeroProps) {
  switch (props.variant) {
    case 'home':
      return <HomeHeroVariant {...props} />;
    case 'about':
      return <AboutHeroVariant {...props} />;
    case 'conference':
      return <ConferenceHeroVariant {...props} />;
    case 'membership':
      return <MembershipHeroVariant {...props} />;
    case 'hall-of-fame':
      return <HallOfFameHeroVariant {...props} />;
    case 'awards':
      return <AwardsHeroVariant {...props} />;
    default:
      return null;
  }
}
```

### Brand System Integration

```tsx
// Epic 4 Design Token Usage
const gradientBackground = "bg-gradient-to-br from-[var(--nhbea-royal-blue)] via-[var(--nhbea-royal-blue-dark)] to-[var(--nhbea-royal-blue-deeper)]";

const ctaButtonPrimary = "bg-[var(--nhbea-accent-orange)] hover:bg-[var(--nhbea-accent-orange-dark)]";

const ctaButtonSecondary = "bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:bg-white/30";
```

### Responsive Breakpoint System

```tsx
const responsiveClasses = {
  title: "text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold",
  subtitle: "text-xl md:text-2xl max-w-4xl mx-auto text-white/90",
  container: "container mx-auto px-6 lg:px-8",
  grid: "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
};
```

## 🧪 Testing

### Test Coverage
- **19 test cases** covering all variants and functionality
- **Accessibility testing** with ARIA attribute validation
- **Responsive behavior testing** across breakpoints
- **Visual consistency validation** for brand compliance

### Key Test Scenarios

```typescript
describe('FlexibleHero', () => {
  describe('Home Hero Variant', () => {
    it('renders home hero correctly');
    it('renders value propositions');
    it('renders call-to-action buttons');
    it('renders hero image when provided');
    it('does not render hero image when not provided');
  });

  describe('About Hero Variant', () => {
    it('renders about hero correctly');
    it('renders default content when props not provided');
  });

  describe('Conference Hero Variant', () => {
    it('renders conference hero correctly');
    it('renders registration button when registration is open');
    it('does not render registration button when registration is closed');
  });

  // Additional variant tests...

  describe('Accessibility', () => {
    it('has proper ARIA attributes');
    it('has semantic HTML structure');
  });

  describe('Custom styling', () => {
    it('applies custom className');
  });
});
```

## ⚡ Performance Considerations

### Bundle Impact
- **Single component** replaces 6 individual hero components
- **Variant-based rendering** eliminates unused code paths
- **Optimized imports** with tree-shaking support
- **Lazy loading ready** for non-critical variants

### Image Optimization
- **Next.js Image component** integration for automatic optimization
- **Priority loading** for above-the-fold hero images
- **Responsive image handling** with proper srcset generation
- **Lazy loading** for non-critical hero images

### Performance Metrics
- **83% component reduction** (6 → 1) significantly reduces bundle size
- **Consistent caching** through unified component architecture
- **Better Core Web Vitals** with optimized image and content loading

## 🚨 Common Issues & Solutions

### Issue: Variant-specific props not typed correctly
**Solution**: Use discriminated unions properly and ensure TypeScript strict mode is enabled.

### Issue: Brand colors not displaying correctly
**Solution**: Verify CSS custom properties are defined in your global styles and Epic 4 design tokens are loaded.

### Issue: Hero image not loading
**Solution**: Check image paths and ensure Next.js Image component configuration is correct.

### Issue: Responsive layout breaking on mobile
**Solution**: Verify mobile-first CSS classes and test on actual devices, not just browser resize.

### Issue: CTA buttons not styled correctly
**Solution**: Ensure Tailwind classes are not being purged and hover states are properly defined.

## 🔄 Migration Guide

### From Individual Hero Components

**Before** (6 separate components):
```tsx
// Different files for each page type
import HeroSection from '@/components/HeroSection';
import AboutHeroSection from '@/components/AboutHeroSection';
import ConferenceHeroSection from '@/components/ConferenceHeroSection';
// ... etc
```

**After** (Single flexible component):
```tsx
import { FlexibleHero } from '@/components/FlexibleHero';

// Use variant prop to specify hero type
<FlexibleHero variant="home" content={content} />
<FlexibleHero variant="about" title="About Us" />
<FlexibleHero variant="conference" conference={conferenceData} />
```

### Migration Steps

1. **Identify current hero component** on the page
2. **Determine appropriate variant** based on page type
3. **Map existing props** to new variant-specific props
4. **Replace component import** with FlexibleHero
5. **Update JSX** to use variant prop
6. **Test functionality** and visual consistency
7. **Remove old hero component** file after verification

### Homepage Migration Example

**Before**:
```tsx
import HeroSection from '@/components/HeroSection';

return (
  <div className="min-h-screen">
    <HeroSection content={safeContent} />
    {/* ... */}
  </div>
);
```

**After**:
```tsx
import { StandardPageLayout } from '@/components/StandardPageLayout';
import { FlexibleHero } from '@/components/FlexibleHero';

return (
  <StandardPageLayout
    hero={{
      component: FlexibleHero,
      props: {
        variant: 'home' as const,
        content: safeContent
      }
    }}
  >
    {/* ... */}
  </StandardPageLayout>
);
```

## 📊 Component Consolidation Benefits

### Before Standardization
- **6 separate hero components** with duplicate code
- **Inconsistent styling** across page types
- **Maintenance overhead** for multiple components
- **Bundle size impact** from duplicate logic

### After Standardization
- **Single FlexibleHero component** with variants
- **Consistent brand application** across all pages
- **Centralized maintenance** and updates
- **Reduced bundle size** through code consolidation

### Metrics
- **83% reduction** in hero component count
- **Consistent Epic 4 integration** across all variants
- **TypeScript type safety** with discriminated unions
- **Improved developer experience** with unified API

## 📚 Related Components

- **[StandardPageLayout](./StandardPageLayout.md)** - Main layout component that integrates FlexibleHero
- **[StandardErrorBoundary](./StandardErrorBoundary.md)** - Error handling for hero component failures
- **[LoadingSpinner](./LoadingComponents.md)** - Loading states during hero content loading
- **[ResponsiveGrid](./ResponsiveGrid.md)** - Content layout below hero sections

---

*For complete implementation examples, see the homepage migration in `/src/app/page.tsx` and component tests in `/src/__tests__/components/FlexibleHero.test.tsx`*