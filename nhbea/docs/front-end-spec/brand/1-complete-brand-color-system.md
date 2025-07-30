# 1. Complete Brand Color System

### Primary Color Palette (Following 60-30-10 Rule)

#### Primary Blue (60% of Design Usage)
- **Conservative Royal Blue**: `#2563eb` - Primary brand color
- **RGB Values**: R:37, G:99, B:235
- **CMYK Values**: C:84, M:58, Y:0, K:8
- **Pantone Equivalent**: 286C
- **Psychological Impact**: Professional confidence with approachability
- **Usage**: Primary UI elements, navigation, main CTAs, brand elements

#### Supporting Blues (Additional 30% Usage)
```css
:root {
  /* Primary Blue Variations */
  --nhbea-royal-blue: #2563eb;          /* Main brand blue */
  --nhbea-royal-blue-dark: #1e40af;     /* Headers, emphasis */
  --nhbea-royal-blue-deeper: #1e3a8a;   /* Maximum authority elements */
  --nhbea-royal-blue-light: #3b82f6;    /* Links, secondary elements */
  --nhbea-royal-blue-lighter: #60a5fa;  /* Backgrounds, success states */
  --nhbea-royal-blue-subtle: #93c5fd;   /* Subtle highlights */
  
  /* Neutral Foundation (60% of layout) */
  --nhbea-white: #ffffff;
  --nhbea-gray-50: #f8fafc;
  --nhbea-gray-100: #f1f5f9;
  --nhbea-gray-200: #e2e8f0;
  --nhbea-gray-300: #cbd5e1;
  --nhbea-gray-400: #94a3b8;
  --nhbea-gray-500: #64748b;
  --nhbea-gray-600: #475569;
  --nhbea-gray-700: #334155;
  --nhbea-gray-800: #1e293b;
  --nhbea-gray-900: #0f172a;
}
```

### Strategic Accent Colors (10% of Design Usage)

#### Primary Accent - Warm Orange
```css
:root {
  --nhbea-accent-orange: #ea580c;        /* Primary CTA accent */
  --nhbea-accent-orange-dark: #c2410c;   /* Hover states */
  --nhbea-accent-orange-light: #fb923c;  /* Subtle highlights */
}
```
- **Usage**: High-priority CTAs, urgent notifications, action elements
- **Psychological Effect**: Creates urgency while maintaining blue's calm authority
- **Application**: "Register Now", "Apply Today", "Join NHBEA" buttons

#### Secondary Accent - Academic Gold
```css
:root {
  --nhbea-accent-gold: #fbbf24;          /* Achievement highlights */
  --nhbea-accent-gold-dark: #f59e0b;     /* Awards, recognition */
  --nhbea-accent-gold-light: #fde68a;    /* Success backgrounds */
}
```
- **Usage**: Awards, achievements, success messages, testimonials
- **Psychological Effect**: Adds warmth and prestige without compromising professionalism
- **Application**: Hall of Fame, award nominations, member achievements

#### Supporting Accent - Forest Green
```css
:root {
  --nhbea-accent-green: #059669;         /* Progress, growth */
  --nhbea-accent-green-dark: #047857;    /* Success confirmations */
  --nhbea-accent-green-light: #34d399;   /* Positive indicators */
}
```
- **Usage**: Progress indicators, completion states, positive feedback
- **Application**: Form validation, membership progress, learning paths

### Status and Feedback Colors
```css
:root {
  /* Status Colors */
  --nhbea-success: #10b981;
  --nhbea-success-bg: #d1fae5;
  --nhbea-warning: #f59e0b;
  --nhbea-warning-bg: #fef3c7;
  --nhbea-error: #ef4444;
  --nhbea-error-bg: #fee2e2;
  --nhbea-info: #3b82f6;
  --nhbea-info-bg: #dbeafe;
}
```
