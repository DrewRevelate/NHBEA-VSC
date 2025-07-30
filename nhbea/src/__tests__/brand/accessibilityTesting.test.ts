import {
  runAccessibilityTest,
  testColorContrast,
  testKeyboardNavigation,
  testScreenReaderCompatibility,
  testBrandAccessibility,
  runWCAGCompliance,
  createAccessibilityAuditChecklist,
  generateAccessibilityReport
} from '../../lib/accessibilityTesting';
import accessibilityTesting from '../../lib/accessibilityTesting';

const { BRAND_COLOR_COMBINATIONS, CONTRAST_REQUIREMENTS } = accessibilityTesting;

describe('Accessibility Testing Suite', () => {
  describe('Comprehensive Accessibility Testing', () => {
    test('should run complete accessibility test for a page', async () => {
      const result = await runAccessibilityTest('/', 'Homepage');
      
      expect(result.pageName).toBe('Homepage');
      expect(result.url).toBe('/');
      expect(result.timestamp).toBeDefined();
      expect(result.wcagCompliance).toBeDefined();
      expect(result.colorContrast).toBeDefined();
      expect(result.keyboardNavigation).toBeDefined();
      expect(result.screenReader).toBeDefined();
      expect(result.brandAccessibility).toBeDefined();
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
      expect(typeof result.passed).toBe('boolean');
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    test('should generate recommendations for failed tests', async () => {
      const result = await runAccessibilityTest('/test-page', 'Test Page');
      
      if (!result.passed) {
        expect(result.recommendations.length).toBeGreaterThan(0);
      }
      
      // Test that recommendations are meaningful
      result.recommendations.forEach(rec => {
        expect(typeof rec).toBe('string');
        expect(rec.length).toBeGreaterThan(10);
      });
    });
  });

  describe('Color Contrast Testing', () => {
    test('should test brand color contrast combinations', async () => {
      const result = await testColorContrast('Homepage');
      
      expect(typeof result.passed).toBe('boolean');
      expect(Array.isArray(result.violations)).toBe(true);
      expect(result.testedCombinations).toBe(BRAND_COLOR_COMBINATIONS.length);
      expect(result.testedCombinations).toBeGreaterThan(10);
    });

    test('should identify contrast violations', async () => {
      const result = await testColorContrast('Test Page');
      
      result.violations.forEach(violation => {
        expect(violation.element).toBeDefined();
        expect(violation.foregroundColor).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(violation.backgroundColor).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(violation.contrastRatio).toBeGreaterThan(0);
        expect(violation.requiredRatio).toBeGreaterThan(0);
        expect(violation.contrastRatio).toBeLessThan(violation.requiredRatio);
      });
    });

    test('should validate WCAG contrast requirements', () => {
      expect(CONTRAST_REQUIREMENTS.normal.AA).toBe(4.5);
      expect(CONTRAST_REQUIREMENTS.normal.AAA).toBe(7.0);
      expect(CONTRAST_REQUIREMENTS.large.AA).toBe(3.0);
      expect(CONTRAST_REQUIREMENTS.large.AAA).toBe(4.5);
    });

    test('should include royal blue brand combinations', () => {
      const royalBlueCombinations = BRAND_COLOR_COMBINATIONS.filter(combo => 
        combo.name.toLowerCase().includes('royal blue')
      );
      
      expect(royalBlueCombinations.length).toBeGreaterThan(0);
      
      royalBlueCombinations.forEach(combo => {
        expect(combo.fg).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(combo.bg).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(['normal', 'large']).toContain(combo.type);
      });
    });
  });

  describe('Keyboard Navigation Testing', () => {
    test('should test keyboard navigation for interactive elements', async () => {
      const result = await testKeyboardNavigation('Homepage');
      
      expect(typeof result.passed).toBe('boolean');
      expect(Array.isArray(result.violations)).toBe(true);
      expect(result.interactiveElements).toBeGreaterThan(0);
      expect(result.accessibleElements).toBeGreaterThanOrEqual(0);
      expect(result.accessibleElements).toBeLessThanOrEqual(result.interactiveElements);
    });

    test('should identify keyboard accessibility issues', async () => {
      const result = await testKeyboardNavigation('Professional Membership');
      
      result.violations.forEach(violation => {
        expect(typeof violation).toBe('string');
        expect(violation.length).toBeGreaterThan(5);
      });
    });

    test('should handle different page types appropriately', async () => {
      const homepageResult = await testKeyboardNavigation('Homepage');
      const formResult = await testKeyboardNavigation('Professional Membership');
      
      expect(homepageResult.interactiveElements).toBeGreaterThan(0);
      expect(formResult.interactiveElements).toBeGreaterThan(0);
      
      // Form pages typically have more interactive elements
      expect(formResult.interactiveElements).toBeGreaterThanOrEqual(homepageResult.interactiveElements);
    });
  });

  describe('Screen Reader Compatibility Testing', () => {
    test('should test screen reader compatibility', async () => {
      const result = await testScreenReaderCompatibility('About');
      
      expect(typeof result.passed).toBe('boolean');
      expect(Array.isArray(result.violations)).toBe(true);
      expect(result.ariaLabels).toBeGreaterThanOrEqual(0);
      expect(result.missingLabels).toBeGreaterThanOrEqual(0);
    });

    test('should identify missing ARIA labels', async () => {
      const result = await testScreenReaderCompatibility('Awards');
      
      result.violations.forEach(violation => {
        expect(typeof violation).toBe('string');
        expect(violation.length).toBeGreaterThan(10);
      });
      
      if (result.missingLabels > 0) {
        expect(result.violations.length).toBeGreaterThan(0);
      }
    });

    test('should handle page-specific screen reader issues', async () => {
      const awardsResult = await testScreenReaderCompatibility('Awards');
      const homepageResult = await testScreenReaderCompatibility('Homepage');
      const formResult = await testScreenReaderCompatibility('Professional Membership');
      
      expect(awardsResult.ariaLabels).toBeGreaterThanOrEqual(0);
      expect(homepageResult.ariaLabels).toBeGreaterThanOrEqual(0);
      expect(formResult.ariaLabels).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Brand Accessibility Testing', () => {
    test('should test brand-specific accessibility', async () => {
      const result = await testBrandAccessibility('Homepage');
      
      expect(typeof result.passed).toBe('boolean');
      expect(Array.isArray(result.violations)).toBe(true);
      expect(result.brandElementsAccessible).toBeGreaterThanOrEqual(0);
      expect(result.totalBrandElements).toBeGreaterThan(0);
      expect(result.brandElementsAccessible).toBeLessThanOrEqual(result.totalBrandElements);
    });

    test('should identify brand accessibility violations', async () => {
      const result = await testBrandAccessibility('Conference');
      
      result.violations.forEach(violation => {
        expect(typeof violation).toBe('string');
        expect(violation.length).toBeGreaterThan(15);
        expect(violation.toLowerCase()).toMatch(/royal blue|brand|color|contrast|button/);
      });
    });

    test('should handle different page brand elements', async () => {
      const homepageResult = await testBrandAccessibility('Homepage');
      const aboutResult = await testBrandAccessibility('About');
      
      expect(homepageResult.totalBrandElements).toBeGreaterThan(0);
      expect(aboutResult.totalBrandElements).toBeGreaterThan(0);
    });
  });

  describe('WCAG Compliance Testing', () => {
    test('should run WCAG compliance testing', async () => {
      const result = await runWCAGCompliance('Homepage');
      
      expect(['A', 'AA', 'AAA']).toContain(result.level);
      expect(typeof result.passed).toBe('boolean');
      expect(Array.isArray(result.violations)).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    test('should provide detailed violation information', async () => {
      const result = await runWCAGCompliance('Test Page');
      
      result.violations.forEach(violation => {
        expect(violation.id).toBeDefined();
        expect(['minor', 'moderate', 'serious', 'critical']).toContain(violation.impact);
        expect(violation.description).toBeDefined();
        expect(violation.element).toBeDefined();
        expect(violation.help).toBeDefined();
        expect(Array.isArray(violation.wcagTags)).toBe(true);
      });
    });

    test('should calculate score based on violation severity', async () => {
      const result = await runWCAGCompliance('Test Page');
      
      if (result.violations.length > 0) {
        const criticalViolations = result.violations.filter(v => v.impact === 'critical').length;
        const seriousViolations = result.violations.filter(v => v.impact === 'serious').length;
        
        if (criticalViolations > 0 || seriousViolations > 0) {
          expect(result.score).toBeLessThan(100);
        }
      }
    });
  });

  describe('Accessibility Audit Checklist', () => {
    test('should create comprehensive accessibility audit checklist', () => {
      const checklist = createAccessibilityAuditChecklist();
      
      expect(checklist.categories).toBeDefined();
      expect(Array.isArray(checklist.categories)).toBe(true);
      expect(checklist.categories.length).toBeGreaterThan(0);
    });

    test('should include brand-specific accessibility checks', () => {
      const checklist = createAccessibilityAuditChecklist();
      
      const brandCategories = checklist.categories.filter(category => 
        category.name.toLowerCase().includes('brand')
      );
      
      expect(brandCategories.length).toBeGreaterThan(0);
      
      brandCategories.forEach(category => {
        expect(category.items.length).toBeGreaterThan(0);
        
        category.items.forEach(item => {
          expect(item.id).toBeDefined();
          expect(item.description).toBeDefined();
          expect(item.wcagCriteria).toBeDefined();
          expect(Array.isArray(item.testSteps)).toBe(true);
          expect(['high', 'medium', 'low']).toContain(item.priority);
        });
      });
    });

    test('should include high-priority accessibility checks', () => {
      const checklist = createAccessibilityAuditChecklist();
      
      const highPriorityItems = checklist.categories
        .flatMap(category => category.items)
        .filter(item => item.priority === 'high');
      
      expect(highPriorityItems.length).toBeGreaterThan(0);
      
      // Should include color contrast and keyboard navigation as high priority
      const hasColorContrast = highPriorityItems.some(item => 
        item.id.includes('contrast') || item.description.toLowerCase().includes('contrast')
      );
      const hasKeyboard = highPriorityItems.some(item => 
        item.id.includes('keyboard') || item.description.toLowerCase().includes('keyboard')
      );
      
      expect(hasColorContrast).toBe(true);
      expect(hasKeyboard).toBe(true);
    });
  });

  describe('Accessibility Report Generation', () => {
    test('should generate comprehensive accessibility report', async () => {
      const testResults = [
        await runAccessibilityTest('/', 'Homepage'),
        await runAccessibilityTest('/about', 'About'),
        await runAccessibilityTest('/membership/professional', 'Professional Membership')
      ];
      
      const report = generateAccessibilityReport(testResults);
      
      expect(report.overallScore).toBeGreaterThanOrEqual(0);
      expect(report.overallScore).toBeLessThanOrEqual(100);
      expect(report.passedTests).toBeGreaterThanOrEqual(0);
      expect(report.passedTests).toBeLessThanOrEqual(report.totalTests);
      expect(report.totalTests).toBe(testResults.length);
      expect(Array.isArray(report.criticalIssues)).toBe(true);
      expect(Array.isArray(report.recommendations)).toBe(true);
      expect(typeof report.contrastViolations).toBe('number');
      expect(typeof report.keyboardIssues).toBe('number');
      expect(typeof report.screenReaderIssues).toBe('number');
      expect(typeof report.summary).toBe('string');
    });

    test('should categorize performance levels correctly', async () => {
      const excellentResults = [
        {
          pageName: 'Test',
          url: '/',
          timestamp: new Date().toISOString(),
          wcagCompliance: { level: 'AA' as const, passed: true, violations: [], score: 100 },
          colorContrast: { passed: true, violations: [], testedCombinations: 10 },
          keyboardNavigation: { passed: true, violations: [], interactiveElements: 5, accessibleElements: 5 },
          screenReader: { passed: true, violations: [], ariaLabels: 5, missingLabels: 0 },
          brandAccessibility: { passed: true, violations: [], brandElementsAccessible: 8, totalBrandElements: 8 },
          overallScore: 98,
          passed: true,
          recommendations: []
        }
      ];
      
      const report = generateAccessibilityReport(excellentResults);
      expect(report.summary).toContain('✅ Excellent accessibility compliance');
    });

    test('should provide detailed violation counts', async () => {
      const testResults = [
        await runAccessibilityTest('/', 'Homepage'),
        await runAccessibilityTest('/about', 'About')
      ];
      
      const report = generateAccessibilityReport(testResults);
      
      expect(typeof report.contrastViolations).toBe('number');
      expect(typeof report.keyboardIssues).toBe('number');
      expect(typeof report.screenReaderIssues).toBe('number');
      expect(report.contrastViolations).toBeGreaterThanOrEqual(0);
      expect(report.keyboardIssues).toBeGreaterThanOrEqual(0);
      expect(report.screenReaderIssues).toBeGreaterThanOrEqual(0);
    });
  });
});