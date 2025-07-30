# 2. Typography Hierarchy

### Professional Font System

#### Primary Typeface - Inter (Headings & UI)
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

.font-primary {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
}
```
- **Rationale**: Modern, highly legible, authoritative without being intimidating
- **Psychological Impact**: Conveys educational professionalism and accessibility
- **Usage**: All headings, navigation, buttons, UI elements

#### Secondary Typeface - Georgia (Long-form Content)
```css
.font-secondary {
  font-family: 'Georgia', 'Times New Roman', Times, serif;
  font-feature-settings: 'kern', 'liga', 'clig', 'calt';
}
```
- **Rationale**: Academic tradition, excellent readability for extended reading
- **Usage**: Article content, long descriptions, formal documents

### Typography Scale & Hierarchy
```css
:root {
  /* Font Sizes - Modular Scale (1.25 ratio) */
  --text-xs: 0.75rem;      /* 12px - Small labels, captions */
  --text-sm: 0.875rem;     /* 14px - Body text, forms */
  --text-base: 1rem;       /* 16px - Standard body text */
  --text-lg: 1.125rem;     /* 18px - Large body text */
  --text-xl: 1.25rem;      /* 20px - Small headings */
  --text-2xl: 1.5rem;      /* 24px - Section headings */
  --text-3xl: 1.875rem;    /* 30px - Page headings */
  --text-4xl: 2.25rem;     /* 36px - Major headings */
  --text-5xl: 3rem;        /* 48px - Hero headings */
  --text-6xl: 3.75rem;     /* 60px - Display headings */
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
  
  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
}
```

### Typography Usage Guidelines

#### Heading Hierarchy
```css
/* H1 - Page Titles */
.heading-1 {
  font-family: var(--font-primary);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--nhbea-royal-blue-deeper);
  margin-bottom: var(--space-6);
}

/* H2 - Section Headings */
.heading-2 {
  font-family: var(--font-primary);
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
  color: var(--nhbea-royal-blue);
  margin-bottom: var(--space-4);
}

/* H3 - Subsection Headings */
.heading-3 {
  font-family: var(--font-primary);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
  color: var(--nhbea-royal-blue-dark);
  margin-bottom: var(--space-3);
}

/* Body Text */
.body-text {
  font-family: var(--font-primary);
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-relaxed);
  color: var(--nhbea-gray-700);
}

/* Long-form Content */
.content-text {
  font-family: var(--font-secondary);
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
  line-height: var(--leading-loose);
  color: var(--nhbea-gray-800);
}
```
