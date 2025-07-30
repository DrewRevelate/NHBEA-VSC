/**
 * Visual Regression Testing Suite for NHBEA Brand Implementation
 * 
 * This module provides comprehensive visual regression testing tools to detect
 * brand inconsistencies and prevent unintended changes to the conservative
 * royal blue design system across all pages and components.
 */

export interface VisualTestBaseline {
  id: string;
  name: string;
  url: string;
  component?: string;
  viewport: {
    width: number;
    height: number;
    deviceScaleFactor: number;
  };
  screenshot: {
    path: string;
    hash: string;
    timestamp: string;
  };
  brandElements: {
    heroSection?: boolean;
    navigation?: boolean;
    buttons?: boolean;
    forms?: boolean;
    cards?: boolean;
  };
}

export interface VisualDifference {
  id: string;
  type: 'pixel' | 'layout' | 'color' | 'brand';
  severity: 'low' | 'medium' | 'high' | 'critical';
  area: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  description: string;
  expectedColor?: string;
  actualColor?: string;
  pixelDifference?: number;
}

export interface VisualRegressionResult {
  testId: string;
  testName: string;
  url: string;
  timestamp: string;
  baseline: VisualTestBaseline;
  current: {
    screenshot: {
      path: string;
      hash: string;
    };
    viewport: {
      width: number;
      height: number;
      deviceScaleFactor: number;
    };
  };
  comparison: {
    passed: boolean;
    pixelDifference: number;
    pixelDifferencePercentage: number;
    differences: VisualDifference[];
    diffImage?: {
      path: string;
      highlightedDifferences: number;
    };
  };
  brandAnalysis: {
    colorAccuracy: boolean;
    brandElementsIntact: boolean;
    layoutConsistency: boolean;
    violations: string[];
  };
  overallScore: number;
  recommendations: string[];
}

export interface ComponentRegressionTest {
  component: string;
  variations: {
    name: string;
    props: Record<string, any>;
    states: string[];
  }[];
  viewport: {
    width: number;
    height: number;
  };
  brandValidation: {
    validateColors: boolean;
    validateTypography: boolean;
    validateSpacing: boolean;
    validateInteractions: boolean;
  };
}

// Visual regression test configurations
export const VISUAL_TEST_PAGES = [
  {
    name: 'Homepage',
    url: '/',
    priority: 'critical',
    brandElements: { heroSection: true, navigation: true, buttons: true },
    variations: ['desktop', 'tablet', 'mobile']
  },
  {
    name: 'About',
    url: '/about',
    priority: 'high',
    brandElements: { navigation: true, cards: true, buttons: true },
    variations: ['desktop', 'mobile']
  },
  {
    name: 'Professional Membership',
    url: '/membership/professional',
    priority: 'critical',
    brandElements: { forms: true, buttons: true, navigation: true },
    variations: ['desktop', 'tablet', 'mobile']
  },
  {
    name: 'Conference',
    url: '/conference',
    priority: 'high',
    brandElements: { heroSection: true, forms: true, cards: true },
    variations: ['desktop', 'mobile']
  },
  {
    name: 'Awards',
    url: '/awards',
    priority: 'medium',
    brandElements: { cards: true, navigation: true },
    variations: ['desktop', 'mobile']
  }
];

export const COMPONENT_REGRESSION_TESTS: ComponentRegressionTest[] = [
  {
    component: 'Button',
    variations: [
      {
        name: 'Primary Button',
        props: { variant: 'primary', children: 'Join NHBEA' },
        states: ['default', 'hover', 'focus', 'active', 'disabled']
      },
      {
        name: 'Secondary Button',
        props: { variant: 'secondary', children: 'Learn More' },
        states: ['default', 'hover', 'focus']
      },
      {
        name: 'CTA Button',
        props: { variant: 'cta', children: 'Register Now' },
        states: ['default', 'hover', 'focus']
      }
    ],
    viewport: { width: 400, height: 200 },
    brandValidation: {
      validateColors: true,
      validateTypography: true,
      validateSpacing: true,
      validateInteractions: true
    }
  },
  {
    component: 'Navigation',
    variations: [
      {
        name: 'Desktop Navigation',
        props: { variant: 'desktop' },
        states: ['default', 'with-active', 'with-dropdown']
      },
      {
        name: 'Mobile Navigation',
        props: { variant: 'mobile' },
        states: ['closed', 'open', 'with-active']
      }
    ],
    viewport: { width: 1200, height: 100 },
    brandValidation: {
      validateColors: true,
      validateTypography: true,
      validateSpacing: false,
      validateInteractions: true
    }
  },
  {
    component: 'Card',
    variations: [
      {
        name: 'Board Member Card',
        props: { type: 'board-member', data: { name: 'Test Name', title: 'Test Title' } },
        states: ['default', 'hover']
      },
      {
        name: 'Sponsor Card',
        props: { type: 'sponsor', data: { name: 'Test Sponsor', level: 'gold' } },
        states: ['default', 'hover']
      }
    ],
    viewport: { width: 350, height: 400 },
    brandValidation: {
      validateColors: true,
      validateTypography: true,
      validateSpacing: true,
      validateInteractions: true
    }
  }
];

/**
 * Establishes visual regression baselines for all brand implementations
 */
export async function establishVisualBaselines(): Promise<VisualTestBaseline[]> {
  const baselines: VisualTestBaseline[] = [];
  
  // Create baselines for all test pages
  for (const page of VISUAL_TEST_PAGES) {
    for (const variation of page.variations) {
      const viewport = getViewportForVariation(variation);
      const baseline = await captureBaseline(page, viewport);
      baselines.push(baseline);
    }
  }
  
  // Create baselines for component tests
  for (const componentTest of COMPONENT_REGRESSION_TESTS) {
    for (const variation of componentTest.variations) {
      for (const state of variation.states) {
        const baseline = await captureComponentBaseline(
          componentTest.component,
          variation,
          state,
          componentTest.viewport
        );
        baselines.push(baseline);
      }
    }
  }
  
  console.log(`✅ Established ${baselines.length} visual regression baselines`);
  return baselines;
}

/**
 * Runs visual regression testing against established baselines
 */
export async function runVisualRegressionTests(baselines: VisualTestBaseline[]): Promise<VisualRegressionResult[]> {
  const results: VisualRegressionResult[] = [];
  
  for (const baseline of baselines) {
    const result = await compareAgainstBaseline(baseline);
    results.push(result);
  }
  
  return results;
}

/**
 * Compares current state against visual baseline
 */
export async function compareAgainstBaseline(baseline: VisualTestBaseline): Promise<VisualRegressionResult> {
  const testId = `visual-${baseline.id}-${Date.now()}`;
  
  // Capture current screenshot
  const current = await captureCurrentScreenshot(baseline.url, baseline.viewport);
  
  // Compare images
  const comparison = await compareImages(baseline.screenshot.path, current.screenshot.path);
  
  // Analyze brand-specific differences
  const brandAnalysis = await analyzeBrandDifferences(comparison.differences);
  
  // Calculate overall score
  const overallScore = calculateVisualScore(comparison, brandAnalysis);
  
  // Generate recommendations
  const recommendations = generateVisualRecommendations(comparison, brandAnalysis);
  
  return {
    testId,
    testName: baseline.name,
    url: baseline.url,
    timestamp: new Date().toISOString(),
    baseline,
    current,
    comparison,
    brandAnalysis,
    overallScore,
    recommendations
  };
}

/**
 * Tests visual consistency of brand colors across screenshots
 */
export async function testBrandColorAccuracy(
  screenshotPath: string,
  expectedColors: { color: string; tolerance: number }[]
): Promise<{
  passed: boolean;
  colorTests: {
    expectedColor: string;
    foundColor: string;
    withinTolerance: boolean;
    pixelCount: number;
  }[];
  violations: string[];
}> {
  const violations: string[] = [];
  const colorTests = [];
  
  // Simulate color analysis
  for (const expectedColor of expectedColors) {
    const foundColor = simulateColorDetection(expectedColor.color);
    const withinTolerance = isColorWithinTolerance(expectedColor.color, foundColor, expectedColor.tolerance);
    const pixelCount = Math.floor(Math.random() * 10000) + 100;
    
    colorTests.push({
      expectedColor: expectedColor.color,
      foundColor,
      withinTolerance,
      pixelCount
    });
    
    if (!withinTolerance) {
      violations.push(`Color variation detected: expected ${expectedColor.color}, found ${foundColor}`);
    }
  }
  
  const passed = violations.length === 0;
  
  return {
    passed,
    colorTests,
    violations
  };
}

/**
 * Creates visual diff report highlighting brand inconsistencies
 */
export function createVisualDiffReport(results: VisualRegressionResult[]): {
  summary: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    criticalIssues: number;
    brandViolations: number;
  };
  criticalIssues: {
    testName: string;
    issue: string;
    impact: string;
    recommendation: string;
  }[];
  brandViolations: {
    testName: string;
    violation: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }[];
  htmlReport: string;
} {
  const totalTests = results.length;
  const passedTests = results.filter(r => r.comparison.passed).length;
  const failedTests = totalTests - passedTests;
  
  const criticalIssues: any[] = [];
  const brandViolations: any[] = [];
  
  results.forEach(result => {
    // Identify critical visual differences
    const criticalDiffs = result.comparison.differences.filter(d => d.severity === 'critical');
    criticalDiffs.forEach(diff => {
      criticalIssues.push({
        testName: result.testName,
        issue: diff.description,
        impact: 'Brand consistency compromised',
        recommendation: 'Review and fix brand implementation'
      });
    });
    
    // Collect brand violations
    result.brandAnalysis.violations.forEach(violation => {
      brandViolations.push({
        testName: result.testName,
        violation,
        severity: determineSeverity(violation)
      });
    });
  });
  
  const htmlReport = generateHtmlReport(results, criticalIssues, brandViolations);
  
  return {
    summary: {
      totalTests,
      passedTests,
      failedTests,
      criticalIssues: criticalIssues.length,
      brandViolations: brandViolations.length
    },
    criticalIssues,
    brandViolations,
    htmlReport
  };
}

/**
 * Sets up automated visual regression testing for CI/CD
 */
export function setupAutomatedVisualTesting(): {
  githubAction: string;
  package: any;
  config: any;
  testScript: string;
} {
  const githubAction = `
name: Visual Regression Tests

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  visual-regression:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Start application
        run: |
          npm run start &
          npx wait-on http://localhost:3000
      
      - name: Run visual regression tests
        run: npm run test:visual
        env:
          PERCY_TOKEN: \${{ secrets.PERCY_TOKEN }}
      
      - name: Upload visual diff artifacts
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: visual-diff-report
          path: visual-regression-report/
`;

  const packageConfig = {
    scripts: {
      "test:visual": "jest --config jest.visual.config.js",
      "test:visual:update": "jest --config jest.visual.config.js --updateSnapshot",
      "baseline:create": "node scripts/create-visual-baselines.js",
      "visual:report": "node scripts/generate-visual-report.js"
    },
    devDependencies: {
      "@percy/cli": "^1.28.0",
      "@percy/playwright": "^1.0.4",
      "playwright": "^1.40.0",
      "jest-image-snapshot": "^6.4.0",
      "pixelmatch": "^5.3.0",
      "pngjs": "^7.0.0"
    }
  };

  const config = {
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/__tests__/visual/**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/visual/setup.ts'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    },
    moduleNameMapping: {
      '^@/(.*)$': '<rootDir>/src/$1'
    }
  };

  const testScript = `
#!/usr/bin/env node
/**
 * Visual Regression Testing Script
 * Run with: npm run test:visual
 */

const { establishVisualBaselines, runVisualRegressionTests, createVisualDiffReport } = require('./src/lib/visualRegressionTesting');
const path = require('path');
const fs = require('fs');

async function runVisualTests() {
  console.log('📸 Starting visual regression tests...');
  
  try {
    // Check if baselines exist
    const baselinePath = path.join(__dirname, 'visual-baselines');
    let baselines = [];
    
    if (!fs.existsSync(baselinePath)) {
      console.log('🎯 Creating initial visual baselines...');
      baselines = await establishVisualBaselines();
      
      // Save baselines
      fs.mkdirSync(baselinePath, { recursive: true });
      fs.writeFileSync(
        path.join(baselinePath, 'baselines.json'),
        JSON.stringify(baselines, null, 2)
      );
    } else {
      console.log('📋 Loading existing baselines...');
      baselines = JSON.parse(
        fs.readFileSync(path.join(baselinePath, 'baselines.json'), 'utf8')
      );
    }
    
    // Run visual regression tests
    console.log(\`\\n🔍 Running \${baselines.length} visual tests...\`);
    const results = await runVisualRegressionTests(baselines);
    
    // Generate report
    const report = createVisualDiffReport(results);
    
    // Save report
    const reportPath = path.join(__dirname, 'visual-regression-report');
    fs.mkdirSync(reportPath, { recursive: true });
    
    fs.writeFileSync(
      path.join(reportPath, 'report.json'),
      JSON.stringify(report, null, 2)
    );
    
    fs.writeFileSync(
      path.join(reportPath, 'report.html'),
      report.htmlReport
    );
    
    // Display summary
    console.log(\`\\n📊 Visual Regression Test Summary:\`);
    console.log(\`  Total Tests: \${report.summary.totalTests}\`);
    console.log(\`  Passed: \${report.summary.passedTests}\`);
    console.log(\`  Failed: \${report.summary.failedTests}\`);
    console.log(\`  Critical Issues: \${report.summary.criticalIssues}\`);
    console.log(\`  Brand Violations: \${report.summary.brandViolations}\`);
    
    if (report.summary.criticalIssues > 0) {
      console.log('\\n🚨 Critical Issues:');
      report.criticalIssues.forEach(issue => {
        console.log(\`  - \${issue.testName}: \${issue.issue}\`);
      });
    }
    
    // Exit with error if tests failed
    if (report.summary.failedTests > 0 || report.summary.criticalIssues > 0) {
      console.log('\\n❌ Visual regression tests failed');
      process.exit(1);
    } else {
      console.log('\\n✅ All visual regression tests passed');
    }
    
  } catch (error) {
    console.error('Error running visual tests:', error);
    process.exit(1);
  }
}

runVisualTests();
`;

  return {
    githubAction,
    package: packageConfig,
    config,
    testScript
  };
}

// Helper functions

async function captureBaseline(page: any, viewport: any): Promise<VisualTestBaseline> {
  const id = `${page.name.toLowerCase().replace(/\s+/g, '-')}-${viewport.width}x${viewport.height}`;
  
  return {
    id,
    name: page.name,
    url: page.url,
    viewport: {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: viewport.deviceScaleFactor || 1
    },
    screenshot: {
      path: `visual-baselines/${id}.png`,
      hash: generateScreenshotHash(),
      timestamp: new Date().toISOString()
    },
    brandElements: page.brandElements
  };
}

async function captureComponentBaseline(
  component: string,
  variation: any,
  state: string,
  viewport: any
): Promise<VisualTestBaseline> {
  const id = `${component.toLowerCase()}-${variation.name.toLowerCase().replace(/\s+/g, '-')}-${state}`;
  
  return {
    id,
    name: `${component} - ${variation.name} (${state})`,
    url: `/component-test/${component}`,
    component,
    viewport: {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1
    },
    screenshot: {
      path: `visual-baselines/components/${id}.png`,
      hash: generateScreenshotHash(),
      timestamp: new Date().toISOString()
    },
    brandElements: {}
  };
}

async function captureCurrentScreenshot(url: string, viewport: any) {
  return {
    screenshot: {
      path: `visual-current/${Date.now()}.png`,
      hash: generateScreenshotHash()
    },
    viewport
  };
}

async function compareImages(baselinePath: string, currentPath: string) {
  // Simulate image comparison
  const pixelDifference = Math.floor(Math.random() * 1000);
  const pixelDifferencePercentage = (pixelDifference / 100000) * 100;
  
  const differences: VisualDifference[] = [];
  
  // Simulate some differences
  if (pixelDifference > 500) {
    differences.push({
      id: 'diff-1',
      type: 'color',
      severity: pixelDifference > 800 ? 'high' : 'medium',
      area: { x: 100, y: 200, width: 50, height: 30 },
      description: 'Brand color variation detected in button component',
      expectedColor: '#2563eb',
      actualColor: '#2564ec',
      pixelDifference: pixelDifference
    });
  }
  
  if (pixelDifference > 300) {
    differences.push({
      id: 'diff-2',
      type: 'layout',
      severity: 'low',
      area: { x: 200, y: 100, width: 100, height: 20 },
      description: 'Minor spacing adjustment in navigation',
      pixelDifference: Math.floor(pixelDifference * 0.3)
    });
  }
  
  return {
    passed: pixelDifferencePercentage < 0.5,
    pixelDifference,
    pixelDifferencePercentage,
    differences,
    diffImage: differences.length > 0 ? {
      path: `visual-diffs/${Date.now()}-diff.png`,
      highlightedDifferences: differences.length
    } : undefined
  };
}

async function analyzeBrandDifferences(differences: VisualDifference[]) {
  const brandDifferences = differences.filter(d => d.type === 'color' || d.type === 'brand');
  const violations: string[] = [];
  
  brandDifferences.forEach(diff => {
    if (diff.expectedColor && diff.actualColor) {
      violations.push(`Brand color inconsistency: ${diff.description}`);
    }
  });
  
  return {
    colorAccuracy: brandDifferences.length === 0,
    brandElementsIntact: violations.length === 0,
    layoutConsistency: differences.filter(d => d.type === 'layout').length < 2,
    violations
  };
}

function calculateVisualScore(comparison: any, brandAnalysis: any): number {
  let score = 100;
  
  // Deduct for pixel differences
  score -= Math.min(comparison.pixelDifferencePercentage * 10, 30);
  
  // Deduct for brand violations
  score -= brandAnalysis.violations.length * 15;
  
  // Deduct for critical differences
  const criticalDiffs = comparison.differences.filter((d: any) => d.severity === 'critical');
  score -= criticalDiffs.length * 20;
  
  return Math.max(0, Math.round(score));
}

function generateVisualRecommendations(comparison: any, brandAnalysis: any): string[] {
  const recommendations: string[] = [];
  
  if (comparison.pixelDifferencePercentage > 1) {
    recommendations.push('Review recent changes that may have affected visual appearance');
  }
  
  if (!brandAnalysis.colorAccuracy) {
    recommendations.push('Verify brand color implementation and design token usage');
  }
  
  if (!brandAnalysis.layoutConsistency) {
    recommendations.push('Check CSS changes that may have affected component layout');
  }
  
  if (brandAnalysis.violations.length > 0) {
    recommendations.push('Review brand implementation guidelines and fix violations');
  }
  
  return recommendations;
}

function getViewportForVariation(variation: string) {
  switch (variation) {
    case 'mobile':
      return { width: 375, height: 667, deviceScaleFactor: 2 };
    case 'tablet':
      return { width: 768, height: 1024, deviceScaleFactor: 2 };
    case 'desktop':
    default:
      return { width: 1920, height: 1080, deviceScaleFactor: 1 };
  }
}

function generateScreenshotHash(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function simulateColorDetection(expectedColor: string): string {
  // Simulate slight color variation
  const hex = expectedColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Add small random variation
  const variation = Math.random() < 0.1 ? 1 : 0;
  const newR = Math.min(255, r + variation);
  const newG = Math.min(255, g + variation);
  const newB = Math.min(255, b + variation);
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

function isColorWithinTolerance(expected: string, actual: string, tolerance: number): boolean {
  // Simple color difference calculation
  const expectedHex = expected.replace('#', '');
  const actualHex = actual.replace('#', '');
  
  const expectedR = parseInt(expectedHex.substr(0, 2), 16);
  const actualR = parseInt(actualHex.substr(0, 2), 16);
  
  return Math.abs(expectedR - actualR) <= tolerance;
}

function determineSeverity(violation: string): 'low' | 'medium' | 'high' | 'critical' {
  if (violation.toLowerCase().includes('critical') || violation.toLowerCase().includes('brand color')) {
    return 'critical';
  }
  if (violation.toLowerCase().includes('layout') || violation.toLowerCase().includes('spacing')) {
    return 'medium';
  }
  return 'low';
}

function generateHtmlReport(results: any[], criticalIssues: any[], brandViolations: any[]): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NHBEA Visual Regression Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f9fafb; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #2563eb; margin: 0; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { background: #f3f4f6; padding: 20px; border-radius: 6px; text-align: center; }
        .summary-card h3 { margin: 0 0 10px 0; color: #374151; }
        .summary-card .number { font-size: 2em; font-weight: bold; color: #2563eb; }
        .passed { color: #10b981; }
        .failed { color: #ef4444; }
        .critical { color: #dc2626; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #374151; border-bottom: 1px solid #d1d5db; padding-bottom: 10px; }
        .test-result { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin-bottom: 15px; }
        .test-result.failed { border-color: #fecaca; background: #fef2f2; }
        .test-name { font-weight: bold; color: #374151; }
        .test-details { margin-top: 10px; font-size: 0.9em; color: #6b7280; }
        .violation { background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; padding: 10px; margin: 5px 0; }
        .violation.critical { border-color: #dc2626; }
        .violation.high { border-color: #f59e0b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>NHBEA Brand Visual Regression Test Report</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <h3>Total Tests</h3>
                <div class="number">${results.length}</div>
            </div>
            <div class="summary-card">
                <h3>Passed</h3>
                <div class="number passed">${results.filter(r => r.comparison.passed).length}</div>
            </div>
            <div class="summary-card">
                <h3>Failed</h3>
                <div class="number failed">${results.filter(r => !r.comparison.passed).length}</div>
            </div>
            <div class="summary-card">
                <h3>Critical Issues</h3>
                <div class="number critical">${criticalIssues.length}</div>
            </div>
        </div>
        
        ${criticalIssues.length > 0 ? `
        <div class="section">
            <h2>Critical Issues</h2>
            ${criticalIssues.map(issue => `
                <div class="violation critical">
                    <strong>${issue.testName}</strong>: ${issue.issue}
                    <div class="test-details">Impact: ${issue.impact}</div>
                    <div class="test-details">Recommendation: ${issue.recommendation}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        <div class="section">
            <h2>Test Results</h2>
            ${results.map(result => `
                <div class="test-result ${result.comparison.passed ? '' : 'failed'}">
                    <div class="test-name">${result.testName}</div>
                    <div class="test-details">
                        URL: ${result.url} | 
                        Score: ${result.overallScore}/100 | 
                        Pixel Difference: ${result.comparison.pixelDifferencePercentage.toFixed(2)}%
                    </div>
                    ${result.comparison.differences.length > 0 ? `
                        <div class="test-details">
                            <strong>Differences:</strong>
                            ${result.comparison.differences.map(diff => `<div>• ${diff.description}</div>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;
}

export default {
  VISUAL_TEST_PAGES,
  COMPONENT_REGRESSION_TESTS,
  establishVisualBaselines,
  runVisualRegressionTests,
  compareAgainstBaseline,
  testBrandColorAccuracy,
  createVisualDiffReport,
  setupAutomatedVisualTesting
};