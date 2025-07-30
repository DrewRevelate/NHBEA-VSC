# 4. Component Design Language

### Button System

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, var(--nhbea-royal-blue) 0%, var(--nhbea-royal-blue-dark) 100%);
  color: var(--nhbea-white);
  padding: var(--space-3) var(--space-6);
  border-radius: 0.5rem;
  font-family: var(--font-primary);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.35);
  background: linear-gradient(135deg, var(--nhbea-royal-blue-dark) 0%, var(--nhbea-royal-blue-deeper) 100%);
}
```

#### Accent CTA Button
```css
.btn-cta {
  background: linear-gradient(135deg, var(--nhbea-accent-orange) 0%, var(--nhbea-accent-orange-dark) 100%);
  color: var(--nhbea-white);
  padding: var(--space-4) var(--space-8);
  border-radius: 0.625rem;
  font-family: var(--font-primary);
  font-weight: var(--font-bold);
  font-size: var(--text-lg);
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(234, 88, 12, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(234, 88, 12, 0.4);
}

.btn-cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-cta:hover::before {
  left: 100%;
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: var(--nhbea-royal-blue);
  padding: var(--space-3) var(--space-6);
  border: 2px solid var(--nhbea-royal-blue);
  border-radius: 0.5rem;
  font-family: var(--font-primary);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-secondary:hover {
  background: var(--nhbea-royal-blue);
  color: var(--nhbea-white);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
}
```

### Card Components

#### Standard Card
```css
.card {
  background: var(--nhbea-white);
  border-radius: 0.75rem;
  border: 1px solid var(--nhbea-gray-200);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: var(--space-6);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--nhbea-royal-blue), var(--nhbea-royal-blue-light));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  border-color: var(--nhbea-royal-blue-light);
}

.card:hover::before {
  opacity: 1;
}
```

#### Featured Card
```css
.card-featured {
  background: linear-gradient(135deg, var(--nhbea-royal-blue) 0%, var(--nhbea-royal-blue-dark) 100%);
  color: var(--nhbea-white);
  border-radius: 0.75rem;
  padding: var(--space-8);
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
  position: relative;
  overflow: hidden;
}

.card-featured::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  pointer-events: none;
}
```

### Form Components

#### Input Fields
```css
.form-input {
  width: 100%;
  padding: var(--space-4);
  border: 2px solid var(--nhbea-gray-300);
  border-radius: 0.5rem;
  font-family: var(--font-primary);
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  color: var(--nhbea-gray-800);
  background: var(--nhbea-white);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.form-input:focus {
  outline: none;
  border-color: var(--nhbea-royal-blue);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  transform: translateY(-1px);
}

.form-input::placeholder {
  color: var(--nhbea-gray-400);
  font-weight: var(--font-normal);
}

.form-input.error {
  border-color: var(--nhbea-error);
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
}

.form-input.success {
  border-color: var(--nhbea-success);
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}
```

#### Form Labels
```css
.form-label {
  display: block;
  font-family: var(--font-primary);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  color: var(--nhbea-gray-700);
  margin-bottom: var(--space-2);
  letter-spacing: 0.025em;
}

.form-label.required::after {
  content: ' *';
  color: var(--nhbea-error);
  font-weight: var(--font-bold);
}
```

### Navigation Components

#### Main Navigation
```css
.nav-main {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--nhbea-gray-200);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-link {
  color: var(--nhbea-gray-700);
  font-family: var(--font-primary);
  font-weight: var(--font-medium);
  font-size: var(--text-base);
  padding: var(--space-4) var(--space-5);
  border-radius: 0.375rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  text-decoration: none;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--nhbea-royal-blue);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-50%);
}

.nav-link:hover,
.nav-link.active {
  color: var(--nhbea-royal-blue);
  background: var(--nhbea-gray-50);
}

.nav-link:hover::before,
.nav-link.active::before {
  width: 80%;
}
```
