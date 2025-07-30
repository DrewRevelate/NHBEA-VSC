import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpeakersSection from './SpeakersSection';
import { ConferenceSpeaker, ConferenceSession } from '@/types/conference';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

const mockSpeakers: ConferenceSpeaker[] = [
  {
    id: 'speaker-1',
    name: 'Dr. Sarah Johnson',
    title: 'Dean of Business Education',
    organization: 'New Hampshire University',
    bio: 'Dr. Sarah Johnson is a renowned expert in business education innovation with over 15 years of experience in curriculum development and educational technology integration.',
    expertise: ['Curriculum Innovation', 'Educational Technology', 'Student Engagement'],
    sessionIds: ['session-1'],
    isKeynote: true,
    featured: true,
    linkedInURL: 'https://linkedin.com/in/sarah-johnson',
    twitterHandle: 'sarahjohnson_edu',
    photoURL: '/images/speakers/sarah-johnson.jpg'
  },
  {
    id: 'speaker-2',
    name: 'Prof. Michael Roberts',
    title: 'Business Education Specialist',
    organization: 'Manchester College',
    bio: 'Prof. Michael Roberts specializes in interactive teaching methods and has been recognized for his innovative approaches to student engagement in business education.',
    expertise: ['Interactive Teaching', 'Student Engagement', 'Assessment Strategies'],
    sessionIds: ['session-2'],
    isKeynote: false,
    featured: true
  }
];

const mockSessions: ConferenceSession[] = [
  {
    id: 'session-1',
    title: 'Opening Keynote: The Future of Business Education',
    description: 'Explore the latest trends shaping business education.',
    startTime: new Date('2025-10-24T09:00:00'),
    endTime: new Date('2025-10-24T10:00:00'),
    track: 'Innovation',
    type: 'keynote',
    speaker: 'speaker-1',
    room: 'Main Auditorium',
    level: 'all'
  },
  {
    id: 'session-2',
    title: 'Workshop: Interactive Teaching Methods',
    description: 'Hands-on workshop covering interactive teaching techniques.',
    startTime: new Date('2025-10-24T10:30:00'),
    endTime: new Date('2025-10-24T12:00:00'),
    track: 'Pedagogy',
    type: 'workshop',
    speaker: 'speaker-2',
    room: 'Workshop Room A',
    level: 'intermediate'
  }
];

describe('SpeakersSection', () => {
  const defaultProps = {
    speakers: mockSpeakers,
    sessions: mockSessions,
    className: 'test-speakers-section'
  };

  it('renders the speakers section with title', () => {
    render(<SpeakersSection {...defaultProps} />);

    expect(screen.getByText('Featured Speakers')).toBeInTheDocument();
    expect(screen.getByText(/Learn from industry leaders and education innovators/)).toBeInTheDocument();
  });

  it('displays all featured speakers', () => {
    render(<SpeakersSection {...defaultProps} />);

    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Prof. Michael Roberts')).toBeInTheDocument();
  });

  it('shows speaker titles and organizations', () => {
    render(<SpeakersSection {...defaultProps} />);

    expect(screen.getByText('Dean of Business Education')).toBeInTheDocument();
    expect(screen.getByText('New Hampshire University')).toBeInTheDocument();
    expect(screen.getByText('Business Education Specialist')).toBeInTheDocument();
    expect(screen.getByText('Manchester College')).toBeInTheDocument();
  });

  it('displays keynote badge for keynote speakers', () => {
    render(<SpeakersSection {...defaultProps} />);

    expect(screen.getByText('KEYNOTE SPEAKER')).toBeInTheDocument();
  });

  it('shows speaker expertise areas', () => {
    render(<SpeakersSection {...defaultProps} />);

    expect(screen.getByText('Curriculum Innovation')).toBeInTheDocument();
    expect(screen.getByText('Educational Technology')).toBeInTheDocument();
    expect(screen.getByText('Interactive Teaching')).toBeInTheDocument();
    expect(screen.getAllByText('Student Engagement')).toHaveLength(2); // Both speakers have this expertise
  });

  it('opens speaker bio modal when speaker card is clicked', async () => {
    render(<SpeakersSection {...defaultProps} />);

    // Click on the speaker's name in the featured speakers section
    const speakerCards = screen.getAllByText('Dr. Sarah Johnson');
    fireEvent.click(speakerCards[0]);

    await waitFor(() => {
      expect(screen.getByText('Biography')).toBeInTheDocument();
      expect(screen.getAllByText(/renowned expert in business education innovation/)).toHaveLength(2); // One in card, one in modal
    });
  });

  it('displays speaker sessions in modal', async () => {
    render(<SpeakersSection {...defaultProps} />);

    const speakerCards = screen.getAllByText('Dr. Sarah Johnson');
    fireEvent.click(speakerCards[0]);

    await waitFor(() => {
      // Check if modal opened
      expect(screen.getByText('Biography')).toBeInTheDocument();
      // Check if session appears (session title should be in modal)
      expect(screen.getByText('Opening Keynote: The Future of Business Education')).toBeInTheDocument();
    });
  });

  it('shows social media links when available', async () => {
    render(<SpeakersSection {...defaultProps} />);

    const speakerCard = screen.getByText('Dr. Sarah Johnson');
    fireEvent.click(speakerCard);

    await waitFor(() => {
      const linkedInLinks = screen.getAllByRole('link');
      const linkedInLink = linkedInLinks.find(link => link.getAttribute('href')?.includes('linkedin.com'));
      expect(linkedInLink).toBeInTheDocument();
    });
  });

  it('closes modal when close button is clicked', async () => {
    render(<SpeakersSection {...defaultProps} />);

    // Open modal
    const speakerCard = screen.getByText('Dr. Sarah Johnson');
    fireEvent.click(speakerCard);

    await waitFor(() => {
      expect(screen.getByText('Biography')).toBeInTheDocument();
    });

    // Close modal
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Biography')).not.toBeInTheDocument();
    });
  });

  it('handles speakers without sessions gracefully', async () => {
    const speakersWithoutSessions = [
      {
        ...mockSpeakers[0],
        sessionIds: []
      }
    ];

    render(<SpeakersSection speakers={speakersWithoutSessions} />);

    const speakerCard = screen.getByText('Dr. Sarah Johnson');
    fireEvent.click(speakerCard);

    await waitFor(() => {
      expect(screen.getByText('Biography')).toBeInTheDocument();
      expect(screen.queryByText('Sarah\'s Sessions')).not.toBeInTheDocument();
    });
  });

  it('renders without sessions prop', () => {
    const propsWithoutSessions = {
      speakers: mockSpeakers,
      className: 'test-speakers-section'
    };

    render(<SpeakersSection {...propsWithoutSessions} />);

    expect(screen.getByText('Featured Speakers')).toBeInTheDocument();
    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<SpeakersSection {...defaultProps} />);
    
    expect(container.firstChild).toHaveClass('test-speakers-section');
  });

  it('handles empty speakers list', () => {
    render(<SpeakersSection speakers={[]} />);

    expect(screen.getByText('Featured Speakers')).toBeInTheDocument();
    // The component shows filter buttons and grid even with empty speakers
  });

  it('displays speaker photo when available', () => {
    render(<SpeakersSection {...defaultProps} />);

    const speakerImage = screen.getByAltText('Dr. Sarah Johnson');
    expect(speakerImage).toBeInTheDocument();
    expect(speakerImage).toHaveAttribute('src', expect.stringContaining('sarah-johnson.jpg'));
  });

  it('uses placeholder when speaker photo is not available', () => {
    // Create a speaker without photo
    const speakerWithoutPhoto: ConferenceSpeaker = {
      id: 'speaker-no-photo',
      name: 'John Doe',
      title: 'Test Speaker',
      organization: 'Test University',
      bio: 'Test bio',
      expertise: ['Test'],
      sessionIds: [],
      isKeynote: false,
      featured: false
    };
    
    render(<SpeakersSection speakers={[speakerWithoutPhoto]} sessions={[]} />);

    // Should show initials since no photo provided
    expect(screen.getByText('JD')).toBeInTheDocument(); // John Doe initials
  });

  it('displays all expertise areas as tags', () => {
    render(<SpeakersSection {...defaultProps} />);

    // Check for expertise tags
    expect(screen.getByText('Curriculum Innovation')).toBeInTheDocument();
    expect(screen.getByText('Educational Technology')).toBeInTheDocument();
    expect(screen.getAllByText('Student Engagement')).toHaveLength(2); // Both speakers have this
    expect(screen.getByText('Interactive Teaching')).toBeInTheDocument();
    expect(screen.getByText('Assessment Strategies')).toBeInTheDocument();
  });

  it('shows filter buttons with correct counts', () => {
    render(<SpeakersSection {...defaultProps} />);

    expect(screen.getByText('All Speakers (2)')).toBeInTheDocument();
    expect(screen.getByText('Keynote (1)')).toBeInTheDocument();
    expect(screen.getByText('Featured (2)')).toBeInTheDocument();
  });

  it('filters speakers when filter buttons are clicked', async () => {
    render(<SpeakersSection {...defaultProps} />);

    // Click keynote filter
    const keynoteButton = screen.getByText('Keynote (1)');
    fireEvent.click(keynoteButton);

    await waitFor(() => {
      // Should only show keynote speaker
      expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
      expect(screen.queryByText('Prof. Michael Roberts')).not.toBeInTheDocument();
    });
  });

  it('shows session count for speakers with sessions', () => {
    render(<SpeakersSection {...defaultProps} />);

    expect(screen.getAllByText('1 session')).toHaveLength(2); // Both speakers have 1 session each
  });
});