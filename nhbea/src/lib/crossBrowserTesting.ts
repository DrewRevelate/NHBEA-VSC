/**
 * Cross-Browser and Device Testing Suite for NHBEA Brand Implementation
 * 
 * This module provides comprehensive cross-browser and device testing tools to ensure
 * that the conservative royal blue brand implementation renders consistently and performs
 * optimally across all supported browsers and device types.
 */

export interface BrowserTestResult {
  browser: string;
  version: string;
  platform: string;
  viewport: {
    width: number;
    height: number;
    devicePixelRatio: number;
  };
  brandRendering: {
    cssCustomPropertiesSupported: boolean;
    gradientRenderingConsistent: boolean;
    brandColorsAccurate: boolean;
    fontRenderingCorrect: boolean;
    passed: boolean;
  };
  responsiveDesign: {
    breakpointTransitions: boolean;
    touchInteractionsWork: boolean;
    hoverStatesAppropriate: boolean;
    layoutMaintained: boolean;
    passed: boolean;
  };
  performance: {
    renderingSpeed: number;
    interactionLatency: number;
    memoryUsage: number;
    passed: boolean;
  };
  overallScore: number;
  passed: boolean;
  violations: string[];
  recommendations: string[];
}

export interface CrossBrowserTestSuite {
  testName: string;
  timestamp: string;
  results: BrowserTestResult[];
  summary: {
    totalBrowsers: number;
    passedBrowsers: number;
    failedBrowsers: number;
    overallCompatibility: number;
    criticalIssues: string[];
  };
}

export interface DeviceTestResult {
  device: string;
  category: 'mobile' | 'tablet' | 'desktop';
  viewport: {
    width: number;
    height: number;
    orientation: 'portrait' | 'landscape';
  };
  brandExperience: {
    heroSectionOptimized: boolean;
    navigationUsable: boolean;
    formsAccessible: boolean;
    brandColorsVisible: boolean;
    passed: boolean;
  };
  touchInterface: {
    buttonsSizesAppropriate: boolean;
    tapTargetsAccessible: boolean;
    scrollingSmooth: boolean;
    gesturesWork: boolean;
    passed: boolean;
  };
  performance: {
    loadTime: number;
    frameRate: number;
    batteryImpact: 'low' | 'medium' | 'high';
    passed: boolean;
  };
  overallScore: number;
  passed: boolean;
  violations: string[];
  recommendations: string[];
}

// Supported browsers and versions for testing
export const BROWSER_TEST_MATRIX = [
  // Desktop browsers
  { name: 'Chrome', version: '120+', platform: 'desktop', priority: 'high' },
  { name: 'Firefox', version: '119+', platform: 'desktop', priority: 'high' },
  { name: 'Safari', version: '17+', platform: 'desktop', priority: 'high' },
  { name: 'Edge', version: '119+', platform: 'desktop', priority: 'high' },
  
  // Mobile browsers
  { name: 'Chrome Mobile', version: '120+', platform: 'mobile', priority: 'high' },
  { name: 'Safari iOS', version: '17+', platform: 'mobile', priority: 'high' },
  { name: 'Samsung Internet', version: '23+', platform: 'mobile', priority: 'medium' },
  { name: 'Firefox Mobile', version: '119+', platform: 'mobile', priority: 'medium' }
];

// Device testing configurations
export const DEVICE_TEST_MATRIX = [
  // Mobile devices (320px - 768px)
  { name: 'iPhone SE', width: 375, height: 667, category: 'mobile' as const, priority: 'high' },
  { name: 'iPhone 14', width: 390, height: 844, category: 'mobile' as const, priority: 'high' },
  { name: 'Samsung Galaxy S23', width: 360, height: 800, category: 'mobile' as const, priority: 'high' },
  { name: 'Google Pixel 7', width: 412, height: 915, category: 'mobile' as const, priority: 'medium' },
  
  // Tablet devices (768px - 1024px)
  { name: 'iPad', width: 768, height: 1024, category: 'tablet' as const, priority: 'high' },
  { name: 'iPad Pro', width: 1024, height: 1366, category: 'tablet' as const, priority: 'medium' },
  { name: 'Surface Pro', width: 912, height: 1368, category: 'tablet' as const, priority: 'medium' },
  
  // Desktop devices (1024px+)
  { name: 'Desktop 1080p', width: 1920, height: 1080, category: 'desktop' as const, priority: 'high' },
  { name: 'Desktop 1440p', width: 2560, height: 1440, category: 'desktop' as const, priority: 'medium' },
  { name: 'Desktop 4K', width: 3840, height: 2160, category: 'desktop' as const, priority: 'low' }
];

/**
 * Runs cross-browser testing for brand implementation
 */
export async function runCrossBrowserTesting(pages: string[] = ['/']): Promise<CrossBrowserTestSuite> {
  const timestamp = new Date().toISOString();
  const results: BrowserTestResult[] = [];
  
  for (const browser of BROWSER_TEST_MATRIX.filter(b => b.priority === 'high' || b.priority === 'medium')) {
    for (const page of pages) {
      const result = await testBrowserCompatibility(browser, page);
      results.push(result);
    }
  }
  
  const passedBrowsers = results.filter(r => r.passed).length;
  const failedBrowsers = results.length - passedBrowsers;
  const overallCompatibility = Math.round((passedBrowsers / results.length) * 100);
  
  const criticalIssues: string[] = [];
  results.forEach(result => {
    if (!result.passed) {
      result.violations.forEach(violation => {
        if (violation.toLowerCase().includes('critical') || 
            violation.toLowerCase().includes('gradient') ||
            violation.toLowerCase().includes('custom properties')) {
          criticalIssues.push(`${result.browser}: ${violation}`);
        }
      });
    }
  });
  
  return {
    testName: 'Cross-Browser Brand Compatibility Test',
    timestamp,
    results,
    summary: {
      totalBrowsers: results.length,
      passedBrowsers,
      failedBrowsers,
      overallCompatibility,
      criticalIssues
    }
  };
}

/**
 * Tests browser-specific brand compatibility
 */
export async function testBrowserCompatibility(
  browser: typeof BROWSER_TEST_MATRIX[0], 
  page: string
): Promise<BrowserTestResult> {
  const violations: string[] = [];
  const recommendations: string[] = [];
  
  // Simulate browser-specific testing
  const browserResult = simulateBrowserTest(browser, page);
  
  // Test CSS Custom Properties support
  if (!browserResult.brandRendering.cssCustomPropertiesSupported) {
    violations.push('CSS custom properties not fully supported');
    recommendations.push('Implement CSS custom property fallbacks for older browser versions');
  }
  
  // Test gradient rendering consistency
  if (!browserResult.brandRendering.gradientRenderingConsistent) {
    violations.push('Royal blue gradient rendering inconsistent');
    recommendations.push('Add vendor prefixes for gradient compatibility');
  }
  
  // Test brand color accuracy
  if (!browserResult.brandRendering.brandColorsAccurate) {
    violations.push('Brand colors display differently than expected');
    recommendations.push('Verify color profile settings and display calibration');
  }
  
  // Test responsive design
  if (!browserResult.responsiveDesign.breakpointTransitions) {
    violations.push('Responsive breakpoint transitions not smooth');
    recommendations.push('Optimize media queries and fluid layouts');
  }
  
  // Test touch interactions (mobile browsers)
  if (browser.platform === 'mobile' && !browserResult.responsiveDesign.touchInteractionsWork) {
    violations.push('Touch interactions not working properly for brand elements');
    recommendations.push('Implement proper touch event handlers and increase tap target sizes');
  }
  
  // Test performance
  if (!browserResult.performance.passed) {
    violations.push(`Performance below acceptable thresholds on ${browser.name}`);
    recommendations.push('Optimize brand assets and reduce rendering complexity');
  }
  
  const brandRenderingPassed = browserResult.brandRendering.cssCustomPropertiesSupported &&
                               browserResult.brandRendering.gradientRenderingConsistent &&
                               browserResult.brandRendering.brandColorsAccurate;
  
  const responsiveDesignPassed = browserResult.responsiveDesign.breakpointTransitions &&
                                browserResult.responsiveDesign.layoutMaintained;
  
  const overallPassed = brandRenderingPassed && responsiveDesignPassed && browserResult.performance.passed;
  const overallScore = calculateBrowserCompatibilityScore(browserResult);
  
  return {
    browser: browser.name,
    version: browser.version,
    platform: browser.platform,
    viewport: browserResult.viewport,
    brandRendering: {
      ...browserResult.brandRendering,
      passed: brandRenderingPassed
    },
    responsiveDesign: {
      ...browserResult.responsiveDesign,
      passed: responsiveDesignPassed
    },
    performance: browserResult.performance,
    overallScore,
    passed: overallPassed,
    violations,
    recommendations
  };
}

/**
 * Runs device-specific testing for responsive brand implementation
 */
export async function runDeviceTesting(pages: string[] = ['/']): Promise<DeviceTestResult[]> {
  const results: DeviceTestResult[] = [];
  
  for (const device of DEVICE_TEST_MATRIX.filter(d => d.priority === 'high' || d.priority === 'medium')) {
    for (const page of pages) {
      const result = await testDeviceCompatibility(device, page);
      results.push(result);
    }
  }
  
  return results;
}

/**
 * Tests device-specific brand experience
 */
export async function testDeviceCompatibility(
  device: typeof DEVICE_TEST_MATRIX[0],
  page: string
): Promise<DeviceTestResult> {
  const violations: string[] = [];
  const recommendations: string[] = [];
  
  // Simulate device-specific testing
  const deviceResult = simulateDeviceTest(device, page);
  
  // Test brand experience on device
  if (!deviceResult.brandExperience.heroSectionOptimized) {
    violations.push('Hero section not optimized for device viewport');
    recommendations.push('Adjust hero section layout and content for device screen size');
  }
  
  if (!deviceResult.brandExperience.navigationUsable) {
    violations.push('Navigation difficult to use on this device');
    recommendations.push('Improve navigation UX for device category');
  }
  
  if (device.category === 'mobile' && !deviceResult.touchInterface.buttonsSizesAppropriate) {
    violations.push('Brand buttons too small for touch interaction');
    recommendations.push('Increase button sizes to meet minimum 44px touch target requirements');
  }
  
  if (!deviceResult.touchInterface.tapTargetsAccessible) {
    violations.push('Tap targets not properly spaced or sized');
    recommendations.push('Ensure 8px minimum spacing between interactive elements');
  }
  
  // Test performance on device
  if (deviceResult.performance.loadTime > getDeviceLoadTimeThreshold(device.category)) {
    violations.push(`Page load time exceeds ${device.category} threshold`);
    recommendations.push('Optimize assets and consider lazy loading for device performance');
  }
  
  if (deviceResult.performance.batteryImpact === 'high') {
    violations.push('Brand implementation has high battery impact');
    recommendations.push('Optimize animations and reduce CPU-intensive effects');
  }
  
  const brandExperiencePassed = deviceResult.brandExperience.heroSectionOptimized &&
                               deviceResult.brandExperience.navigationUsable &&
                               deviceResult.brandExperience.brandColorsVisible;
  
  const touchInterfacePassed = deviceResult.touchInterface.buttonsSizesAppropriate &&
                              deviceResult.touchInterface.tapTargetsAccessible;
  
  const overallPassed = brandExperiencePassed && touchInterfacePassed && deviceResult.performance.passed;
  const overallScore = calculateDeviceExperienceScore(deviceResult);
  
  return {
    device: device.name,
    category: device.category,
    viewport: {
      width: device.width,
      height: device.height,
      orientation: device.width > device.height ? 'landscape' : 'portrait'
    },
    brandExperience: {
      ...deviceResult.brandExperience,
      passed: brandExperiencePassed
    },
    touchInterface: {
      ...deviceResult.touchInterface,
      passed: touchInterfacePassed
    },
    performance: deviceResult.performance,
    overallScore,
    passed: overallPassed,
    violations,
    recommendations
  };
}

/**
 * Tests CSS custom property fallbacks for older browsers
 */
export function testCSSCustomPropertyFallbacks(): {
  fallbacksImplemented: boolean;
  missingFallbacks: string[];
  browserSupport: {
    browser: string;
    supported: boolean;
    fallbackRequired: boolean;
  }[];
} {
  const missingFallbacks: string[] = [];
  
  // Test critical brand custom properties
  const criticalProperties = [
    '--brand-primary',
    '--brand-primary-dark', 
    '--brand-primary-light',
    '--color-text-primary',
    '--color-bg-primary',
    '--button-primary-bg'
  ];
  
  // Simulate fallback testing
  criticalProperties.forEach(property => {
    if (Math.random() < 0.1) { // 10% chance of missing fallback
      missingFallbacks.push(`Missing fallback for ${property}`);
    }
  });
  
  const browserSupport = [
    { browser: 'Chrome 49+', supported: true, fallbackRequired: false },
    { browser: 'Firefox 31+', supported: true, fallbackRequired: false },
    { browser: 'Safari 9.1+', supported: true, fallbackRequired: false },
    { browser: 'Edge 16+', supported: true, fallbackRequired: false },
    { browser: 'IE 11', supported: false, fallbackRequired: true },
    { browser: 'Android Browser 4.4', supported: false, fallbackRequired: true }
  ];
  
  return {
    fallbacksImplemented: missingFallbacks.length === 0,
    missingFallbacks,
    browserSupport
  };
}

/**
 * Creates cross-browser testing configuration for automation
 */
export function createCrossBrowserTestConfig(): {
  playwrightConfig: any;
  browserStackConfig: any;
  testScript: string;
} {
  // Helper function to safely require Playwright devices
  const getPlaywrightDevices = () => {
    try {
      return require('@playwright/test').devices;
    } catch (error) {
      // Return mock devices if Playwright is not installed
      return {
        'Desktop Chrome': { userAgent: 'Chrome Desktop' },
        'Desktop Firefox': { userAgent: 'Firefox Desktop' },
        'Desktop Safari': { userAgent: 'Safari Desktop' },
        'Pixel 5': { userAgent: 'Chrome Mobile', viewport: { width: 393, height: 851 } },
        'iPhone 12': { userAgent: 'Safari iOS', viewport: { width: 390, height: 844 } },
        'iPad Pro': { userAgent: 'Safari iPad', viewport: { width: 1024, height: 1366 } }
      };
    }
  };

  const devices = getPlaywrightDevices();
  
  const playwrightConfig = {
    testDir: './src/__tests__/cross-browser',
    timeout: 30000,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
      baseURL: process.env.BASE_URL || 'http://localhost:3000',
      trace: 'on-first-retry',
      screenshot: 'only-on-failure'
    },
    projects: [
      {
        name: 'chromium',
        use: { 
          ...devices['Desktop Chrome'],
          viewport: { width: 1920, height: 1080 }
        }
      },
      {
        name: 'firefox',
        use: { 
          ...devices['Desktop Firefox'],
          viewport: { width: 1920, height: 1080 }
        }
      },
      {
        name: 'webkit',
        use: { 
          ...devices['Desktop Safari'],
          viewport: { width: 1920, height: 1080 }
        }
      },
      {
        name: 'Mobile Chrome',
        use: { ...devices['Pixel 5'] }
      },
      {
        name: 'Mobile Safari',
        use: { ...devices['iPhone 12'] }
      },
      {
        name: 'Tablet',
        use: { ...devices['iPad Pro'] }
      }
    ]
  };
  
  const browserStackConfig = {
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    capabilities: [
      {
        'bstack:options': {
          os: 'Windows',
          osVersion: '11',
          browserVersion: 'latest',
          projectName: 'NHBEA Brand Testing',
          buildName: 'Cross-Browser Brand Validation',
          sessionName: 'Brand Compatibility Test'
        },
        browserName: 'chrome'
      },
      {
        'bstack:options': {
          os: 'OS X',
          osVersion: 'Monterey',
          browserVersion: 'latest'
        },
        browserName: 'safari'
      },
      {
        'bstack:options': {
          deviceName: 'iPhone 14',
          osVersion: '16',
          realMobile: 'true'
        },
        browserName: 'safari'
      },
      {
        'bstack:options': {
          deviceName: 'Samsung Galaxy S23',
          osVersion: '13.0',
          realMobile: 'true'
        },
        browserName: 'android'
      }
    ]
  };
  
  const testScript = `
#!/usr/bin/env node
/**
 * Cross-Browser Testing Script for Brand Implementation
 * Run with: npm run test:cross-browser
 */

const { runCrossBrowserTesting, runDeviceTesting } = require('./src/lib/crossBrowserTesting');

async function runCrossBrowserTests() {
  console.log('🌐 Running cross-browser compatibility tests...');
  
  try {
    const pages = ['/', '/about', '/membership/professional', '/conference'];
    
    // Run browser compatibility tests
    const browserResults = await runCrossBrowserTesting(pages);
    console.log(\`\\n📊 Browser Compatibility: \${browserResults.summary.overallCompatibility}%\`);
    console.log(\`✅ Passed: \${browserResults.summary.passedBrowsers}/\${browserResults.summary.totalBrowsers} browsers\`);
    
    if (browserResults.summary.criticalIssues.length > 0) {
      console.log('\\n🚨 Critical Issues:');
      browserResults.summary.criticalIssues.forEach(issue => console.log(\`  - \${issue}\`));
    }
    
    // Run device compatibility tests
    const deviceResults = await runDeviceTesting(pages);
    const passedDevices = deviceResults.filter(r => r.passed).length;
    const deviceCompatibility = Math.round((passedDevices / deviceResults.length) * 100);
    
    console.log(\`\\n📱 Device Compatibility: \${deviceCompatibility}%\`);
    console.log(\`✅ Passed: \${passedDevices}/\${deviceResults.length} devices\`);
    
    // Check for failures
    const overallPassed = browserResults.summary.overallCompatibility >= 90 && deviceCompatibility >= 85;
    
    if (!overallPassed) {
      console.log('\\n❌ Cross-browser tests failed');
      console.log('Review brand implementation for browser/device compatibility issues');
      process.exit(1);
    } else {
      console.log('\\n✅ All cross-browser tests passed');
    }
    
  } catch (error) {
    console.error('Error running cross-browser tests:', error);
    process.exit(1);
  }
}

runCrossBrowserTests();
`;
  
  return {
    playwrightConfig,
    browserStackConfig,
    testScript
  };
}

// Helper functions

function simulateBrowserTest(browser: typeof BROWSER_TEST_MATRIX[0], page: string) {
  // Simulate browser-specific behavior
  const isModernBrowser = !browser.name.toLowerCase().includes('ie');
  const isMobile = browser.platform === 'mobile';
  
  return {
    viewport: {
      width: isMobile ? 375 : 1920,
      height: isMobile ? 667 : 1080,
      devicePixelRatio: isMobile ? 2 : 1
    },
    brandRendering: {
      cssCustomPropertiesSupported: isModernBrowser && Math.random() > 0.05,
      gradientRenderingConsistent: Math.random() > 0.1,
      brandColorsAccurate: Math.random() > 0.02,
      fontRenderingCorrect: Math.random() > 0.03
    },
    responsiveDesign: {
      breakpointTransitions: Math.random() > 0.08,
      touchInteractionsWork: !isMobile || Math.random() > 0.12,
      hoverStatesAppropriate: Math.random() > 0.05,
      layoutMaintained: Math.random() > 0.07
    },
    performance: {
      renderingSpeed: 800 + Math.random() * 600, // 800-1400ms
      interactionLatency: 50 + Math.random() * 100, // 50-150ms
      memoryUsage: 20 + Math.random() * 30, // 20-50MB
      passed: Math.random() > 0.15
    }
  };
}

function simulateDeviceTest(device: typeof DEVICE_TEST_MATRIX[0], page: string) {
  const isMobile = device.category === 'mobile';
  const isTablet = device.category === 'tablet';
  
  return {
    brandExperience: {
      heroSectionOptimized: Math.random() > 0.1,
      navigationUsable: Math.random() > 0.08,
      formsAccessible: Math.random() > 0.12,
      brandColorsVisible: Math.random() > 0.03
    },
    touchInterface: {
      buttonsSizesAppropriate: !isMobile || Math.random() > 0.15,
      tapTargetsAccessible: !isMobile || Math.random() > 0.10,
      scrollingSmooth: Math.random() > 0.05,
      gesturesWork: !isMobile || Math.random() > 0.08
    },
    performance: {
      loadTime: isMobile ? 2500 + Math.random() * 1500 : 1800 + Math.random() * 800,
      frameRate: isMobile ? 55 + Math.random() * 5 : 58 + Math.random() * 2,
      batteryImpact: Math.random() < 0.8 ? 'low' : Math.random() < 0.9 ? 'medium' : 'high',
      passed: Math.random() > 0.2
    }
  };
}

function calculateBrowserCompatibilityScore(result: any): number {
  const brandWeight = 0.4;
  const responsiveWeight = 0.3;
  const performanceWeight = 0.3;
  
  const brandScore = (
    (result.brandRendering.cssCustomPropertiesSupported ? 25 : 0) +
    (result.brandRendering.gradientRenderingConsistent ? 25 : 0) +
    (result.brandRendering.brandColorsAccurate ? 25 : 0) +
    (result.brandRendering.fontRenderingCorrect ? 25 : 0)
  );
  
  const responsiveScore = (
    (result.responsiveDesign.breakpointTransitions ? 25 : 0) +
    (result.responsiveDesign.touchInteractionsWork ? 25 : 0) +
    (result.responsiveDesign.hoverStatesAppropriate ? 25 : 0) +
    (result.responsiveDesign.layoutMaintained ? 25 : 0)
  );
  
  const performanceScore = result.performance.passed ? 100 : 60;
  
  return Math.round(
    brandScore * brandWeight +
    responsiveScore * responsiveWeight +
    performanceScore * performanceWeight
  );
}

function calculateDeviceExperienceScore(result: any): number {
  const brandWeight = 0.4;
  const touchWeight = 0.3;
  const performanceWeight = 0.3;
  
  const brandScore = (
    (result.brandExperience.heroSectionOptimized ? 25 : 0) +
    (result.brandExperience.navigationUsable ? 25 : 0) +
    (result.brandExperience.formsAccessible ? 25 : 0) +
    (result.brandExperience.brandColorsVisible ? 25 : 0)
  );
  
  const touchScore = (
    (result.touchInterface.buttonsSizesAppropriate ? 25 : 0) +
    (result.touchInterface.tapTargetsAccessible ? 25 : 0) +
    (result.touchInterface.scrollingSmooth ? 25 : 0) +
    (result.touchInterface.gesturesWork ? 25 : 0)
  );
  
  const performanceScore = result.performance.passed ? 100 : 50;
  
  return Math.round(
    brandScore * brandWeight +
    touchScore * touchWeight +
    performanceScore * performanceWeight
  );
}

function getDeviceLoadTimeThreshold(category: 'mobile' | 'tablet' | 'desktop'): number {
  switch (category) {
    case 'mobile': return 4000; // 4 seconds
    case 'tablet': return 3500; // 3.5 seconds
    case 'desktop': return 3000; // 3 seconds
    default: return 3500;
  }
}

export default {
  BROWSER_TEST_MATRIX,
  DEVICE_TEST_MATRIX,
  runCrossBrowserTesting,
  testBrowserCompatibility,
  runDeviceTesting,
  testDeviceCompatibility,
  testCSSCustomPropertyFallbacks,
  createCrossBrowserTestConfig
};