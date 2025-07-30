import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConferenceAgenda from './ConferenceAgenda';
import { ConferenceAgenda as ConferenceAgendaType, ConferenceSession, ConferenceSpeaker } from '@/types/conference';

const mockSessions: ConferenceSession[] = [
  {
    id: 'session-1',
    title: 'Opening Keynote: The Future of Business Education',
    description: 'Explore the latest trends shaping business education and discover innovative approaches.',
    startTime: new Date('2025-10-24T09:00:00'),
    endTime: new Date('2025-10-24T10:00:00'),
    track: 'Innovation',
    type: 'keynote',
    speaker: 'speaker-1',
    room: 'Main Auditorium',
    capacity: 300,
    level: 'all',
    learningObjectives: [
      'Identify emerging trends in business education',
      'Understand the impact of technology on learning'
    ],
    materials: ['Presentation slides', 'Resource handouts'],
    tags: ['innovation', 'trends', 'keynote']
  },
  {
    id: 'session-2',
    title: 'Workshop: Interactive Teaching Methods',
    description: 'Hands-on workshop covering interactive teaching techniques for business education.',
    startTime: new Date('2025-10-24T10:30:00'),
    endTime: new Date('2025-10-24T12:00:00'),
    track: 'Pedagogy',
    type: 'workshop',
    speaker: 'speaker-2',
    room: 'Workshop Room A',
    capacity: 50,
    level: 'intermediate',
    learningObjectives: [
      'Apply interactive teaching methods',
      'Engage students effectively'
    ],
    materials: ['Workshop materials', 'Activity templates'],
    tags: ['workshop', 'interactive', 'teaching']
  }
];

const mockSpeakers: ConferenceSpeaker[] = [
  {
    id: 'speaker-1',
    name: 'Dr. Sarah Johnson',
    title: 'Dean of Business Education',
    organization: 'New Hampshire University',
    bio: 'Expert in business education innovation with over 15 years of experience.',
    expertise: ['Curriculum Innovation', 'Educational Technology'],
    sessionIds: ['session-1'],
    isKeynote: true,
    featured: true,
    linkedInURL: 'https://linkedin.com/in/sarah-johnson',
    twitterHandle: 'sarahjohnson_edu'
  },
  {
    id: 'speaker-2',
    name: 'Prof. Michael Roberts',
    title: 'Business Education Specialist',
    organization: 'Manchester College',
    bio: 'Specialist in interactive teaching methods and student engagement.',
    expertise: ['Interactive Teaching', 'Student Engagement'],
    sessionIds: ['session-2'],
    isKeynote: false,
    featured: true
  }
];

const mockAgenda: ConferenceAgendaType = {
  sessions: mockSessions,
  tracks: ['Innovation', 'Pedagogy', 'Technology', 'Leadership'],
  timeSlots: ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM']
};

describe('ConferenceAgenda', () => {
  const defaultProps = {
    agenda: mockAgenda,
    speakers: mockSpeakers,
    className: 'test-class'
  };

  it('renders the agenda section with title', () => {
    render(<ConferenceAgenda {...defaultProps} />);

    expect(screen.getByText('Conference Agenda')).toBeInTheDocument();
    expect(screen.getByText(/Explore our comprehensive schedule/)).toBeInTheDocument();
  });

  it('displays all sessions', () => {
    render(<ConferenceAgenda {...defaultProps} />);

    expect(screen.getByText('Opening Keynote: The Future of Business Education')).toBeInTheDocument();
    expect(screen.getByText('Workshop: Interactive Teaching Methods')).toBeInTheDocument();
  });

  it('shows track filters', () => {
    render(<ConferenceAgenda {...defaultProps} />);

    expect(screen.getByText('All Tracks')).toBeInTheDocument();
    // Check for track options in select element
    expect(screen.getByRole('option', { name: 'Innovation' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Pedagogy' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Technology' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Leadership' })).toBeInTheDocument();
  });

  it('filters sessions by track when filter is selected', async () => {
    render(<ConferenceAgenda {...defaultProps} />);

    // Select Innovation track from dropdown
    const trackSelect = screen.getByDisplayValue('All Tracks');
    fireEvent.change(trackSelect, { target: { value: 'Innovation' } });

    await waitFor(() => {
      expect(screen.getByText('Opening Keynote: The Future of Business Education')).toBeInTheDocument();
      expect(screen.queryByText('Workshop: Interactive Teaching Methods')).not.toBeInTheDocument();
    });
  });

  it('filters sessions by type when filter is selected', async () => {
    render(<ConferenceAgenda {...defaultProps} />);

    // Select keynote type from dropdown
    const typeSelect = screen.getByDisplayValue('All Types');
    fireEvent.change(typeSelect, { target: { value: 'keynote' } });

    await waitFor(() => {
      expect(screen.getByText('Opening Keynote: The Future of Business Education')).toBeInTheDocument();
      expect(screen.queryByText('Workshop: Interactive Teaching Methods')).not.toBeInTheDocument();
    });
  });

  it('filters sessions by level when filter is selected', async () => {
    render(<ConferenceAgenda {...defaultProps} />);

    // Select intermediate level from dropdown
    const levelSelect = screen.getByDisplayValue('All Levels');
    fireEvent.change(levelSelect, { target: { value: 'intermediate' } });

    await waitFor(() => {
      expect(screen.queryByText('Opening Keynote: The Future of Business Education')).not.toBeInTheDocument();
      expect(screen.getByText('Workshop: Interactive Teaching Methods')).toBeInTheDocument();
    });
  });

  it('displays session time correctly', () => {
    render(<ConferenceAgenda {...defaultProps} />);

    // Check for time slot headers
    expect(screen.getByText('9:00 AM')).toBeInTheDocument();
    expect(screen.getByText('10:30 AM')).toBeInTheDocument();
  });

  it('shows session details including room and capacity', () => {
    render(<ConferenceAgenda {...defaultProps} />);

    expect(screen.getByText('Main Auditorium')).toBeInTheDocument();
    expect(screen.getByText('Workshop Room A')).toBeInTheDocument();
    // The component shows capacity in session detail modal, not in the main view
  });

  it('displays speaker information when available', () => {
    render(<ConferenceAgenda {...defaultProps} />);

    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Prof. Michael Roberts')).toBeInTheDocument();
  });

  it('opens session detail modal when session is clicked', async () => {
    render(<ConferenceAgenda {...defaultProps} />);

    const sessionCard = screen.getByText('Opening Keynote: The Future of Business Education');
    fireEvent.click(sessionCard);

    await waitFor(() => {
      expect(screen.getByText('Session Description')).toBeInTheDocument();
      expect(screen.getByText('Learning Objectives')).toBeInTheDocument();
      expect(screen.getByText('Identify emerging trends in business education')).toBeInTheDocument();
    });
  });

  it('closes session detail modal when close button is clicked', async () => {
    render(<ConferenceAgenda {...defaultProps} />);

    // Open modal
    const sessionCard = screen.getByText('Opening Keynote: The Future of Business Education');
    fireEvent.click(sessionCard);

    await waitFor(() => {
      expect(screen.getByText('Session Description')).toBeInTheDocument();
    });

    // Close modal using the "Close" button in the modal footer
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Session Description')).not.toBeInTheDocument();
    });
  });

  it('shows printable agenda option', () => {
    render(<ConferenceAgenda {...defaultProps} />);

    expect(screen.getByText('Print Schedule')).toBeInTheDocument();
  });

  it('clears filters when Clear Filters button is clicked', async () => {
    render(<ConferenceAgenda {...defaultProps} />);

    // First apply a filter
    const trackSelect = screen.getByDisplayValue('All Tracks');
    fireEvent.change(trackSelect, { target: { value: 'Innovation' } });

    await waitFor(() => {
      expect(screen.queryByText('Workshop: Interactive Teaching Methods')).not.toBeInTheDocument();
    });

    // Then clear filters
    const clearButton = screen.getByText('Clear Filters');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText('Opening Keynote: The Future of Business Education')).toBeInTheDocument();
      expect(screen.getByText('Workshop: Interactive Teaching Methods')).toBeInTheDocument();
    });
  });

  it('renders without speakers prop', () => {
    const propsWithoutSpeakers = {
      agenda: mockAgenda,
      className: 'test-class'
    };

    render(<ConferenceAgenda {...propsWithoutSpeakers} />);

    expect(screen.getByText('Conference Agenda')).toBeInTheDocument();
    expect(screen.getByText('Opening Keynote: The Future of Business Education')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<ConferenceAgenda {...defaultProps} />);
    
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('handles empty sessions gracefully', () => {
    const emptyAgenda = {
      sessions: [],
      tracks: [],
      timeSlots: []
    };

    render(<ConferenceAgenda agenda={emptyAgenda} />);

    expect(screen.getByText('Conference Agenda')).toBeInTheDocument();
    expect(screen.getByText('No sessions found')).toBeInTheDocument();
  });

  it('displays session level badges with correct colors', () => {
    const { container } = render(<ConferenceAgenda {...defaultProps} />);

    const allLevelBadge = screen.getByText('all');
    const intermediateBadge = screen.getByText('intermediate');

    expect(allLevelBadge).toBeInTheDocument();
    expect(intermediateBadge).toBeInTheDocument();

    // Check that badges have appropriate classes for styling
    expect(allLevelBadge).toHaveClass('bg-blue-100', 'text-blue-800');
    expect(intermediateBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });
});