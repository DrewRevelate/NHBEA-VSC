/**
 * CSS Custom Property and Design Token Validation
 * 
 * This module validates the proper usage of CSS custom properties and ensures
 * the three-tier token architecture (Brand → Semantic → Component) is followed
 * throughout the NHBEA brand implementation.
 */

import { readFileSync } from 'fs';

export interface TokenValidationResult {
  hasProperHierarchy: boolean;
  brandTokenUsage: number;
  semanticTokenUsage: number;
  componentTokenUsage: number;
  invalidTokens: string[];
  missingTokens: string[];
  score: number;
  violations: string[];
}

export interface TokenHierarchyAnalysis {
  brandLevel: string[];
  semanticLevel: string[];
  componentLevel: string[];
  invalidReferences: string[];
  circularReferences: string[];
}

// Expected token hierarchy patterns
const TOKEN_HIERARCHY = {
  brand: {
    pattern: /--brand-[a-z-]+/g,
    expectedTokens: [
      '--brand-primary',
      '--brand-primary-dark',
      '--brand-primary-light',
      '--brand-accent-primary',
      '--brand-accent-secondary',
      '--brand-accent-tertiary'
    ]
  },
  semantic: {
    pattern: /--color-[a-z-]+/g,
    expectedTokens: [
      '--color-text-primary',
      '--color-text-secondary',
      '--color-text-muted',
      '--color-bg-primary',
      '--color-bg-secondary',
      '--color-bg-accent',
      '--color-border-primary',
      '--color-border-secondary'
    ]
  },
  component: {
    pattern: /--(button|input|card|nav)-[a-z-]+/g,
    expectedTokens: [
      '--button-primary-bg',
      '--button-primary-hover',
      '--button-primary-text',
      '--button-secondary-bg',
      '--button-secondary-hover',
      '--input-bg',
      '--input-border',
      '--input-focus',
      '--card-bg',
      '--card-border'
    ]
  },
  nhbea: {
    pattern: /--nhbea-[a-z-]+/g,
    expectedTokens: [
      '--nhbea-royal-blue',
      '--nhbea-royal-blue-dark',
      '--nhbea-royal-blue-light',
      '--nhbea-gray-50',
      '--nhbea-gray-100',
      '--nhbea-gray-200',
      '--nhbea-accent-orange',
      '--nhbea-accent-gold',
      '--nhbea-accent-green'
    ]
  }
};

/**
 * Validates CSS custom property usage and hierarchy
 */
export function validateCSSTokenUsage(cssContent: string): TokenValidationResult {
  const violations: string[] = [];
  const invalidTokens: string[] = [];
  const missingTokens: string[] = [];
  
  // Extract all custom property definitions and usages
  const customPropertyDefinitions = extractCustomPropertyDefinitions(cssContent);
  const customPropertyUsages = extractCustomPropertyUsages(cssContent);
  
  // Count token usage by type
  const brandTokenUsage = countTokenUsage(cssContent, TOKEN_HIERARCHY.brand.pattern);
  const semanticTokenUsage = countTokenUsage(cssContent, TOKEN_HIERARCHY.semantic.pattern);
  const componentTokenUsage = countTokenUsage(cssContent, TOKEN_HIERARCHY.component.pattern);
  const nhbeaTokenUsage = countTokenUsage(cssContent, TOKEN_HIERARCHY.nhbea.pattern);
  
  // Check for proper hierarchy
  const hasProperHierarchy = validateTokenHierarchy(customPropertyDefinitions);
  
  // Check for invalid token references
  customPropertyUsages.forEach(usage => {
    const tokenName = usage.replace('var(', '').replace(')', '');
    if (!customPropertyDefinitions.includes(tokenName) && !isValidExternalToken(tokenName)) {
      invalidTokens.push(tokenName);
    }
  });
  
  // Check for missing expected tokens
  Object.values(TOKEN_HIERARCHY).forEach(tokenType => {
    tokenType.expectedTokens.forEach(expectedToken => {
      if (!customPropertyDefinitions.includes(expectedToken)) {
        missingTokens.push(expectedToken);
      }
    });
  });
  
  // Calculate score
  let score = 100;
  score -= invalidTokens.length * 10;
  score -= missingTokens.length * 5;
  if (!hasProperHierarchy) score -= 25;
  score = Math.max(0, score);
  
  // Generate violations
  if (invalidTokens.length > 0) {
    violations.push(`Invalid token references: ${invalidTokens.slice(0, 5).join(', ')}`);
  }
  if (missingTokens.length > 0) {
    violations.push(`Missing expected tokens: ${missingTokens.slice(0, 5).join(', ')}`);
  }
  if (!hasProperHierarchy) {
    violations.push('Token hierarchy not properly implemented');
  }
  
  return {
    hasProperHierarchy,
    brandTokenUsage,
    semanticTokenUsage,
    componentTokenUsage,
    invalidTokens,
    missingTokens,
    score,
    violations
  };
}

/**
 * Analyzes the token hierarchy structure
 */
export function analyzeTokenHierarchy(cssContent: string): TokenHierarchyAnalysis {
  const brandLevel: string[] = [];
  const semanticLevel: string[] = [];
  const componentLevel: string[] = [];
  const invalidReferences: string[] = [];
  const circularReferences: string[] = [];
  
  // Extract token definitions with their values
  const tokenDefinitions = extractTokenDefinitionsWithValues(cssContent);
  
  // Categorize tokens by level
  Object.entries(tokenDefinitions).forEach(([token, value]) => {
    if (TOKEN_HIERARCHY.brand.pattern.test(token)) {
      brandLevel.push(token);
    } else if (TOKEN_HIERARCHY.semantic.pattern.test(token)) {
      semanticLevel.push(token);
    } else if (TOKEN_HIERARCHY.component.pattern.test(token)) {
      componentLevel.push(token);
    }
    
    // Check for invalid references
    if (value.includes('var(') && !isValidTokenReference(value, tokenDefinitions)) {
      invalidReferences.push(`${token}: ${value}`);
    }
    
    // Check for circular references
    if (hasCircularReference(token, value, tokenDefinitions)) {
      circularReferences.push(token);
    }
  });
  
  return {
    brandLevel,
    semanticLevel,
    componentLevel,
    invalidReferences,
    circularReferences
  };
}

/**
 * Validates semantic naming conventions
 */
export function validateSemanticNaming(cssContent: string): {
  score: number;
  violations: string[];
  goodPractices: string[];
} {
  const violations: string[] = [];
  const goodPractices: string[] = [];
  
  const tokenDefinitions = extractTokenDefinitionsWithValues(cssContent);
  
  Object.entries(tokenDefinitions).forEach(([token, value]) => {
    // Check for good semantic naming
    if (isSemanticName(token)) {
      goodPractices.push(token);
    }
    
    // Check for poor naming practices
    if (isPoorNamingPractice(token)) {
      violations.push(`Poor naming: ${token} should use semantic naming`);
    }
    
    // Check for inconsistent naming
    if (hasInconsistentNaming(token)) {
      violations.push(`Inconsistent naming: ${token} doesn't follow kebab-case convention`);
    }
  });
  
  const score = violations.length === 0 ? 100 : Math.max(0, 100 - violations.length * 10);
  
  return { score, violations, goodPractices };
}

/**
 * Creates automated CSS property validation script
 */
export function createCSSValidationScript(): string {
  return `
#!/usr/bin/env node
/**
 * Automated CSS Custom Property Validation Script
 * Run with: node scripts/validate-css-tokens.js
 */

const fs = require('fs');
const path = require('path');
const { validateCSSTokenUsage, analyzeTokenHierarchy } = require('../src/lib/cssTokenValidation');

function validateProjectTokens() {
  console.log('🔍 Validating CSS custom properties and design tokens...');
  
  // Read globals.css
  const globalsPath = path.join(__dirname, '../src/app/globals.css');
  
  if (!fs.existsSync(globalsPath)) {
    console.error('❌ globals.css not found at', globalsPath);
    process.exit(1);
  }
  
  const cssContent = fs.readFileSync(globalsPath, 'utf-8');
  
  // Validate token usage
  const validation = validateCSSTokenUsage(cssContent);
  const hierarchy = analyzeTokenHierarchy(cssContent);
  
  console.log('\\n📊 Validation Results:');
  console.log(\`Score: \${validation.score}/100\`);
  console.log(\`Brand tokens: \${validation.brandTokenUsage}\`);
  console.log(\`Semantic tokens: \${validation.semanticTokenUsage}\`);
  console.log(\`Component tokens: \${validation.componentTokenUsage}\`);
  
  if (validation.violations.length > 0) {
    console.log('\\n⚠️  Violations:');
    validation.violations.forEach(violation => console.log(\`  - \${violation}\`));
  }
  
  if (hierarchy.invalidReferences.length > 0) {
    console.log('\\n❌ Invalid References:');
    hierarchy.invalidReferences.forEach(ref => console.log(\`  - \${ref}\`));
  }
  
  if (hierarchy.circularReferences.length > 0) {
    console.log('\\n🔄 Circular References:');
    hierarchy.circularReferences.forEach(ref => console.log(\`  - \${ref}\`));
  }
  
  if (validation.score < 80) {
    console.log('\\n❌ CSS token validation failed. Score must be >= 80');
    process.exit(1);
  } else {
    console.log('\\n✅ CSS token validation passed!');
  }
}

validateProjectTokens();
`;
}

// Helper functions

function extractCustomPropertyDefinitions(cssContent: string): string[] {
  const definitions: string[] = [];
  const regex = /--[a-zA-Z][a-zA-Z0-9-]*(?=\s*:)/g;
  let match;
  
  while ((match = regex.exec(cssContent)) !== null) {
    if (!definitions.includes(match[0])) {
      definitions.push(match[0]);
    }
  }
  
  return definitions;
}

function extractCustomPropertyUsages(cssContent: string): string[] {
  const usages: string[] = [];
  const regex = /var\(--[a-zA-Z][a-zA-Z0-9-]*[^)]*\)/g;
  let match;
  
  while ((match = regex.exec(cssContent)) !== null) {
    if (!usages.includes(match[0])) {
      usages.push(match[0]);
    }
  }
  
  return usages;
}

function extractTokenDefinitionsWithValues(cssContent: string): Record<string, string> {
  const definitions: Record<string, string> = {};
  const regex = /(--[a-zA-Z][a-zA-Z0-9-]*)\s*:\s*([^;]+);/g;
  let match;
  
  while ((match = regex.exec(cssContent)) !== null) {
    definitions[match[1]] = match[2].trim();
  }
  
  return definitions;
}

function countTokenUsage(cssContent: string, pattern: RegExp): number {
  const matches = cssContent.match(pattern);
  return matches ? matches.length : 0;
}

function validateTokenHierarchy(definitions: string[]): boolean {
  // Check if we have tokens from all three levels
  const hasBrandTokens = definitions.some(def => TOKEN_HIERARCHY.brand.pattern.test(def));
  const hasSemanticTokens = definitions.some(def => TOKEN_HIERARCHY.semantic.pattern.test(def));
  const hasComponentTokens = definitions.some(def => TOKEN_HIERARCHY.component.pattern.test(def));
  
  return hasBrandTokens && hasSemanticTokens && hasComponentTokens;
}

function isValidExternalToken(tokenName: string): boolean {
  // Check for valid external tokens (like ShadCN/UI tokens)
  const validExternalTokens = [
    '--background', '--foreground', '--card', '--card-foreground',
    '--popover', '--popover-foreground', '--primary', '--primary-foreground',
    '--secondary', '--secondary-foreground', '--muted', '--muted-foreground',
    '--accent', '--accent-foreground', '--destructive', '--destructive-foreground',
    '--border', '--input', '--ring', '--radius'
  ];
  
  return validExternalTokens.includes(tokenName);
}

function isValidTokenReference(value: string, definitions: Record<string, string>): boolean {
  const varMatches = value.match(/var\(--[a-zA-Z][a-zA-Z0-9-]*\)/g);
  if (!varMatches) return true;
  
  return varMatches.every(varRef => {
    const tokenName = varRef.replace('var(', '').replace(')', '');
    return definitions[tokenName] !== undefined || isValidExternalToken(tokenName);
  });
}

function hasCircularReference(token: string, value: string, definitions: Record<string, string>): boolean {
  const visited = new Set<string>();
  
  function checkCircular(currentToken: string): boolean {
    if (visited.has(currentToken)) return true;
    visited.add(currentToken);
    
    const currentValue = definitions[currentToken];
    if (!currentValue) return false;
    
    const varMatches = currentValue.match(/var\(--[a-zA-Z][a-zA-Z0-9-]*\)/g);
    if (!varMatches) return false;
    
    return varMatches.some(varRef => {
      const referencedToken = varRef.replace('var(', '').replace(')', '');
      return checkCircular(referencedToken);
    });
  }
  
  return checkCircular(token);
}

function isSemanticName(token: string): boolean {
  const semanticPrefixes = ['--color-', '--text-', '--bg-', '--border-', '--space-', '--font-'];
  return semanticPrefixes.some(prefix => token.startsWith(prefix));
}

function isPoorNamingPractice(token: string): boolean {
  // Check for specific colors or values in token names
  const poorPatterns = [
    /--.*-blue-/, /--.*-red-/, /--.*-green-/, // Specific colors
    /--.*-12px/, /--.*-16px/, /--.*-20px/,   // Specific sizes
    /--.*-bold/, /--.*-italic/                // Specific styles
  ];
  
  return poorPatterns.some(pattern => pattern.test(token));
}

function hasInconsistentNaming(token: string): boolean {
  // Check for consistent kebab-case naming
  return !/^--[a-z][a-z0-9-]*$/.test(token);
}

export default {
  validateCSSTokenUsage,
  analyzeTokenHierarchy,
  validateSemanticNaming,
  createCSSValidationScript
};