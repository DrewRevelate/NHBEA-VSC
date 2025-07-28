import { render, screen } from '@testing-library/react';
import PastPresidentsSection from './PastPresidentsSection';
import { PastPresident } from '@/types/pastPresidents';

describe('PastPresidentsSection', () => {
  const mockPastPresidents: PastPresident[] = [
    {
      id: '1',
      name: 'Robert Williams',
      term: '2022-2023',
      order: 1
    },
    {
      id: '2',
      name: 'Maria Garcia',
      term: '2021-2022',
      order: 2
    },
    {
      id: '3',
      name: 'James Smith',
      term: '2020-2021',
      order: 3
    }
  ];

  it('should render past presidents section with title', () => {
    render(<PastPresidentsSection pastPresidents={mockPastPresidents} />);
    
    expect(screen.getByText('Past Presidents')).toBeInTheDocument();
    expect(screen.getByText(/Honoring the visionary leaders/)).toBeInTheDocument();
  });

  it('should render all past presidents', () => {
    render(<PastPresidentsSection pastPresidents={mockPastPresidents} />);
    
    expect(screen.getByText('Robert Williams')).toBeInTheDocument();
    expect(screen.getByText('2022-2023')).toBeInTheDocument();
    
    expect(screen.getByText('Maria Garcia')).toBeInTheDocument();
    expect(screen.getByText('2021-2022')).toBeInTheDocument();
    
    expect(screen.getByText('James Smith')).toBeInTheDocument();
    expect(screen.getByText('2020-2021')).toBeInTheDocument();
  });

  it('should render timeline layout', () => {
    const { container } = render(<PastPresidentsSection pastPresidents={mockPastPresidents} />);
    
    // Check for timeline elements
    const timelineLine = container.querySelector('.absolute.left-8');
    expect(timelineLine).toBeInTheDocument();
    
    // Check for timeline dots
    const timelineDots = container.querySelectorAll('.border-4.border-blue-600.rounded-full');
    expect(timelineDots).toHaveLength(3);
  });

  it('should render term badges', () => {
    render(<PastPresidentsSection pastPresidents={mockPastPresidents} />);
    
    // Each president should have their term in a badge
    mockPastPresidents.forEach(president => {
      expect(screen.getByText(president.term)).toBeInTheDocument();
    });
  });

  it('should render legacy message', () => {
    render(<PastPresidentsSection pastPresidents={mockPastPresidents} />);
    
    expect(screen.getByText('Continuing the Legacy')).toBeInTheDocument();
    expect(screen.getByText(/Each president has contributed/)).toBeInTheDocument();
  });

  it('should not render when pastPresidents array is empty', () => {
    const { container } = render(<PastPresidentsSection pastPresidents={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should not render when pastPresidents is null/undefined', () => {
    const { container } = render(<PastPresidentsSection pastPresidents={null as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('should have alternating layout for timeline items', () => {
    const { container } = render(<PastPresidentsSection pastPresidents={mockPastPresidents} />);
    
    const timelineItems = container.querySelectorAll('.relative.flex.items-center');
    
    // Check that items alternate between left and right alignment
    expect(timelineItems[0]).toHaveClass('md:flex-row');
    expect(timelineItems[1]).toHaveClass('md:flex-row-reverse');
    expect(timelineItems[2]).toHaveClass('md:flex-row');
  });

  it('should have proper accessibility attributes', () => {
    render(<PastPresidentsSection pastPresidents={mockPastPresidents} />);
    
    const section = screen.getByText('Past Presidents').closest('section');
    expect(section).toBeInTheDocument();
    
    // Check for aria-hidden on decorative elements
    const decorativeElements = section?.querySelectorAll('[aria-hidden="true"]');
    expect(decorativeElements?.length).toBeGreaterThan(0);
  });

  it('should include calendar icons in term badges', () => {
    const { container } = render(<PastPresidentsSection pastPresidents={mockPastPresidents} />);
    
    // Check for calendar SVG icons
    const calendarIcons = container.querySelectorAll('svg');
    expect(calendarIcons.length).toBeGreaterThan(0);
  });
});