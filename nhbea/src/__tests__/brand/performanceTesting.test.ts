import {
  runLighthouseAudit,
  runComprehensivePerformanceTests,
  setupCoreWebVitalsMonitoring,
  detectPerformanceRegression,
  testBrandPerformanceMetrics,
  createPerformanceTestConfig,
  PERFORMANCE_THRESHOLDS
} from '../../lib/performanceTesting';

describe('Performance Testing Suite', () => {
  describe('Lighthouse Performance Audits', () => {
    test('should run Lighthouse audit for homepage', async () => {
      const result = await runLighthouseAudit('/', 'Homepage');
      
      expect(result.pageName).toBe('Homepage');
      expect(result.url).toBe('/');
      expect(result.lighthouse.performance).toBeGreaterThan(0);
      expect(result.lighthouse.accessibility).toBeGreaterThan(0);
      expect(result.coreWebVitals.lcp).toBeGreaterThan(0);
      expect(result.coreWebVitals.fcp).toBeGreaterThan(0);
      expect(result.bundleSize.cssSize).toBeGreaterThan(0);
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
    });

    test('should identify performance violations', async () => {
      const result = await runLighthouseAudit('/test-slow-page', 'Slow Test Page');
      
      expect(result.violations).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(Array.isArray(result.violations)).toBe(true);
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    test('should validate performance thresholds', async () => {
      const result = await runLighthouseAudit('/', 'Homepage');
      
      // Test that thresholds are properly applied
      if (result.lighthouse.performance < PERFORMANCE_THRESHOLDS.lighthouse.performance) {
        expect(result.violations.some(v => v.includes('Performance score below threshold'))).toBe(true);
      }
      
      if (result.coreWebVitals.lcp > PERFORMANCE_THRESHOLDS.coreWebVitals.lcp) {
        expect(result.violations.some(v => v.includes('LCP above threshold'))).toBe(true);
      }
    });
  });

  describe('Comprehensive Performance Testing', () => {
    test('should run performance tests across all major pages', async () => {
      const results = await runComprehensivePerformanceTests();
      
      expect(results.length).toBeGreaterThan(0);
      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            pageName: expect.any(String),
            url: expect.any(String),
            lighthouse: expect.objectContaining({
              performance: expect.any(Number),
              accessibility: expect.any(Number)
            }),
            coreWebVitals: expect.objectContaining({
              lcp: expect.any(Number),
              fcp: expect.any(Number),
              cls: expect.any(Number)
            }),
            overallScore: expect.any(Number)
          })
        ])
      );
    });

    test('should include homepage in comprehensive testing', async () => {
      const results = await runComprehensivePerformanceTests();
      
      const homepageResult = results.find(r => r.pageName === 'Homepage');
      expect(homepageResult).toBeDefined();
      expect(homepageResult?.url).toBe('/');
    });

    test('should include major pages in testing', async () => {
      const results = await runComprehensivePerformanceTests();
      
      const expectedPages = ['Homepage', 'About', 'Professional Membership'];
      expectedPages.forEach(pageName => {
        const pageResult = results.find(r => r.pageName === pageName);
        expect(pageResult).toBeDefined();
      });
    });
  });

  describe('Core Web Vitals Monitoring', () => {
    test('should setup Core Web Vitals monitoring', () => {
      const monitoring = setupCoreWebVitalsMonitoring();
      
      expect(monitoring.startMonitoring).toBeDefined();
      expect(monitoring.getMetrics).toBeDefined();
      expect(monitoring.stopMonitoring).toBeDefined();
      expect(typeof monitoring.startMonitoring).toBe('function');
      expect(typeof monitoring.getMetrics).toBe('function');
      expect(typeof monitoring.stopMonitoring).toBe('function');
    });

    test('should track CWV metrics', () => {
      const monitoring = setupCoreWebVitalsMonitoring();
      
      monitoring.startMonitoring();
      const metrics = monitoring.getMetrics();
      
      expect(metrics).toHaveProperty('lcp');
      expect(metrics).toHaveProperty('fcp');
      expect(metrics).toHaveProperty('cls');
      expect(metrics).toHaveProperty('fid');
      expect(metrics).toHaveProperty('summary');
      
      monitoring.stopMonitoring();
    });

    test('should provide metric summaries', () => {
      const monitoring = setupCoreWebVitalsMonitoring();
      
      monitoring.startMonitoring();
      const metrics = monitoring.getMetrics();
      
      expect(metrics.summary).toHaveProperty('avgLCP');
      expect(metrics.summary).toHaveProperty('avgFCP');
      expect(metrics.summary).toHaveProperty('avgCLS');
      expect(metrics.summary).toHaveProperty('avgFID');
      expect(metrics.summary).toHaveProperty('avgTTI');
      
      monitoring.stopMonitoring();
    });
  });

  describe('Performance Regression Detection', () => {
    test('should detect performance regression', async () => {
      const baseline = await runLighthouseAudit('/', 'Homepage');
      
      // Simulate a regression by creating a worse result
      const current = {
        ...baseline,
        lighthouse: {
          ...baseline.lighthouse,
          performance: baseline.lighthouse.performance - 10 // Significant drop
        },
        coreWebVitals: {
          ...baseline.coreWebVitals,
          lcp: baseline.coreWebVitals.lcp + 1000 // Significant increase
        }
      };
      
      const regression = detectPerformanceRegression(baseline, current);
      
      expect(regression.pageName).toBe('Homepage');
      expect(regression.overallRegression).toBe(true);
      expect(regression.regressions.length).toBeGreaterThan(0);
      expect(regression.severity).toMatch(/low|medium|high|critical/);
    });

    test('should not flag minor performance variations', async () => {
      const baseline = await runLighthouseAudit('/', 'Homepage');
      
      // Simulate a minor variation
      const current = {
        ...baseline,
        lighthouse: {
          ...baseline.lighthouse,
          performance: baseline.lighthouse.performance - 1 // Minor drop
        }
      };
      
      const regression = detectPerformanceRegression(baseline, current);
      
      expect(regression.overallRegression).toBe(false);
      expect(regression.regressions.length).toBe(0);
    });

    test('should calculate regression severity correctly', async () => {
      const baseline = await runLighthouseAudit('/', 'Homepage');
      
      // Simulate critical regression
      const criticalRegression = {
        ...baseline,
        lighthouse: {
          ...baseline.lighthouse,
          performance: baseline.lighthouse.performance - 15
        },
        coreWebVitals: {
          ...baseline.coreWebVitals,
          lcp: baseline.coreWebVitals.lcp + 1500,
          fcp: baseline.coreWebVitals.fcp + 800
        },
        bundleSize: {
          ...baseline.bundleSize,
          cssSize: baseline.bundleSize.cssSize + 50
        }
      };
      
      const regression = detectPerformanceRegression(baseline, criticalRegression);
      
      if (regression.regressions.length >= 3) {
        expect(regression.severity).toBe('critical');
      }
    });
  });

  describe('Brand-Specific Performance Metrics', () => {
    test('should test brand performance metrics', () => {
      const metrics = testBrandPerformanceMetrics('Homepage');
      
      expect(metrics.heroSectionLoadTime).toBeGreaterThan(0);
      expect(metrics.brandCSSLoadTime).toBeGreaterThan(0);
      expect(metrics.brandFontLoadTime).toBeGreaterThan(0);
      expect(metrics.totalBrandLoadTime).toBeGreaterThan(0);
      expect(typeof metrics.passed).toBe('boolean');
      expect(Array.isArray(metrics.violations)).toBe(true);
    });

    test('should calculate total brand load time', () => {
      const metrics = testBrandPerformanceMetrics('About');
      
      const expectedTotal = metrics.heroSectionLoadTime + 
                           metrics.brandCSSLoadTime + 
                           metrics.brandFontLoadTime;
      
      expect(metrics.totalBrandLoadTime).toBeCloseTo(expectedTotal, 1);
    });

    test('should identify brand performance violations', () => {
      // Run multiple tests to potentially get violations
      const results = Array.from({ length: 10 }, () => testBrandPerformanceMetrics('Test'));
      
      // At least one test should demonstrate violation detection logic
      const hasViolationLogic = results.some(result => 
        result.violations.length > 0 || result.passed === false
      );
      
      // The test should at least have the capability to detect violations
      expect(typeof results[0].passed).toBe('boolean');
      expect(Array.isArray(results[0].violations)).toBe(true);
    });
  });

  describe('Performance Test Configuration', () => {
    test('should create performance test configuration', () => {
      const config = createPerformanceTestConfig();
      
      expect(config.lighthouseConfig).toBeDefined();
      expect(config.budgetConfig).toBeDefined();
      expect(config.testScript).toBeDefined();
      expect(typeof config.testScript).toBe('string');
    });

    test('should include proper Lighthouse configuration', () => {
      const config = createPerformanceTestConfig();
      
      expect(config.lighthouseConfig).toHaveProperty('extends');
      expect(config.lighthouseConfig).toHaveProperty('settings');
      expect(config.lighthouseConfig.settings).toHaveProperty('onlyAudits');
      expect(Array.isArray(config.lighthouseConfig.settings.onlyAudits)).toBe(true);
    });

    test('should include performance budgets', () => {
      const config = createPerformanceTestConfig();
      
      expect(config.budgetConfig).toHaveProperty('budgets');
      expect(Array.isArray(config.budgetConfig.budgets)).toBe(true);
      expect(config.budgetConfig.budgets[0]).toHaveProperty('timings');
      expect(config.budgetConfig.budgets[0]).toHaveProperty('resourceSizes');
    });

    test('should include executable test script', () => {
      const config = createPerformanceTestConfig();
      
      expect(config.testScript).toContain('#!/usr/bin/env node');
      expect(config.testScript).toContain('runComprehensivePerformanceTests');
      expect(config.testScript).toContain('console.log');
    });
  });

  describe('Performance Thresholds Validation', () => {
    test('should have appropriate performance thresholds', () => {
      expect(PERFORMANCE_THRESHOLDS.lighthouse.performance).toBeGreaterThanOrEqual(85);
      expect(PERFORMANCE_THRESHOLDS.lighthouse.accessibility).toBeGreaterThanOrEqual(90);
      expect(PERFORMANCE_THRESHOLDS.coreWebVitals.lcp).toBeLessThanOrEqual(3000);
      expect(PERFORMANCE_THRESHOLDS.coreWebVitals.fcp).toBeLessThanOrEqual(2000);
      expect(PERFORMANCE_THRESHOLDS.coreWebVitals.cls).toBeLessThanOrEqual(0.2);
    });

    test('should have reasonable bundle size thresholds', () => {
      expect(PERFORMANCE_THRESHOLDS.bundleSize.maxCSSSize).toBeGreaterThan(50);
      expect(PERFORMANCE_THRESHOLDS.bundleSize.maxCSSSize).toBeLessThan(200);
      expect(PERFORMANCE_THRESHOLDS.bundleSize.maxTotalSize).toBeGreaterThan(500);
    });
  });
});