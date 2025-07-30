import {
  establishVisualBaselines,
  runVisualRegressionTests,
  compareAgainstBaseline,
  testBrandColorAccuracy,
  createVisualDiffReport,
  setupAutomatedVisualTesting,
  VISUAL_TEST_PAGES,
  COMPONENT_REGRESSION_TESTS
} from '../../lib/visualRegressionTesting';

describe('Visual Regression Testing Suite', () => {
  describe('Visual Baseline Management', () => {
    test('should establish visual baselines for all pages and components', async () => {
      const baselines = await establishVisualBaselines();
      
      expect(Array.isArray(baselines)).toBe(true);
      expect(baselines.length).toBeGreaterThan(0);
      
      baselines.forEach(baseline => {
        expect(baseline.id).toBeDefined();
        expect(baseline.name).toBeDefined();
        expect(baseline.url).toBeDefined();
        expect(baseline.viewport.width).toBeGreaterThan(0);
        expect(baseline.viewport.height).toBeGreaterThan(0);
        expect(baseline.screenshot.path).toBeDefined();
        expect(baseline.screenshot.hash).toBeDefined();
        expect(baseline.screenshot.timestamp).toBeDefined();
      });
    });

    test('should create baselines for different viewport sizes', async () => {
      const baselines = await establishVisualBaselines();
      
      // Should have baselines for different viewport sizes
      const mobileBaselines = baselines.filter(b => b.viewport.width <= 768);
      const tabletBaselines = baselines.filter(b => b.viewport.width > 768 && b.viewport.width <= 1024);
      const desktopBaselines = baselines.filter(b => b.viewport.width > 1024);
      
      expect(mobileBaselines.length).toBeGreaterThan(0);
      expect(desktopBaselines.length).toBeGreaterThan(0);
    });

    test('should include brand element tracking in baselines', async () => {
      const baselines = await establishVisualBaselines();
      
      // Should have baselines with brand element tracking
      const brandBaselines = baselines.filter(b => 
        b.brandElements && Object.keys(b.brandElements).length > 0
      );
      
      expect(brandBaselines.length).toBeGreaterThan(0);
      
      brandBaselines.forEach(baseline => {
        const elements = baseline.brandElements;
        if (elements) {
          expect(typeof elements.heroSection === 'boolean' || elements.heroSection === undefined).toBe(true);
          expect(typeof elements.navigation === 'boolean' || elements.navigation === undefined).toBe(true);
          expect(typeof elements.buttons === 'boolean' || elements.buttons === undefined).toBe(true);
          expect(typeof elements.forms === 'boolean' || elements.forms === undefined).toBe(true);
          expect(typeof elements.cards === 'boolean' || elements.cards === undefined).toBe(true);
        }
      });
    });
  });

  describe('Visual Regression Testing', () => {
    test('should run visual regression tests against baselines', async () => {
      const baselines = await establishVisualBaselines();
      const results = await runVisualRegressionTests(baselines.slice(0, 3)); // Test first 3 for performance
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(3);
      
      results.forEach(result => {
        expect(result.testId).toBeDefined();
        expect(result.testName).toBeDefined();
        expect(result.url).toBeDefined();
        expect(result.timestamp).toBeDefined();
        expect(result.baseline).toBeDefined();
        expect(result.current).toBeDefined();
        expect(result.comparison).toBeDefined();
        expect(result.brandAnalysis).toBeDefined();
        expect(result.overallScore).toBeGreaterThanOrEqual(0);
        expect(result.overallScore).toBeLessThanOrEqual(100);
        expect(Array.isArray(result.recommendations)).toBe(true);
      });
    });

    test('should compare current state against baseline', async () => {
      const baselines = await establishVisualBaselines();
      const baseline = baselines[0];
      
      const result = await compareAgainstBaseline(baseline);
      
      expect(result.testId).toBeDefined();
      expect(result.testName).toBe(baseline.name);
      expect(result.url).toBe(baseline.url);
      expect(result.baseline).toEqual(baseline);
      expect(result.current.screenshot.path).toBeDefined();
      expect(result.current.screenshot.hash).toBeDefined();
      expect(typeof result.comparison.passed).toBe('boolean');
      expect(result.comparison.pixelDifference).toBeGreaterThanOrEqual(0);
      expect(result.comparison.pixelDifferencePercentage).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(result.comparison.differences)).toBe(true);
    });

    test('should analyze brand-specific differences', async () => {
      const baselines = await establishVisualBaselines();
      const baseline = baselines.find(b => b.brandElements && Object.keys(b.brandElements).length > 0);
      
      if (baseline) {
        const result = await compareAgainstBaseline(baseline);
        
        expect(result.brandAnalysis).toBeDefined();
        expect(typeof result.brandAnalysis.colorAccuracy).toBe('boolean');
        expect(typeof result.brandAnalysis.brandElementsIntact).toBe('boolean');
        expect(typeof result.brandAnalysis.layoutConsistency).toBe('boolean');
        expect(Array.isArray(result.brandAnalysis.violations)).toBe(true);
      }
    });

    test('should detect visual differences correctly', async () => {
      const baselines = await establishVisualBaselines();
      const result = await compareAgainstBaseline(baselines[0]);
      
      result.comparison.differences.forEach(diff => {
        expect(diff.id).toBeDefined();
        expect(['pixel', 'layout', 'color', 'brand']).toContain(diff.type);
        expect(['low', 'medium', 'high', 'critical']).toContain(diff.severity);
        expect(diff.area.x).toBeGreaterThanOrEqual(0);
        expect(diff.area.y).toBeGreaterThanOrEqual(0);
        expect(diff.area.width).toBeGreaterThan(0);
        expect(diff.area.height).toBeGreaterThan(0);
        expect(diff.description).toBeDefined();
      });
    });
  });

  describe('Brand Color Accuracy Testing', () => {
    test('should test brand color accuracy in screenshots', async () => {
      const expectedColors = [
        { color: '#2563eb', tolerance: 2 }, // Royal blue
        { color: '#1f2937', tolerance: 1 }, // Gray 800
        { color: '#ea580c', tolerance: 2 }  // Orange accent
      ];
      
      const result = await testBrandColorAccuracy('test-screenshot.png', expectedColors);
      
      expect(typeof result.passed).toBe('boolean');
      expect(Array.isArray(result.colorTests)).toBe(true);
      expect(Array.isArray(result.violations)).toBe(true);
      expect(result.colorTests.length).toBe(expectedColors.length);
    });

    test('should validate individual color tests', async () => {
      const expectedColors = [
        { color: '#2563eb', tolerance: 2 },
        { color: '#ffffff', tolerance: 0 }
      ];
      
      const result = await testBrandColorAccuracy('test-screenshot.png', expectedColors);
      
      result.colorTests.forEach(test => {
        expect(test.expectedColor).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(test.foundColor).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(typeof test.withinTolerance).toBe('boolean');
        expect(test.pixelCount).toBeGreaterThan(0);
      });
    });

    test('should identify color violations', async () => {
      const expectedColors = [
        { color: '#2563eb', tolerance: 0 } // Very strict tolerance
      ];
      
      const result = await testBrandColorAccuracy('test-screenshot.png', expectedColors);
      
      result.violations.forEach(violation => {
        expect(typeof violation).toBe('string');
        expect(violation.length).toBeGreaterThan(10);
        expect(violation.toLowerCase()).toContain('color');
      });
    });
  });

  describe('Visual Diff Reporting', () => {
    test('should create comprehensive visual diff report', async () => {
      const baselines = await establishVisualBaselines();
      const results = await runVisualRegressionTests(baselines.slice(0, 5));
      const report = createVisualDiffReport(results);
      
      expect(report.summary).toBeDefined();
      expect(report.summary.totalTests).toBe(results.length);
      expect(report.summary.passedTests).toBeGreaterThanOrEqual(0);
      expect(report.summary.failedTests).toBeGreaterThanOrEqual(0);
      expect(report.summary.criticalIssues).toBeGreaterThanOrEqual(0);
      expect(report.summary.brandViolations).toBeGreaterThanOrEqual(0);
      expect(report.summary.passedTests + report.summary.failedTests).toBe(report.summary.totalTests);
    });

    test('should identify critical issues in report', async () => {
      const baselines = await establishVisualBaselines();
      const results = await runVisualRegressionTests(baselines.slice(0, 3));
      const report = createVisualDiffReport(results);
      
      expect(Array.isArray(report.criticalIssues)).toBe(true);
      
      report.criticalIssues.forEach(issue => {
        expect(issue.testName).toBeDefined();
        expect(issue.issue).toBeDefined();
        expect(issue.impact).toBeDefined();
        expect(issue.recommendation).toBeDefined();
      });
    });

    test('should categorize brand violations', async () => {
      const baselines = await establishVisualBaselines();
      const results = await runVisualRegressionTests(baselines.slice(0, 3));
      const report = createVisualDiffReport(results);
      
      expect(Array.isArray(report.brandViolations)).toBe(true);
      
      report.brandViolations.forEach(violation => {
        expect(violation.testName).toBeDefined();
        expect(violation.violation).toBeDefined();
        expect(['low', 'medium', 'high', 'critical']).toContain(violation.severity);
      });
    });

    test('should generate HTML report', async () => {
      const baselines = await establishVisualBaselines();
      const results = await runVisualRegressionTests(baselines.slice(0, 2));
      const report = createVisualDiffReport(results);
      
      expect(typeof report.htmlReport).toBe('string');
      expect(report.htmlReport).toContain('<!DOCTYPE html>');
      expect(report.htmlReport).toContain('NHBEA');
      expect(report.htmlReport).toContain('Visual Regression');
      expect(report.htmlReport.length).toBeGreaterThan(1000);
    });
  });

  describe('Automated Visual Testing Setup', () => {
    test('should create automated visual testing configuration', () => {
      const config = setupAutomatedVisualTesting();
      
      expect(config.githubAction).toBeDefined();
      expect(config.package).toBeDefined();
      expect(config.config).toBeDefined();
      expect(config.testScript).toBeDefined();
    });

    test('should include proper GitHub Action workflow', () => {
      const config = setupAutomatedVisualTesting();
      
      expect(config.githubAction).toContain('name: Visual Regression Tests');
      expect(config.githubAction).toContain('pull_request');
      expect(config.githubAction).toContain('npm run test:visual');
      expect(config.githubAction).toContain('upload-artifact');
    });

    test('should include required package dependencies', () => {
      const config = setupAutomatedVisualTesting();
      
      expect(config.package.scripts).toBeDefined();
      expect(config.package.scripts['test:visual']).toBeDefined();
      expect(config.package.scripts['test:visual:update']).toBeDefined();
      expect(config.package.scripts['baseline:create']).toBeDefined();
      
      expect(config.package.devDependencies).toBeDefined();
      expect(config.package.devDependencies['@percy/cli']).toBeDefined();
      expect(config.package.devDependencies['playwright']).toBeDefined();
      expect(config.package.devDependencies['jest-image-snapshot']).toBeDefined();
    });

    test('should include Jest configuration for visual tests', () => {
      const config = setupAutomatedVisualTesting();
      
      expect(config.config.testEnvironment).toBe('node');
      expect(config.config.testMatch).toBeDefined();
      expect(Array.isArray(config.config.testMatch)).toBe(true);
      expect(config.config.setupFilesAfterEnv).toBeDefined();
      expect(config.config.transform).toBeDefined();
    });

    test('should include executable test script', () => {
      const config = setupAutomatedVisualTesting();
      
      expect(config.testScript).toContain('#!/usr/bin/env node');
      expect(config.testScript).toContain('Visual Regression Testing Script');
      expect(config.testScript).toContain('establishVisualBaselines');
      expect(config.testScript).toContain('runVisualRegressionTests');
      expect(config.testScript).toContain('createVisualDiffReport');
      expect(config.testScript).toContain('console.log');
    });
  });

  describe('Test Configuration Validation', () => {
    test('should have comprehensive visual test pages configuration', () => {
      expect(Array.isArray(VISUAL_TEST_PAGES)).toBe(true);
      expect(VISUAL_TEST_PAGES.length).toBeGreaterThan(0);
      
      VISUAL_TEST_PAGES.forEach(page => {
        expect(page.name).toBeDefined();
        expect(page.url).toBeDefined();
        expect(['critical', 'high', 'medium', 'low']).toContain(page.priority);
        expect(page.brandElements).toBeDefined();
        expect(Array.isArray(page.variations)).toBe(true);
        expect(page.variations.length).toBeGreaterThan(0);
      });
    });

    test('should include all major pages in visual testing', () => {
      const pageNames = VISUAL_TEST_PAGES.map(p => p.name.toLowerCase());
      
      expect(pageNames.some(name => name.includes('homepage'))).toBe(true);
      expect(pageNames.some(name => name.includes('about'))).toBe(true);
      expect(pageNames.some(name => name.includes('membership'))).toBe(true);
      expect(pageNames.some(name => name.includes('conference'))).toBe(true);
    });

    test('should have comprehensive component regression tests', () => {
      expect(Array.isArray(COMPONENT_REGRESSION_TESTS)).toBe(true);
      expect(COMPONENT_REGRESSION_TESTS.length).toBeGreaterThan(0);
      
      COMPONENT_REGRESSION_TESTS.forEach(test => {
        expect(test.component).toBeDefined();
        expect(Array.isArray(test.variations)).toBe(true);
        expect(test.variations.length).toBeGreaterThan(0);
        expect(test.viewport.width).toBeGreaterThan(0);
        expect(test.viewport.height).toBeGreaterThan(0);
        expect(test.brandValidation).toBeDefined();
        expect(typeof test.brandValidation.validateColors).toBe('boolean');
        expect(typeof test.brandValidation.validateTypography).toBe('boolean');
        expect(typeof test.brandValidation.validateSpacing).toBe('boolean');
        expect(typeof test.brandValidation.validateInteractions).toBe('boolean');
      });
    });

    test('should include brand-critical components in regression tests', () => {
      const componentNames = COMPONENT_REGRESSION_TESTS.map(t => t.component.toLowerCase());
      
      expect(componentNames.some(name => name.includes('button'))).toBe(true);
      expect(componentNames.some(name => name.includes('navigation'))).toBe(true);
      expect(componentNames.some(name => name.includes('card'))).toBe(true);
    });

    test('should test multiple component variations and states', () => {
      COMPONENT_REGRESSION_TESTS.forEach(test => {
        test.variations.forEach(variation => {
          expect(variation.name).toBeDefined();
          expect(variation.props).toBeDefined();
          expect(Array.isArray(variation.states)).toBe(true);
          expect(variation.states.length).toBeGreaterThan(0);
          
          // Should test appropriate states for each component type
          if (variation.name.toLowerCase().includes('mobile navigation')) {
            expect(variation.states.some(state => ['closed', 'open', 'default'].includes(state))).toBe(true);
          } else {
            expect(variation.states).toContain('default');
          }
        });
      });
    });
  });
});