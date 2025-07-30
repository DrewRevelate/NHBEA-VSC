#!/bin/bash

echo "🎨 Running NHBEA Brand Validation..."
echo "====================================="
echo

# Test the specific components we modified
COMPONENTS=(
  "src/components/RecognitionShowcaseSection.tsx"
  "src/components/SpeakersSection.tsx" 
  "src/components/AwardNominationForm.tsx"
  "src/components/SocialMediaFeed.tsx"
)

TOTAL_VIOLATIONS=0
TOTAL_COMPONENTS=${#COMPONENTS[@]}

echo "📋 Testing Modified Components:"
echo

for component in "${COMPONENTS[@]}"; do
  echo "✨ Testing $(basename "$component" .tsx)"
  
  # Check for hardcoded colors that should have been fixed
  HARDCODED_COLORS=$(grep -E "(bg-blue-[0-9]+|text-blue-[0-9]+|border-blue-[0-9]+|focus:ring-blue-[0-9]+|focus:border-blue-[0-9]+|border-gray-300)" "$component" | wc -l | xargs)
  
  # Check for design token usage
  DESIGN_TOKENS=$(grep -E "var\(--nhbea-|var\(--color-|var\(--brand-" "$component" | wc -l | xargs)
  
  # Calculate score
  if [ "$HARDCODED_COLORS" -eq 0 ] && [ "$DESIGN_TOKENS" -gt 0 ]; then
    SCORE=100
    STATUS="✅ EXCELLENT"
  elif [ "$HARDCODED_COLORS" -le 2 ] && [ "$DESIGN_TOKENS" -gt 0 ]; then
    SCORE=85
    STATUS="🟡 GOOD"
  else
    SCORE=50
    STATUS="❌ NEEDS IMPROVEMENT"
  fi
  
  echo "   Score: $SCORE/100"
  echo "   Design Tokens Found: $DESIGN_TOKENS"
  echo "   Hardcoded Colors: $HARDCODED_COLORS"
  echo "   Status: $STATUS"
  
  if [ "$HARDCODED_COLORS" -gt 0 ]; then
    echo "   Remaining hardcoded colors:"
    grep -n -E "(bg-blue-[0-9]+|text-blue-[0-9]+|border-blue-[0-9]+|focus:ring-blue-[0-9]+|focus:border-blue-[0-9]+|border-gray-300)" "$component" | head -5
    TOTAL_VIOLATIONS=$((TOTAL_VIOLATIONS + HARDCODED_COLORS))
  fi
  
  echo
done

echo "📊 Summary:"
echo "   Components Tested: $TOTAL_COMPONENTS"
echo "   Total Hardcoded Color Violations: $TOTAL_VIOLATIONS"

if [ "$TOTAL_VIOLATIONS" -eq 0 ]; then
  echo "   Overall Status: ✅ ALL COMPONENTS COMPLIANT"
  echo
  echo "🎉 Excellent! All modified components now use design tokens instead of hardcoded colors."
elif [ "$TOTAL_VIOLATIONS" -le 5 ]; then
  echo "   Overall Status: 🟡 MOSTLY COMPLIANT"
  echo
  echo "👍 Good progress! Only minor violations remain."
else
  echo "   Overall Status: ❌ NEEDS MORE WORK"
  echo
  echo "⚠️  Several hardcoded colors still need to be replaced with design tokens."
fi

echo
echo "🔍 Full Project Hardcoded Color Scan:"
echo "====================================="

# Scan all TSX files for common hardcoded color patterns
TOTAL_PROJECT_VIOLATIONS=$(find src -name "*.tsx" -exec grep -l -E "(bg-blue-[0-9]+|text-blue-[0-9]+|border-blue-[0-9]+|focus:ring-blue-[0-9]+|focus:border-blue-[0-9]+|border-gray-300)" {} \; | wc -l | xargs)

echo "Files with potential hardcoded colors: $TOTAL_PROJECT_VIOLATIONS"

if [ "$TOTAL_PROJECT_VIOLATIONS" -eq 0 ]; then
  echo "🎉 No hardcoded colors detected in any TSX files!"
else
  echo "Files still containing hardcoded colors:"
  find src -name "*.tsx" -exec grep -l -E "(bg-blue-[0-9]+|text-blue-[0-9]+|border-blue-[0-9]+|focus:ring-blue-[0-9]+|focus:border-blue-[0-9]+|border-gray-300)" {} \;
fi