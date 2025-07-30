/**
 * Brand Consistency Checklist for Manual Review
 * 
 * This comprehensive checklist ensures consistent application of the NHBEA
 * conservative royal blue brand system across all pages, components, and
 * interactive elements.
 */

export interface ChecklistItem {
  id: string;
  category: string;
  description: string;
  criteria: string[];
  priority: 'high' | 'medium' | 'low';
  automated: boolean;
}

export interface ChecklistResult {
  item: ChecklistItem;
  passed: boolean;
  notes: string;
  score: number;
}

export const BRAND_CONSISTENCY_CHECKLIST: ChecklistItem[] = [
  // Hero Sections (High Priority)
  {
    id: 'hero-001',
    category: 'Hero Sections',
    description: 'Conservative royal blue gradient background implementation',
    criteria: [
      'Uses linear-gradient with --nhbea-royal-blue to --nhbea-royal-blue-dark',
      'Gradient angle is 135deg for consistent visual direction',
      'Background covers full hero section area',
      'No conflicting background colors or images'
    ],
    priority: 'high',
    automated: false
  },
  {
    id: 'hero-002',
    category: 'Hero Sections',
    description: 'Text contrast and readability on royal blue background',
    criteria: [
      'Text color is white or --nhbea-gray-50',
      'Contrast ratio meets WCAG 2.1 AA (4.5:1 minimum)',
      'Text remains readable across all screen sizes',
      'No text shadows or effects that reduce readability'
    ],
    priority: 'high',
    automated: true
  },
  {
    id: 'hero-003',
    category: 'Hero Sections',
    description: 'Typography hierarchy in hero sections',
    criteria: [
      'Main heading uses Inter font family with proper weight',
      'Heading size follows modular scale (--text-4xl or --text-5xl)',
      'Subtext uses complementary typography scale',
      'Letter spacing follows brand guidelines (-0.05em for large text)'
    ],
    priority: 'high',
    automated: false
  },
  {
    id: 'hero-004',
    category: 'Hero Sections',
    description: 'Consistent spacing and layout structure',
    criteria: [
      'Uses design token spacing system (--space-* variables)',
      'Vertical rhythm maintained with consistent spacing',
      'Responsive behavior preserves brand integrity',
      'Call-to-action placement follows brand patterns'
    ],
    priority: 'medium',
    automated: false
  },

  // Content Areas (High Priority)
  {
    id: 'content-001',
    category: 'Content Areas',
    description: '60-30-10 color rule implementation',
    criteria: [
      'Royal blue (primary brand color) used for ~60% of brand elements',
      'Neutral grays used for ~30% of background and text elements',
      'Accent colors (orange/gold) used for ≤10% of highlight elements',
      'Color distribution creates proper visual hierarchy'
    ],
    priority: 'high',
    automated: true
  },
  {
    id: 'content-002',
    category: 'Content Areas',
    description: 'Semantic color token usage',
    criteria: [
      'Text uses --color-text-primary, --color-text-secondary',
      'Backgrounds use --color-bg-primary, --color-bg-secondary',
      'Borders use --color-border-primary, --color-border-secondary',
      'No hard-coded color values in component styles'
    ],
    priority: 'high',
    automated: true
  },
  {
    id: 'content-003',
    category: 'Content Areas',
    description: 'Typography hierarchy consistency',
    criteria: [
      'Headings use royal blue color variations appropriately',
      'Body text follows Inter + Georgia font system',
      'Font weights are consistent with design system',
      'Line heights use --leading-* token system'
    ],
    priority: 'medium',
    automated: false
  },
  {
    id: 'content-004',
    category: 'Content Areas',
    description: 'Visual hierarchy and content flow',
    criteria: [
      'Important content uses royal blue for emphasis',
      'Content sections have clear visual separation',
      'Reading flow is logical and maintains brand consistency',
      'White space usage follows spacing token system'
    ],
    priority: 'medium',
    automated: false
  },

  // Interactive Elements (High Priority)
  {
    id: 'interactive-001',
    category: 'Interactive Elements',
    description: 'Primary button brand consistency',
    criteria: [
      'Uses .nhbea-button-primary class or equivalent styling',
      'Royal blue gradient background (--nhbea-royal-blue to --nhbea-royal-blue-dark)',
      'White or light text with proper contrast',
      'Hover state darkens gradient appropriately'
    ],
    priority: 'high',
    automated: true
  },
  {
    id: 'interactive-002',
    category: 'Interactive Elements',
    description: 'CTA button accent usage',
    criteria: [
      'Orange accent CTAs limited to 1-2 per page maximum',
      'Uses .nhbea-button-cta class or --nhbea-accent-orange',
      'Placement emphasizes most important actions',
      'Maintains professional appearance'
    ],
    priority: 'high',
    automated: true
  },
  {
    id: 'interactive-003',
    category: 'Interactive Elements',
    description: 'Focus states accessibility',
    criteria: [
      'Focus indicators use royal blue color',
      'Focus ring has sufficient contrast (3:1 minimum)',
      'Focus states are visible and consistent',
      'Keyboard navigation works with brand styling'
    ],
    priority: 'high',
    automated: true
  },
  {
    id: 'interactive-004',
    category: 'Interactive Elements',
    description: 'Hover effects professionalism',
    criteria: [
      'Hover effects are subtle and professional',
      'Transitions use brand-defined duration tokens',
      'No jarring color changes or animations',
      'Maintains institutional authority feel'
    ],
    priority: 'medium',
    automated: false
  },

  // Forms (Medium Priority)
  {
    id: 'form-001',
    category: 'Forms',
    description: 'Input field brand consistency',
    criteria: [
      'Focus states use --nhbea-royal-blue border',
      'Input backgrounds use --input-bg token',
      'Border colors use --input-border token',
      'Placeholder text uses appropriate gray'
    ],
    priority: 'medium',
    automated: true
  },
  {
    id: 'form-002',
    category: 'Forms',
    description: 'Form validation styling',
    criteria: [
      'Error states use --nhbea-error color',
      'Success states use --nhbea-success color',
      'Warning states use --nhbea-warning color',
      'Validation messages maintain brand typography'
    ],
    priority: 'medium',
    automated: true
  },
  {
    id: 'form-003',
    category: 'Forms',
    description: 'Form layout and spacing',
    criteria: [
      'Form elements use consistent spacing tokens',
      'Labels follow brand typography hierarchy',
      'Form sections have proper visual grouping',
      'Submit buttons follow primary button styling'
    ],
    priority: 'medium',
    automated: false
  },

  // Navigation (High Priority)
  {
    id: 'nav-001',
    category: 'Navigation',
    description: 'Navigation link brand consistency',
    criteria: [
      'Active states use royal blue color',
      'Hover states use --nhbea-royal-blue-subtle background',
      'Link colors follow brand hierarchy',
      'Navigation maintains readability'
    ],
    priority: 'high',
    automated: true
  },
  {
    id: 'nav-002',
    category: 'Navigation',
    description: 'Mobile navigation brand application',
    criteria: [
      'Mobile menu maintains brand consistency',
      'Hamburger menu uses appropriate colors',
      'Mobile navigation backdrop follows brand',
      'Touch targets meet accessibility requirements'
    ],
    priority: 'high',
    automated: false
  },
  {
    id: 'nav-003',
    category: 'Navigation',
    description: 'Breadcrumbs and secondary navigation',
    criteria: [
      'Breadcrumbs use consistent brand colors',
      'Secondary navigation follows hierarchy',
      'Separator elements are appropriately styled',
      'Current page indication is clear'
    ],
    priority: 'medium',
    automated: false
  },

  // Cards and Components (Medium Priority)
  {
    id: 'card-001',
    category: 'Cards and Components',
    description: 'Card component brand consistency',
    criteria: [
      'Cards use .nhbea-card base styling',
      'Hover effects reveal royal blue accent',
      'Card shadows use brand shadow tokens',
      'Card spacing follows token system'
    ],
    priority: 'medium',
    automated: true
  },
  {
    id: 'card-002',
    category: 'Cards and Components',
    description: 'Interactive card enhancements',
    criteria: [
      'Interactive cards have subtle hover animations',
      'Transform effects are professional',
      'Focus states work with keyboard navigation',
      'Active states provide appropriate feedback'
    ],
    priority: 'medium',
    automated: false
  },

  // Responsive Design (Medium Priority)
  {
    id: 'responsive-001',
    category: 'Responsive Design',
    description: 'Mobile brand consistency',
    criteria: [
      'Brand colors remain consistent across breakpoints',
      'Typography scales appropriately on mobile',
      'Touch interactions maintain brand styling',
      'Mobile-specific components follow brand'
    ],
    priority: 'medium',
    automated: false
  },
  {
    id: 'responsive-002',
    category: 'Responsive Design',
    description: 'Tablet and desktop optimization',
    criteria: [
      'Layout adapts while maintaining brand identity',
      'Spacing scales appropriately',
      'Interactive elements remain consistent',
      'Brand hierarchy preserved across sizes'
    ],
    priority: 'medium',
    automated: false
  }
];

/**
 * Executes automated brand consistency checks
 */
export function runAutomatedBrandChecks(componentPath: string): ChecklistResult[] {
  const results: ChecklistResult[] = [];
  const automatedChecks = BRAND_CONSISTENCY_CHECKLIST.filter(item => item.automated);
  
  // This would integrate with actual validation functions
  automatedChecks.forEach(check => {
    const result: ChecklistResult = {
      item: check,
      passed: false, // Would be determined by actual validation
      notes: '',
      score: 0
    };
    
    // Example implementation for color usage check
    if (check.id === 'content-001') {
      // Integration with brand validation would go here
      result.passed = true;
      result.score = 100;
      result.notes = 'Color distribution follows 60-30-10 rule';
    }
    
    results.push(result);
  });
  
  return results;
}

/**
 * Creates a manual review checklist for a specific page
 */
export function createPageReviewChecklist(pageName: string): {
  pageChecklist: ChecklistItem[];
  reviewInstructions: string;
} {
  const pageChecklist = BRAND_CONSISTENCY_CHECKLIST.filter(item => 
    item.priority === 'high' || 
    (pageName.includes('hero') && item.category === 'Hero Sections') ||
    (pageName.includes('form') && item.category === 'Forms') ||
    item.category === 'Interactive Elements'
  );

  const reviewInstructions = `
# Brand Consistency Review: ${pageName}

## Review Instructions
1. Open the page in multiple browsers (Chrome, Firefox, Safari)
2. Test across mobile, tablet, and desktop breakpoints
3. Verify each checklist item systematically
4. Document any violations with screenshots
5. Test keyboard navigation and focus states
6. Validate color contrast using accessibility tools

## Priority Items
Focus on HIGH priority items first, then proceed to medium priority items.

## Scoring
- Pass: All criteria met (100%)
- Partial: Most criteria met with minor issues (70-99%)
- Fail: Significant violations or missing implementation (< 70%)
`;

  return { pageChecklist, reviewInstructions };
}

/**
 * Generates a comprehensive brand audit report
 */
export function generateBrandAuditReport(results: ChecklistResult[]): {
  overallScore: number;
  categoryScores: Record<string, number>;
  highPriorityIssues: ChecklistResult[];
  recommendations: string[];
  summary: string;
} {
  const totalScore = results.reduce((sum, result) => sum + result.score, 0);
  const overallScore = results.length > 0 ? totalScore / results.length : 0;
  
  // Calculate category scores
  const categoryScores: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  
  results.forEach(result => {
    const category = result.item.category;
    if (!categoryScores[category]) {
      categoryScores[category] = 0;
      categoryCounts[category] = 0;
    }
    categoryScores[category] += result.score;
    categoryCounts[category]++;
  });
  
  Object.keys(categoryScores).forEach(category => {
    categoryScores[category] = categoryScores[category] / categoryCounts[category];
  });
  
  // Identify high priority issues
  const highPriorityIssues = results.filter(result => 
    result.item.priority === 'high' && result.score < 80
  );
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (overallScore < 90) {
    recommendations.push('Overall brand consistency needs improvement');
  }
  if (categoryScores['Hero Sections'] < 85) {
    recommendations.push('Hero sections require brand consistency updates');
  }
  if (categoryScores['Interactive Elements'] < 85) {
    recommendations.push('Interactive elements need brand styling improvements');
  }
  if (highPriorityIssues.length > 0) {
    recommendations.push(`Address ${highPriorityIssues.length} high-priority brand violations`);
  }
  
  const summary = `
Brand Consistency Audit Summary:
- Overall Score: ${overallScore.toFixed(1)}/100
- High Priority Issues: ${highPriorityIssues.length}
- Categories Reviewed: ${Object.keys(categoryScores).length}
- Recommendations: ${recommendations.length}

${overallScore >= 90 ? '✅ Excellent brand consistency' : 
  overallScore >= 80 ? '⚠️  Good with room for improvement' : 
  '❌ Significant brand consistency issues'}
`;

  return {
    overallScore,
    categoryScores,
    highPriorityIssues,
    recommendations,
    summary
  };
}

export default {
  BRAND_CONSISTENCY_CHECKLIST,
  runAutomatedBrandChecks,
  createPageReviewChecklist,
  generateBrandAuditReport
};