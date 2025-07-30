import { render, screen } from '@testing-library/react';
import SponsorsSection from './SponsorsSection';
import { Sponsor } from '@/types/sponsors';

// Mock Next.js components
jest.mock('next/image', () => {
  return function MockImage({ src, alt, onError, ...props }: any) {
    return (
      <img 
        src={src} 
        alt={alt} 
        onError={onError}
        {...props} 
      />
    );
  };
});

jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock SponsorImage component to avoid Firebase Storage calls in tests
jest.mock('./SponsorImage', () => {
  return function MockSponsorImage({ logoURL, sponsorName }: any) {
    if (logoURL && logoURL.trim() !== '') {
      return (
        <img
          src={logoURL}
          alt={`${sponsorName} logo`}
          width={160}
          height={160}
          className="relative z-10 object-contain max-w-full max-h-full grayscale group-hover:grayscale-0 transition-all duration-500"
        />
      );
    }
    return (
      <div className="relative z-10 text-center">
        <div className="text-4xl font-bold text-slate-400 mb-2">
          {sponsorName.charAt(0).toUpperCase()}
        </div>
        <div className="text-xs text-slate-500">
          {sponsorName}
        </div>
      </div>
    );
  };
});

// Mock the image utilities
jest.mock('@/lib/imageUtils', () => ({
  getSponsorImageUrl: jest.fn().mockImplementation((path: string) => 
    Promise.resolve(path ? `https://example.com/${path}` : null)
  ),
}));

describe('SponsorsSection', () => {
  const mockSponsors: Sponsor[] = [
    {
      id: '1',
      name: 'Sponsor One',
      logoURL: '/sponsor1.png',
      website: 'https://sponsor1.com',
      order: 1
    },
    {
      id: '2',
      name: 'Sponsor Two',
      logoURL: '/sponsor2.png',
      website: 'https://sponsor2.com',
      order: 2
    }
  ];

  it('should render sponsors section with title', () => {
    render(<SponsorsSection sponsors={mockSponsors} />);
    
    expect(screen.getByText('Our Sponsors')).toBeInTheDocument();
    expect(screen.getByText(/We are grateful to our sponsors/)).toBeInTheDocument();
  });

  it('should render all sponsor logos', () => {
    render(<SponsorsSection sponsors={mockSponsors} />);
    
    expect(screen.getByAltText('Sponsor One logo')).toBeInTheDocument();
    expect(screen.getByAltText('Sponsor Two logo')).toBeInTheDocument();
  });

  it('should create links to sponsor websites', () => {
    render(<SponsorsSection sponsors={mockSponsors} />);
    
    const links = screen.getAllByRole('link');
    const sponsorLinks = links.filter(link => 
      link.getAttribute('href')?.includes('sponsor')
    );
    
    expect(sponsorLinks).toHaveLength(2);
    expect(sponsorLinks[0]).toHaveAttribute('href', 'https://sponsor1.com');
    expect(sponsorLinks[1]).toHaveAttribute('href', 'https://sponsor2.com');
  });

  it('should render contact us section', () => {
    render(<SponsorsSection sponsors={mockSponsors} />);
    
    expect(screen.getByText('Interested in becoming a sponsor?')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('should not render when sponsors array is empty', () => {
    const { container } = render(<SponsorsSection sponsors={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should not render when sponsors is null/undefined', () => {
    const { container } = render(<SponsorsSection sponsors={null as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('should have responsive grid classes', () => {
    const { container } = render(<SponsorsSection sponsors={mockSponsors} />);
    
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass(
      'grid-cols-2',
      'md:grid-cols-3', 
      'lg:grid-cols-4',
      'xl:grid-cols-5'
    );
  });

  it('should have hover effects on sponsor links', () => {
    render(<SponsorsSection sponsors={mockSponsors} />);
    
    const links = screen.getAllByRole('link');
    const sponsorLinks = links.filter(link => 
      link.getAttribute('href')?.includes('sponsor')
    );
    
    sponsorLinks.forEach(link => {
      expect(link).toHaveClass('group');
    });
  });
});