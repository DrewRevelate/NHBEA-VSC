import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VenueInformation from './VenueInformation';
import { VenueDetails } from '@/types/conference';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock environment variables
const originalEnv = process.env;
beforeAll(() => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: 'test-api-key'
  };
});

afterAll(() => {
  process.env = originalEnv;
});

const mockVenue: VenueDetails = {
  name: 'Manchester Community College',
  description: 'A premier educational institution located in Manchester, featuring modern facilities and comprehensive amenities for conferences and events.',
  address: {
    street: '1066 Front Street',
    city: 'Manchester',
    state: 'NH',
    zipCode: '03102'
  },
  coordinates: {
    lat: 43.0059,
    lng: -71.4632
  },
  facilities: [
    {
      name: 'Free WiFi',
      description: 'High-speed wireless internet throughout the venue',
      available: true,
      iconName: 'wifi'
    },
    {
      name: 'On-site Parking',
      description: 'Convenient parking for all attendees',
      available: true,
      iconName: 'parking'
    },
    {
      name: 'Restaurant',
      description: 'Full-service dining options',
      available: false,
      iconName: 'restaurant'
    }
  ],
  accessibility: {
    wheelchairAccessible: true,
    elevatorAccess: true,
    accessibleParking: true,
    accessibleRestrooms: true,
    hearingLoopAvailable: false,
    signLanguageInterpreter: true,
    largeTextMaterials: true,
    additionalNotes: 'Additional accessibility accommodations available upon request'
  },
  parking: {
    available: true,
    free: false,
    cost: 10,
    spaces: 200,
    validationAvailable: true,
    alternatives: ['Street parking nearby', 'Municipal parking garage'],
    notes: 'Early bird rates available before 8 AM'
  },
  nearbyAccommodations: [
    {
      name: 'Grand Hotel Manchester',
      type: 'hotel',
      distanceFromVenue: '0.2 miles',
      priceRange: '$$$',
      website: 'https://grandhotelmanchester.com',
      phone: '(603) 555-0123',
      specialRates: true,
      bookingDeadline: new Date('2025-09-15'),
      amenities: ['Pool', 'Fitness Center', 'Restaurant', 'Room Service']
    },
    {
      name: 'Budget Inn',
      type: 'inn',
      distanceFromVenue: '0.5 miles',
      priceRange: '$',
      phone: '(603) 555-0456',
      specialRates: false,
      amenities: ['WiFi', 'Continental Breakfast']
    }
  ],
  transportation: {
    publicTransit: true,
    airportShuttles: ['Airport Express', 'City Shuttle Service'],
    rideshareRecommended: true,
    walkingDistance: {
      fromDowntown: '0.3 miles',
      fromStation: '0.1 miles'
    },
    drivingDirections: 'Take I-93 to Exit 6, follow signs to downtown Manchester'
  },
  photos: [
    '/venue/exterior.jpg',
    '/venue/lobby.jpg',
    '/venue/auditorium.jpg',
    '/venue/meeting-room.jpg'
  ],
  website: 'https://nhconventioncenter.com',
  phone: '(603) 555-0100'
};

describe('VenueInformation', () => {
  const defaultProps = {
    venue: mockVenue,
    className: 'test-venue-info'
  };

  it('renders the venue information section with title', () => {
    render(<VenueInformation {...defaultProps} />);

    expect(screen.getByText('Venue Information')).toBeInTheDocument();
    expect(screen.getByText(/Discover everything you need to know about our conference venue/)).toBeInTheDocument();
  });

  it('displays venue name and description', () => {
    render(<VenueInformation {...defaultProps} />);

    expect(screen.getAllByText('Manchester Community College')).toHaveLength(2); // One in main view, one in fallback
    expect(screen.getByText(/A premier educational institution located in Manchester/)).toBeInTheDocument();
  });

  it('shows venue address', () => {
    render(<VenueInformation {...defaultProps} />);

    // The address is rendered in the fallback component when no maps API
    expect(screen.getByText(/1066 Front Street, Manchester, NH 03102/)).toBeInTheDocument();
  });

  it('displays contact information when available', () => {
    render(<VenueInformation {...defaultProps} />);

    expect(screen.getByText('(603) 555-0100')).toBeInTheDocument();
    expect(screen.getByText('Visit Website')).toBeInTheDocument();
  });

  it('renders tab navigation', () => {
    render(<VenueInformation {...defaultProps} />);

    expect(screen.getByText('Facilities')).toBeInTheDocument();
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
    expect(screen.getByText('Parking')).toBeInTheDocument();
    expect(screen.getByText('Transportation')).toBeInTheDocument();
    expect(screen.getByText('Hotels')).toBeInTheDocument();
  });

  it('shows facilities in overview tab by default', () => {
    render(<VenueInformation {...defaultProps} />);

    expect(screen.getByText('Venue Facilities')).toBeInTheDocument();
    expect(screen.getByText('Free WiFi')).toBeInTheDocument();
    expect(screen.getByText('On-site Parking')).toBeInTheDocument();
    expect(screen.getByText('Restaurant')).toBeInTheDocument();
  });

  it('switches to accessibility tab when clicked', async () => {
    render(<VenueInformation {...defaultProps} />);

    const accessibilityTab = screen.getByText('Accessibility');
    fireEvent.click(accessibilityTab);

    await waitFor(() => {
      expect(screen.getByText('Accessibility Features')).toBeInTheDocument();
      expect(screen.getByText('Wheelchair Accessible')).toBeInTheDocument();
      expect(screen.getByText('Additional Accessibility Information')).toBeInTheDocument();
    });
  });

  it('displays parking information in parking tab', async () => {
    render(<VenueInformation {...defaultProps} />);

    const parkingTab = screen.getByText('Parking');
    fireEvent.click(parkingTab);

    await waitFor(() => {
      expect(screen.getByText('Parking Information')).toBeInTheDocument();
      expect(screen.getByText('Parking Available')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument(); // Total spaces
      expect(screen.getByText('$10')).toBeInTheDocument(); // Cost
    });
  });

  it('shows transportation options in transportation tab', async () => {
    render(<VenueInformation {...defaultProps} />);

    const transportationTab = screen.getByText('Transportation');
    fireEvent.click(transportationTab);

    await waitFor(() => {
      expect(screen.getByText('Transportation Options')).toBeInTheDocument();
      expect(screen.getByText('Public Transit')).toBeInTheDocument();
      expect(screen.getByText('Walking Distance')).toBeInTheDocument();
      expect(screen.getByText('0.3 miles')).toBeInTheDocument(); // From downtown
    });
  });

  it('displays accommodations in hotels tab', async () => {
    render(<VenueInformation {...defaultProps} />);

    const hotelsTab = screen.getByText('Hotels');
    fireEvent.click(hotelsTab);

    await waitFor(() => {
      expect(screen.getByText('Nearby Accommodations')).toBeInTheDocument();
      expect(screen.getByText('Grand Hotel Manchester')).toBeInTheDocument();
      expect(screen.getByText('Budget Inn')).toBeInTheDocument();
    });
  });

  it('renders Google Maps embed with API key', () => {
    // Mock window.google to simulate Maps API being available
    (global as any).window.google = { maps: {} };
    
    const { container } = render(<VenueInformation {...defaultProps} />);

    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', expect.stringContaining('test-api-key'));
    
    // Clean up
    delete (global as any).window.google;
  });

  it('shows fallback when Google Maps API key is not available', () => {
    // Temporarily remove API key
    delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    render(<VenueInformation {...defaultProps} />);

    expect(screen.getByText('Get Directions')).toBeInTheDocument();

    // Restore API key
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-api-key';
  });

  it('displays venue photos when available', () => {
    render(<VenueInformation {...defaultProps} />);

    expect(screen.getByText('Venue Photos')).toBeInTheDocument();
    expect(screen.getByAltText('Manchester Community College - Photo 1')).toBeInTheDocument();
    expect(screen.getByAltText('Manchester Community College - Photo 2')).toBeInTheDocument();
  });

  it('opens photo modal when photo is clicked', async () => {
    render(<VenueInformation {...defaultProps} />);

    const firstPhoto = screen.getByAltText('Manchester Community College - Photo 1');
    fireEvent.click(firstPhoto);

    await waitFor(() => {
      expect(screen.getByAltText('Venue photo')).toBeInTheDocument();
    });
  });

  it('closes photo modal when close button is clicked', async () => {
    render(<VenueInformation {...defaultProps} />);

    // Open modal
    const firstPhoto = screen.getByAltText('Manchester Community College - Photo 1');
    fireEvent.click(firstPhoto);

    await waitFor(() => {
      expect(screen.getByAltText('Venue photo')).toBeInTheDocument();
    });

    // Close modal - find close button in modal
    const buttons = screen.getAllByRole('button');
    const closeButton = buttons.find(button => button.querySelector('svg'));
    if (closeButton) {
      fireEvent.click(closeButton);
    }

    await waitFor(() => {
      expect(screen.queryByAltText('Venue photo')).not.toBeInTheDocument();
    });
  });

  it('displays accommodation booking information', async () => {
    render(<VenueInformation {...defaultProps} />);

    const hotelsTab = screen.getByText('Hotels');
    fireEvent.click(hotelsTab);

    await waitFor(() => {
      expect(screen.getByText('Conference rates available')).toBeInTheDocument();
      expect(screen.getByText(/Book by/)).toBeInTheDocument();
    });
  });

  it('shows accommodation amenities', async () => {
    render(<VenueInformation {...defaultProps} />);

    const hotelsTab = screen.getByText('Hotels');
    fireEvent.click(hotelsTab);

    await waitFor(() => {
      expect(screen.getByText('Pool')).toBeInTheDocument();
      expect(screen.getByText('Fitness Center')).toBeInTheDocument();
      expect(screen.getByText('+1 more')).toBeInTheDocument(); // 4 amenities, showing 3, so +1 more
    });
  });

  it('applies custom className', () => {
    const { container } = render(<VenueInformation {...defaultProps} />);
    
    expect(container.firstChild).toHaveClass('test-venue-info');
  });

  it('handles venue without photos gracefully', () => {
    const venueWithoutPhotos = {
      ...mockVenue,
      photos: []
    };

    render(<VenueInformation venue={venueWithoutPhotos} />);

    expect(screen.queryByText('Venue Photos')).not.toBeInTheDocument();
  });

  it('handles venue without accommodations', async () => {
    const venueWithoutAccommodations = {
      ...mockVenue,
      nearbyAccommodations: []
    };

    render(<VenueInformation venue={venueWithoutAccommodations} />);

    const hotelsTab = screen.getByText('Hotels');
    fireEvent.click(hotelsTab);

    await waitFor(() => {
      expect(screen.getByText('Accommodation information coming soon')).toBeInTheDocument();
    });
  });

  it('shows parking unavailable state', async () => {
    const venueWithoutParking = {
      ...mockVenue,
      parking: {
        ...mockVenue.parking,
        available: false
      }
    };

    render(<VenueInformation venue={venueWithoutParking} />);

    const parkingTab = screen.getByText('Parking');
    fireEvent.click(parkingTab);

    await waitFor(() => {
      expect(screen.getByText('Limited Parking Available')).toBeInTheDocument();
      expect(screen.getByText(/On-site parking is not available/)).toBeInTheDocument();
    });
  });

  it('displays accessibility features correctly', async () => {
    render(<VenueInformation {...defaultProps} />);

    const accessibilityTab = screen.getByText('Accessibility');
    fireEvent.click(accessibilityTab);

    await waitFor(() => {
      // Check for some available features
      expect(screen.getByText('Wheelchair Accessible')).toBeInTheDocument();
      expect(screen.getByText('Elevator Access')).toBeInTheDocument();
      // Check for available and not available statuses exist
      expect(screen.getAllByText('Available').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Not Available').length).toBeGreaterThan(0);
    });
  });

  it('shows airport shuttle information', async () => {
    render(<VenueInformation {...defaultProps} />);

    const transportationTab = screen.getByText('Transportation');
    fireEvent.click(transportationTab);

    await waitFor(() => {
      expect(screen.getByText('Airport Transportation')).toBeInTheDocument();
      expect(screen.getByText('Airport Express')).toBeInTheDocument();
      expect(screen.getByText('City Shuttle Service')).toBeInTheDocument();
    });
  });

  it('displays rideshare recommendation', async () => {
    render(<VenueInformation {...defaultProps} />);

    const transportationTab = screen.getByText('Transportation');
    fireEvent.click(transportationTab);

    await waitFor(() => {
      expect(screen.getByText('Rideshare Recommended')).toBeInTheDocument();
      expect(screen.getByText(/Uber and Lyft services are readily available/)).toBeInTheDocument();
    });
  });
});