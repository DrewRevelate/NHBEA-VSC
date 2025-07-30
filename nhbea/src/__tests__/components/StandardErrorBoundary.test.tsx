import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StandardErrorBoundary, StandardErrorFallback } from '../../components/StandardErrorBoundary';

// Mock console.error to avoid noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

// Test component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('StandardErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <StandardErrorBoundary>
        <div>Test content</div>
      </StandardErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error fallback when error occurs', () => {
    render(
      <StandardErrorBoundary>
        <ThrowError shouldThrow={true} />
      </StandardErrorBoundary>
    );

    expect(screen.getByText('Content Unavailable')).toBeInTheDocument();
    expect(screen.getByText(/We apologize for the inconvenience/)).toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = jest.fn();
    
    render(
      <StandardErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </StandardErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    );
  });

  it('uses custom fallback component when provided', () => {
    const CustomFallback = ({ error }: { error: string }) => (
      <div>Custom error: {error}</div>
    );

    render(
      <StandardErrorBoundary fallback={CustomFallback}>
        <ThrowError shouldThrow={true} />
      </StandardErrorBoundary>
    );

    expect(screen.getByText('Custom error: Test error')).toBeInTheDocument();
  });

  it('supports retry functionality', () => {
    let shouldThrow = true;
    const TestComponent = () => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>No error</div>;
    };

    render(
      <StandardErrorBoundary>
        <TestComponent />
      </StandardErrorBoundary>
    );

    expect(screen.getByText('Content Unavailable')).toBeInTheDocument();

    const retryButton = screen.getByText('Try Again');
    
    // Change the error condition and retry
    shouldThrow = false;
    fireEvent.click(retryButton);

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('hides retry button after 3 failed attempts', () => {
    // Create a component that always throws to test retry limit
    const AlwaysError = () => {
      throw new Error('Always fails');
    };

    render(
      <StandardErrorBoundary>
        <AlwaysError />
      </StandardErrorBoundary>
    );

    // Initial state: should show retry button (retryCount: 0)
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    
    // Exhaust all retry attempts
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByText('Try Again'));
    }
    
    // After 3 failed retries, button should be hidden
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });
});

describe('StandardErrorFallback', () => {
  const originalEnv = process.env.NODE_ENV;
  
  afterEach(() => {
    // Restore original environment
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      writable: true,
      configurable: true
    });
  });

  it('renders error message correctly', () => {
    render(<StandardErrorFallback error="Test error message" />);

    expect(screen.getByText('Content Unavailable')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows development error details in development mode', () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true,
      configurable: true
    });
    
    render(<StandardErrorFallback error="Test error message" />);

    expect(screen.getByText(/Development Notice: Test error message/)).toBeInTheDocument();
  });

  it('shows user-friendly message in production mode', () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
      configurable: true
    });
    
    render(<StandardErrorFallback error="Test error message" />);

    expect(screen.getByText(/We apologize for the inconvenience/)).toBeInTheDocument();
    expect(screen.queryByText(/Development Notice/)).not.toBeInTheDocument();
  });

  it('renders retry button when retry function provided', () => {
    const retryFn = jest.fn();
    
    render(<StandardErrorFallback error="Test error" retry={retryFn} />);

    const retryButton = screen.getByText('Try Again');
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(retryFn).toHaveBeenCalled();
  });

  it('does not render retry button when no retry function provided', () => {
    render(<StandardErrorFallback error="Test error" />);

    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });

  it('renders different variants correctly', () => {
    const { rerender } = render(
      <StandardErrorFallback error="Test error" variant="page" />
    );

    expect(screen.getByText('Page Unavailable')).toBeInTheDocument();
    expect(screen.getByText('Go to Homepage')).toBeInTheDocument();
    expect(screen.getByText('Contact Support')).toBeInTheDocument();

    rerender(<StandardErrorFallback error="Test error" variant="section" />);
    expect(screen.getByText('Content Unavailable')).toBeInTheDocument();

    rerender(<StandardErrorFallback error="Test error" variant="inline" />);
    expect(screen.getByText('Content Unavailable')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<StandardErrorFallback error="Test error" />);

    const errorContainer = screen.getByRole('alert');
    expect(errorContainer).toHaveAttribute('aria-live', 'polite');
    
    const description = screen.getByText(/We apologize for the inconvenience/);
    expect(description).toHaveAttribute('id', 'error-description');
  });
});