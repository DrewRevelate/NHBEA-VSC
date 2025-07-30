# Accessibility (a11y) Guide

Accessibility is a primary goal of the standardized component architecture. All components are designed to meet WCAG 2.1 Level AA compliance. This guide outlines the built-in features and best practices for maintaining accessibility.

## 🎯 Core Principles

- **Semantic HTML**: Use HTML elements for their intended purpose (e.g., `<nav>`, `<main>`, `<button>`).
- **Keyboard Navigable**: All interactive elements must be reachable and operable via the keyboard alone.
- **Screen Reader Friendly**: Content should be understandable and navigable by screen reader users.
- **Sufficient Contrast**: Text and UI elements must have adequate color contrast to be readable by people with low vision.

## Built-in Accessibility Features

The new standardized components have accessibility built-in.

### `StandardPageLayout`
- **Skip-to-Content Link**: Automatically included to allow keyboard users to bypass navigation and jump directly to the main content (`#main-content`).
- **ARIA Landmarks**: The layout uses semantic `<header>`, `<main>`, and `<footer>` elements, which act as landmarks for assistive technologies.
- **Focus Management**: The `<main>` element has `id="main-content"` and `tabIndex={-1}` to ensure it can be programmatically focused, which is crucial for routing changes.

### `StandardErrorBoundary`
- **Accessible Fallbacks**: The default error fallback is designed to be announced by screen readers, informing users when content has failed to load.

## Component-Specific Guidelines

### `FlexibleHero`
- **Image `alt` Text**: When using variants that include an image (`about`, `home`), ensure that meaningful alternative text is provided if the image conveys information. If it's purely decorative, provide an empty `alt=""` attribute.
- **Heading Structure**: The `title` prop is rendered as a `<h1>` or `<h2>` depending on context, ensuring a proper heading hierarchy.

### Form Elements
- **Labels**: Always associate a `<label>` with every form input (`<input>`, `<textarea>`, `<select>`).
- **Error Messages**: When validation errors occur, they must be programmatically associated with the input field using `aria-describedby`.

## Testing for Accessibility

While automated tooling with `axe-core` is planned for integration into our CI/CD pipeline, manual testing remains crucial.

### Manual Testing Checklist
1.  **Keyboard Navigation**:
    - Can you `Tab` to every interactive element (links, buttons, form fields)?
    - Is the focus order logical and predictable?
    - Is the focus indicator always visible?
    - Can you operate all controls using `Enter` and `Space`?
    - Can you escape modals and menus using the `Esc` key?
2.  **Screen Reader Testing**:
    - Use a screen reader (VoiceOver on macOS, NVDA on Windows) to navigate the page.
    - Is all content read out logically?
    - Are images described properly?
    - Are links and buttons clearly labeled?
3.  **Color Contrast**:
    - Use browser developer tools or online contrast checkers to ensure text meets the WCAG AA ratio of 4.5:1 (or 3:1 for large text).

## Common Pitfalls to Avoid

- **Using `div`s for Buttons**: Never use a `<div>` with an `onClick` handler instead of a `<button>`. Buttons provide keyboard accessibility and ARIA roles for free.
- **Vague Link Text**: Avoid link text like "Click Here" or "Learn More". Link text should be descriptive of its destination, even out of context.
- **Missing Focus Styles**: Ensure that the `focus-visible` state is styled to be clearly different from the default and hover states. Our new component system handles this.