import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResponsiveGrid, { Container, responsiveTypography, breakpoints } from '../../components/ResponsiveGrid';

describe('ResponsiveGrid', () => {
  it('renders children correctly', () => {
    render(
      <ResponsiveGrid>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </ResponsiveGrid>
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('applies default props correctly', () => {
    render(
      <ResponsiveGrid data-testid="grid">
        <div>Item 1</div>
      </ResponsiveGrid>
    );

    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass(
      'grid',
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-3',
      'xl:grid-cols-4',
      'gap-6'
    );
  });

  it('applies custom breakpoints correctly', () => {
    render(
      <ResponsiveGrid
        data-testid="grid"
        breakpoints={{ mobile: 2, tablet: 3, desktop: 4, wide: 6 }}
      >
        <div>Item 1</div>
      </ResponsiveGrid>
    );

    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass(
      'grid-cols-2',
      'md:grid-cols-3',
      'lg:grid-cols-4',
      'xl:grid-cols-6'
    );
  });

  it('applies different gap sizes correctly', () => {
    const { rerender } = render(
      <ResponsiveGrid data-testid="grid" gap="sm">
        <div>Item 1</div>
      </ResponsiveGrid>
    );

    let grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('gap-4');

    rerender(
      <ResponsiveGrid data-testid="grid" gap="md">
        <div>Item 1</div>
      </ResponsiveGrid>
    );
    grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('gap-6');

    rerender(
      <ResponsiveGrid data-testid="grid" gap="lg">
        <div>Item 1</div>
      </ResponsiveGrid>
    );
    grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('gap-8');

    rerender(
      <ResponsiveGrid data-testid="grid" gap="xl">
        <div>Item 1</div>
      </ResponsiveGrid>
    );
    grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('gap-12');
  });

  it('applies custom className', () => {
    render(
      <ResponsiveGrid data-testid="grid" className="custom-grid-class">
        <div>Item 1</div>
      </ResponsiveGrid>
    );

    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('custom-grid-class');
  });

  it('handles partial breakpoint configuration', () => {
    render(
      <ResponsiveGrid
        data-testid="grid"
        breakpoints={{ mobile: 1, desktop: 2 }}
      >
        <div>Item 1</div>
      </ResponsiveGrid>
    );

    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('grid-cols-1', 'lg:grid-cols-2');
    // Should not have tablet and wide classes when not specified
    expect(grid.className).not.toMatch(/md:grid-cols-/);
    expect(grid.className).not.toMatch(/xl:grid-cols-/);
  });

  it('handles different variant types', () => {
    // Note: The variant prop is defined in the interface but not used in implementation
    // This test ensures the component works with any variant value
    render(
      <ResponsiveGrid data-testid="grid" variant="auto">
        <div>Item 1</div>
      </ResponsiveGrid>
    );

    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('grid');
  });
});

describe('Container', () => {
  it('renders children correctly', () => {
    render(
      <Container>
        <div>Container content</div>
      </Container>
    );

    expect(screen.getByText('Container content')).toBeInTheDocument();
  });

  it('applies default props correctly', () => {
    render(
      <Container data-testid="container">
        <div>Content</div>
      </Container>
    );

    const container = screen.getByTestId('container');
    expect(container).toHaveClass('max-w-6xl', 'mx-auto', 'px-6', 'lg:px-8');
  });

  it('applies different size variants correctly', () => {
    const { rerender } = render(
      <Container data-testid="container" size="sm">
        <div>Content</div>
      </Container>
    );

    let container = screen.getByTestId('container');
    expect(container).toHaveClass('max-w-2xl');

    rerender(
      <Container data-testid="container" size="md">
        <div>Content</div>
      </Container>
    );
    container = screen.getByTestId('container');
    expect(container).toHaveClass('max-w-4xl');

    rerender(
      <Container data-testid="container" size="lg">
        <div>Content</div>
      </Container>
    );
    container = screen.getByTestId('container');
    expect(container).toHaveClass('max-w-6xl');

    rerender(
      <Container data-testid="container" size="xl">
        <div>Content</div>
      </Container>
    );
    container = screen.getByTestId('container');
    expect(container).toHaveClass('max-w-7xl');

    rerender(
      <Container data-testid="container" size="full">
        <div>Content</div>
      </Container>
    );
    container = screen.getByTestId('container');
    expect(container).toHaveClass('max-w-full');
  });

  it('applies different padding variants correctly', () => {
    const { rerender } = render(
      <Container data-testid="container" padding="sm">
        <div>Content</div>
      </Container>
    );

    let container = screen.getByTestId('container');
    expect(container).toHaveClass('px-4');

    rerender(
      <Container data-testid="container" padding="md">
        <div>Content</div>
      </Container>
    );
    container = screen.getByTestId('container');
    expect(container).toHaveClass('px-6', 'lg:px-8');

    rerender(
      <Container data-testid="container" padding="lg">
        <div>Content</div>
      </Container>
    );
    container = screen.getByTestId('container');
    expect(container).toHaveClass('px-8', 'lg:px-12');

    rerender(
      <Container data-testid="container" padding="xl">
        <div>Content</div>
      </Container>
    );
    container = screen.getByTestId('container');
    expect(container).toHaveClass('px-12', 'lg:px-16');
  });

  it('applies custom className', () => {
    render(
      <Container data-testid="container" className="custom-container-class">
        <div>Content</div>
      </Container>
    );

    const container = screen.getByTestId('container');
    expect(container).toHaveClass('custom-container-class');
  });

  it('centers content with mx-auto', () => {
    render(
      <Container data-testid="container">
        <div>Content</div>
      </Container>
    );

    const container = screen.getByTestId('container');
    expect(container).toHaveClass('mx-auto');
  });
});

describe('responsiveTypography', () => {
  it('exports typography scale with correct classes', () => {
    expect(responsiveTypography.heading1).toBe('text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold');
    expect(responsiveTypography.heading2).toBe('text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold');
    expect(responsiveTypography.heading3).toBe('text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold');
    expect(responsiveTypography.heading4).toBe('text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold');
    expect(responsiveTypography.body).toBe('text-base md:text-lg lg:text-xl');
    expect(responsiveTypography.small).toBe('text-sm md:text-base lg:text-lg');
    expect(responsiveTypography.caption).toBe('text-xs md:text-sm lg:text-base');
  });

  it('can be applied to elements', () => {
    render(
      <h1 className={responsiveTypography.heading1} data-testid="heading">
        Responsive Heading
      </h1>
    );

    const heading = screen.getByTestId('heading');
    expect(heading).toHaveClass('text-3xl', 'md:text-4xl', 'lg:text-5xl', 'xl:text-6xl', 'font-bold');
  });
});

describe('breakpoints', () => {
  it('exports correct breakpoint configuration', () => {
    expect(breakpoints.mobile).toEqual({
      min: '320px',
      max: '767px',
      container: 'max-w-sm mx-auto px-4',
      grid: 'grid-cols-1',
      spacing: 'space-y-8'
    });

    expect(breakpoints.tablet).toEqual({
      min: '768px',
      max: '1023px',
      container: 'max-w-4xl mx-auto px-6',
      grid: 'grid-cols-2',
      spacing: 'space-y-12'
    });

    expect(breakpoints.desktop).toEqual({
      min: '1024px',
      max: '1439px',
      container: 'max-w-6xl mx-auto px-8',
      grid: 'grid-cols-3',
      spacing: 'space-y-16'
    });

    expect(breakpoints.wide).toEqual({
      min: '1440px',
      container: 'max-w-7xl mx-auto px-8',
      grid: 'grid-cols-4',
      spacing: 'space-y-20'
    });
  });

  it('provides consistent breakpoint values', () => {
    // Ensure breakpoints have proper progressive enhancement
    expect(parseInt(breakpoints.mobile.min)).toBeLessThan(parseInt(breakpoints.tablet.min));
    expect(parseInt(breakpoints.tablet.min)).toBeLessThan(parseInt(breakpoints.desktop.min));
    expect(parseInt(breakpoints.desktop.min)).toBeLessThan(parseInt(breakpoints.wide.min));
  });
});

describe('ResponsiveGrid integration', () => {
  it('works well with Container component', () => {
    render(
      <Container data-testid="container">
        <ResponsiveGrid data-testid="grid">
          <div>Item 1</div>
          <div>Item 2</div>
        </ResponsiveGrid>
      </Container>
    );

    const container = screen.getByTestId('container');
    const grid = screen.getByTestId('grid');
    
    expect(container).toBeInTheDocument();
    expect(grid).toBeInTheDocument();
    expect(container).toContainElement(grid);
  });

  it('supports semantic HTML structure', () => {
    render(
      <ResponsiveGrid data-testid="grid">
        <article>Article 1</article>
        <article>Article 2</article>
      </ResponsiveGrid>
    );

    const grid = screen.getByTestId('grid');
    const articles = screen.getAllByRole('article');
    
    expect(grid).toBeInTheDocument();
    expect(articles).toHaveLength(2);
    articles.forEach(article => {
      expect(grid).toContainElement(article);
    });
  });
});