import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfessionalMembershipForm from './ProfessionalMembershipForm';
import { MembershipSubmissionResult } from '@/types/membership';
import type { ProfessionalMembershipFormData } from '@/lib/membershipValidation';

// Mock successful submission
const mockSuccessfulSubmit = jest.fn<Promise<MembershipSubmissionResult>, [ProfessionalMembershipFormData]>();
const mockFailedSubmit = jest.fn<Promise<MembershipSubmissionResult>, [ProfessionalMembershipFormData]>();

describe('ProfessionalMembershipForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validFormData = {
    membershipType: 'new' as const,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    institution: 'Test University',
    position: 'Professor',
    yearsExperience: 10,
    address: '123 Main St',
    city: 'Manchester',
    state: 'NH',
    zipCode: '03101',
    communicationPreferences: {
      newsletter: true,
      updates: true,
      events: true
    }
  };

  const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
    // Select membership type
    await user.click(screen.getByLabelText('New Membership'));
    
    // Fill personal information
    await user.type(screen.getByLabelText(/first name/i), validFormData.firstName);
    await user.type(screen.getByLabelText(/last name/i), validFormData.lastName);
    await user.type(screen.getByLabelText(/email address/i), validFormData.email);
    await user.type(screen.getByLabelText(/phone number/i), validFormData.phone);
    
    // Fill professional information
    await user.type(screen.getByLabelText(/institution/i), validFormData.institution);
    await user.type(screen.getByLabelText(/position/i), validFormData.position);
    await user.type(screen.getByLabelText(/years of experience/i), validFormData.yearsExperience.toString());
    
    // Fill address information
    await user.type(screen.getByLabelText(/street address/i), validFormData.address);
    await user.type(screen.getByLabelText(/city/i), validFormData.city);
    await user.selectOptions(screen.getByLabelText(/state/i), validFormData.state);
    await user.type(screen.getByLabelText(/zip code/i), validFormData.zipCode);
  };

  it('renders form with all required fields', () => {
    render(<ProfessionalMembershipForm onSubmit={mockSuccessfulSubmit} />);

    // Check header
    expect(screen.getByText('Professional Membership Application')).toBeInTheDocument();
    expect(screen.getByText(/annual membership fee: \$50\.00/i)).toBeInTheDocument();

    // Check membership type options
    expect(screen.getByLabelText('New Membership')).toBeInTheDocument();
    expect(screen.getByLabelText('Membership Renewal')).toBeInTheDocument();

    // Check required form fields
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/institution/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/position/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/years of experience/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument();

    // Check communication preferences
    expect(screen.getByLabelText(/newsletter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/general updates/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event notifications/i)).toBeInTheDocument();

    // Check submit button
    expect(screen.getByRole('button', { name: /submit application/i })).toBeInTheDocument();
  });

  it('shows previous member number field when renewal is selected', async () => {
    const user = userEvent.setup();
    render(<ProfessionalMembershipForm onSubmit={mockSuccessfulSubmit} />);

    // Initially, previous member number field should not be visible
    expect(screen.queryByLabelText(/previous member number/i)).not.toBeInTheDocument();

    // Select renewal membership
    await user.click(screen.getByLabelText('Membership Renewal'));

    // Now previous member number field should be visible
    expect(screen.getByLabelText(/previous member number/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<ProfessionalMembershipForm onSubmit={mockSuccessfulSubmit} />);

    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, 'invalid-email');
    
    const submitButton = screen.getByRole('button', { name: /submit application/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('sets default values for communication preferences', () => {
    render(<ProfessionalMembershipForm onSubmit={mockSuccessfulSubmit} />);

    // All communication preferences should be checked by default
    expect(screen.getByLabelText(/newsletter/i)).toBeChecked();
    expect(screen.getByLabelText(/general updates/i)).toBeChecked();
    expect(screen.getByLabelText(/event notifications/i)).toBeChecked();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    
    mockSuccessfulSubmit.mockResolvedValue({
      success: true,
      message: 'Application submitted successfully'
    });

    render(<ProfessionalMembershipForm onSubmit={mockSuccessfulSubmit} />);

    await fillValidForm(user);

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSuccessfulSubmit).toHaveBeenCalledWith(expect.objectContaining({
        firstName: validFormData.firstName,
        lastName: validFormData.lastName,
        email: validFormData.email,
        phone: validFormData.phone,
        institution: validFormData.institution,
        position: validFormData.position,
        yearsExperience: validFormData.yearsExperience,
        address: validFormData.address,
        city: validFormData.city,
        state: validFormData.state,
        zipCode: validFormData.zipCode,
        membershipType: validFormData.membershipType,
        communicationPreferences: validFormData.communicationPreferences
      }));
    });
  });

  it('displays error message when submission fails', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Failed to process application';
    
    mockFailedSubmit.mockResolvedValue({
      success: false,
      message: errorMessage,
      error: 'API error'
    });

    render(<ProfessionalMembershipForm onSubmit={mockFailedSubmit} />);

    await fillValidForm(user);

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});