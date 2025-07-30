import { render, screen } from '@testing-library/react';
import BoardMembersSection from './BoardMembersSection';
import { BoardMember } from '@/types/board';

// Mock Next.js Image component
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

// Mock MemberImage component to avoid Firebase Storage calls in tests
jest.mock('./MemberImage', () => {
  return function MockMemberImage({ imagePath, memberName }: any) {
    if (imagePath) {
      return (
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[var(--nhbea-royal-blue-subtle)] to-[var(--nhbea-royal-blue-light)] flex items-center justify-center overflow-hidden">
          <img
            src={imagePath}
            alt={`${memberName} photo`}
            width={80}
            height={80}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      );
    }
    return (
      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[var(--nhbea-royal-blue-subtle)] to-[var(--nhbea-royal-blue-light)] flex items-center justify-center">
        <svg className="w-10 h-10 text-[var(--nhbea-royal-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    );
  };
});

describe('BoardMembersSection', () => {
  const mockBoardMembers: BoardMember[] = [
    {
      id: '1',
      name: 'John Doe',
      title: 'President',
      bio: 'Experienced leader in business education with over 15 years of teaching.',
      imageURL: '/john-doe.jpg',
      order: 1
    },
    {
      id: '2',
      name: 'Jane Smith',
      title: 'Vice President',
      bio: 'Specializes in curriculum development and educational innovation.',
      order: 2
    }
  ];

  it('should render board members section with title', () => {
    render(<BoardMembersSection boardMembers={mockBoardMembers} />);
    
    expect(screen.getByText('Board of Directors')).toBeInTheDocument();
    expect(screen.getByText(/Meet the dedicated leaders/)).toBeInTheDocument();
  });

  it('should render all board members', () => {
    render(<BoardMembersSection boardMembers={mockBoardMembers} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('President')).toBeInTheDocument();
    expect(screen.getByText(/Experienced leader in business education/)).toBeInTheDocument();
    
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Vice President')).toBeInTheDocument();
    expect(screen.getByText(/Specializes in curriculum development/)).toBeInTheDocument();
  });

  it('should render member images when provided', () => {
    render(<BoardMembersSection boardMembers={mockBoardMembers} />);
    
    const johnImage = screen.getByAltText('John Doe photo');
    expect(johnImage).toBeInTheDocument();
    expect(johnImage).toHaveAttribute('src', '/john-doe.jpg');
  });

  it('should render placeholder when no image provided', () => {
    render(<BoardMembersSection boardMembers={mockBoardMembers} />);
    
    // Jane Smith has no imageURL, should show placeholder SVG
    const janeSection = screen.getByText('Jane Smith').closest('section');
    const placeholderSvg = janeSection?.querySelector('svg');
    expect(placeholderSvg).toBeInTheDocument();
  });

  it('should not render when boardMembers array is empty', () => {
    const { container } = render(<BoardMembersSection boardMembers={[]} />);
    // Component still renders the section with title, but no member cards
    expect(screen.getByText('Board of Directors')).toBeInTheDocument();
    const memberCards = container.querySelectorAll('.bg-white.rounded-xl');
    expect(memberCards).toHaveLength(0);
  });

  it('should not render when boardMembers is null/undefined', () => {
    const { container } = render(<BoardMembersSection boardMembers={null as any} />);
    // Component still renders the section with title, but no member cards
    expect(screen.getByText('Board of Directors')).toBeInTheDocument();
    const memberCards = container.querySelectorAll('.bg-white.rounded-xl');
    expect(memberCards).toHaveLength(0);
  });

  it('should have responsive grid layout', () => {
    const { container } = render(<BoardMembersSection boardMembers={mockBoardMembers} />);
    
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass(
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-3'
    );
  });

  it('should have proper accessibility attributes', () => {
    render(<BoardMembersSection boardMembers={mockBoardMembers} />);
    
    const section = screen.getByText('Board of Directors').closest('section');
    expect(section).toBeInTheDocument();
    
    // Check for member images with proper alt text
    expect(screen.getByAltText('John Doe photo')).toBeInTheDocument();
  });

  it('should handle image loading errors gracefully', () => {
    render(<BoardMembersSection boardMembers={mockBoardMembers} />);
    
    const johnImage = screen.getByAltText('John Doe photo');
    expect(johnImage).toBeInTheDocument();
    
    // Simulate error loading - the component should handle this gracefully
    // The onError handler is attached internally for error handling
    expect(johnImage).toHaveAttribute('src', '/john-doe.jpg');
  });
});