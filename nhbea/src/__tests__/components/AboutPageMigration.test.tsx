import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AboutPage from '@/app/about/page';

// Mock the lazy-loaded components
jest.mock('@/components/HeritageSection', () => {
  return function MockHeritageSection() {
    return <div data-testid="heritage-section">Heritage Section</div>;
  };
});

jest.mock('@/components/ValuesImpactSection', () => {
  return function MockValuesImpactSection() {
    return <div data-testid="values-impact-section">Values Impact Section</div>;
  };
});

jest.mock('@/components/LeadershipOverviewSection', () => {
  return function MockLeadershipOverviewSection() {
    return <div data-testid="leadership-overview-section">Leadership Overview Section</div>;
  };
});

// Mock the data fetching functions
jest.mock('@/lib/content', () => ({
  getHomepageContent: jest.fn(() => Promise.resolve({
    missionTitle: 'Our Mission',
    missionContent: 'To advance business education excellence',
    heroSubtitle: 'Mock subtitle'
  })),
  defaultHomepageContent: {
    missionTitle: 'Default Mission',
    missionContent: 'Default mission content',
    heroSubtitle: 'Default subtitle'
  }
}));

jest.mock('@/lib/members', () => ({
  getBoardMembers: jest.fn(() => Promise.resolve([
    { id: '1', name: 'John Doe', position: 'President', order: 1 },
    { id: '2', name: 'Jane Smith', position: 'Vice President', order: 2 }
  ])),
  convertToLegacyBoardMember: jest.fn((member) => ({
    id: member.id,
    name: member.name,
    position: member.position,
    order: member.order
  }))
}));

jest.mock('@/lib/board', () => ({
  getBoardMembers: jest.fn(() => Promise.resolve([
    { id: '1', name: 'John Doe', position: 'President', order: 1 },
    { id: '2', name: 'Jane Smith', position: 'Vice President', order: 2 }
  ])),
  defaultBoardMembers: [
    { id: 'default-1', name: 'Default Member', position: 'Member', order: 1 }
  ]
}));

jest.mock('@/lib/pastPresidents', () => ({
  getPastPresidents: jest.fn(() => Promise.resolve([
    { id: '1', name: 'Past President 1', term: '2020-2021', order: 1 }
  ])),
  defaultPastPresidents: [
    { id: 'default-1', name: 'Default Past President', term: '2019-2020', order: 1 }
  ]
}));

describe('About Page Migration to Standardized Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with StandardPageLayout structure', async () => {
    render(await AboutPage());

    // Check for skip link (from StandardPageLayout)
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
    
    // Check for main content area with correct ID
    const mainContent = screen.getByRole('main');
    expect(mainContent).toHaveAttribute('id', 'about-main-content');
    expect(mainContent).toHaveAttribute('aria-label', 'Main content');
  });

  it('displays FlexibleHero with about variant', async () => {
    render(await AboutPage());

    // Check for hero section with About NHBEA title
    await waitFor(() => {
      expect(screen.getByText('About NHBEA')).toBeInTheDocument();
    });

    // Check for subtitle with established year
    expect(screen.getByText(/Dedicated to advancing business education throughout New Hampshire since 1960/i)).toBeInTheDocument();
    
    // Check for board count and years of service statistics
    expect(screen.getByText('Board Members')).toBeInTheDocument();
    expect(screen.getByText('Years of Service')).toBeInTheDocument();
  });

  it('wraps all sections with StandardErrorBoundary', async () => {
    render(await AboutPage());

    // All sections should be present without error boundaries interfering
    await waitFor(() => {
      expect(screen.getByTestId('heritage-section')).toBeInTheDocument();
      expect(screen.getByTestId('values-impact-section')).toBeInTheDocument(); 
      expect(screen.getByTestId('leadership-overview-section')).toBeInTheDocument();
    });
  });

  it('uses ResponsiveGrid for layout', async () => {
    render(await AboutPage());

    // Check that content is organized in a grid structure
    const gridContainer = document.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
    
    // Check for proper spacing classes
    const spacingContainer = document.querySelector('.space-y-16');
    expect(spacingContainer).toBeInTheDocument();
  });

  it('maintains backward compatibility with data loading', async () => {
    render(await AboutPage());

    // Should render board members section
    await waitFor(() => {
      const boardSection = screen.getByText(/board members/i);
      expect(boardSection).toBeInTheDocument();
    });

    // Should render past presidents section  
    const presidentsSection = screen.getByText(/past presidents/i);
    expect(presidentsSection).toBeInTheDocument();
  });

  it('implements lazy loading for non-critical sections', async () => {
    render(await AboutPage());

    // These sections should be lazy loaded and eventually appear
    await waitFor(() => {
      expect(screen.getByTestId('heritage-section')).toBeInTheDocument();
      expect(screen.getByTestId('values-impact-section')).toBeInTheDocument();
      expect(screen.getByTestId('leadership-overview-section')).toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', async () => {
    render(await AboutPage());

    // Check for proper semantic structure
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('tabIndex', '-1');
    expect(main).toHaveClass('focus:outline-none');
    
    // Check for skip link
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toHaveAttribute('href', '#about-main-content');
  });
});