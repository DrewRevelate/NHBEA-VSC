import {
  runUserExperienceValidation,
  simulateUserTaskCompletion,
  testBrandRecognition,
  testNavigationEfficiency,
  analyzeUserSatisfactionMetrics,
  createUXValidationReport,
  UX_TEST_SCENARIOS
} from '../../lib/userExperienceValidation';

describe('User Experience Validation Suite', () => {
  describe('User Task Completion Testing', () => {
    test('should run comprehensive user experience validation', async () => {
      const results = await runUserExperienceValidation(UX_TEST_SCENARIOS.slice(0, 2));
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(2);
      
      results.forEach(result => {
        expect(result.scenarioId).toBeDefined();
        expect(result.scenarioName).toBeDefined();
        expect(['new-visitor', 'returning-member', 'academic-professional', 'mobile-user']).toContain(result.userType);
        expect(result.timestamp).toBeDefined();
        expect(result.completion).toBeDefined();
        expect(result.userExperience).toBeDefined();
        expect(result.brandImpact).toBeDefined();
        expect(Array.isArray(result.usabilityIssues)).toBe(true);
        expect(result.performanceMetrics).toBeDefined();
      });
    });

    test('should simulate user task completion for individual scenarios', async () => {
      const scenario = UX_TEST_SCENARIOS[0];
      const result = await simulateUserTaskCompletion(scenario);
      
      expect(result.scenarioId).toBe(scenario.id);
      expect(result.scenarioName).toBe(scenario.name);
      expect(result.userType).toBe(scenario.userType);
      
      expect(typeof result.completion.successful).toBe('boolean');
      expect(result.completion.completionTime).toBeGreaterThan(0);
      expect(result.completion.stepsCompleted).toBeGreaterThanOrEqual(0);
      expect(result.completion.stepsCompleted).toBeLessThanOrEqual(result.completion.totalSteps);
      expect(result.completion.totalSteps).toBe(scenario.steps.length);
      
      if (!result.completion.successful) {
        expect(result.completion.abandonmentPoint).toBeDefined();
      }
    });

    test('should validate user experience ratings', async () => {
      const scenario = UX_TEST_SCENARIOS[1]; // Professional membership application
      const result = await simulateUserTaskCompletion(scenario);
      
      expect(result.userExperience.brandRecognition).toBeGreaterThanOrEqual(1);
      expect(result.userExperience.brandRecognition).toBeLessThanOrEqual(5);
      expect(result.userExperience.navigationEase).toBeGreaterThanOrEqual(1);
      expect(result.userExperience.navigationEase).toBeLessThanOrEqual(5);
      expect(result.userExperience.visualClarity).toBeGreaterThanOrEqual(1);
      expect(result.userExperience.visualClarity).toBeLessThanOrEqual(5);
      expect(result.userExperience.professionalAppearance).toBeGreaterThanOrEqual(1);
      expect(result.userExperience.professionalAppearance).toBeLessThanOrEqual(5);
      expect(result.userExperience.trustworthiness).toBeGreaterThanOrEqual(1);
      expect(result.userExperience.trustworthiness).toBeLessThanOrEqual(5);
      expect(result.userExperience.overallSatisfaction).toBeGreaterThanOrEqual(1);
      expect(result.userExperience.overallSatisfaction).toBeLessThanOrEqual(5);
    });

    test('should assess brand impact on user experience', async () => {
      const scenario = UX_TEST_SCENARIOS[0];
      const result = await simulateUserTaskCompletion(scenario);
      
      expect(Array.isArray(result.brandImpact.brandElementsNoticed)).toBe(true);
      expect(result.brandImpact.colorSystemRating).toBeGreaterThanOrEqual(1);
      expect(result.brandImpact.colorSystemRating).toBeLessThanOrEqual(5);
      expect(result.brandImpact.typographyReadability).toBeGreaterThanOrEqual(1);
      expect(result.brandImpact.typographyReadability).toBeLessThanOrEqual(5);
      expect(result.brandImpact.brandConsistency).toBeGreaterThanOrEqual(1);
      expect(result.brandImpact.brandConsistency).toBeLessThanOrEqual(5);
      expect(result.brandImpact.brandHelpfulness).toBeGreaterThanOrEqual(1);
      expect(result.brandImpact.brandHelpfulness).toBeLessThanOrEqual(5);
      
      // Should notice some brand elements from the scenario's brand interactions
      result.brandImpact.brandElementsNoticed.forEach(element => {
        expect(typeof element).toBe('string');
        expect(element.length).toBeGreaterThan(0);
      });
    });

    test('should identify usability issues', async () => {
      const results = await runUserExperienceValidation(UX_TEST_SCENARIOS);
      
      results.forEach(result => {
        result.usabilityIssues.forEach(issue => {
          expect(issue.issue).toBeDefined();
          expect(['low', 'medium', 'high', 'critical']).toContain(issue.severity);
          expect(typeof issue.brandRelated).toBe('boolean');
          expect(issue.location).toBeDefined();
          expect(issue.recommendation).toBeDefined();
        });
      });
    });

    test('should track performance metrics', async () => {
      const scenario = UX_TEST_SCENARIOS[2]; // Conference registration
      const result = await simulateUserTaskCompletion(scenario);
      
      expect(Array.isArray(result.performanceMetrics.pageLoadTimes)).toBe(true);
      expect(Array.isArray(result.performanceMetrics.interactionLatency)).toBe(true);
      expect(result.performanceMetrics.perceivedPerformance).toBeGreaterThanOrEqual(1);
      expect(result.performanceMetrics.perceivedPerformance).toBeLessThanOrEqual(5);
      
      result.performanceMetrics.pageLoadTimes.forEach(time => {
        expect(time).toBeGreaterThan(0);
        expect(time).toBeLessThan(10000); // Should be less than 10 seconds
      });
      
      result.performanceMetrics.interactionLatency.forEach(latency => {
        expect(latency).toBeGreaterThan(0);
        expect(latency).toBeLessThan(1000); // Should be less than 1 second
      });
    });
  });

  describe('Brand Recognition Testing', () => {
    test('should test brand recognition and professional authority perception', async () => {
      const result = await testBrandRecognition('academic-professional');
      
      expect(result.testId).toBeDefined();
      expect(result.testName).toBe('NHBEA Brand Recognition Assessment');
      expect(result.participantType).toBe('academic-professional');
      expect(Array.isArray(result.brandElements)).toBe(true);
      expect(result.brandElements.length).toBeGreaterThan(0);
      expect(result.overallBrandStrength).toBeGreaterThanOrEqual(1);
      expect(result.overallBrandStrength).toBeLessThanOrEqual(5);
      expect(result.brandDifferentiation).toBeGreaterThanOrEqual(1);
      expect(result.brandDifferentiation).toBeLessThanOrEqual(5);
      expect(result.institutionalTrust).toBeGreaterThanOrEqual(1);
      expect(result.institutionalTrust).toBeLessThanOrEqual(5);
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    test('should evaluate individual brand elements', async () => {
      const result = await testBrandRecognition('new-visitor');
      
      result.brandElements.forEach(element => {
        expect(element.element).toBeDefined();
        expect(typeof element.recognized).toBe('boolean');
        expect(typeof element.associatedWithNHBEA).toBe('boolean');
        expect(element.perceivedProfessionalism).toBeGreaterThanOrEqual(1);
        expect(element.perceivedProfessionalism).toBeLessThanOrEqual(5);
        
        if (element.comments) {
          expect(typeof element.comments).toBe('string');
          expect(element.comments.length).toBeGreaterThan(5);
        }
      });
    });

    test('should include key brand elements in testing', async () => {
      const result = await testBrandRecognition('returning-member');
      
      const elementNames = result.brandElements.map(e => e.element.toLowerCase());
      expect(elementNames.some(name => name.includes('royal blue'))).toBe(true);
      expect(elementNames.some(name => name.includes('logo') || name.includes('typography'))).toBe(true);
      expect(elementNames.some(name => name.includes('navigation'))).toBe(true);
      expect(elementNames.some(name => name.includes('button'))).toBe(true);
    });

    test('should provide meaningful brand recommendations', async () => {
      const result = await testBrandRecognition('mobile-user');
      
      result.recommendations.forEach(recommendation => {
        expect(typeof recommendation).toBe('string');
        expect(recommendation.length).toBeGreaterThan(10);
      });
    });
  });

  describe('Navigation Efficiency Testing', () => {
    test('should test navigation efficiency with brand-enhanced interface', async () => {
      const result = await testNavigationEfficiency('academic-professional');
      
      expect(result.testId).toBeDefined();
      expect(result.participantType).toBe('academic-professional');
      expect(Array.isArray(result.navigationTasks)).toBe(true);
      expect(result.navigationTasks.length).toBeGreaterThan(0);
      expect(result.overallNavigationScore).toBeGreaterThanOrEqual(0);
      expect(result.overallNavigationScore).toBeLessThanOrEqual(100);
      expect(['positive', 'neutral', 'negative']).toContain(result.brandNavigationImpact);
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    test('should evaluate individual navigation tasks', async () => {
      const result = await testNavigationEfficiency('returning-member');
      
      result.navigationTasks.forEach(task => {
        expect(task.task).toBeDefined();
        expect(task.startPage).toBeDefined();
        expect(task.targetPage).toBeDefined();
        expect(task.expectedSteps).toBeGreaterThan(0);
        expect(task.actualSteps).toBeGreaterThan(0);
        expect(task.completionTime).toBeGreaterThan(0);
        expect(typeof task.successful).toBe('boolean');
        expect(Array.isArray(task.difficulties)).toBe(true);
        expect(task.brandHelpfulness).toBeGreaterThanOrEqual(1);
        expect(task.brandHelpfulness).toBeLessThanOrEqual(5);
      });
    });

    test('should include common navigation scenarios', async () => {
      const result = await testNavigationEfficiency('new-visitor');
      
      const taskDescriptions = result.navigationTasks.map(t => t.task.toLowerCase());
      expect(taskDescriptions.some(desc => desc.includes('membership'))).toBe(true);
      expect(taskDescriptions.some(desc => desc.includes('conference'))).toBe(true);
    });

    test('should measure navigation efficiency metrics', async () => {
      const result = await testNavigationEfficiency('mobile-user');
      
      // Should have tasks that test efficiency
      const efficientTasks = result.navigationTasks.filter(t => t.actualSteps <= t.expectedSteps * 1.2);
      expect(efficientTasks.length).toBeGreaterThan(0);
      
      // Should have reasonable completion times
      const reasonableTimeTasks = result.navigationTasks.filter(t => t.completionTime < 60);
      expect(reasonableTimeTasks.length).toBeGreaterThan(0);
    });
  });

  describe('User Satisfaction Analysis', () => {
    test('should analyze user satisfaction metrics', async () => {
      const results = await runUserExperienceValidation(UX_TEST_SCENARIOS.slice(0, 3));
      const analysis = analyzeUserSatisfactionMetrics(results);
      
      expect(analysis.overallSatisfaction).toBeGreaterThanOrEqual(1);
      expect(analysis.overallSatisfaction).toBeLessThanOrEqual(5);
      expect(analysis.taskCompletionRate).toBeGreaterThanOrEqual(0);
      expect(analysis.taskCompletionRate).toBeLessThanOrEqual(100);
      expect(analysis.brandImpactScore).toBeGreaterThanOrEqual(1);
      expect(analysis.brandImpactScore).toBeLessThanOrEqual(5);
      expect(Array.isArray(analysis.criticalIssues)).toBe(true);
      expect(Array.isArray(analysis.recommendations)).toBe(true);
      expect(analysis.comparisonMetrics).toBeDefined();
    });

    test('should provide pre/post brand implementation comparison', async () => {
      const results = await runUserExperienceValidation(UX_TEST_SCENARIOS.slice(0, 2));
      const analysis = analyzeUserSatisfactionMetrics(results);
      
      expect(analysis.comparisonMetrics.preBrandImplementation).toBeDefined();
      expect(analysis.comparisonMetrics.postBrandImplementation).toBeDefined();
      expect(analysis.comparisonMetrics.improvement).toBeDefined();
      
      const pre = analysis.comparisonMetrics.preBrandImplementation!;
      const post = analysis.comparisonMetrics.postBrandImplementation;
      const improvement = analysis.comparisonMetrics.improvement;
      
      expect(pre.satisfactionScore).toBeGreaterThan(0);
      expect(pre.completionRate).toBeGreaterThan(0);
      expect(pre.averageTaskTime).toBeGreaterThan(0);
      
      expect(post.satisfactionScore).toBeGreaterThan(0);
      expect(post.completionRate).toBeGreaterThan(0);
      expect(post.averageTaskTime).toBeGreaterThan(0);
      
      expect(typeof improvement.satisfactionImprovement).toBe('number');
      expect(typeof improvement.completionRateImprovement).toBe('number');
      expect(typeof improvement.taskTimeImprovement).toBe('number');
    });

    test('should identify critical usability issues', async () => {
      const results = await runUserExperienceValidation(UX_TEST_SCENARIOS);
      const analysis = analyzeUserSatisfactionMetrics(results);
      
      analysis.criticalIssues.forEach(issue => {
        expect(typeof issue).toBe('string');
        expect(issue.length).toBeGreaterThan(5);
      });
    });

    test('should generate meaningful recommendations', async () => {
      const results = await runUserExperienceValidation(UX_TEST_SCENARIOS.slice(0, 2));
      const analysis = analyzeUserSatisfactionMetrics(results);
      
      analysis.recommendations.forEach(recommendation => {
        expect(typeof recommendation).toBe('string');
        expect(recommendation.length).toBeGreaterThan(15);
      });
    });
  });

  describe('UX Validation Reporting', () => {
    test('should create comprehensive UX validation report', async () => {
      const results = await runUserExperienceValidation(UX_TEST_SCENARIOS.slice(0, 3));
      const report = createUXValidationReport(results);
      
      expect(report.executiveSummary).toBeDefined();
      expect(report.taskCompletionAnalysis).toBeDefined();
      expect(report.brandImpactAnalysis).toBeDefined();
      expect(report.usabilityIssues).toBeDefined();
      expect(report.performanceImpact).toBeDefined();
      expect(Array.isArray(report.recommendations)).toBe(true);
      expect(report.htmlReport).toBeDefined();
    });

    test('should include task completion analysis', async () => {
      const results = await runUserExperienceValidation(UX_TEST_SCENARIOS.slice(0, 2));
      const report = createUXValidationReport(results);
      
      const analysis = report.taskCompletionAnalysis;
      expect(analysis.totalScenarios).toBe(results.length);
      expect(analysis.successfulCompletions).toBeGreaterThanOrEqual(0);
      expect(analysis.averageCompletionTime).toBeGreaterThan(0);
      expect(Array.isArray(analysis.scenarioBreakdown)).toBe(true);
      expect(analysis.scenarioBreakdown.length).toBe(results.length);
      
      analysis.scenarioBreakdown.forEach((scenario: any) => {
        expect(scenario.scenario).toBeDefined();
        expect(scenario.userType).toBeDefined();
        expect(typeof scenario.successful).toBe('boolean');
        expect(scenario.completionTime).toBeGreaterThan(0);
        expect(scenario.stepsCompleted).toBeGreaterThanOrEqual(0);
        expect(scenario.totalSteps).toBeGreaterThan(0);
      });
    });

    test('should include brand impact analysis', async () => {
      const results = await runUserExperienceValidation(UX_TEST_SCENARIOS.slice(0, 2));
      const report = createUXValidationReport(results);
      
      const analysis = report.brandImpactAnalysis;
      expect(analysis.brandRecognitionAverage).toBeGreaterThanOrEqual(1);
      expect(analysis.brandRecognitionAverage).toBeLessThanOrEqual(5);
      expect(analysis.colorSystemRating).toBeGreaterThanOrEqual(1);
      expect(analysis.colorSystemRating).toBeLessThanOrEqual(5);
      expect(analysis.typographyReadability).toBeGreaterThanOrEqual(1);
      expect(analysis.typographyReadability).toBeLessThanOrEqual(5);
      expect(analysis.brandHelpfulness).toBeGreaterThanOrEqual(1);
      expect(analysis.brandHelpfulness).toBeLessThanOrEqual(5);
      expect(Array.isArray(analysis.mostNoticeableBrandElements)).toBe(true);
    });

    test('should categorize usability issues', async () => {
      const results = await runUserExperienceValidation(UX_TEST_SCENARIOS);
      const report = createUXValidationReport(results);
      
      const issues = report.usabilityIssues;
      expect(issues.totalIssues).toBeGreaterThanOrEqual(0);
      expect(issues.criticalIssues).toBeGreaterThanOrEqual(0);
      expect(issues.brandRelatedIssues).toBeGreaterThanOrEqual(0);
      expect(issues.issuesByType).toBeDefined();
      expect(typeof issues.issuesByType.navigation).toBe('number');
      expect(typeof issues.issuesByType.forms).toBe('number');
      expect(typeof issues.issuesByType.performance).toBe('number');
      expect(typeof issues.issuesByType.mobile).toBe('number');
      expect(typeof issues.issuesByType.brandRelated).toBe('number');
    });

    test('should analyze performance impact', async () => {
      const results = await runUserExperienceValidation(UX_TEST_SCENARIOS.slice(0, 2));
      const report = createUXValidationReport(results);
      
      const performance = report.performanceImpact;
      expect(performance.averagePageLoadTime).toBeGreaterThan(0);
      expect(performance.averageInteractionLatency).toBeGreaterThan(0);
      expect(performance.perceivedPerformance).toBeGreaterThanOrEqual(1);
      expect(performance.perceivedPerformance).toBeLessThanOrEqual(5);
    });

    test('should generate HTML report', async () => {
      const results = await runUserExperienceValidation(UX_TEST_SCENARIOS.slice(0, 2));
      const report = createUXValidationReport(results);
      
      expect(typeof report.htmlReport).toBe('string');
      expect(report.htmlReport).toContain('<!DOCTYPE html>');
      expect(report.htmlReport).toContain('NHBEA UX Validation Report');
      expect(report.htmlReport).toContain('Overall Satisfaction');
      expect(report.htmlReport).toContain('Task Completion');
      expect(report.htmlReport).toContain('Brand Impact');
      expect(report.htmlReport.length).toBeGreaterThan(2000);
    });
  });

  describe('Test Scenario Configuration', () => {
    test('should have comprehensive UX test scenarios', () => {
      expect(Array.isArray(UX_TEST_SCENARIOS)).toBe(true);
      expect(UX_TEST_SCENARIOS.length).toBeGreaterThan(0);
      
      UX_TEST_SCENARIOS.forEach(scenario => {
        expect(scenario.id).toBeDefined();
        expect(scenario.name).toBeDefined();
        expect(scenario.description).toBeDefined();
        expect(['new-visitor', 'returning-member', 'academic-professional', 'mobile-user']).toContain(scenario.userType);
        expect(scenario.startPage).toBeDefined();
        expect(scenario.targetOutcome).toBeDefined();
        expect(Array.isArray(scenario.steps)).toBe(true);
        expect(scenario.steps.length).toBeGreaterThan(0);
        expect(Array.isArray(scenario.brandInteractions)).toBe(true);
        expect(scenario.expectedDuration).toBeGreaterThan(0);
        expect(['critical', 'high', 'medium', 'low']).toContain(scenario.priority);
      });
    });

    test('should include all key user types in scenarios', () => {
      const userTypes = UX_TEST_SCENARIOS.map(s => s.userType);
      
      expect(userTypes).toContain('new-visitor');
      expect(userTypes).toContain('returning-member');
      expect(userTypes).toContain('academic-professional');
      expect(userTypes).toContain('mobile-user');
    });

    test('should include critical user journeys', () => {
      const scenarioNames = UX_TEST_SCENARIOS.map(s => s.name.toLowerCase());
      
      expect(scenarioNames.some(name => name.includes('membership'))).toBe(true);
      expect(scenarioNames.some(name => name.includes('conference'))).toBe(true);
      expect(scenarioNames.some(name => name.includes('exploration') || name.includes('exploring'))).toBe(true);
    });

    test('should validate scenario step structure', () => {
      UX_TEST_SCENARIOS.forEach(scenario => {
        scenario.steps.forEach(step => {
          expect(step.action).toBeDefined();
          expect(step.expectedElement).toBeDefined();
          expect(step.successCriteria).toBeDefined();
        });
      });
    });

    test('should include brand interaction tracking', () => {
      UX_TEST_SCENARIOS.forEach(scenario => {
        expect(scenario.brandInteractions.length).toBeGreaterThan(0);
        
        scenario.brandInteractions.forEach(interaction => {
          expect(typeof interaction).toBe('string');
          expect(interaction.length).toBeGreaterThan(0);
        });
      });
    });
  });
});