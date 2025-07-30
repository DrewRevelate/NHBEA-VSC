# Testing Guide for Standardized Components

This guide outlines best practices and procedures for testing pages and components built with the new standardized architecture. Our testing strategy relies on Jest and React Testing Library for unit/integration tests, with plans to add Playwright for E2E/visual tests and axe-core for accessibility.

## 🎯 Core Principles

- **High Coverage**: Aim for 85%+ test coverage for all new components and pages.
- **User-Centric Tests**: Write tests that simulate user interactions and verify the rendered output, rather than testing implementation details.
- **Accessibility First**: Integrate accessibility checks into your testing workflow.

## Unit Testing Components

When testing a component that uses the standardized architecture, focus on what the user sees and interacts with.

### Testing a Page Built with `StandardPageLayout`

You don't need to test the internals of `StandardPageLayout`. Instead, verify that your page correctly passes props to it and renders its own content.

```tsx
// /src/__tests__/pages/AboutPage.test.tsx
import { render, screen } from '@testing-library/react';
import AboutPage from '@/app/about/page';

// Mock child components to isolate the test
jest.mock('@/components/FlexibleHero', () => ({ FlexibleHero: () => <div>Mocked Hero</div> }));
jest.mock('@/components/BoardMembersSection', () => () => <div>Board Members</div>);

describe('AboutPage', () => {
  it('renders the hero with the correct title', () => {
    render(<AboutPage />);
    // This implicitly tests that the correct props were passed to StandardPageLayout > FlexibleHero
    expect(screen.getByText('Mocked Hero')).toBeInTheDocument();
  });

  it('renders the main content sections', () => {
    render(<AboutPage />);
    expect(screen.getByText('Board Members')).toBeInTheDocument();
  });
});
```

### Testing Error and Loading States

Use React Testing Library's `waitFor` and `findBy` queries to test asynchronous operations and the resulting UI states.

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StandardErrorBoundary } from '@/components/StandardErrorBoundary';

function FailingComponent() {
  throw new Error('Test Error');
}

it('displays a fallback UI when a child component throws an error', () => {
  // Silence console.error for this test
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <StandardErrorBoundary>
      <FailingComponent />
    </StandardErrorBoundary>
  );

  // Check that the fallback UI is rendered
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();

  consoleErrorSpy.mockRestore();
});
```

## Accessibility Testing

Accessibility testing is now automated in our CI/CD pipeline using Playwright and `axe-core`. The `__tests__/e2e/accessibility-compliance.spec.ts` suite runs on every pull request to check for WCAG 2.1 AA violations.

To run these tests locally:
```bash
npx playwright test __tests__/e2e/accessibility-compliance.spec.ts
```

## Visual Regression Testing

Visual snapshot tests are now integrated using Playwright. These tests capture screenshots of components and pages and compare them against baseline images to detect unintended UI changes.

The process involves:
1. Taking baseline screenshots of components and pages.
2. On each pull request, taking new screenshots and comparing them to the baseline.
3. Flagging any visual differences for manual review.

To run the tests locally:
```bash
npx playwright test __tests__/e2e/component-visual-regression.spec.ts
```

To update the baseline snapshots after an intentional design change, run:
```bash
npx playwright test __tests__/e2e/component-visual-regression.spec.ts --update-snapshots
```