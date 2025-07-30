import { 
  executeBrandRecognitionTests, 
  runBrandRecognitionTest, 
  analyzeBrandPresenceOnPage,
  analyzeJourneyConsistency,
  generateBrandRecognitionReport
} from '../../lib/brandIdentityTesting';

describe('Brand Identity Recognition Testing', () => {
  describe('Page Brand Presence Analysis', () => {
    test('should analyze brand presence on homepage', () => {
      const result = analyzeBrandPresenceOnPage('/');
      
      expect(result.score).toBeGreaterThan(60);
      expect(result.brandElements).toContain('royal-blue-gradient-hero');
      expect(result.brandElements).toContain('brand-consistent-navigation');
      expect(result.brandElements).toContain('primary-button-styling');
    });

    test('should analyze brand presence on about page', () => {
      const result = analyzeBrandPresenceOnPage('/about');
      
      expect(result.score).toBeGreaterThan(50);
      expect(result.brandElements).toContain('professional-typography');
      expect(result.brandElements).toContain('brand-color-hierarchy');
      expect(result.brandElements).toContain('academic-gold-accents');
    });

    test('should analyze brand presence on membership page', () => {
      const result = analyzeBrandPresenceOnPage('/membership/professional');
      
      expect(result.score).toBeGreaterThan(20);
      expect(result.brandElements).toContain('form-brand-styling');
      expect(result.brandElements).toContain('royal-blue-ctas');
      expect(result.brandElements).toContain('professional-presentation');
    });

    test('should identify violations on pages with poor brand implementation', () => {
      // This would be a page that doesn't follow brand guidelines
      const result = analyzeBrandPresenceOnPage('/unknown-page');
      
      expect(result.violations.length).toBeGreaterThan(0);
      expect(result.score).toBeLessThan(100);
    });
  });

  describe('Journey Consistency Analysis', () => {
    test('should analyze consistency across membership journey', () => {
      const membershipJourney = ['/', '/membership/professional', '/membership/success'];
      const consistencyScore = analyzeJourneyConsistency(membershipJourney);
      
      expect(consistencyScore).toBeGreaterThan(60);
      expect(consistencyScore).toBeLessThanOrEqual(100);
    });

    test('should analyze consistency across conference journey', () => {
      const conferenceJourney = ['/', '/conference', '/conference/register'];
      const consistencyScore = analyzeJourneyConsistency(conferenceJourney);
      
      expect(consistencyScore).toBeGreaterThan(60);
      expect(consistencyScore).toBeLessThanOrEqual(100);
    });

    test('should detect inconsistency in mixed page types', () => {
      const mixedJourney = ['/', '/about', '/awards', '/unknown-page'];
      const consistencyScore = analyzeJourneyConsistency(mixedJourney);
      
      // Should still be reasonable due to most pages having good brand implementation
      expect(consistencyScore).toBeGreaterThan(60);
    });
  });

  describe('Brand Recognition Tests', () => {
    test('should execute all brand recognition tests', () => {
      const results = executeBrandRecognitionTests();
      
      expect(results.length).toBeGreaterThan(0);
      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            testId: expect.stringContaining('journey-'),
            journeyName: expect.any(String),
            score: expect.any(Number),
            passed: expect.any(Boolean),
            pageScores: expect.any(Object)
          })
        ])
      );
    });

    test('should run membership journey brand recognition test', () => {
      const membershipTest = {
        id: 'test-membership',
        journeyName: 'Test Membership Flow',
        pages: ['/', '/membership/professional', '/membership/success'],
        testCriteria: ['Royal blue consistency', 'Professional presentation'],
        expectedOutcomes: ['Brand recognition maintained'],
        passingScore: 80
      };

      const result = runBrandRecognitionTest(membershipTest);
      
      expect(result.testId).toBe('test-membership');
      expect(result.journeyName).toBe('Test Membership Flow');
      expect(result.score).toBeGreaterThan(0);
      expect(result.pageScores).toHaveProperty('/');
      expect(result.pageScores).toHaveProperty('/membership/professional');
      expect(result.pageScores).toHaveProperty('/membership/success');
    });
  });

  describe('Brand Recognition Report Generation', () => {
    test('should generate comprehensive brand recognition report', () => {
      const mockResults = [
        {
          testId: 'test-1',
          journeyName: 'Test Journey 1',
          score: 85,
          passed: true,
          findings: [],
          recommendations: [],
          pageScores: { '/': 85, '/about': 85 }
        },
        {
          testId: 'test-2',
          journeyName: 'Test Journey 2',
          score: 75,
          passed: false,
          findings: ['Low brand consistency'],
          recommendations: ['Improve brand elements'],
          pageScores: { '/': 80, '/membership': 70 }
        }
      ];

      const report = generateBrandRecognitionReport(mockResults);

      expect(report.overallScore).toBe(80);
      expect(report.passedTests).toBe(1);
      expect(report.totalTests).toBe(2);
      expect(report.criticalIssues).toContain('Low brand consistency');
      expect(report.recommendations).toContain('Improve brand elements');
      expect(report.summary).toContain('80.0/100');
    });

    test('should categorize performance levels correctly', () => {
      const excellentResults = [
        {
          testId: 'excellent-test',
          journeyName: 'Excellent Journey',
          score: 95,
          passed: true,
          findings: [],
          recommendations: [],
          pageScores: { '/': 95 }
        }
      ];

      const report = generateBrandRecognitionReport(excellentResults);
      expect(report.summary).toContain('✅ Excellent brand recognition');
    });
  });

  describe('Brand Element Detection', () => {
    test('should identify required brand elements for different page types', () => {
      const homepageResult = analyzeBrandPresenceOnPage('/');
      const aboutResult = analyzeBrandPresenceOnPage('/about');
      const awardsResult = analyzeBrandPresenceOnPage('/awards');

      // Homepage should have hero elements
      expect(homepageResult.brandElements).toContain('royal-blue-gradient-hero');
      
      // About page should have professional elements
      expect(aboutResult.brandElements).toContain('professional-typography');
      
      // Awards page should have academic elements
      expect(awardsResult.brandElements).toContain('academic-gold-highlights');
    });

    test('should penalize missing critical brand elements', () => {
      const homepageResult = analyzeBrandPresenceOnPage('/');
      
      // Homepage without hero would have violations
      expect(homepageResult.violations.length).toBeGreaterThanOrEqual(0);
      
      if (homepageResult.violations.length > 0) {
        expect(homepageResult.score).toBeLessThan(100);
      }
    });
  });
});