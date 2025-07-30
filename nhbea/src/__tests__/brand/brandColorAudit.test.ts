import { validateBrandColorUsage, analyzePage60_30_10Rule, detectUnauthorizedColors } from '../../lib/brandValidation';

describe('Brand Color Usage Audit', () => {
  describe('60-30-10 Color Rule Validation', () => {
    test('should validate proper royal blue usage (60%)', () => {
      const mockHTML = `
        <div class="bg-blue-600">Hero Section</div>
        <nav class="text-blue-600">Navigation</nav>
        <button class="bg-blue-600 text-white">Primary CTA</button>
        <div class="focus:ring-blue-600">Interactive Element</div>
        <div class="bg-gray-50">Background</div>
        <div class="bg-gray-100">Secondary</div>
        <button class="bg-orange-600">Accent</button>
      `;
      
      const result = analyzePage60_30_10Rule(mockHTML);
      expect(result.royalBlueUsage).toBeGreaterThanOrEqual(50);
      expect(result.royalBlueUsage).toBeLessThanOrEqual(70);
    });

    test('should validate neutral colors usage (30%)', () => {
      const mockHTML = `
        <div class="bg-blue-600">Primary</div>
        <div class="bg-blue-600">Primary 2</div>
        <div class="bg-blue-600">Primary 3</div>
        <div class="bg-blue-600">Primary 4</div>
        <div class="bg-gray-50">Page background</div>
        <p class="text-gray-600">Body text</p>
        <div class="border-gray-200">Card border</div>
        <button class="bg-orange-600">Accent</button>
      `;
      
      const result = analyzePage60_30_10Rule(mockHTML);
      expect(result.neutralUsage).toBeGreaterThanOrEqual(20);
      expect(result.neutralUsage).toBeLessThanOrEqual(50);
    });

    test('should validate accent colors usage (10%)', () => {
      const mockHTML = `
        <div class="bg-blue-600">Primary 1</div>
        <div class="bg-blue-600">Primary 2</div>
        <div class="bg-blue-600">Primary 3</div>
        <div class="bg-gray-50">Neutral 1</div>
        <div class="bg-gray-100">Neutral 2</div>
        <div class="bg-gray-200">Neutral 3</div>
        <button class="bg-orange-600">Accent CTA</button>
      `;
      
      const result = analyzePage60_30_10Rule(mockHTML);
      expect(result.accentUsage).toBeLessThanOrEqual(15);
    });
  });

  describe('Unauthorized Color Detection', () => {
    test('should detect unauthorized color usage', () => {
      const mockCSS = `
        .custom-element {
          background-color: #ff0000; /* Unauthorized red */
          color: #00ff00; /* Unauthorized green */
        }
        .brand-element {
          background-color: var(--nhbea-royal-blue); /* Authorized */
        }
      `;
      
      const unauthorizedColors = detectUnauthorizedColors(mockCSS);
      expect(unauthorizedColors).toContain('#ff0000');
      expect(unauthorizedColors).toContain('#00ff00');
      expect(unauthorizedColors).not.toContain('var(--nhbea-royal-blue)');
    });

    test('should allow authorized brand colors', () => {
      const mockCSS = `
        .hero {
          background: var(--nhbea-royal-blue);
          color: var(--nhbea-gray-50);
        }
        .accent {
          background: var(--nhbea-accent-orange);
        }
      `;
      
      const unauthorizedColors = detectUnauthorizedColors(mockCSS);
      expect(unauthorizedColors).toHaveLength(0);
    });
  });

  describe('Design Token Usage Validation', () => {
    test('should validate proper design token hierarchy', () => {
      const mockCSS = `
        .component {
          background: var(--button-primary-bg);
          color: var(--color-text-primary);
          border: 1px solid var(--color-border-primary);
        }
      `;
      
      const result = validateBrandColorUsage(mockCSS);
      expect(result.usesDesignTokens).toBe(true);
      expect(result.hasProperHierarchy).toBe(true);
    });

    test('should flag hard-coded colors', () => {
      const mockCSS = `
        .component {
          background: #ff0000; /* Hard-coded red - unauthorized */
          color: #ffffff;      /* Hard-coded white - unauthorized but common */
        }
      `;
      
      const result = validateBrandColorUsage(mockCSS);
      expect(result.hasHardCodedColors).toBe(true);
      expect(result.hardCodedColors).toContain('#ff0000');
      expect(result.hardCodedColors).toContain('#ffffff');
    });
  });
});