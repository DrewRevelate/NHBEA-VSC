#!/usr/bin/env node

/**
 * NHBEA Brand Validation Runner
 * 
 * Comprehensive brand validation test runner for CI/CD integration
 * Integrates all brand validation modules and generates unified reports
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import brand validation modules
const brandValidation = require('../src/lib/brandValidation');
const cssTokenValidation = require('../src/lib/cssTokenValidation');
const accessibilityTesting = require('../src/lib/accessibilityTesting');
const performanceTesting = require('../src/lib/performanceTesting');
const visualRegressionTesting = require('../src/lib/visualRegressionTesting');
const crossBrowserTesting = require('../src/lib/crossBrowserTesting');
const userExperienceValidation = require('../src/lib/userExperienceValidation');

class BrandValidationRunner {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      overall: { status: 'pass', score: 0 },
      brandConsistency: { violations: 0, colorCompliance: 0, tokenCompliance: 0 },
      performance: { status: 'pass', score: 0, lcp: 0, fcp: 0, cls: 0 },
      accessibility: { violations: 0, score: 0 },
      visualRegression: { changedComponents: 0, status: 'pass' },
      crossBrowser: { supportedBrowsers: 0, failures: 0 }
    };
  }

  async runBrandConsistencyValidation() {
    console.log('🎨 Running brand consistency validation...');
    
    try {
      // Read main CSS file
      const cssPath = path.join(__dirname, '../src/app/globals.css');
      const cssContent = fs.readFileSync(cssPath, 'utf8');

      // Validate 60-30-10 color rule
      const colorRuleResult = await brandValidation.validate60_30_10ColorRule(cssContent);
      
      // Check for unauthorized colors
      const unauthorizedColors = await brandValidation.detectUnauthorizedColorUsage(cssContent);
      
      // Validate design token usage
      const tokenValidation = await cssTokenValidation.validateTokenHierarchy(cssContent);

      this.results.brandConsistency.violations = unauthorizedColors.length;
      this.results.brandConsistency.colorCompliance = colorRuleResult.compliance;
      this.results.brandConsistency.tokenCompliance = tokenValidation.compliance;

      console.log(`✅ Brand consistency: ${this.results.brandConsistency.violations} violations found`);
      
      return this.results.brandConsistency.violations === 0;
    } catch (error) {
      console.error('❌ Brand consistency validation failed:', error.message);
      return false;
    }
  }

  async runPerformanceValidation() {
    console.log('⚡ Running performance validation...');
    
    try {
      // Run Lighthouse performance tests
      const performanceResults = await performanceTesting.runLighthouseAudit('http://localhost:3000');
      
      this.results.performance.score = performanceResults.score;
      this.results.performance.lcp = performanceResults.metrics.lcp;
      this.results.performance.fcp = performanceResults.metrics.fcp;
      this.results.performance.cls = performanceResults.metrics.cls;
      this.results.performance.status = performanceResults.score >= 85 ? 'pass' : 'fail';

      console.log(`✅ Performance: ${this.results.performance.score}/100 (${this.results.performance.status})`);
      
      return this.results.performance.status === 'pass';
    } catch (error) {
      console.error('❌ Performance validation failed:', error.message);
      this.results.performance.status = 'fail';
      return false;
    }
  }

  async runAccessibilityValidation() {
    console.log('♿ Running accessibility validation...');
    
    try {
      // Run axe-core accessibility tests
      const accessibilityResults = await accessibilityTesting.runWCAGComplianceTest('http://localhost:3000');
      
      this.results.accessibility.violations = accessibilityResults.violations.length;
      this.results.accessibility.score = accessibilityResults.score;

      console.log(`✅ Accessibility: ${this.results.accessibility.violations} violations found`);
      
      return this.results.accessibility.violations === 0;
    } catch (error) {
      console.error('❌ Accessibility validation failed:', error.message);
      return false;
    }
  }

  async runVisualRegressionTests() {
    console.log('📸 Running visual regression tests...');
    
    try {
      // Run visual regression testing
      const visualResults = await visualRegressionTesting.runComponentRegressionTests();
      
      this.results.visualRegression.changedComponents = visualResults.changedComponents.length;
      this.results.visualRegression.status = visualResults.status;

      console.log(`✅ Visual regression: ${this.results.visualRegression.changedComponents} components changed`);
      
      return this.results.visualRegression.status === 'pass';
    } catch (error) {
      console.error('❌ Visual regression testing failed:', error.message);
      this.results.visualRegression.status = 'fail';
      return false;
    }
  }

  async runCrossBrowserTests() {
    console.log('🌐 Running cross-browser tests...');
    
    try {
      // Run cross-browser compatibility tests
      const crossBrowserResults = await crossBrowserTesting.runBrowserCompatibilityTests();
      
      this.results.crossBrowser.supportedBrowsers = crossBrowserResults.supportedBrowsers;
      this.results.crossBrowser.failures = crossBrowserResults.failures.length;

      console.log(`✅ Cross-browser: ${this.results.crossBrowser.supportedBrowsers} browsers supported, ${this.results.crossBrowser.failures} failures`);
      
      return this.results.crossBrowser.failures === 0;
    } catch (error) {
      console.error('❌ Cross-browser testing failed:', error.message);
      return false;
    }
  }

  calculateOverallScore() {
    const weights = {
      brandConsistency: 0.25,
      performance: 0.25,
      accessibility: 0.25,
      visualRegression: 0.15,
      crossBrowser: 0.10
    };

    let totalScore = 0;
    
    // Brand consistency score (inverse of violations, max 100)
    const brandScore = Math.max(0, 100 - (this.results.brandConsistency.violations * 10));
    totalScore += brandScore * weights.brandConsistency;
    
    // Performance score (direct from Lighthouse)
    totalScore += this.results.performance.score * weights.performance;
    
    // Accessibility score (inverse of violations, max 100)
    const accessibilityScore = Math.max(0, 100 - (this.results.accessibility.violations * 5));
    totalScore += accessibilityScore * weights.accessibility;
    
    // Visual regression score (binary pass/fail)
    const visualScore = this.results.visualRegression.status === 'pass' ? 100 : 0;
    totalScore += visualScore * weights.visualRegression;
    
    // Cross-browser score (inverse of failures, max 100)
    const crossBrowserScore = Math.max(0, 100 - (this.results.crossBrowser.failures * 20));
    totalScore += crossBrowserScore * weights.crossBrowser;

    this.results.overall.score = Math.round(totalScore);
    this.results.overall.status = totalScore >= 80 ? 'pass' : 'fail';
  }

  generateReport() {
    const reportPath = path.join(__dirname, '../brand-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    console.log('\n📊 Brand Validation Report Generated');
    console.log('=====================================');
    console.log(`Overall Status: ${this.results.overall.status === 'pass' ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Overall Score: ${this.results.overall.score}/100`);
    console.log('');
    console.log('Detailed Results:');
    console.log(`- Brand Consistency: ${this.results.brandConsistency.violations} violations`);
    console.log(`- Performance: ${this.results.performance.score}/100 (${this.results.performance.status})`);
    console.log(`- Accessibility: ${this.results.accessibility.violations} WCAG violations`);
    console.log(`- Visual Regression: ${this.results.visualRegression.changedComponents} components changed`);
    console.log(`- Cross Browser: ${this.results.crossBrowser.failures} browser failures`);
    console.log('');
    console.log(`Full report saved to: ${reportPath}`);

    return this.results.overall.status === 'pass';
  }

  async run() {
    console.log('🚀 Starting NHBEA Brand Validation Suite...\n');

    const tests = [
      { name: 'Brand Consistency', fn: () => this.runBrandConsistencyValidation() },
      { name: 'Performance', fn: () => this.runPerformanceValidation() },
      { name: 'Accessibility', fn: () => this.runAccessibilityValidation() },
      { name: 'Visual Regression', fn: () => this.runVisualRegressionTests() },
      { name: 'Cross Browser', fn: () => this.runCrossBrowserTests() }
    ];

    const results = [];
    
    for (const test of tests) {
      try {
        const passed = await test.fn();
        results.push(passed);
        console.log(`${passed ? '✅' : '❌'} ${test.name} validation ${passed ? 'passed' : 'failed'}\n`);
      } catch (error) {
        console.error(`❌ ${test.name} validation error:`, error.message);
        results.push(false);
      }
    }

    this.calculateOverallScore();
    const allPassed = this.generateReport();

    // Exit with appropriate code for CI/CD
    process.exit(allPassed ? 0 : 1);
  }
}

// CLI execution
if (require.main === module) {
  const runner = new BrandValidationRunner();
  runner.run().catch((error) => {
    console.error('💥 Brand validation runner failed:', error);
    process.exit(1);
  });
}

module.exports = BrandValidationRunner;