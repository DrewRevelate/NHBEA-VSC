# NHBEA Standardized Components Team Onboarding Guide

Welcome to the NHBEA standardized component architecture! This guide helps new team members understand our development workflow and quality assurance processes.

## 🎯 Overview

The standardized component architecture was implemented in Story 5.2 to:
- **Reduce component duplication** by 70-83%
- **Improve development velocity** through reusable patterns
- **Ensure consistent user experience** across all pages
- **Maintain high quality standards** with 85%+ test coverage

## 🚀 Quick Start for New Developers

### 1. Environment Setup

```bash
# Clone the repository
git clone https://github.com/nhbea/website.git
cd nhbea

# Install dependencies
npm install

# Install Playwright browsers for E2E testing
npx playwright install

# Run development server
npm run dev

# Run tests
npm test
```

### 2. Essential Files to Review

**Start with these key files:**
1. `/docs/components/README.md` - Component overview
2. `/src/components/StandardPageLayout.tsx` - Main layout pattern
3. `/src/components/FlexibleHero.tsx` - Hero variant system
4. `/src/app/page.tsx` - Homepage implementation (reference example)

### 3. Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes following standards
# (see Component Development Standards below)

# 3. Run tests
npm test
npm run test:e2e

# 4. Check code quality
npm run lint

# 5. Build to verify
npm run build

# 6. Commit with conventional commits
git commit -m "feat: add new component feature"

# 7. Push and create PR
git push origin feature/your-feature-name
```

## 📋 Component Development Standards

### TypeScript First

All components use TypeScript with strict typing:

```typescript
// ✅ Good - Proper TypeScript interfaces
interface ComponentProps {
  title: string;
  variant: 'primary' | 'secondary';
  onClick?: () => void;
}

// ❌ Bad - Using 'any' type
interface BadProps {
  data: any;
  handler: any;
}
```

### Component Structure Pattern

Follow this standard structure for new components:

```typescript
// ComponentName.tsx
import React from 'react';

// 1. Interface definition
interface ComponentNameProps {
  // Props with JSDoc comments
  /** Component title text */
  title: string;
  /** Optional CSS classes */
  className?: string;
}

// 2. Component implementation
export default function ComponentName({ 
  title, 
  className 
}: ComponentNameProps) {
  return (
    <div 
      className={`base-styles ${className || ''}`}
      data-testid="component-name"
    >
      <h2>{title}</h2>
    </div>
  );
}

// 3. Display name for debugging
ComponentName.displayName = 'ComponentName';
```

### Using Standardized Components

Always use the standardized architecture for new pages:

```typescript
import { StandardPageLayout } from '@/components/StandardPageLayout';
import { FlexibleHero } from '@/components/FlexibleHero';
import { StandardErrorBoundary } from '@/components/StandardErrorBoundary';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';

export default function NewPage() {
  return (
    <StandardPageLayout
      hero={{
        component: FlexibleHero,
        props: { variant: 'about', title: 'Page Title' }
      }}
      meta={{
        title: 'Page Title - NHBEA',
        description: 'Page description'
      }}
    >
      <ResponsiveGrid gap="lg">
        <StandardErrorBoundary>
          {/* Your content here */}
        </StandardErrorBoundary>
      </ResponsiveGrid>
    </StandardPageLayout>
  );
}
```

## 🧪 Testing Requirements

### Test Coverage Standards

All components must maintain:
- **85%+ statement coverage**
- **80%+ branch coverage**
- **85%+ function coverage**
- **85%+ line coverage**

### Writing Tests

Follow the testing pyramid approach:

#### 1. Unit Tests (Most tests)

```typescript
// ComponentName.test.tsx
import { render, screen } from '@testing-library/react';
import ComponentName from '@/components/ComponentName';

describe('ComponentName', () => {
  it('renders with required props', () => {
    render(<ComponentName title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ComponentName title="Test" className="custom-class" />);
    expect(screen.getByTestId('component-name')).toHaveClass('custom-class');
  });
});
```

#### 2. Integration Tests

```typescript
it('integrates with StandardPageLayout', () => {
  render(
    <StandardPageLayout>
      <ComponentName title="Integration Test" />
    </StandardPageLayout>
  );
  
  expect(screen.getByRole('main')).toContainElement(
    screen.getByText('Integration Test')
  );
});
```

#### 3. E2E Tests (Fewer tests)

```typescript
// e2e/component.spec.ts
import { test, expect } from '@playwright/test';

test('component renders on page', async ({ page }) => {
  await page.goto('/page-with-component');
  await expect(page.locator('[data-testid="component-name"]')).toBeVisible();
});
```

### Running Tests

```bash
# Unit tests
npm test

# Unit tests with coverage
npm run test:components

# E2E tests
npm run test:e2e

# Visual regression tests
npm run test:visual

# Accessibility tests
npm run test:accessibility

# Full test suite
npm run test:full-suite
```

## ♿ Accessibility Standards

### WCAG 2.1 AA Compliance

All components must meet accessibility standards:

1. **Semantic HTML**
   ```typescript
   // ✅ Good
   <nav aria-label="Main navigation">
   <main id="main-content">
   <button type="button">
   
   // ❌ Bad
   <div onClick={handleClick}>
   <span className="button">
   ```

2. **ARIA Attributes**
   ```typescript
   <div 
     role="status" 
     aria-live="polite"
     aria-label="Loading content"
   >
   ```

3. **Keyboard Navigation**
   - All interactive elements must be keyboard accessible
   - Visible focus indicators required
   - Logical tab order

4. **Color Contrast**
   - Text must meet WCAG AA contrast ratios
   - Don't rely on color alone for information

### Testing Accessibility

```typescript
// In unit tests
import { axe } from 'jest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(<ComponentName title="Test" />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## 🎨 Design System Integration

### Epic 4 Brand System

Components use the established design tokens:

```css
/* CSS Custom Properties */
--nhbea-royal-blue: #1e40af;
--nhbea-royal-blue-hover: #1e3a8a;
--nhbea-gold: #eab308;
--nhbea-gold-hover: #ca8a04;
```

### Typography Scale

Use the responsive typography utilities:

```typescript
import { responsiveTypography } from '@/components/ResponsiveGrid';

<h1 className={responsiveTypography.heading1}>
  Responsive Heading
</h1>
```

### Spacing System

Follow consistent spacing patterns:
- Small: 1rem (16px)
- Medium: 1.5rem (24px)
- Large: 2rem (32px)
- XLarge: 3rem (48px)

## 📊 Performance Guidelines

### Bundle Size Optimization

1. **Use dynamic imports for heavy components**
   ```typescript
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   ```

2. **Tree-shake unused code**
   ```typescript
   // Import only what you need
   import { specificFunction } from '@/lib/utils';
   ```

3. **Monitor bundle impact**
   ```bash
   npm run build
   # Check .next/analyze for bundle analysis
   ```

### Core Web Vitals Targets

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## 🔄 Code Review Checklist

Before submitting a PR, ensure:

### Component Quality
- [ ] TypeScript interfaces properly defined
- [ ] Props have JSDoc comments
- [ ] Component has displayName
- [ ] Follows naming conventions
- [ ] Uses standardized components where applicable

### Testing
- [ ] Unit tests written with >85% coverage
- [ ] Accessibility tests included
- [ ] E2E tests for critical paths
- [ ] All tests passing

### Accessibility
- [ ] Semantic HTML used
- [ ] ARIA attributes where needed
- [ ] Keyboard navigable
- [ ] Screen reader tested

### Performance
- [ ] No unnecessary re-renders
- [ ] Lazy loading for heavy components
- [ ] Images optimized
- [ ] Bundle size impact checked

### Documentation
- [ ] Component documented with examples
- [ ] Props documented in TypeScript
- [ ] Complex logic commented
- [ ] README updated if needed

## 🚨 Common Pitfalls to Avoid

### 1. Not Using Standardized Components

```typescript
// ❌ Bad - Creating custom layout
<div className="min-h-screen">
  <CustomHero />
  <main>...</main>
</div>

// ✅ Good - Using StandardPageLayout
<StandardPageLayout hero={{ component: FlexibleHero }}>
  ...
</StandardPageLayout>
```

### 2. Ignoring TypeScript Errors

```typescript
// ❌ Bad - Using @ts-ignore
// @ts-ignore
<Component prop={invalidValue} />

// ✅ Good - Fix the type issue
<Component prop={validValue as CorrectType} />
```

### 3. Missing Error Boundaries

```typescript
// ❌ Bad - No error handling
<AsyncComponent />

// ✅ Good - Wrapped with error boundary
<StandardErrorBoundary>
  <AsyncComponent />
</StandardErrorBoundary>
```

### 4. Hardcoding Styles

```typescript
// ❌ Bad - Inline styles
<div style={{ padding: '20px', color: '#1e40af' }}>

// ✅ Good - Using Tailwind classes
<div className="p-5 text-nhbea-royal-blue">
```

## 📚 Learning Resources

### Internal Documentation
1. **[Component Documentation](./README.md)** - Overview of all components
2. **[API Reference](./api-reference.md)** - Detailed prop specifications
3. **[Migration Guide](./migration-guide.md)** - Converting existing pages
4. **[Testing Guide](./testing-guide.md)** - Testing best practices

### External Resources
1. **React Documentation**: https://react.dev
2. **TypeScript Handbook**: https://www.typescriptlang.org/docs/
3. **Testing Library**: https://testing-library.com/
4. **Playwright**: https://playwright.dev/
5. **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

### Getting Help

1. **Check documentation first** - Most answers are in the docs
2. **Review existing code** - Homepage is the reference implementation
3. **Ask the team** - We're here to help!
4. **Create an issue** - For bugs or unclear documentation

## 🎓 Onboarding Checklist

### Week 1: Foundation
- [ ] Environment setup complete
- [ ] Read all component documentation
- [ ] Run and explore the codebase
- [ ] Successfully run all tests
- [ ] Review homepage implementation

### Week 2: Practice
- [ ] Create a test page using StandardPageLayout
- [ ] Implement all FlexibleHero variants
- [ ] Write tests for your test page
- [ ] Fix any linting/TypeScript errors
- [ ] Submit practice PR for review

### Week 3: Contribution
- [ ] Pick up first real ticket
- [ ] Follow development workflow
- [ ] Write comprehensive tests
- [ ] Get code review approval
- [ ] Merge your first contribution!

### Ongoing Learning
- [ ] Participate in code reviews
- [ ] Suggest documentation improvements
- [ ] Share knowledge with team
- [ ] Stay updated on best practices

## 🤝 Team Collaboration

### Communication
- **Daily standups**: Share progress and blockers
- **Code reviews**: Learn from and teach others
- **Documentation**: Keep it updated
- **Questions**: No question is too small

### Git Workflow
1. **Feature branches**: `feature/description`
2. **Conventional commits**: `feat:`, `fix:`, `docs:`, etc.
3. **PR descriptions**: Clear problem/solution format
4. **Code reviews**: Address all feedback

### Quality Culture
- **Test-driven development**: Write tests first when possible
- **Accessibility-first**: Consider all users
- **Performance matters**: Monitor impact
- **Documentation**: Leave code better than you found it

## 🎉 Welcome to the Team!

You're now equipped with everything needed to contribute to the NHBEA standardized components. Remember:

1. **Quality over quantity** - Better to do it right
2. **Ask questions** - We all started somewhere
3. **Share knowledge** - Help others learn
4. **Have fun** - Enjoy building great software!

---

*This onboarding guide is part of the standardized component architecture. Please keep it updated as processes evolve.*