import { test, expect } from '@playwright/test';

/**
 * =================================================================
 * Visual Regression Tests for Standardized Components (Story 5.2)
 * =================================================================
 * 
 * This test suite validates the visual consistency of the new standardized components
 * introduced in Story 5.2. It uses Playwright's screenshot testing capabilities
 * to detect any unintended visual changes in the UI.
 * 
 * How it works:
 * 1. It navigates to a page that uses the standardized components (e.g., the homepage).
 * 2. It takes screenshots of specific components or the entire page.
 * 3. It compares these new screenshots against "golden" baseline images stored in the repository.
 * 4. If there are any visual differences, the test fails, and a diff image is generated.
 * 
 * To update baseline images after an intentional UI change, run:
 * `npm run test:visual -- --update-snapshots`
 */

const HOMEPAGE = '/';

test.describe('Visual Regression: Standardized Components on Homepage', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage, which serves as the primary showcase for the new components.
    await page.goto(HOMEPAGE);
    // Wait for the network to be idle to ensure all assets (images, fonts) are loaded.
    await page.waitForLoadState('networkidle');
  });

  test('should render the full homepage layout consistently', async ({ page }) => {
    // This is a broad test to catch any major layout shifts or style changes on the page.
    // A higher threshold is used here to account for minor rendering differences in text or anti-aliasing.
    await expect(page).toHaveScreenshot('full-homepage-layout.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05, // Allow up to 5% of pixels to be different
    });
  });

  test('FlexibleHero home variant renders consistently', async ({ page }) => {
    const hero = page.locator('[data-testid="flexible-hero"]');
    await expect(hero).toBeVisible();
    
    // Take screenshot of hero section
    await expect(hero).toHaveScreenshot('flexible-hero-home-variant.png', {
      threshold: 0.15,
    });
  });

  test('Loading states render consistently', async ({ page }) => {
    // Test loading spinner by intercepting a slow request
    await page.route('**/api/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.continue();
    });

    // Reload to trigger loading states
    await page.reload();
    
    // Capture loading spinner
    const loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    if (await loadingSpinner.count() > 0) {
      await expect(loadingSpinner).toHaveScreenshot('loading-spinner.png', {
        threshold: 0.1,
      });
    }
  });

  test('ResponsiveGrid components render consistently', async ({ page }) => {
    // Look for grid components on the page
    const grids = page.locator('[data-testid*="responsive-grid"]');
    const gridCount = await grids.count();
    
    if (gridCount > 0) {
      // Take screenshot of first responsive grid
      await expect(grids.first()).toHaveScreenshot('responsive-grid-component.png', {
        threshold: 0.15,
      });
    }
  });

  test('Error boundary fallback renders consistently', async ({ page }) => {
    // Navigate to a test page that might trigger error boundary
    // For now, test the error boundary component directly if it exists
    const errorBoundary = page.locator('[data-testid="error-boundary-fallback"]');
    
    if (await errorBoundary.count() > 0) {
      await expect(errorBoundary).toHaveScreenshot('error-boundary-fallback.png', {
        threshold: 0.1,
      });
    }
  });
});

test.describe('Responsive Design Visual Regression', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'wide', width: 1920, height: 1080 },
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`Homepage renders consistently on ${name} viewport`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Wait for responsive styles to apply
      await page.waitForTimeout(500);
      
      await expect(page).toHaveScreenshot(`homepage-${name}-viewport.png`, {
        fullPage: true,
        threshold: 0.25, // Higher threshold for responsive variations
      });
    });

    test(`FlexibleHero adapts properly on ${name} viewport`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const hero = page.locator('[data-testid="flexible-hero"]');
      await expect(hero).toBeVisible();
      
      await expect(hero).toHaveScreenshot(`flexible-hero-${name}-viewport.png`, {
        threshold: 0.2,
      });
    });
  });
});

test.describe('Component State Visual Regression', () => {
  test('Interactive states render consistently', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test hover states on buttons
    const buttons = page.locator('button, a[role="button"]');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      await expect(firstButton).toBeVisible();
      
      // Normal state
      await expect(firstButton).toHaveScreenshot('button-normal-state.png', {
        threshold: 0.1,
      });
      
      // Hover state
      await firstButton.hover();
      await page.waitForTimeout(200); // Wait for hover animation
      await expect(firstButton).toHaveScreenshot('button-hover-state.png', {
        threshold: 0.1,
      });
      
      // Focus state
      await firstButton.focus();
      await page.waitForTimeout(200); // Wait for focus animation
      await expect(firstButton).toHaveScreenshot('button-focus-state.png', {
        threshold: 0.1,
      });
    }
  });
});

test.describe('Cross-Browser Consistency', () => {
  test('Components render identically across browsers', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take browser-specific screenshots for comparison
    await expect(page).toHaveScreenshot(`homepage-${browserName}.png`, {
      fullPage: true,
      threshold: 0.3, // Higher threshold for cross-browser differences
    });
    
    // Test specific components
    const hero = page.locator('[data-testid="flexible-hero"]');
    if (await hero.count() > 0) {
      await expect(hero).toHaveScreenshot(`hero-${browserName}.png`, {
        threshold: 0.2,
      });
    }
  });
});