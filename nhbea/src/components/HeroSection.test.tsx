import { render, screen } from '@testing-library/react';
import HeroSection from './HeroSection';
import { HomepageContent } from '@/types/content';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('HeroSection', () => {
  const mockContent: HomepageContent = {
    heroTitle: 'Test Hero Title',
    heroSubtitle: 'Test Hero Subtitle',
    heroImageURL: '/test-hero.jpg',
    missionTitle: 'Mission Title',
    missionContent: 'Mission Content',
    aboutTitle: 'About Title',
    aboutContent: 'About Content'
  };

  it('should render hero title and subtitle', () => {
    render(<HeroSection content={mockContent} />);
    
    expect(screen.getByText('Test Hero Title')).toBeInTheDocument();
    expect(screen.getByText('Test Hero Subtitle')).toBeInTheDocument();
  });

  it('should render hero image when provided', () => {
    render(<HeroSection content={mockContent} />);
    
    const heroImage = screen.getByAltText('NHBEA Hero');
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute('src', '/test-hero.jpg');
  });

  it('should not render image when heroImageURL is not provided', () => {
    const contentWithoutImage = { ...mockContent, heroImageURL: undefined };
    render(<HeroSection content={contentWithoutImage} />);
    
    expect(screen.queryByAltText('NHBEA Hero')).not.toBeInTheDocument();
  });

  it('should have proper responsive classes', () => {
    render(<HeroSection content={mockContent} />);
    
    const title = screen.getByText('Test Hero Title');
    expect(title.parentElement).toHaveClass('text-5xl', 'md:text-6xl', 'lg:text-7xl');
    
    const subtitle = screen.getByText('Test Hero Subtitle');
    expect(subtitle).toHaveClass('text-xl', 'md:text-2xl', 'lg:text-3xl');
  });

  it('should have background gradient styling', () => {
    const { container } = render(<HeroSection content={mockContent} />);
    
    const section = container.querySelector('section');
    expect(section).toHaveClass('relative', 'min-h-screen', 'flex', 'items-center');
    
    const backgroundDiv = container.querySelector('.bg-gradient-to-br');
    expect(backgroundDiv).toBeInTheDocument();
  });
});