const { auditFullBrandCompliance, validateComponentBrandCompliance } = require('../src/lib/brandValidation.ts');
const path = require('path');

console.log('🎨 Running NHBEA Brand Validation...\n');

// Test the specific components we modified
const componentsToTest = [
  'src/components/RecognitionShowcaseSection.tsx',
  'src/components/SpeakersSection.tsx', 
  'src/components/AwardNominationForm.tsx',
  'src/components/SocialMediaFeed.tsx'
];

let totalScore = 0;
let totalViolations = 0;

console.log('📋 Testing Modified Components:\n');

componentsToTest.forEach(componentPath => {
  try {
    const result = validateComponentBrandCompliance(componentPath);
    console.log(`✨ ${result.componentName}`);
    console.log(`   Score: ${result.score}/100`);
    console.log(`   Uses Design Tokens: ${result.usesApprovedTokens ? '✅' : '❌'}`);
    console.log(`   Brand Styling: ${result.hasProperBrandStyling ? '✅' : '❌'}`);
    
    if (result.violations.length > 0) {
      console.log(`   Violations: ${result.violations.join(', ')}`);
      totalViolations += result.violations.length;
    } else {
      console.log(`   Violations: None ✅`);
    }
    
    totalScore += result.score;
    console.log('');
  } catch (error) {
    console.log(`❌ Error testing ${componentPath}: ${error.message}`);
  }
});

const averageScore = totalScore / componentsToTest.length;

console.log('📊 Summary:');
console.log(`   Average Score: ${averageScore.toFixed(1)}/100`);
console.log(`   Total Violations: ${totalViolations}`);
console.log(`   Compliance Status: ${averageScore >= 90 ? '✅ EXCELLENT' : averageScore >= 80 ? '🟡 GOOD' : '❌ NEEDS IMPROVEMENT'}`);

// Also run full audit
console.log('\n🔍 Running Full Source Code Brand Audit...\n');

try {
  const fullAudit = auditFullBrandCompliance('src');
  console.log(`📈 Overall Brand Compliance Score: ${fullAudit.overallScore.toFixed(1)}/100`);
  console.log(`📁 Total Components Scanned: ${fullAudit.totalComponents}`);
  console.log(`✅ Compliant Components (≥80%): ${fullAudit.compliantComponents}/${fullAudit.totalComponents}`);
  
  if (fullAudit.violations.length > 0) {
    console.log('\n⚠️  Top Violations:');
    fullAudit.violations.slice(0, 10).forEach(violation => {
      console.log(`   • ${violation}`);
    });
  }
  
  if (fullAudit.overallScore >= 90) {
    console.log('\n🎉 Excellent brand compliance! Your implementation follows NHBEA brand guidelines.');
  } else if (fullAudit.overallScore >= 80) {
    console.log('\n👍 Good brand compliance. Minor improvements may be needed.');
  } else {
    console.log('\n⚠️  Brand compliance needs improvement. Please address the violations above.');
  }
  
} catch (error) {
  console.log(`❌ Error running full audit: ${error.message}`);
}