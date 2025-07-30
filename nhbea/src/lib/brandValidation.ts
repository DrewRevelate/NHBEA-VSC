/**
 * Brand Validation Library for NHBEA Conservative Royal Blue Brand System
 * 
 * This module provides comprehensive validation for the NHBEA brand implementation
 * including 60-30-10 color rule compliance, design token usage, and unauthorized
 * color detection across all pages and components.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

export interface BrandColorAnalysis {
  royalBlueUsage: number;
  neutralUsage: number;
  accentUsage: number;
  totalElements: number;
  compliance: boolean;
  violations: string[];
}

export interface BrandValidationResult {
  usesDesignTokens: boolean;
  hasProperHierarchy: boolean;
  hasHardCodedColors: boolean;
  hardCodedColors: string[];
  designTokenUsage: number;
  violations: string[];
}

export interface ComponentBrandCompliance {
  componentName: string;
  usesApprovedTokens: boolean;
  hasProperBrandStyling: boolean;
  violations: string[];
  score: number;
}

// Authorized NHBEA brand colors and patterns
const AUTHORIZED_BRAND_COLORS = {
  // Primary Royal Blue System (60% usage)
  primary: [
    '--nhbea-royal-blue',
    '--nhbea-royal-blue-dark',
    '--nhbea-royal-blue-deeper',
    '--nhbea-royal-blue-light',
    '--nhbea-royal-blue-lighter',
    '--nhbea-royal-blue-subtle',
    '#2563eb', '#1e40af', '#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd'
  ],
  // Neutral Foundation (30% usage) - CORRECTED to match brand documentation
  neutral: [
    '--nhbea-gray-50', '--nhbea-gray-100', '--nhbea-gray-200', '--nhbea-gray-300',
    '--nhbea-gray-400', '--nhbea-gray-500', '--nhbea-gray-600', '--nhbea-gray-700',
    '--nhbea-gray-800', '--nhbea-gray-900',
    '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b',
    '#475569', '#334155', '#1e293b', '#0f172a'
  ],
  // Accent Colors (10% usage)
  accent: [
    '--nhbea-accent-orange', '--nhbea-accent-orange-light', '--nhbea-accent-orange-dark',
    '--nhbea-accent-gold', '--nhbea-accent-gold-light', '--nhbea-accent-gold-dark',
    '--nhbea-accent-green', '--nhbea-accent-green-light', '--nhbea-accent-green-dark',
    '#ea580c', '#fb923c', '#c2410c', '#fbbf24', '#fcd34d', '#d97706',
    '#059669', '#10b981', '#047857'
  ],
  // Status Colors
  status: [
    '--nhbea-success', '--nhbea-warning', '--nhbea-error', '--nhbea-info',
    '#10b981', '#f59e0b', '#ef4444', '#3b82f6'
  ]
};

// Design token hierarchy patterns
const DESIGN_TOKEN_PATTERNS = {
  brand: /--brand-[a-z-]+/g,
  semantic: /--color-[a-z-]+/g,
  component: /--(button|input|card|nav)-[a-z-]+/g,
  nhbea: /--nhbea-[a-z-]+/g
};

/**
 * Analyzes a page's HTML for 60-30-10 color rule compliance
 */
export function analyzePage60_30_10Rule(htmlContent: string): BrandColorAnalysis {
  const violations: string[] = [];
  let royalBlueCount = 0;
  let neutralCount = 0;
  let accentCount = 0;
  let totalElements = 0;

  // Parse HTML and count color usage
  const classMatches = htmlContent.match(/class="[^"]*"/g) || [];
  const styleMatches = htmlContent.match(/style="[^"]*"/g) || [];
  
  // Count all HTML elements for proper percentage calculation
  const elementMatches = htmlContent.match(/<[^>]+>/g) || [];
  totalElements = elementMatches.length;

  // If no elements found, fall back to counting class and style attributes
  if (totalElements === 0) {
    totalElements = classMatches.length + styleMatches.length;
  }
  
  classMatches.forEach(classAttr => {
    // Check for royal blue usage (bg-blue-, text-blue-, border-blue-)
    if (/bg-blue-|text-blue-|border-blue-|ring-blue-/.test(classAttr)) {
      royalBlueCount++;
    }
    
    // Check for neutral usage (bg-gray-, text-gray-, border-gray-)
    if (/bg-gray-|text-gray-|border-gray-/.test(classAttr)) {
      neutralCount++;
    }
    
    // Check for accent usage (bg-orange-, bg-yellow-, bg-green-)
    if (/bg-orange-|bg-yellow-|bg-green-|text-orange-|text-yellow-|text-green-/.test(classAttr)) {
      accentCount++;
    }
  });

  styleMatches.forEach(styleAttr => {
    // Check for CSS custom property usage
    AUTHORIZED_BRAND_COLORS.primary.forEach(color => {
      if (styleAttr.includes(color)) royalBlueCount++;
    });
    
    AUTHORIZED_BRAND_COLORS.neutral.forEach(color => {
      if (styleAttr.includes(color)) neutralCount++;
    });
    
    AUTHORIZED_BRAND_COLORS.accent.forEach(color => {
      if (styleAttr.includes(color)) accentCount++;
    });
  });

  // Calculate percentages based on total color usage, not total elements
  const totalColorUsage = royalBlueCount + neutralCount + accentCount;
  const royalBlueUsage = totalColorUsage > 0 ? (royalBlueCount / totalColorUsage) * 100 : 0;
  const neutralUsage = totalColorUsage > 0 ? (neutralCount / totalColorUsage) * 100 : 0;
  const accentUsage = totalColorUsage > 0 ? (accentCount / totalColorUsage) * 100 : 0;

  // Check compliance with 60-30-10 rule
  const compliance = royalBlueUsage >= 50 && royalBlueUsage <= 70 &&
                    neutralUsage >= 20 && neutralUsage <= 40 &&
                    accentUsage <= 15;

  if (!compliance) {
    if (royalBlueUsage < 50) violations.push('Royal blue usage below 50%');
    if (royalBlueUsage > 70) violations.push('Royal blue usage exceeds 70%');
    if (neutralUsage < 20) violations.push('Neutral color usage below 20%');
    if (neutralUsage > 40) violations.push('Neutral color usage exceeds 40%');
    if (accentUsage > 15) violations.push('Accent color usage exceeds 15%');
  }

  return {
    royalBlueUsage,
    neutralUsage,
    accentUsage,
    totalElements,
    compliance,
    violations
  };
}

/**
 * Detects unauthorized colors in CSS content
 */
export function detectUnauthorizedColors(cssContent: string): string[] {
  const unauthorizedColors: string[] = [];
  const allAuthorizedHexColors = AUTHORIZED_BRAND_COLORS.primary
    .concat(AUTHORIZED_BRAND_COLORS.neutral)
    .concat(AUTHORIZED_BRAND_COLORS.accent)
    .concat(AUTHORIZED_BRAND_COLORS.status)
    .filter(color => color.startsWith('#'));

  // Find all hex colors in CSS
  const hexColorMatches = cssContent.match(/#[a-fA-F0-9]{3,8}/g) || [];
  
  hexColorMatches.forEach(color => {
    const normalizedColor = color.toLowerCase();
    if (!allAuthorizedHexColors.includes(normalizedColor)) {
      if (!unauthorizedColors.includes(normalizedColor)) {
        unauthorizedColors.push(normalizedColor);
      }
    }
  });

  // Find RGB/RGBA colors
  const rgbMatches = cssContent.match(/rgba?\([^)]+\)/g) || [];
  rgbMatches.forEach(color => {
    // Skip if it's a known authorized pattern (e.g., rgba(37, 99, 235, 0.1))
    if (!isAuthorizedRGBColor(color)) {
      if (!unauthorizedColors.includes(color)) {
        unauthorizedColors.push(color);
      }
    }
  });

  return unauthorizedColors;
}

/**
 * Validates brand color usage and design token compliance
 */
export function validateBrandColorUsage(cssContent: string): BrandValidationResult {
  const violations: string[] = [];
  const hardCodedColors: string[] = [];
  
  // Check for design token usage
  const tokenMatches = cssContent.match(/var\(--[^)]+\)/g) || [];
  const totalStyleDeclarations = cssContent.split(';').length;
  const designTokenUsage = tokenMatches.length / totalStyleDeclarations * 100;
  
  const usesDesignTokens = designTokenUsage > 50;
  
  // Check for proper hierarchy (brand -> semantic -> component)
  const brandTokens = (cssContent.match(DESIGN_TOKEN_PATTERNS.brand) || []).length;
  const semanticTokens = (cssContent.match(DESIGN_TOKEN_PATTERNS.semantic) || []).length;
  const componentTokens = (cssContent.match(DESIGN_TOKEN_PATTERNS.component) || []).length;
  
  const hasProperHierarchy = brandTokens > 0 || semanticTokens > 0 || componentTokens > 0;
  
  // Detect hard-coded colors
  const unauthorizedColors = detectUnauthorizedColors(cssContent);
  const hasHardCodedColors = unauthorizedColors.length > 0;
  
  if (hasHardCodedColors) {
    hardCodedColors.push(...unauthorizedColors);
    violations.push(`Found ${unauthorizedColors.length} hard-coded colors`);
  }
  
  if (!usesDesignTokens) {
    violations.push('Low design token usage (should be > 50%)');
  }
  
  if (!hasProperHierarchy) {
    violations.push('No proper design token hierarchy found');
  }

  return {
    usesDesignTokens,
    hasProperHierarchy,
    hasHardCodedColors,
    hardCodedColors,
    designTokenUsage,
    violations
  };
}

/**
 * Validates component brand compliance
 */
export function validateComponentBrandCompliance(componentPath: string): ComponentBrandCompliance {
  const componentName = componentPath.split('/').pop()?.replace('.tsx', '') || 'Unknown';
  const violations: string[] = [];
  
  try {
    const componentContent = readFileSync(componentPath, 'utf-8');
    
    // Check for approved class patterns
    const approvedPatterns = [
      /nhbea-button-(primary|secondary|cta|ghost)/,
      /nhbea-card(-featured|-interactive|-accent)?/,
      /nhbea-input/,
      /nhbea-nav-link/,
      /bg-blue-600|bg-blue-700|bg-blue-800/, // Tailwind royal blue
      /text-blue-600|text-blue-700|text-blue-800/,
      /var\(--nhbea-royal-blue/,
      /var\(--brand-primary/,
      /var\(--color-/
    ];
    
    const hasApprovedStyling = approvedPatterns.some(pattern => pattern.test(componentContent));
    
    // Check for design token usage
    const tokenUsage = (componentContent.match(/var\(--[^)]+\)/g) || []).length;
    const usesApprovedTokens = tokenUsage > 0;
    
    // Check for brand violations
    const brandViolations = detectUnauthorizedColors(componentContent);
    if (brandViolations.length > 0) {
      violations.push(`Unauthorized colors: ${brandViolations.join(', ')}`);
    }
    
    if (!hasApprovedStyling) {
      violations.push('No approved brand styling patterns found');
    }
    
    if (!usesApprovedTokens) {
      violations.push('No design token usage found');
    }
    
    // Calculate compliance score
    let score = 100;
    score -= brandViolations.length * 20;
    if (!hasApprovedStyling) score -= 30;
    if (!usesApprovedTokens) score -= 25;
    score = Math.max(0, score);
    
    return {
      componentName,
      usesApprovedTokens,
      hasProperBrandStyling: hasApprovedStyling,
      violations,
      score
    };
    
  } catch (error) {
    return {
      componentName,
      usesApprovedTokens: false,
      hasProperBrandStyling: false,
      violations: [`Error reading component: ${error}`],
      score: 0
    };
  }
}

/**
 * Scans entire src directory for brand compliance
 */
export function auditFullBrandCompliance(srcPath: string = 'src'): {
  overallScore: number;
  totalComponents: number;
  compliantComponents: number;
  violations: string[];
  componentResults: ComponentBrandCompliance[];
} {
  const componentResults: ComponentBrandCompliance[] = [];
  const violations: string[] = [];
  
  function scanDirectory(dirPath: string) {
    const items = readdirSync(dirPath);
    
    items.forEach(item => {
      const fullPath = join(dirPath, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDirectory(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        if (!item.endsWith('.test.tsx') && !item.endsWith('.test.ts')) {
          const result = validateComponentBrandCompliance(fullPath);
          componentResults.push(result);
          
          if (result.violations.length > 0) {
            violations.push(`${result.componentName}: ${result.violations.join(', ')}`);
          }
        }
      }
    });
  }
  
  try {
    scanDirectory(srcPath);
  } catch (error) {
    violations.push(`Error scanning directory: ${error}`);
  }
  
  const totalComponents = componentResults.length;
  const compliantComponents = componentResults.filter(r => r.score >= 80).length;
  const overallScore = totalComponents > 0 
    ? componentResults.reduce((sum, r) => sum + r.score, 0) / totalComponents 
    : 0;
  
  return {
    overallScore,
    totalComponents,
    compliantComponents,
    violations,
    componentResults
  };
}

/**
 * Helper function to check if RGB color is authorized
 */
function isAuthorizedRGBColor(rgbColor: string): boolean {
  // Check for known authorized RGB patterns from the brand system - CORRECTED
  const authorizedRGBPatterns = [
    /rgba?\(37,\s*99,\s*235/, // Royal blue variations
    /rgba?\(30,\s*64,\s*175/, // Royal blue dark
    /rgba?\(30,\s*58,\s*138/, // Royal blue deeper
    /rgba?\(248,\s*250,\s*252/, // Gray-50 - CORRECTED
    /rgba?\(241,\s*245,\s*249/, // Gray-100 - CORRECTED
    /rgba?\(226,\s*232,\s*240/, // Gray-200 - CORRECTED
    /rgba?\(203,\s*213,\s*225/, // Gray-300 - CORRECTED
    /rgba?\(148,\s*163,\s*184/, // Gray-400 - CORRECTED
    /rgba?\(100,\s*116,\s*139/, // Gray-500 - CORRECTED
    /rgba?\(71,\s*85,\s*105/, // Gray-600 - CORRECTED
    /rgba?\(51,\s*65,\s*85/, // Gray-700 - CORRECTED
    /rgba?\(30,\s*41,\s*59/, // Gray-800 - CORRECTED
    /rgba?\(15,\s*23,\s*42/, // Gray-900 - CORRECTED
    /rgba?\(234,\s*88,\s*12/, // Accent orange
    /rgba?\(251,\s*191,\s*36/, // Accent gold
    /rgba?\(5,\s*150,\s*105/, // Accent green
  ];
  
  return authorizedRGBPatterns.some(pattern => pattern.test(rgbColor));
}

/**
 * Creates a brand consistency checklist for manual review
 */
export function createBrandConsistencyChecklist() {
  return {
    heroSections: [
      'Uses conservative royal blue gradient background',
      'White or light text on royal blue background meets contrast ratio 4.5:1',
      'Proper spacing using design token system',
      'Consistent typography hierarchy with Inter font family'
    ],
    contentAreas: [
      'Implements 60-30-10 color rule correctly',
      'Uses semantic color tokens for text and backgrounds',
      'Proper visual hierarchy with royal blue headings',
      'Consistent spacing and layout structure'
    ],
    interactiveElements: [
      'Primary buttons use royal blue gradient',
      'CTA buttons use orange accent (limited usage)',
      'Focus states use royal blue with proper contrast',
      'Hover effects are subtle and professional'
    ],
    forms: [
      'Input focus states use royal blue brand color',
      'Form validation uses appropriate status colors',
      'Labels and helper text follow typography hierarchy',
      'Form layout uses consistent spacing tokens'
    ],
    navigation: [
      'Navigation links use royal blue for active states',
      'Hover effects use royal blue subtle background',
      'Mobile navigation maintains brand consistency',
      'Breadcrumbs and secondary navigation follow brand patterns'
    ]
  };
}

export default {
  analyzePage60_30_10Rule,
  detectUnauthorizedColors,
  validateBrandColorUsage,
  validateComponentBrandCompliance,
  auditFullBrandCompliance,
  createBrandConsistencyChecklist
};