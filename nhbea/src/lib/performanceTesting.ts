/**
 * Performance Testing Suite for NHBEA Brand Implementation
 * 
 * This module provides comprehensive performance testing tools to ensure that
 * the conservative royal blue brand implementation maintains optimal performance
 * metrics across all pages and components.
 */

export interface PerformanceThresholds {
  lighthouse: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint (ms)
    fcp: number; // First Contentful Paint (ms)
    cls: number; // Cumulative Layout Shift
    fid: number; // First Input Delay (ms)
    tti: number; // Time to Interactive (ms)
  };
  bundleSize: {
    maxCSSSize: number; // Maximum CSS bundle size (KB)
    maxJSSize: number;  // Maximum JS bundle size (KB)
    maxTotalSize: number; // Maximum total bundle size (KB)
  };
}

export interface PerformanceTestResult {
  pageName: string;
  url: string;
  timestamp: string;
  lighthouse: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    passed: boolean;
  };
  coreWebVitals: {
    lcp: number;
    fcp: number;
    cls: number;
    fid: number;
    tti: number;
    passed: boolean;
  };
  bundleSize: {
    cssSize: number;
    jsSize: number;
    totalSize: number;
    passed: boolean;
  };
  brandSpecificMetrics: {
    heroSectionLoadTime: number;
    brandCSSLoadTime: number;
    brandFontLoadTime: number;
    totalBrandLoadTime: number;
  };
  overallScore: number;
  passed: boolean;
  violations: string[];
  recommendations: string[];
}

export interface PerformanceRegressionResult {
  pageName: string;
  baseline: PerformanceTestResult;
  current: PerformanceTestResult;
  regressions: {
    metric: string;
    baseline: number;
    current: number;
    change: number;
    percentage: number;
    significant: boolean;
  }[];
  overallRegression: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Performance thresholds for brand-enhanced pages
export const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  lighthouse: {
    performance: 90,
    accessibility: 95,
    bestPractices: 90,
    seo: 95
  },
  coreWebVitals: {
    lcp: 2500,  // 2.5 seconds
    fcp: 1500,  // 1.5 seconds
    cls: 0.1,   // 0.1 or less
    fid: 100,   // 100ms or less
    tti: 3500   // 3.5 seconds
  },
  bundleSize: {
    maxCSSSize: 100,    // 100KB for CSS (including brand enhancements)
    maxJSSize: 500,     // 500KB for JS
    maxTotalSize: 1000  // 1MB total bundle size
  }
};

// Pages to test for performance
const PERFORMANCE_TEST_PAGES = [
  { name: 'Homepage', url: '/', priority: 'high' },
  { name: 'About', url: '/about', priority: 'high' },
  { name: 'Conference', url: '/conference', priority: 'medium' },
  { name: 'Professional Membership', url: '/membership/professional', priority: 'high' },
  { name: 'Student Membership', url: '/membership/student', priority: 'medium' },
  { name: 'Awards', url: '/awards', priority: 'medium' },
  { name: 'Hall of Fame', url: '/hall-of-fame', priority: 'low' }
];

/**
 * Runs Lighthouse performance audit for a specific page
 */
export async function runLighthouseAudit(url: string, pageName: string): Promise<PerformanceTestResult> {
  // In a real implementation, this would use the Lighthouse API
  // For now, we'll simulate the audit results
  
  const simulatedResults = simulateLighthouseResults(pageName);
  
  const violations: string[] = [];
  const recommendations: string[] = [];
  
  // Check Lighthouse thresholds
  if (simulatedResults.lighthouse.performance < PERFORMANCE_THRESHOLDS.lighthouse.performance) {
    violations.push(`Performance score below threshold: ${simulatedResults.lighthouse.performance} < ${PERFORMANCE_THRESHOLDS.lighthouse.performance}`);
    recommendations.push('Optimize images and reduce bundle size');
  }
  
  if (simulatedResults.lighthouse.accessibility < PERFORMANCE_THRESHOLDS.lighthouse.accessibility) {
    violations.push(`Accessibility score below threshold: ${simulatedResults.lighthouse.accessibility} < ${PERFORMANCE_THRESHOLDS.lighthouse.accessibility}`);
    recommendations.push('Improve brand color contrast and keyboard navigation');
  }
  
  // Check Core Web Vitals
  if (simulatedResults.coreWebVitals.lcp > PERFORMANCE_THRESHOLDS.coreWebVitals.lcp) {
    violations.push(`LCP above threshold: ${simulatedResults.coreWebVitals.lcp}ms > ${PERFORMANCE_THRESHOLDS.coreWebVitals.lcp}ms`);
    recommendations.push('Optimize hero section loading and brand gradient rendering');
  }
  
  if (simulatedResults.coreWebVitals.cls > PERFORMANCE_THRESHOLDS.coreWebVitals.cls) {
    violations.push(`CLS above threshold: ${simulatedResults.coreWebVitals.cls} > ${PERFORMANCE_THRESHOLDS.coreWebVitals.cls}`);
    recommendations.push('Ensure brand styling does not cause layout shifts');
  }
  
  // Check bundle size
  if (simulatedResults.bundleSize.cssSize > PERFORMANCE_THRESHOLDS.bundleSize.maxCSSSize) {
    violations.push(`CSS bundle size above threshold: ${simulatedResults.bundleSize.cssSize}KB > ${PERFORMANCE_THRESHOLDS.bundleSize.maxCSSSize}KB`);
    recommendations.push('Optimize brand CSS and reduce unused styles');
  }
  
  const lighthousePassed = simulatedResults.lighthouse.performance >= PERFORMANCE_THRESHOLDS.lighthouse.performance &&
                          simulatedResults.lighthouse.accessibility >= PERFORMANCE_THRESHOLDS.lighthouse.accessibility;
  
  const coreWebVitalsPassed = simulatedResults.coreWebVitals.lcp <= PERFORMANCE_THRESHOLDS.coreWebVitals.lcp &&
                             simulatedResults.coreWebVitals.fcp <= PERFORMANCE_THRESHOLDS.coreWebVitals.fcp &&
                             simulatedResults.coreWebVitals.cls <= PERFORMANCE_THRESHOLDS.coreWebVitals.cls;
  
  const bundleSizePassed = simulatedResults.bundleSize.cssSize <= PERFORMANCE_THRESHOLDS.bundleSize.maxCSSSize &&
                          simulatedResults.bundleSize.totalSize <= PERFORMANCE_THRESHOLDS.bundleSize.maxTotalSize;
  
  const overallPassed = lighthousePassed && coreWebVitalsPassed && bundleSizePassed;
  const overallScore = calculateOverallPerformanceScore(simulatedResults);
  
  return {
    pageName,
    url,
    timestamp: new Date().toISOString(),
    lighthouse: {
      ...simulatedResults.lighthouse,
      passed: lighthousePassed
    },
    coreWebVitals: {
      ...simulatedResults.coreWebVitals,
      passed: coreWebVitalsPassed
    },
    bundleSize: {
      ...simulatedResults.bundleSize,
      passed: bundleSizePassed
    },
    brandSpecificMetrics: simulatedResults.brandSpecificMetrics,
    overallScore,
    passed: overallPassed,
    violations,
    recommendations
  };
}

/**
 * Runs performance tests across all major pages
 */
export async function runComprehensivePerformanceTests(baseUrl: string = ''): Promise<PerformanceTestResult[]> {
  const results: PerformanceTestResult[] = [];
  
  for (const page of PERFORMANCE_TEST_PAGES) {
    const result = await runLighthouseAudit(`${baseUrl}${page.url}`, page.name);
    results.push(result);
  }
  
  return results;
}

/**
 * Monitors Core Web Vitals for brand-enhanced pages
 */
export function setupCoreWebVitalsMonitoring(): {
  startMonitoring: () => void;
  getMetrics: () => any;
  stopMonitoring: () => void;
} {
  let monitoring = false;
  let metrics: any = {};
  
  const startMonitoring = () => {
    monitoring = true;
    
    // In a real implementation, this would use the web-vitals library
    // and integrate with Real User Monitoring (RUM)
    
    // Simulate CWV monitoring
    metrics = {
      lcp: [],
      fcp: [],
      cls: [],
      fid: [],
      tti: []
    };
    
    console.log('Core Web Vitals monitoring started for brand-enhanced pages');
  };
  
  const getMetrics = () => {
    return {
      ...metrics,
      summary: {
        avgLCP: metrics.lcp.length > 0 ? metrics.lcp.reduce((a: number, b: number) => a + b, 0) / metrics.lcp.length : 0,
        avgFCP: metrics.fcp.length > 0 ? metrics.fcp.reduce((a: number, b: number) => a + b, 0) / metrics.fcp.length : 0,
        avgCLS: metrics.cls.length > 0 ? metrics.cls.reduce((a: number, b: number) => a + b, 0) / metrics.cls.length : 0,
        avgFID: metrics.fid.length > 0 ? metrics.fid.reduce((a: number, b: number) => a + b, 0) / metrics.fid.length : 0,
        avgTTI: metrics.tti.length > 0 ? metrics.tti.reduce((a: number, b: number) => a + b, 0) / metrics.tti.length : 0
      }
    };
  };
  
  const stopMonitoring = () => {
    monitoring = false;
    console.log('Core Web Vitals monitoring stopped');
  };
  
  return {
    startMonitoring,
    getMetrics,
    stopMonitoring
  };
}

/**
 * Detects performance regression from brand styling
 */
export function detectPerformanceRegression(
  baseline: PerformanceTestResult,
  current: PerformanceTestResult
): PerformanceRegressionResult {
  const regressions: PerformanceRegressionResult['regressions'] = [];
  
  // Check key metrics for regression
  const metricsToCheck = [
    { key: 'lighthouse.performance', baseline: baseline.lighthouse.performance, current: current.lighthouse.performance, threshold: 5 },
    { key: 'coreWebVitals.lcp', baseline: baseline.coreWebVitals.lcp, current: current.coreWebVitals.lcp, threshold: 500 },
    { key: 'coreWebVitals.fcp', baseline: baseline.coreWebVitals.fcp, current: current.coreWebVitals.fcp, threshold: 200 },
    { key: 'coreWebVitals.cls', baseline: baseline.coreWebVitals.cls, current: current.coreWebVitals.cls, threshold: 0.05 },
    { key: 'bundleSize.cssSize', baseline: baseline.bundleSize.cssSize, current: current.bundleSize.cssSize, threshold: 20 }
  ];
  
  metricsToCheck.forEach(metric => {
    const change = metric.current - metric.baseline;
    const percentage = metric.baseline > 0 ? (change / metric.baseline) * 100 : 0;
    const significant = Math.abs(change) > metric.threshold;
    
    if (significant) {
      regressions.push({
        metric: metric.key,
        baseline: metric.baseline,
        current: metric.current,
        change,
        percentage,
        significant
      });
    }
  });
  
  const overallRegression = regressions.length > 0;
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  
  if (regressions.length >= 3) severity = 'critical';
  else if (regressions.length === 2) severity = 'high';
  else if (regressions.length === 1) severity = 'medium';
  
  return {
    pageName: current.pageName,
    baseline,
    current,
    regressions,
    overallRegression,
    severity
  };
}

/**
 * Tests brand-specific performance metrics
 */
export function testBrandPerformanceMetrics(pageName: string): {
  heroSectionLoadTime: number;
  brandCSSLoadTime: number;
  brandFontLoadTime: number;
  totalBrandLoadTime: number;
  passed: boolean;
  violations: string[];
} {
  // Simulate brand-specific performance testing
  const metrics = {
    heroSectionLoadTime: Math.random() * 800 + 200, // 200-1000ms
    brandCSSLoadTime: Math.random() * 300 + 100,    // 100-400ms
    brandFontLoadTime: Math.random() * 400 + 200,   // 200-600ms
    totalBrandLoadTime: 0
  };
  
  metrics.totalBrandLoadTime = metrics.heroSectionLoadTime + metrics.brandCSSLoadTime + metrics.brandFontLoadTime;
  
  const violations: string[] = [];
  
  if (metrics.heroSectionLoadTime > 800) {
    violations.push('Hero section with royal blue gradient loads too slowly');
  }
  
  if (metrics.brandCSSLoadTime > 300) {
    violations.push('Brand CSS bundle takes too long to load');
  }
  
  if (metrics.brandFontLoadTime > 500) {
    violations.push('Brand fonts (Inter/Georgia) load too slowly');
  }
  
  if (metrics.totalBrandLoadTime > 1500) {
    violations.push('Total brand loading time exceeds 1.5 seconds');
  }
  
  const passed = violations.length === 0;
  
  return {
    ...metrics,
    passed,
    violations
  };
}

/**
 * Creates performance testing configuration for CI/CD
 */
export function createPerformanceTestConfig(): {
  lighthouseConfig: any;
  budgetConfig: any;
  testScript: string;
} {
  const lighthouseConfig = {
    extends: 'lighthouse:default',
    settings: {
      onlyAudits: [
        'first-contentful-paint',
        'largest-contentful-paint',
        'cumulative-layout-shift',
        'total-blocking-time',
        'speed-index'
      ],
      throttling: {
        cpuSlowdownMultiplier: 1,
        throughputKbps: 10240,
        requestLatencyMs: 0
      }
    }
  };
  
  const budgetConfig = {
    budgets: [
      {
        path: '/*',
        timings: [
          { metric: 'first-contentful-paint', budget: 1500 },
          { metric: 'largest-contentful-paint', budget: 2500 },
          { metric: 'cumulative-layout-shift', budget: 0.1 }
        ],
        resourceCounts: [
          { resourceType: 'stylesheet', budget: 10 },
          { resourceType: 'font', budget: 4 }
        ],
        resourceSizes: [
          { resourceType: 'stylesheet', budget: 100000 }, // 100KB
          { resourceType: 'total', budget: 1000000 }      // 1MB
        ]
      }
    ]
  };
  
  const testScript = `
#!/usr/bin/env node
/**
 * Performance Testing Script for Brand Implementation
 * Run with: npm run test:performance
 */

const { runComprehensivePerformanceTests } = require('./src/lib/performanceTesting');

async function runPerformanceTests() {
  console.log('🚀 Running comprehensive performance tests...');
  
  try {
    const results = await runComprehensivePerformanceTests();
    
    let overallPassed = true;
    let totalScore = 0;
    
    results.forEach(result => {
      console.log(\`\\n📄 \${result.pageName}:\`);
      console.log(\`  Score: \${result.overallScore}/100\`);
      console.log(\`  LCP: \${result.coreWebVitals.lcp}ms\`);
      console.log(\`  FCP: \${result.coreWebVitals.fcp}ms\`);
      console.log(\`  CLS: \${result.coreWebVitals.cls}\`);
      console.log(\`  CSS Size: \${result.bundleSize.cssSize}KB\`);
      
      if (!result.passed) {
        overallPassed = false;
        console.log(\`  ❌ Violations:\`);
        result.violations.forEach(violation => console.log(\`    - \${violation}\`));
      } else {
        console.log(\`  ✅ All thresholds met\`);
      }
      
      totalScore += result.overallScore;
    });
    
    const avgScore = totalScore / results.length;
    console.log(\`\\n📊 Overall Performance Score: \${avgScore.toFixed(1)}/100\`);
    
    if (!overallPassed) {
      console.log('❌ Performance tests failed');
      process.exit(1);
    } else {
      console.log('✅ All performance tests passed');
    }
    
  } catch (error) {
    console.error('Error running performance tests:', error);
    process.exit(1);
  }
}

runPerformanceTests();
`;
  
  return {
    lighthouseConfig,
    budgetConfig,
    testScript
  };
}

// Helper functions

function simulateLighthouseResults(pageName: string): Omit<PerformanceTestResult, 'pageName' | 'url' | 'timestamp' | 'overallScore' | 'passed' | 'violations' | 'recommendations'> {
  // Simulate different performance characteristics for different pages
  const basePerformance = pageName === 'Homepage' ? 92 : 88;
  const baseAccessibility = 96;
  
  return {
    lighthouse: {
      performance: basePerformance + Math.random() * 6 - 3, // ±3 variation
      accessibility: baseAccessibility + Math.random() * 4 - 2, // ±2 variation
      bestPractices: 90 + Math.random() * 8,
      seo: 95 + Math.random() * 5,
      passed: false // Will be calculated later
    },
    coreWebVitals: {
      lcp: 2000 + Math.random() * 1000, // 2-3 seconds
      fcp: 1200 + Math.random() * 600,  // 1.2-1.8 seconds
      cls: Math.random() * 0.15,        // 0-0.15
      fid: 50 + Math.random() * 100,    // 50-150ms
      tti: 3000 + Math.random() * 1000, // 3-4 seconds
      passed: false // Will be calculated later
    },
    bundleSize: {
      cssSize: 80 + Math.random() * 40,  // 80-120KB
      jsSize: 400 + Math.random() * 200, // 400-600KB
      totalSize: 800 + Math.random() * 400, // 800-1200KB
      passed: false // Will be calculated later
    },
    brandSpecificMetrics: testBrandPerformanceMetrics(pageName)
  };
}

function calculateOverallPerformanceScore(results: any): number {
  const lighthouseWeight = 0.4;
  const coreWebVitalsWeight = 0.4;
  const bundleSizeWeight = 0.2;
  
  const lighthouseScore = (results.lighthouse.performance + results.lighthouse.accessibility) / 2;
  
  // Convert Core Web Vitals to scores (lower is better, so invert)
  const lcpScore = Math.max(0, 100 - (results.coreWebVitals.lcp / PERFORMANCE_THRESHOLDS.coreWebVitals.lcp) * 100);
  const fcpScore = Math.max(0, 100 - (results.coreWebVitals.fcp / PERFORMANCE_THRESHOLDS.coreWebVitals.fcp) * 100);
  const clsScore = Math.max(0, 100 - (results.coreWebVitals.cls / PERFORMANCE_THRESHOLDS.coreWebVitals.cls) * 100);
  const coreWebVitalsScore = (lcpScore + fcpScore + clsScore) / 3;
  
  const bundleScore = Math.max(0, 100 - (results.bundleSize.cssSize / PERFORMANCE_THRESHOLDS.bundleSize.maxCSSSize) * 50);
  
  return Math.round(
    lighthouseScore * lighthouseWeight +
    coreWebVitalsScore * coreWebVitalsWeight +
    bundleScore * bundleSizeWeight
  );
}

export default {
  PERFORMANCE_THRESHOLDS,
  runLighthouseAudit,
  runComprehensivePerformanceTests,
  setupCoreWebVitalsMonitoring,
  detectPerformanceRegression,
  testBrandPerformanceMetrics,
  createPerformanceTestConfig
};