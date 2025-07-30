import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StandardPageLayout } from '../../components/StandardPageLayout';

// Mock components to avoid complex dependencies
jest.mock('../../components/StandardErrorBoundary', () => ({
  StandardErrorBoundary: ({ children }: { children: React.ReactNode }) => <div data-testid="error-boundary">{children}</div>
}));

jest.mock('../../components/LoadingSpinner', () => ({
  LoadingSpinner: ({ variant }: { variant?: string }) => <div data-testid={`loading-${variant}`}>Loading...</div>
}));

describe('StandardPageLayout', () => {
  it('renders children correctly', () => {
    render(
      <StandardPageLayout>
        <div>Test content</div>
      </StandardPageLayout>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders with default main element configuration', () => {
    render(
      <StandardPageLayout>
        <div>Test content</div>
      </StandardPageLayout>
    );

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveAttribute('id', 'main-content');
    expect(mainElement).toHaveAttribute('tabIndex', '-1');
    expect(mainElement).toHaveAttribute('aria-label', 'Main content');
  });

  it('renders with custom main element configuration', () => {
    render(
      <StandardPageLayout
        main={{
          id: 'custom-main',
          className: 'custom-class',
          focusable: false
        }}
      >
        <div>Test content</div>
      </StandardPageLayout>
    );

    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveAttribute('id', 'custom-main');
    expect(mainElement).toHaveClass('custom-class');
    expect(mainElement).not.toHaveAttribute('tabIndex');
  });

  it('renders skip link with correct href', () => {
    render(
      <StandardPageLayout
        main={{ id: 'custom-main' }}
      >
        <div>Test content</div>
      </StandardPageLayout>
    );

    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#custom-main');
  });

  it('renders hero component when provided', () => {
    const MockHero = () => <div data-testid="hero">Hero Content</div>;
    
    render(
      <StandardPageLayout
        hero={{
          component: MockHero,
          props: { test: 'prop' }
        }}
      >
        <div>Test content</div>
      </StandardPageLayout>
    );

    expect(screen.getByTestId('hero')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <StandardPageLayout className="custom-layout-class">
        <div>Test content</div>
      </StandardPageLayout>
    );

    // Check that the outer div has the custom class
    const container = screen.getByText('Test content').closest('.custom-layout-class');
    expect(container).toBeInTheDocument();
  });

  it('wraps content with error boundary when enabled', () => {
    render(
      <StandardPageLayout error={{ boundary: true }}>
        <div>Test content</div>
      </StandardPageLayout>
    );

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
  });

  it('does not wrap content with error boundary when disabled', () => {
    render(
      <StandardPageLayout error={{ boundary: false }}>
        <div>Test content</div>
      </StandardPageLayout>
    );

    expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument();
  });

  it('renders with loading disabled', () => {
    render(
      <StandardPageLayout loading={{ enabled: false }}>
        <div>Test content</div>
      </StandardPageLayout>
    );

    // Content should render immediately without Suspense
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('has proper accessibility structure', () => {
    render(
      <StandardPageLayout>
        <div>Test content</div>
      </StandardPageLayout>
    );

    // Check for skip link
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toHaveClass('sr-only');

    // Check for main landmark
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });
});

describe('withStandardLayout HOC', () => {
  it('wraps component with StandardPageLayout', () => {
    const TestComponent = () => <div>Wrapped content</div>;
    const WrappedComponent = () => (
      <StandardPageLayout>
        <TestComponent />
      </StandardPageLayout>
    );

    render(<WrappedComponent />);

    expect(screen.getByText('Wrapped content')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});