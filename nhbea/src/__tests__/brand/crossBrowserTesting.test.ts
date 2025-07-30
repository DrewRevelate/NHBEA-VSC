import {
  runCrossBrowserTesting,
  testBrowserCompatibility,
  runDeviceTesting,
  testDeviceCompatibility,
  testCSSCustomPropertyFallbacks,
  createCrossBrowserTestConfig,
  BROWSER_TEST_MATRIX,
  DEVICE_TEST_MATRIX
} from '../../lib/crossBrowserTesting';

describe('Cross-Browser Testing Suite', () => {
  describe('Cross-Browser Compatibility Testing', () => {
    test('should run cross-browser testing for multiple pages', async () => {
      const result = await runCrossBrowserTesting(['/', '/about']);
      
      expect(result.testName).toBe('Cross-Browser Brand Compatibility Test');
      expect(result.timestamp).toBeDefined();
      expect(result.results.length).toBeGreaterThan(0);
      expect(result.summary.totalBrowsers).toBe(result.results.length);
      expect(result.summary.passedBrowsers).toBeGreaterThanOrEqual(0);
      expect(result.summary.failedBrowsers).toBeGreaterThanOrEqual(0);
      expect(result.summary.overallCompatibility).toBeGreaterThanOrEqual(0);
      expect(result.summary.overallCompatibility).toBeLessThanOrEqual(100);
      expect(Array.isArray(result.summary.criticalIssues)).toBe(true);
    });

    test('should test individual browser compatibility', async () => {
      const browser = BROWSER_TEST_MATRIX.find(b => b.name === 'Chrome');
      if (!browser) throw new Error('Chrome browser not found in test matrix');
      
      const result = await testBrowserCompatibility(browser, '/');
      
      expect(result.browser).toBe('Chrome');
      expect(result.version).toBeDefined();
      expect(result.platform).toBeDefined();
      expect(result.viewport.width).toBeGreaterThan(0);
      expect(result.viewport.height).toBeGreaterThan(0);
      expect(typeof result.brandRendering.passed).toBe('boolean');
      expect(typeof result.responsiveDesign.passed).toBe('boolean');
      expect(typeof result.performance.passed).toBe('boolean');
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
      expect(Array.isArray(result.violations)).toBe(true);
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    test('should test brand rendering compatibility', async () => {
      const browser = BROWSER_TEST_MATRIX.find(b => b.name === 'Firefox');
      if (!browser) throw new Error('Firefox browser not found in test matrix');
      
      const result = await testBrowserCompatibility(browser, '/');
      
      expect(result.brandRendering).toHaveProperty('cssCustomPropertiesSupported');
      expect(result.brandRendering).toHaveProperty('gradientRenderingConsistent');
      expect(result.brandRendering).toHaveProperty('brandColorsAccurate');
      expect(result.brandRendering).toHaveProperty('fontRenderingCorrect');
      expect(typeof result.brandRendering.passed).toBe('boolean');
    });

    test('should test responsive design across browsers', async () => {
      const browser = BROWSER_TEST_MATRIX.find(b => b.name === 'Safari');
      if (!browser) throw new Error('Safari browser not found in test matrix');
      
      const result = await testBrowserCompatibility(browser, '/about');
      
      expect(result.responsiveDesign).toHaveProperty('breakpointTransitions');
      expect(result.responsiveDesign).toHaveProperty('touchInteractionsWork');
      expect(result.responsiveDesign).toHaveProperty('hoverStatesAppropriate');
      expect(result.responsiveDesign).toHaveProperty('layoutMaintained');
      expect(typeof result.responsiveDesign.passed).toBe('boolean');
    });

    test('should identify browser-specific violations', async () => {
      const browsers = BROWSER_TEST_MATRIX.slice(0, 3);
      
      for (const browser of browsers) {
        const result = await testBrowserCompatibility(browser, '/');
        
        result.violations.forEach(violation => {
          expect(typeof violation).toBe('string');
          expect(violation.length).toBeGreaterThan(10);
        });
        
        result.recommendations.forEach(rec => {
          expect(typeof rec).toBe('string');
          expect(rec.length).toBeGreaterThan(15);
        });
      }
    });
  });

  describe('Device Compatibility Testing', () => {
    test('should run device testing for multiple pages', async () => {
      const results = await runDeviceTesting(['/', '/membership/professional']);
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      
      results.forEach(result => {
        expect(result.device).toBeDefined();
        expect(['mobile', 'tablet', 'desktop']).toContain(result.category);
        expect(result.viewport.width).toBeGreaterThan(0);
        expect(result.viewport.height).toBeGreaterThan(0);
        expect(['portrait', 'landscape']).toContain(result.viewport.orientation);
        expect(typeof result.passed).toBe('boolean');
      });
    });

    test('should test individual device compatibility', async () => {
      const device = DEVICE_TEST_MATRIX.find(d => d.name === 'iPhone 14');
      if (!device) throw new Error('iPhone 14 not found in device matrix');
      
      const result = await testDeviceCompatibility(device, '/');
      
      expect(result.device).toBe('iPhone 14');
      expect(result.category).toBe('mobile');
      expect(result.viewport.width).toBe(390);
      expect(result.viewport.height).toBe(844);
      expect(result.viewport.orientation).toBe('portrait');
      expect(typeof result.brandExperience.passed).toBe('boolean');
      expect(typeof result.touchInterface.passed).toBe('boolean');
      expect(typeof result.performance.passed).toBe('boolean');
    });

    test('should test brand experience on different devices', async () => {
      const mobileDevice = DEVICE_TEST_MATRIX.find(d => d.category === 'mobile');
      const tabletDevice = DEVICE_TEST_MATRIX.find(d => d.category === 'tablet');
      const desktopDevice = DEVICE_TEST_MATRIX.find(d => d.category === 'desktop');
      
      if (!mobileDevice || !tabletDevice || !desktopDevice) {
        throw new Error('Required device types not found');
      }
      
      const mobileResult = await testDeviceCompatibility(mobileDevice, '/');
      const tabletResult = await testDeviceCompatibility(tabletDevice, '/');
      const desktopResult = await testDeviceCompatibility(desktopDevice, '/');
      
      // All devices should test brand experience
      [mobileResult, tabletResult, desktopResult].forEach(result => {
        expect(result.brandExperience).toHaveProperty('heroSectionOptimized');
        expect(result.brandExperience).toHaveProperty('navigationUsable');
        expect(result.brandExperience).toHaveProperty('formsAccessible');
        expect(result.brandExperience).toHaveProperty('brandColorsVisible');
      });
      
      // Mobile should have additional touch interface requirements
      expect(mobileResult.touchInterface).toHaveProperty('buttonsSizesAppropriate');
      expect(mobileResult.touchInterface).toHaveProperty('tapTargetsAccessible');
    });

    test('should test touch interface on mobile devices', async () => {
      const mobileDevices = DEVICE_TEST_MATRIX.filter(d => d.category === 'mobile');
      
      for (const device of mobileDevices.slice(0, 2)) {
        const result = await testDeviceCompatibility(device, '/membership/professional');
        
        expect(result.touchInterface).toHaveProperty('buttonsSizesAppropriate');
        expect(result.touchInterface).toHaveProperty('tapTargetsAccessible');
        expect(result.touchInterface).toHaveProperty('scrollingSmooth');
        expect(result.touchInterface).toHaveProperty('gesturesWork');
        expect(typeof result.touchInterface.passed).toBe('boolean');
      }
    });

    test('should test performance across device categories', async () => {
      const devices = [
        DEVICE_TEST_MATRIX.find(d => d.category === 'mobile'),
        DEVICE_TEST_MATRIX.find(d => d.category === 'tablet'),
        DEVICE_TEST_MATRIX.find(d => d.category === 'desktop')
      ].filter(Boolean);
      
      for (const device of devices) {
        const result = await testDeviceCompatibility(device!, '/');
        
        expect(result.performance.loadTime).toBeGreaterThan(0);
        expect(result.performance.frameRate).toBeGreaterThan(0);
        expect(['low', 'medium', 'high']).toContain(result.performance.batteryImpact);
        expect(typeof result.performance.passed).toBe('boolean');
        
        // Mobile devices typically have longer load times
        if (device!.category === 'mobile') {
          expect(result.performance.loadTime).toBeGreaterThan(2000);
        }
      }
    });
  });

  describe('CSS Custom Properties Fallback Testing', () => {
    test('should test CSS custom property fallbacks', () => {
      const result = testCSSCustomPropertyFallbacks();
      
      expect(typeof result.fallbacksImplemented).toBe('boolean');
      expect(Array.isArray(result.missingFallbacks)).toBe(true);
      expect(Array.isArray(result.browserSupport)).toBe(true);
      expect(result.browserSupport.length).toBeGreaterThan(0);
    });

    test('should identify missing fallbacks for critical properties', () => {
      const result = testCSSCustomPropertyFallbacks();
      
      result.missingFallbacks.forEach(fallback => {
        expect(typeof fallback).toBe('string');
        expect(fallback).toContain('--');
        expect(fallback.toLowerCase()).toContain('missing fallback');
      });
    });

    test('should provide browser support information', () => {
      const result = testCSSCustomPropertyFallbacks();
      
      result.browserSupport.forEach(browser => {
        expect(browser.browser).toBeDefined();
        expect(typeof browser.supported).toBe('boolean');
        expect(typeof browser.fallbackRequired).toBe('boolean');
      });
      
      // Should include IE which requires fallbacks
      const ieSupport = result.browserSupport.find(b => b.browser.includes('IE'));
      if (ieSupport) {
        expect(ieSupport.supported).toBe(false);
        expect(ieSupport.fallbackRequired).toBe(true);
      }
    });
  });

  describe('Cross-Browser Test Configuration', () => {
    test('should create cross-browser test configuration', () => {
      const config = createCrossBrowserTestConfig();
      
      expect(config.playwrightConfig).toBeDefined();
      expect(config.browserStackConfig).toBeDefined();
      expect(config.testScript).toBeDefined();
      expect(typeof config.testScript).toBe('string');
    });

    test('should include Playwright configuration', () => {
      const config = createCrossBrowserTestConfig();
      
      expect(config.playwrightConfig).toHaveProperty('testDir');
      expect(config.playwrightConfig).toHaveProperty('timeout');
      expect(config.playwrightConfig).toHaveProperty('projects');
      expect(Array.isArray(config.playwrightConfig.projects)).toBe(true);
      expect(config.playwrightConfig.projects.length).toBeGreaterThan(0);
    });

    test('should include major browsers in Playwright config', () => {
      const config = createCrossBrowserTestConfig();
      
      const projectNames = config.playwrightConfig.projects.map((p: any) => p.name);
      expect(projectNames).toContain('chromium');
      expect(projectNames).toContain('firefox');
      expect(projectNames).toContain('webkit');
    });

    test('should include mobile devices in Playwright config', () => {
      const config = createCrossBrowserTestConfig();
      
      const projectNames = config.playwrightConfig.projects.map((p: any) => p.name);
      expect(projectNames.some(name => name.toLowerCase().includes('mobile'))).toBe(true);
    });

    test('should include BrowserStack configuration', () => {
      const config = createCrossBrowserTestConfig();
      
      expect(config.browserStackConfig).toHaveProperty('user');
      expect(config.browserStackConfig).toHaveProperty('key');
      expect(config.browserStackConfig).toHaveProperty('capabilities');
      expect(Array.isArray(config.browserStackConfig.capabilities)).toBe(true);
    });

    test('should include executable test script', () => {
      const config = createCrossBrowserTestConfig();
      
      expect(config.testScript).toContain('#!/usr/bin/env node');
      expect(config.testScript).toContain('runCrossBrowserTesting');
      expect(config.testScript).toContain('runDeviceTesting');
      expect(config.testScript).toContain('console.log');
    });
  });

  describe('Browser and Device Test Matrix', () => {
    test('should have comprehensive browser test matrix', () => {
      expect(Array.isArray(BROWSER_TEST_MATRIX)).toBe(true);
      expect(BROWSER_TEST_MATRIX.length).toBeGreaterThan(0);
      
      BROWSER_TEST_MATRIX.forEach(browser => {
        expect(browser.name).toBeDefined();
        expect(browser.version).toBeDefined();
        expect(['desktop', 'mobile']).toContain(browser.platform);
        expect(['high', 'medium', 'low']).toContain(browser.priority);
      });
    });

    test('should include major desktop browsers', () => {
      const desktopBrowsers = BROWSER_TEST_MATRIX.filter(b => b.platform === 'desktop');
      const browserNames = desktopBrowsers.map(b => b.name.toLowerCase());
      
      expect(browserNames.some(name => name.includes('chrome'))).toBe(true);
      expect(browserNames.some(name => name.includes('firefox'))).toBe(true);
      expect(browserNames.some(name => name.includes('safari'))).toBe(true);
      expect(browserNames.some(name => name.includes('edge'))).toBe(true);
    });

    test('should include major mobile browsers', () => {
      const mobileBrowsers = BROWSER_TEST_MATRIX.filter(b => b.platform === 'mobile');
      const browserNames = mobileBrowsers.map(b => b.name.toLowerCase());
      
      expect(browserNames.some(name => name.includes('chrome'))).toBe(true);
      expect(browserNames.some(name => name.includes('safari'))).toBe(true);
    });

    test('should have comprehensive device test matrix', () => {
      expect(Array.isArray(DEVICE_TEST_MATRIX)).toBe(true);
      expect(DEVICE_TEST_MATRIX.length).toBeGreaterThan(0);
      
      DEVICE_TEST_MATRIX.forEach(device => {
        expect(device.name).toBeDefined();
        expect(device.width).toBeGreaterThan(0);
        expect(device.height).toBeGreaterThan(0);
        expect(['mobile', 'tablet', 'desktop']).toContain(device.category);
        expect(['high', 'medium', 'low']).toContain(device.priority);
      });
    });

    test('should include appropriate device categories', () => {
      const categories = DEVICE_TEST_MATRIX.map(d => d.category);
      
      expect(categories).toContain('mobile');
      expect(categories).toContain('tablet');
      expect(categories).toContain('desktop');
    });

    test('should have realistic viewport dimensions', () => {
      DEVICE_TEST_MATRIX.forEach(device => {
        // Mobile devices should be narrower
        if (device.category === 'mobile') {
          expect(device.width).toBeLessThanOrEqual(500);
        }
        
        // Tablet devices should be medium width
        if (device.category === 'tablet') {
          expect(device.width).toBeGreaterThan(700);
          expect(device.width).toBeLessThan(1200);
        }
        
        // Desktop devices should be wide
        if (device.category === 'desktop') {
          expect(device.width).toBeGreaterThan(1500);
        }
      });
    });
  });
});