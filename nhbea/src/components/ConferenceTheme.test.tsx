import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConferenceThemeProvider, ShapingTheFutureHero } from './ConferenceTheme';
import { ConferenceTheme } from '@/types/conference';

// Mock the DOM style setting since JSDOM doesn't fully support it
const mockSetProperty = jest.fn();
Object.defineProperty(document.documentElement, 'style', {
  value: {
    setProperty: mockSetProperty
  }
});

const mockTheme: ConferenceTheme = {
  primaryColor: '#2563eb',
  secondaryColor: '#4f46e5',
  accentColor: '#06b6d4',
  backgroundGradient: {
    from: '#f8fafc',
    to: '#e0f2fe'
  },
  brandingElements: {
    shapingTheFuture: true,
    animatedElements: true
  }
};

describe('ConferenceThemeProvider', () => {
  beforeEach(() => {
    mockSetProperty.mockClear();
  });

  it('renders children correctly', () => {
    render(
      <ConferenceThemeProvider theme={mockTheme}>
        <div data-testid="test-child">Test Content</div>
      </ConferenceThemeProvider>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies CSS custom properties for theme colors', () => {
    render(
      <ConferenceThemeProvider theme={mockTheme}>
        <div>Test</div>
      </ConferenceThemeProvider>
    );

    expect(mockSetProperty).toHaveBeenCalledWith('--conference-primary', '#2563eb');
    expect(mockSetProperty).toHaveBeenCalledWith('--conference-secondary', '#4f46e5');
    expect(mockSetProperty).toHaveBeenCalledWith('--conference-accent', '#06b6d4');
  });

  it('applies background gradient custom properties', () => {
    render(
      <ConferenceThemeProvider theme={mockTheme}>
        <div>Test</div>
      </ConferenceThemeProvider>
    );

    expect(mockSetProperty).toHaveBeenCalledWith('--conference-bg-from', '#f8fafc');
    expect(mockSetProperty).toHaveBeenCalledWith('--conference-bg-to', '#e0f2fe');
  });

  it('uses default theme when no theme provided', () => {
    render(
      <ConferenceThemeProvider>
        <div data-testid="test-child">Test Content</div>
      </ConferenceThemeProvider>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(mockSetProperty).toHaveBeenCalledWith('--conference-primary', '#2563eb');
  });
});

describe('ShapingTheFutureHero', () => {
  const mockProps = {
    title: 'Test Conference 2025',
    subtitle: 'A great conference for testing',
    theme: mockTheme
  };

  it('renders title and subtitle correctly', () => {
    render(<ShapingTheFutureHero {...mockProps} />);

    expect(screen.getByText('Test Conference 2025')).toBeInTheDocument();
    expect(screen.getByText('A great conference for testing')).toBeInTheDocument();
  });

  it('displays "Shaping the Future" badge when enabled', () => {
    render(<ShapingTheFutureHero {...mockProps} />);

    expect(screen.getByText('SHAPING THE FUTURE')).toBeInTheDocument();
    expect(screen.getByText('Professional Excellence')).toBeInTheDocument();
  });

  it('does not display "Shaping the Future" badge when disabled', () => {
    const themeWithoutShaping = {
      ...mockTheme,
      brandingElements: {
        ...mockTheme.brandingElements,
        shapingTheFuture: false
      }
    };

    render(<ShapingTheFutureHero {...mockProps} theme={themeWithoutShaping} />);

    expect(screen.queryByText('SHAPING THE FUTURE')).not.toBeInTheDocument();
  });

  it('displays future-focused features when shaping the future is enabled', () => {
    render(<ShapingTheFutureHero {...mockProps} />);

    expect(screen.getByText('Innovative Teaching')).toBeInTheDocument();
    expect(screen.getByText('Expert Network')).toBeInTheDocument();
    expect(screen.getByText('Career Growth')).toBeInTheDocument();
  });

  it('uses default theme when no theme provided', () => {
    const propsWithoutTheme = {
      title: 'Test Conference',
      subtitle: 'Test subtitle'
    };

    render(<ShapingTheFutureHero {...propsWithoutTheme} />);

    expect(screen.getByText('Test Conference')).toBeInTheDocument();
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
  });

  it('renders animated elements when animations are enabled', () => {
    const { container } = render(<ShapingTheFutureHero {...mockProps} />);

    // Check for animated elements by looking for animation-related classes
    const animatedElements = container.querySelectorAll('.animate-pulse, .animate-float, .animate-fade-in-up');
    expect(animatedElements.length).toBeGreaterThan(0);
  });

  it('applies gradient styles to title text', () => {
    const { container } = render(<ShapingTheFutureHero {...mockProps} />);

    const titleElement = screen.getByText('Test Conference 2025');
    // Check that the title has the style attribute with gradient background
    expect(titleElement).toHaveAttribute('style');
    expect(titleElement.getAttribute('style')).toContain('linear-gradient');
  });
});