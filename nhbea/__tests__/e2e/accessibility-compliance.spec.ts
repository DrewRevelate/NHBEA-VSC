import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility Compliance Tests for Standardized Components
 * 
 * Validates WCAG 2.1 AA compliance for all standardized components
 * implemented in Story 5.2 using axe-core integration.
 */

test.describe('WCAG 2.1 AA Compliance Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Homepage with StandardPageLayout meets WCAG 2.1 AA standards', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('#__next-dev-tools') // Exclude dev tools from scan
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('FlexibleHero component is accessible', async ({ page }) => {
    const hero = page.locator('[data-testid="flexible-hero"]');
    await expect(hero).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[data-testid="flexible-hero"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('StandardPageLayout skip links are accessible', async ({ page }) => {
    // Test skip link functionality
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a[href="#main-content"]');
    
    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeFocused();
      await expect(skipLink).toBeVisible();
      
      // Test skip link navigation
      await skipLink.click();
      const mainContent = page.locator('main#main-content');
      await expect(mainContent).toBeFocused();
    }
  });

  test('Loading states are accessible', async ({ page }) => {
    // Test loading spinner accessibility
    const loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    
    if (await loadingSpinner.count() > 0) {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('[data-testid="loading-spinner"]')
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
      
      // Check for proper ARIA attributes
      await expect(loadingSpinner).toHaveAttribute('role', 'status');
      await expect(loadingSpinner).toHaveAttribute('aria-live', 'polite');
    }
  });

  test('Error boundary fallback is accessible', async ({ page }) => {
    // Test error boundary accessibility if present
    const errorFallback = page.locator('[data-testid="error-boundary-fallback"]');
    
    if (await errorFallback.count() > 0) {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('[data-testid="error-boundary-fallback"]')
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
      
      // Check for proper error announcement
      await expect(errorFallback).toHaveAttribute('role', 'alert');
    }
  });
});

test.describe('Keyboard Navigation Testing', () => {
  test('All interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get all focusable elements
    const focusableElements = await page.locator(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ).all();

    // Test that each element can receive focus
    for (const element of focusableElements) {
      await element.focus();
      await expect(element).toBeFocused();
    }
  });

  test('Tab navigation follows logical order', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Start from the beginning
    await page.keyboard.press('Tab');
    
    const focusedElements: string[] = [];
    
    // Navigate through first 10 focusable elements
    for (let i = 0; i < 10; i++) {
      const focusedElement = page.locator(':focus');
      if (await focusedElement.count() > 0) {
        const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
        const testId = await focusedElement.getAttribute('data-testid') || '';
        focusedElements.push(`${tagName}${testId ? `[${testId}]` : ''}`);
      }
      await page.keyboard.press('Tab');
    }

    // Verify logical tab order (skip link -> navigation -> main content)
    expect(focusedElements[0]).toMatch(/^(a|nav|button)/);
  });

  test('Focus indicators are visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test focus indicators on various interactive elements
    const interactiveElements = await page.locator('button, a[href]').all();
    
    for (const element of interactiveElements.slice(0, 5)) { // Test first 5 elements
      await element.focus();
      
      // Check that focus indicator is visible (outline or custom focus styling)
      const styles = await element.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          outline: computed.outline,
          outlineWidth: computed.outlineWidth,
          boxShadow: computed.boxShadow,
        };
      });
      
      // Should have either outline or box-shadow for focus indication
      const hasFocusIndicator = 
        styles.outline !== 'none' || 
        styles.outlineWidth !== '0px' || 
        styles.boxShadow !== 'none';
      
      expect(hasFocusIndicator).toBeTruthy();
    }
  });
});

test.describe('Screen Reader Compatibility', () => {
  test('Semantic HTML structure is properly implemented', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for proper landmark structure
    const landmarks = {
      main: await page.locator('main').count(),
      nav: await page.locator('nav').count(),
      header: await page.locator('header').count(),
      footer: await page.locator('footer').count(),
    };

    expect(landmarks.main).toBeGreaterThanOrEqual(1);
    expect(landmarks.nav).toBeGreaterThanOrEqual(1);
    expect(landmarks.header).toBeGreaterThanOrEqual(1);

    // Check heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let currentLevel = 0;
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName);
      const level = parseInt(tagName.charAt(1));
      
      // Heading levels should not skip (e.g., h1 -> h3)
      if (currentLevel > 0) {
        expect(level).toBeLessThanOrEqual(currentLevel + 1);
      }
      currentLevel = Math.max(currentLevel, level);
    }
  });

  test('Images have appropriate alt text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['image-alt'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Mobile Accessibility', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('Touch targets meet minimum size requirements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const touchTargets = await page.locator('button, a[href], input').all();
    
    for (const target of touchTargets) {
      const boundingBox = await target.boundingBox();
      if (boundingBox) {
        // WCAG 2.1 AA requires minimum 44x44 CSS pixels for touch targets
        expect(Math.max(boundingBox.width, boundingBox.height)).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('Content is accessible with zoom up to 200%', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Set zoom to 200%
    await page.setViewportSize({ width: 187, height: 333 });
    await page.waitForTimeout(500);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});