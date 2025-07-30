# Performance Guide

The standardized component architecture was designed with performance as a key consideration. This guide provides strategies for leveraging the architecture to build fast, responsive pages that meet our Core Web Vitals targets.

## 🎯 Performance Targets

- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100 milliseconds
- **Cumulative Layout Shift (CLS)**: < 0.1

## Bundle Size Optimization

The component consolidation effort significantly reduces the baseline JavaScript bundle size. To maintain this, follow these practices:

### Code Splitting with `next/dynamic`

For components that are not visible in the initial viewport (i.e., "below the fold"), use dynamic imports to code-split them into separate chunks. This is especially important for large components or those with heavy dependencies.

The `StandardPageLayout` and `Suspense` integration make this easy.

```tsx
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { LoadingSkeleton } from '@/components/LoadingSpinner';

const NewsletterSignup = dynamic(
  () => import('@/components/NewsletterSignup'),
  { ssr: false, loading: () => <LoadingSkeleton variant="content" /> }
);

export default function HomePage() {
  return (
    <StandardPageLayout /* ... */>
      {/* ... above-the-fold content ... */}
      
      <NewsletterSignup />
    </StandardPageLayout>
  );
}
```

## Core Web Vitals

- **LCP**: The `FlexibleHero` component is optimized for fast rendering. Ensure images used in the hero are appropriately sized and compressed.
- **FID**: The new components are lightweight and have efficient event handlers, minimizing main-thread blocking.
- **CLS**: The `LoadingSkeleton` components are crucial for preventing layout shifts. Use them as fallbacks for any dynamically loaded content to reserve space in the layout.

## Caching

The standardized component structure leads to more consistent HTML output, which improves the effectiveness of caching at the CDN level (Firebase Hosting). Data fetching patterns should continue to use the repository pattern, which has its own caching layer for Firestore data.