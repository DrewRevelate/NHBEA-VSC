import { render, screen, waitFor } from '@testing-library/react';
import HallOfFamePage from './page';
import { HallOfFameMember } from '@/types/dataModels';

// Mock the hallOfFame library
jest.mock('@/lib/hallOfFame', () => ({
  getHallOfFameMembers: jest.fn(),
}));

import { getHallOfFameMembers } from '@/lib/hallOfFame';
const mockGetHallOfFameMembers = getHallOfFameMembers as jest.MockedFunction<typeof getHallOfFameMembers>;

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, fill, ...props }: any) {
    // Properly handle the fill prop without passing it to the DOM img element
    return <img src={src} alt={alt} {...props} style={fill ? { objectFit: 'cover' } : {}} />;
  };
});

// Sample test data
const mockHallOfFameMembers: HallOfFameMember[] = [
  {
    id: '1',
    memberId: 'member1',
    name: 'John Doe',
    year: 2023,
    awardType: 'business_educator_of_the_year',
    bio: 'A dedicated educator with 20 years of experience in business education.',
    imageUrl: 'https://example.com/john-doe.jpg',
    achievements: ['Teacher of the Year 2022', 'Curriculum Innovation Award', 'Outstanding Leadership Award'],
    order: 1
  },
  {
    id: '2',
    memberId: 'member2',
    name: 'Jane Smith',
    year: 2022,
    awardType: 'lifetime_achievement',
    bio: 'Pioneered innovative teaching methods in business education.',
    achievements: ['30 Years of Service', 'Mentorship Excellence Award'],
    order: 2
  },
  {
    id: '3',
    memberId: 'member3',
    name: 'Bob Johnson',
    year: 2021,
    awardType: 'other',
    bio: 'Distinguished service to the business education community.',
    order: 3
  }
];

describe('HallOfFamePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page title and description', async () => {
    mockGetHallOfFameMembers.mockResolvedValue(mockHallOfFameMembers);

    render(<HallOfFamePage />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /hall of fame/i })).toBeInTheDocument();
      expect(screen.getByText(/honoring the legacy of distinguished business educators/i)).toBeInTheDocument();
    });
  });

  it('displays Hall of Fame members correctly', async () => {
    mockGetHallOfFameMembers.mockResolvedValue(mockHallOfFameMembers);

    render(<HallOfFamePage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    // Check award types are displayed correctly
    expect(screen.getByText('Business Educator of the Year')).toBeInTheDocument();
    expect(screen.getByText('Lifetime Achievement')).toBeInTheDocument();
    expect(screen.getByText('Distinguished Service')).toBeInTheDocument();

    // Check years are displayed
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('2022')).toBeInTheDocument();
    expect(screen.getByText('2021')).toBeInTheDocument();
  });

  it('displays member biographies', async () => {
    mockGetHallOfFameMembers.mockResolvedValue(mockHallOfFameMembers);

    render(<HallOfFamePage />);

    await waitFor(() => {
      expect(screen.getByText(/dedicated educator with 20 years of experience/i)).toBeInTheDocument();
      expect(screen.getByText(/pioneered innovative teaching methods/i)).toBeInTheDocument();
      expect(screen.getByText(/distinguished service to the business education community/i)).toBeInTheDocument();
    });
  });

  it('displays achievements for members who have them', async () => {
    mockGetHallOfFameMembers.mockResolvedValue(mockHallOfFameMembers);

    render(<HallOfFamePage />);

    await waitFor(() => {
      // John Doe has 3 achievements, should show first 3
      expect(screen.getByText('Teacher of the Year 2022')).toBeInTheDocument();
      expect(screen.getByText('Curriculum Innovation Award')).toBeInTheDocument();
      expect(screen.getByText('Outstanding Leadership Award')).toBeInTheDocument();

      // Jane Smith has 2 achievements
      expect(screen.getByText('30 Years of Service')).toBeInTheDocument();
      expect(screen.getByText('Mentorship Excellence Award')).toBeInTheDocument();
    });
  });

  it('displays member images with proper alt text', async () => {
    mockGetHallOfFameMembers.mockResolvedValue(mockHallOfFameMembers);

    render(<HallOfFamePage />);

    await waitFor(() => {
      const johnImage = screen.getByAltText('John Doe - Business Educator of the Year 2023');
      expect(johnImage).toBeInTheDocument();
      expect(johnImage).toHaveAttribute('src', 'https://example.com/john-doe.jpg');
    });
  });

  it('displays fallback avatar for members without images', async () => {
    mockGetHallOfFameMembers.mockResolvedValue(mockHallOfFameMembers);

    render(<HallOfFamePage />);

    await waitFor(() => {
      // Jane Smith and Bob Johnson don't have imageUrl, should show fallback SVG
      const avatarIcons = screen.getAllByRole('img', { hidden: true });
      expect(avatarIcons.length).toBeGreaterThan(0);
    });
  });

  it('handles empty Hall of Fame gracefully', async () => {
    mockGetHallOfFameMembers.mockResolvedValue([]);

    render(<HallOfFamePage />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /hall of fame/i })).toBeInTheDocument();
      expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
      expect(screen.getByText(/our hall of fame honorees will be displayed here soon/i)).toBeInTheDocument();
    });
  });

  it('handles fetch errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockGetHallOfFameMembers.mockRejectedValue(new Error('Failed to fetch'));

    render(<HallOfFamePage />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /hall of fame/i })).toBeInTheDocument();
      expect(screen.getByText(/unable to load hall of fame members/i)).toBeInTheDocument();
      expect(screen.getByText(/please try again later/i)).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching Hall of Fame members:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('displays loading state initially', () => {
    mockGetHallOfFameMembers.mockImplementation(() => new Promise(() => {})); // Never resolves

    const { container } = render(<HallOfFamePage />);

    expect(screen.getByRole('heading', { name: /hall of fame/i })).toBeInTheDocument();
    expect(screen.getByText(/loading our distinguished honorees/i)).toBeInTheDocument();
    
    // Should show loading skeletons
    const loadingCards = container.querySelectorAll('.animate-pulse');
    expect(loadingCards.length).toBeGreaterThan(0);
  });

  it('has proper semantic HTML structure', async () => {
    mockGetHallOfFameMembers.mockResolvedValue(mockHallOfFameMembers);

    render(<HallOfFamePage />);

    await waitFor(() => {
      // Check main heading
      expect(screen.getByRole('heading', { level: 1, name: /hall of fame/i })).toBeInTheDocument();
      
      // Check member name headings
      expect(screen.getByRole('heading', { level: 3, name: 'John Doe' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: 'Jane Smith' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: 'Bob Johnson' })).toBeInTheDocument();
    });
  });

  it('displays achievements section properly', async () => {
    mockGetHallOfFameMembers.mockResolvedValue(mockHallOfFameMembers);

    render(<HallOfFamePage />);

    await waitFor(() => {
      // Check for "Notable Achievements" headings
      const achievementHeadings = screen.getAllByText('Notable Achievements');
      expect(achievementHeadings.length).toBe(2); // John Doe and Jane Smith have achievements
    });
  });

  it('truncates long achievement lists', async () => {
    const memberWithManyAchievements: HallOfFameMember = {
      id: '4',
      name: 'Achievement Rich',
      year: 2020,
      awardType: 'business_educator_of_the_year',
      bio: 'Lots of achievements',
      achievements: ['Achievement 1', 'Achievement 2', 'Achievement 3', 'Achievement 4', 'Achievement 5'],
      order: 4
    };

    mockGetHallOfFameMembers.mockResolvedValue([memberWithManyAchievements]);

    render(<HallOfFamePage />);

    await waitFor(() => {
      expect(screen.getByText('Achievement 1')).toBeInTheDocument();
      expect(screen.getByText('Achievement 2')).toBeInTheDocument();
      expect(screen.getByText('Achievement 3')).toBeInTheDocument();
      expect(screen.getByText('+2 more achievements')).toBeInTheDocument();
      expect(screen.queryByText('Achievement 4')).not.toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', async () => {
    mockGetHallOfFameMembers.mockResolvedValue(mockHallOfFameMembers);

    render(<HallOfFamePage />);

    await waitFor(() => {
      // Check alt text for images
      const johnImage = screen.getByAltText('John Doe - Business Educator of the Year 2023');
      expect(johnImage).toBeInTheDocument();
    });
  });
});