# 7. Digital Implementation

### CSS Custom Properties (Design Tokens)
```css
:root {
  /* Brand Colors */
  --brand-primary: var(--nhbea-royal-blue);
  --brand-primary-dark: var(--nhbea-royal-blue-dark);
  --brand-primary-light: var(--nhbea-royal-blue-light);
  --brand-accent-primary: var(--nhbea-accent-orange);
  --brand-accent-secondary: var(--nhbea-accent-gold);
  --brand-accent-tertiary: var(--nhbea-accent-green);
  
  /* Semantic Colors */
  --color-text-primary: var(--nhbea-gray-800);
  --color-text-secondary: var(--nhbea-gray-600);
  --color-text-muted: var(--nhbea-gray-500);
  --color-bg-primary: var(--nhbea-white);
  --color-bg-secondary: var(--nhbea-gray-50);
  --color-bg-muted: var(--nhbea-gray-100);
  --color-border-primary: var(--nhbea-gray-200);
  --color-border-secondary: var(--nhbea-gray-300);
  
  /* Component Tokens */
  --button-primary-bg: var(--brand-primary);
  --button-primary-hover: var(--brand-primary-dark);
  --button-accent-bg: var(--brand-accent-primary);
  --card-bg: var(--color-bg-primary);
  --card-border: var(--color-border-primary);
  --input-border: var(--color-border-secondary);
  --input-focus: var(--brand-primary);
  
  /* Spacing Scale */
  --space-xs: 0.25rem;    /* 4px */
  --space-sm: 0.5rem;     /* 8px */
  --space-md: 0.75rem;    /* 12px */
  --space-lg: 1rem;       /* 16px */
  --space-xl: 1.25rem;    /* 20px */
  --space-2xl: 1.5rem;    /* 24px */
  --space-3xl: 2rem;      /* 32px */
  --space-4xl: 2.5rem;    /* 40px */
  --space-5xl: 3rem;      /* 48px */
  --space-6xl: 4rem;      /* 64px */
  
  /* Border Radius Scale */
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;  /* 6px */
  --radius-lg: 0.5rem;    /* 8px */
  --radius-xl: 0.75rem;   /* 12px */
  --radius-2xl: 1rem;     /* 16px */
  --radius-full: 9999px;
  
  /* Shadow Scale */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
  --shadow-brand: 0 8px 25px rgba(37, 99, 235, 0.3);
  --shadow-accent: 0 8px 25px rgba(234, 88, 12, 0.3);
  
  /* Animation Tokens */
  --duration-fast: 0.15s;
  --duration-normal: 0.3s;
  --duration-slow: 0.5s;
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-accelerate: cubic-bezier(0.4, 0, 1, 1);
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
}
```

### Dark Mode Considerations
```css
@media (prefers-color-scheme: dark) {
  :root {
    /* Adjusted for dark mode while maintaining brand identity */
    --color-bg-primary: var(--nhbea-gray-900);
    --color-bg-secondary: var(--nhbea-gray-800);
    --color-bg-muted: var(--nhbea-gray-700);
    --color-text-primary: var(--nhbea-gray-100);
    --color-text-secondary: var(--nhbea-gray-300);
    --color-text-muted: var(--nhbea-gray-400);
    --color-border-primary: var(--nhbea-gray-700);
    --color-border-secondary: var(--nhbea-gray-600);
    
    /* Brand colors remain consistent for identity recognition */
    --brand-primary: var(--nhbea-royal-blue-light);
    --brand-primary-dark: var(--nhbea-royal-blue);
  }
}
```

### Component Implementation Examples

#### Brand-Compliant Button Component
```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'cta';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ variant, size, children, className = '' }) => {
  const baseClasses = 'font-primary font-semibold transition-all duration-300 ease-standard';
  
  const variantClasses = {
    primary: 'bg-brand-primary hover:bg-brand-primary-dark text-white shadow-brand hover:shadow-lg hover:-translate-y-0.5',
    secondary: 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white',
    cta: 'bg-brand-accent-primary hover:bg-brand-accent-primary-dark text-white shadow-accent hover:shadow-xl hover:-translate-y-1'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-md',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-xl'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};
```

### Responsive Design Tokens
```css
/* Breakpoint-specific adjustments */
@media (max-width: 768px) {
  :root {
    --text-4xl: 2rem;        /* Smaller hero text on mobile */
    --text-3xl: 1.5rem;      /* Adjusted section headings */
    --space-6xl: 2rem;       /* Reduced large spacing */
    --space-5xl: 1.5rem;     /* Adjusted padding */
  }
}

@media (max-width: 480px) {
  :root {
    --text-4xl: 1.75rem;     /* Further reduced for small screens */
    --text-3xl: 1.375rem;    /* Compact headings */
    --space-6xl: 1.5rem;     /* Minimal large spacing */
    --space-5xl: 1rem;       /* Tight padding */
  }
}
```
