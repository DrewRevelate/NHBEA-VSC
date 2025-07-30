import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FlexibleHero } from '../../components/FlexibleHero';
import { HomepageContent } from '../../types/content';

// Mock Next.js components
jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height, priority, ...props }: any) {
    // Filter out Next.js specific props that shouldn't be passed to img element
    const { className, ...restProps } = props;
    return <img src={src} alt={alt} className={className} {...restProps} />;
  };
});

jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

const mockHomepageContent: HomepageContent = {
  heroTitle: 'Test Hero Title',
  heroSubtitle: 'Test Hero Subtitle',
  heroImageURL: 'https://example.com/hero.jpg',
  missionTitle: 'Test Mission',
  missionContent: 'Test mission content',
  aboutTitle: 'Test About',
  aboutContent: 'Test about content',
  aboutImageURL: 'https://example.com/about.jpg'
};

describe('FlexibleHero', () => {
  describe('Home Hero Variant', () => {
    it('renders home hero correctly', () => {
      render(
        <FlexibleHero
          variant="home"
          content={mockHomepageContent}
        />
      );

      expect(screen.getByText('New Hampshire')).toBeInTheDocument();
      expect(screen.getByText('Business Educators Association')).toBeInTheDocument();
      expect(screen.getByText('Test Hero Subtitle')).toBeInTheDocument();
    });

    it('renders value propositions', () => {
      render(
        <FlexibleHero
          variant="home"
          content={mockHomepageContent}
        />
      );

      expect(screen.getByText('Professional Development')).toBeInTheDocument();
      expect(screen.getByText('Networking')).toBeInTheDocument();
      expect(screen.getByText('Career Growth')).toBeInTheDocument();
    });

    it('renders call-to-action buttons', () => {
      render(
        <FlexibleHero
          variant="home"
          content={mockHomepageContent}
        />
      );

      expect(screen.getByText('Become a Member')).toBeInTheDocument();
      expect(screen.getByText('View Events')).toBeInTheDocument();
      
      const memberLink = screen.getByText('Become a Member').closest('a');
      const eventsLink = screen.getByText('View Events').closest('a');
      
      expect(memberLink).toHaveAttribute('href', '/membership/professional');
      expect(eventsLink).toHaveAttribute('href', '/conference');
    });

    it('renders hero image when provided', () => {
      render(
        <FlexibleHero
          variant="home"
          content={mockHomepageContent}
        />
      );

      const heroImage = screen.getByAltText('NHBEA Professional Educators');
      expect(heroImage).toBeInTheDocument();
      expect(heroImage).toHaveAttribute('src', 'https://example.com/hero.jpg');
    });

    it('does not render hero image when not provided', () => {
      const contentWithoutImage = { ...mockHomepageContent, heroImageURL: '' };
      
      render(
        <FlexibleHero
          variant="home"
          content={contentWithoutImage}
        />
      );

      expect(screen.queryByAltText('NHBEA Professional Educators')).not.toBeInTheDocument();
    });
  });

  describe('About Hero Variant', () => {
    it('renders about hero correctly', () => {
      render(
        <FlexibleHero
          variant="about"
          title="Custom About Title"
          subtitle="Custom About Subtitle"
          boardCount={15}
          establishedYear={1960}
        />
      );

      expect(screen.getByText('Custom About Title')).toBeInTheDocument();
      expect(screen.getByText('Custom About Subtitle')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('Board Members')).toBeInTheDocument();
    });

    it('renders default content when props not provided', () => {
      render(<FlexibleHero variant="about" />);

      expect(screen.getByText('About NHBEA')).toBeInTheDocument();
      expect(screen.getByText(/Dedicated to advancing business education/)).toBeInTheDocument();
    });
  });

  describe('Conference Hero Variant', () => {
    const mockConference = {
      title: 'Annual Conference 2024',
      date: 'March 15, 2024',
      location: 'Manchester, NH',
      registrationOpen: true,
      earlyBirdDeadline: 'February 1, 2024',
      theme: {
        primaryColor: '#1e40af',
        secondaryColor: '#1e3a8a'
      }
    };

    it('renders conference hero correctly', () => {
      render(
        <FlexibleHero
          variant="conference"
          conference={mockConference}
        />
      );

      expect(screen.getByText('Annual Conference 2024')).toBeInTheDocument();
      expect(screen.getByText('📅 March 15, 2024')).toBeInTheDocument();
      expect(screen.getByText('📍 Manchester, NH')).toBeInTheDocument();
      expect(screen.getByText(/Early Bird Pricing until February 1, 2024/)).toBeInTheDocument();
    });

    it('renders registration button when registration is open', () => {
      render(
        <FlexibleHero
          variant="conference"
          conference={mockConference}
        />
      );

      const registerButton = screen.getByText('Register Now');
      expect(registerButton).toBeInTheDocument();
      expect(registerButton.closest('a')).toHaveAttribute('href', '/conference/register');
    });

    it('does not render registration button when registration is closed', () => {
      const closedConference = { ...mockConference, registrationOpen: false };
      
      render(
        <FlexibleHero
          variant="conference"
          conference={closedConference}
        />
      );

      expect(screen.queryByText('Register Now')).not.toBeInTheDocument();
    });
  });

  describe('Membership Hero Variant', () => {
    const mockMembershipProps = {
      variant: 'membership' as const,
      membershipType: 'professional' as const,
      pricing: {
        amount: 50,
        currency: '$',
        period: 'year'
      },
      benefits: [
        'Professional development opportunities',
        'Networking events',
        'Career advancement resources'
      ]
    };

    it('renders membership hero correctly', () => {
      render(<FlexibleHero {...mockMembershipProps} />);

      expect(screen.getByText('Professional Membership')).toBeInTheDocument();
      expect(screen.getByText('$50')).toBeInTheDocument();
      expect(screen.getByText('per year')).toBeInTheDocument();
    });

    it('renders all benefits', () => {
      render(<FlexibleHero {...mockMembershipProps} />);

      mockMembershipProps.benefits.forEach(benefit => {
        expect(screen.getByText(benefit)).toBeInTheDocument();
      });
    });

    it('renders student membership correctly', () => {
      const studentProps = {
        ...mockMembershipProps,
        membershipType: 'student' as const,
        pricing: { amount: 25, currency: '$', period: 'year' }
      };

      render(<FlexibleHero {...studentProps} />);

      expect(screen.getByText('Student Membership')).toBeInTheDocument();
      expect(screen.getByText('$25')).toBeInTheDocument();
    });
  });

  describe('Hall of Fame Hero Variant', () => {
    it('renders hall of fame hero correctly', () => {
      render(
        <FlexibleHero
          variant="hall-of-fame"
          stats={{
            totalMembers: 150,
            latestYear: 2024
          }}
        />
      );

      expect(screen.getByText('Hall of Fame')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('Honored Members')).toBeInTheDocument();
      expect(screen.getByText('2024')).toBeInTheDocument();
      expect(screen.getByText('Latest Induction')).toBeInTheDocument();
    });
  });

  describe('Awards Hero Variant', () => {
    it('renders awards hero correctly', () => {
      render(
        <FlexibleHero
          variant="awards"
          nominationDeadline="March 1, 2024"
          activeAwards={5}
        />
      );

      expect(screen.getByText('Awards & Recognition')).toBeInTheDocument();
      expect(screen.getByText(/Nominations close: March 1, 2024/)).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Award Categories')).toBeInTheDocument();
    });

    it('renders nomination button', () => {
      render(<FlexibleHero variant="awards" />);

      const nominateButton = screen.getByText('Submit Nomination');
      expect(nominateButton).toBeInTheDocument();
      expect(nominateButton.closest('a')).toHaveAttribute('href', '/awards/nominate');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <FlexibleHero
          variant="home"
          content={mockHomepageContent}
        />
      );

      const heroSection = screen.getByRole('banner');
      expect(heroSection).toHaveAttribute('aria-label', 'Hero section');
    });

    it('has semantic HTML structure', () => {
      render(
        <FlexibleHero
          variant="about"
        />
      );

      const heroSection = screen.getByRole('banner');
      expect(heroSection).toBeInTheDocument();
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Custom styling', () => {
    it('applies custom className', () => {
      render(
        <FlexibleHero
          variant="home"
          content={mockHomepageContent}
          className="custom-hero-class"
        />
      );

      const heroSection = screen.getByRole('banner');
      expect(heroSection).toHaveClass('custom-hero-class');
    });
  });
});