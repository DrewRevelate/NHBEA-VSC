import { render, screen } from '@testing-library/react';
import ContentSection from './ContentSection';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('ContentSection', () => {
  const defaultProps = {
    title: 'Test Title',
    content: 'Test content paragraph.'
  };

  it('should render title and content', () => {
    render(<ContentSection {...defaultProps} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test content paragraph.')).toBeInTheDocument();
  });

  it('should render image when imageURL is provided', () => {
    render(
      <ContentSection 
        {...defaultProps} 
        imageURL="/test-image.jpg" 
      />
    );
    
    const image = screen.getByAltText('Test Title');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('should not render image when imageURL is not provided', () => {
    render(<ContentSection {...defaultProps} />);
    
    expect(screen.queryByAltText('Test Title')).not.toBeInTheDocument();
  });

  it('should handle multi-paragraph content', () => {
    const multiParagraphContent = 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.';
    
    render(
      <ContentSection 
        {...defaultProps} 
        content={multiParagraphContent}
      />
    );
    
    expect(screen.getByText('First paragraph.')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph.')).toBeInTheDocument();
    expect(screen.getByText('Third paragraph.')).toBeInTheDocument();
  });

  it('should apply reverse layout when reverse prop is true', () => {
    const { container } = render(
      <ContentSection 
        {...defaultProps} 
        imageURL="/test-image.jpg"
        reverse={true}
      />
    );
    
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('lg:grid-flow-col-dense');
  });

  it('should not apply reverse classes when reverse is false', () => {
    const { container } = render(
      <ContentSection 
        {...defaultProps} 
        imageURL="/test-image.jpg"
        reverse={false}
      />
    );
    
    const grid = container.querySelector('.grid');
    expect(grid).not.toHaveClass('lg:grid-flow-col-dense');
  });

  it('should have proper responsive grid layout', () => {
    const { container } = render(
      <ContentSection 
        {...defaultProps} 
        imageURL="/test-image.jpg"
      />
    );
    
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'lg:grid-cols-2');
  });

  it('should have proper typography classes', () => {
    render(<ContentSection {...defaultProps} />);
    
    const title = screen.getByText('Test Title');
    expect(title.parentElement).toHaveClass('text-4xl', 'md:text-5xl', 'lg:text-6xl', 'font-bold');
  });
});