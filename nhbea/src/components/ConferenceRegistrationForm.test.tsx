import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConferenceRegistrationForm from './ConferenceRegistrationForm';
import { Conference } from '@/types/conference';

// Mock the validation functions
jest.mock('@/lib/conferenceValidation', () => ({
  ...jest.requireActual('@/lib/conferenceValidation'),
  sanitizeRegistrationData: jest.fn((data) => data),
}));

const mockConference: Conference = {
  id: 'test-conference-2025',
  title: '2025 Test Conference',
  description: 'Test conference description',
  year: 2025,
  schedule: {
    date: new Date('2025-10-24'),
    startTime: '09:00',
    endTime: '17:00',
    timezone: 'America/New_York'
  },
  location: {
    venue: 'Test Venue',
    address: {
      street: '123 Test St',
      city: 'Test City',
      state: 'NH',
      zipCode: '03101'
    },
    virtualOption: false
  },
  registration: {
    isOpen: true,
    openDate: new Date('2025-07-01'),
    closeDate: new Date('2025-10-10'),
    capacity: 150,
    currentCount: 50,
    waitlistEnabled: true,
    fees: {
      member: 65,
      nonMember: 65,
      student: 65
    },
    requiredFields: ['fullName', 'email', 'institution'],
    waitingList: []
  },
  media: {
    imageURL: '/test-image.jpg'
  },
  status: 'registration_open',
  metadata: {
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'test-user',
    featured: true
  }
};

const mockOnSubmit = jest.fn();

describe('ConferenceRegistrationForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders all required form fields', () => {
    render(
      <ConferenceRegistrationForm
        conference={mockConference}
        onSubmit={mockOnSubmit}
      />
    );

    // Check for required fields
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/institution/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/membership status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/agree to the terms/i)).toBeInTheDocument();
  });

  it('renders optional form fields', () => {
    render(
      <ConferenceRegistrationForm
        conference={mockConference}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dietary restrictions/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/accessibility needs/i)).toBeInTheDocument();
  });

  it('shows membership ID field when member status is selected', async () => {
    const user = userEvent.setup();
    
    render(
      <ConferenceRegistrationForm
        conference={mockConference}
        onSubmit={mockOnSubmit}
      />
    );

    const membershipStatusSelect = screen.getByDisplayValue('Select membership status');
    await user.selectOptions(membershipStatusSelect, 'member');

    await waitFor(() => {
      expect(screen.getByLabelText(/membership id/i)).toBeInTheDocument();
    });
  });

  it('hides membership ID field for non-members', async () => {
    const user = userEvent.setup();
    
    render(
      <ConferenceRegistrationForm
        conference={mockConference}
        onSubmit={mockOnSubmit}
      />
    );

    const membershipStatusSelect = screen.getByDisplayValue('Select membership status');
    await user.selectOptions(membershipStatusSelect, 'non-member');

    await waitFor(() => {
      expect(screen.queryByLabelText(/membership id/i)).not.toBeInTheDocument();
    });
  });

  it('calculates and displays registration fee', async () => {
    const user = userEvent.setup();
    
    render(
      <ConferenceRegistrationForm
        conference={mockConference}
        onSubmit={mockOnSubmit}
      />
    );

    const membershipStatusSelect = screen.getByDisplayValue('Select membership status');
    await user.selectOptions(membershipStatusSelect, 'member');

    await waitFor(() => {
      expect(screen.getByText(/registration fee/i)).toBeInTheDocument();
      // Should show standard pricing
      expect(screen.getByText('$65')).toBeInTheDocument();
    });
  });

  it('shows standard pricing for all membership types', async () => {
    const user = userEvent.setup();
    
    render(
      <ConferenceRegistrationForm
        conference={mockConference}
        onSubmit={mockOnSubmit}
      />
    );

    const membershipStatusSelect = screen.getByDisplayValue('Select membership status');
    await user.selectOptions(membershipStatusSelect, 'member');

    await waitFor(() => {
      expect(screen.getByText('$65')).toBeInTheDocument();
    });
  });

  it('toggles emergency contact section', async () => {
    const user = userEvent.setup();
    
    render(
      <ConferenceRegistrationForm
        conference={mockConference}
        onSubmit={mockOnSubmit}
      />
    );

    // Emergency contact fields should not be visible initially
    expect(screen.queryByLabelText(/emergency contact.*name/i)).not.toBeInTheDocument();

    // Click to show emergency contact
    const toggleButton = screen.getByText(/add emergency contact/i);
    await user.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/relationship/i)).toBeInTheDocument();
    });

    // Click to hide emergency contact
    const hideButton = screen.getByText(/hide/i);
    await user.click(hideButton);

    await waitFor(() => {
      expect(screen.queryByLabelText(/emergency contact.*name/i)).not.toBeInTheDocument();
    });
  });

  it('validates required fields and shows errors', async () => {
    const user = userEvent.setup();
    
    render(
      <ConferenceRegistrationForm
        conference={mockConference}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /register for/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/institution.*is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    
    render(
      <ConferenceRegistrationForm
        conference={mockConference}
        onSubmit={mockOnSubmit}
      />
    );

    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /register for/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('validates phone number format', async () => {
    const user = userEvent.setup();
    
    render(
      <ConferenceRegistrationForm
        conference={mockConference}
        onSubmit={mockOnSubmit}
      />
    );

    const phoneInput = screen.getByLabelText(/phone number/i);
    await user.type(phoneInput, '123');

    const submitButton = screen.getByRole('button', { name: /register for/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument();
    });
  });

  it('requires terms agreement', async () => {
    const user = userEvent.setup();
    
    render(
      <ConferenceRegistrationForm
        conference={mockConference}
        onSubmit={mockOnSubmit}
      />
    );

    // Fill out required fields but don't check terms
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/institution/i), 'Test University');
    await user.selectOptions(screen.getByLabelText(/membership status/i), 'non-member');

    const submitButton = screen.getByRole('button', { name: /register for/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/you must agree to the terms/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    
    render(
      <ConferenceRegistrationForm
        conference={mockConference}
        onSubmit={mockOnSubmit}
      />
    );

    // Fill out required fields
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/institution/i), 'Test University');
    await user.selectOptions(screen.getByLabelText(/membership status/i), 'non-member');
    await user.click(screen.getByLabelText(/agree to the terms/i));

    const submitButton = screen.getByRole('button', { name: /register for/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: 'John Doe',
          email: 'john@example.com',
          institution: 'Test University',
          membershipStatus: 'non-member',
          agreeToTerms: true
        })
      );
    });
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    
    render(
      <ConferenceRegistrationForm
        conference={mockConference}
        onSubmit={mockOnSubmit}
        isLoading={true}
      />
    );

    const submitButton = screen.getByRole('button', { name: /processing/i });
    expect(submitButton).toBeDisabled();
  });

  it('includes membership ID when member is selected', async () => {
    const user = userEvent.setup();
    
    render(
      <ConferenceRegistrationForm
        conference={mockConference}
        onSubmit={mockOnSubmit}
      />
    );

    // Fill out form as a member
    await user.type(screen.getByLabelText(/full name/i), 'Jane Member');
    await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/institution/i), 'Member University');
    await user.selectOptions(screen.getByLabelText(/membership status/i), 'member');
    
    await waitFor(() => {
      expect(screen.getByLabelText(/membership id/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/membership id/i), 'MEM-12345');
    await user.click(screen.getByLabelText(/agree to the terms/i));

    const submitButton = screen.getByRole('button', { name: /register for/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          membershipStatus: 'member',
          membershipId: 'MEM-12345'
        })
      );
    });
  });

  it('includes optional fields when filled', async () => {
    const user = userEvent.setup();
    
    render(
      <ConferenceRegistrationForm
        conference={mockConference}
        onSubmit={mockOnSubmit}
      />
    );

    // Fill out required fields
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/institution/i), 'Test University');
    await user.selectOptions(screen.getByLabelText(/membership status/i), 'non-member');
    await user.click(screen.getByLabelText(/agree to the terms/i));

    // Fill out optional fields
    await user.type(screen.getByLabelText(/phone number/i), '(555) 123-4567');
    await user.type(screen.getByLabelText(/job title/i), 'Professor');
    await user.type(screen.getByLabelText(/dietary restrictions/i), 'Vegetarian');
    await user.type(screen.getByLabelText(/accessibility needs/i), 'Wheelchair access');

    const submitButton = screen.getByRole('button', { name: /register for/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          phone: '(555) 123-4567',
          jobTitle: 'Professor',
          dietaryRestrictions: 'Vegetarian',
          accessibilityNeeds: 'Wheelchair access'
        })
      );
    });
  });

  it('handles different pricing tiers correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <ConferenceRegistrationForm
        conference={mockConference}
        onSubmit={mockOnSubmit}
      />
    );

    // Test student pricing
    await user.selectOptions(screen.getByLabelText(/membership status/i), 'student');
    
    await waitFor(() => {
      expect(screen.getByText('$65')).toBeInTheDocument(); // Student fee (same as all others)
    });

    // Test non-member pricing (same as all other rates)
    await user.selectOptions(screen.getByLabelText(/membership status/i), 'non-member');
    
    await waitFor(() => {
      expect(screen.getByText('$65')).toBeInTheDocument(); // Non-member fee (same as all others)
    });
  });

  it('accessibly labels form sections', () => {
    render(
      <ConferenceRegistrationForm
        conference={mockConference}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Membership Information')).toBeInTheDocument();
    expect(screen.getByText('Address Information (Optional)')).toBeInTheDocument();
    expect(screen.getByText('Preferences & Special Requirements')).toBeInTheDocument();
    expect(screen.getByText('Terms & Conditions')).toBeInTheDocument();
  });

  it('has proper ARIA labels and structure', () => {
    render(
      <ConferenceRegistrationForm
        conference={mockConference}
        onSubmit={mockOnSubmit}
      />
    );

    // Check that form elements have proper labels
    const fullNameInput = screen.getByLabelText(/full name/i);
    expect(fullNameInput).toHaveAttribute('id', 'fullName');
    
    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toHaveAttribute('type', 'email');
    
    const phoneInput = screen.getByLabelText(/phone number/i);
    expect(phoneInput).toHaveAttribute('type', 'tel');
  });
});