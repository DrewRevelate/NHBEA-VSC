import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AwardNominationFormWrapper from './AwardNominationFormWrapper';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn()
  }),
  useSearchParams: () => ({
    get: jest.fn()
  })
}));

// Mock the awards repository
jest.mock('@/lib/awards', () => ({
  awardsRepository: {
    getAllAwards: jest.fn(),
  }
}));

// Mock the fetch API for form submission
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('Award Nomination Workflow Integration Tests', () => {
  const mockAwards = [
    {
      id: 'award1',
      name: 'Educator of the Year',
      description: 'Recognizing outstanding achievement in business education.',
      eligibility: 'Must be a current NHBEA member with at least 5 years of teaching experience.',
      deadline: new Date('2030-05-01'), // Future date
      category: 'Excellence',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    const mockAwardsRepository = require('@/lib/awards').awardsRepository;
    mockAwardsRepository.getAllAwards.mockResolvedValue(mockAwards);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should successfully complete the nomination workflow from start to finish', async () => {
    // Mock successful API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Nomination submitted successfully!',
        nominationId: 'nom123'
      }),
    } as Response);

    render(<AwardNominationFormWrapper />);

    // Wait for awards to load
    await waitFor(() => {
      expect(screen.getByText('Submit an Award Nomination')).toBeInTheDocument();
    });

    // Step 1: Select an award
    await waitFor(() => {
      expect(screen.getByText('Educator of the Year')).toBeInTheDocument();
    });

    const awardRadio = screen.getByDisplayValue('award1');
    fireEvent.click(awardRadio);

    // Wait for form to become valid
    const continueButton = screen.getByRole('button', { name: /continue/i });
    await waitFor(() => {
      expect(continueButton).not.toBeDisabled();
    });
    fireEvent.click(continueButton);

    // Step 2: Fill nominee information
    await waitFor(() => {
      expect(screen.getByText('Nominee Information')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/nominee full name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/nominee email address/i), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/organization\/school/i), {
      target: { value: 'Test High School' }
    });
    fireEvent.change(screen.getByLabelText(/position\/title/i), {
      target: { value: 'Business Teacher' }
    });

    // Wait for form to become valid
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).not.toBeDisabled();
    });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    // Step 3: Fill nominator information
    await waitFor(() => {
      expect(screen.getByText('Your Information')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/your full name/i), {
      target: { value: 'Jane Smith' }
    });
    fireEvent.change(screen.getByLabelText(/your email address/i), {
      target: { value: 'jane@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/your organization\/school/i), {
      target: { value: 'Another School' }
    });
    fireEvent.change(screen.getByLabelText(/your position\/title/i), {
      target: { value: 'Principal' }
    });

    // Wait for form to become valid
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).not.toBeDisabled();
    });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    // Step 4: Fill nomination details
    await waitFor(() => {
      expect(screen.getByText('Nomination Statement')).toBeInTheDocument();
    });

    const nominationText = 'John is an exceptional educator who has transformed business education at our school. His innovative teaching methods and dedication to student success make him truly deserving of this recognition. He consistently goes above and beyond to ensure his students are prepared for the business world.';

    fireEvent.change(screen.getByLabelText(/nomination statement/i), {
      target: { value: nominationText }
    });

    fireEvent.click(screen.getByRole('checkbox', { name: /i agree that the information provided is accurate/i }));

    // Wait for form to become valid
    const submitButton = screen.getByRole('button', { name: /submit nomination/i });
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    // Submit the form
    fireEvent.click(submitButton);

    // Verify loading state is shown
    await waitFor(() => {
      expect(screen.getByText('Submitting your nomination...')).toBeInTheDocument();
    });

    // Verify fetch was called with correct data
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/nominations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          awardId: 'award1',
          awardCategory: 'Excellence',
          nomineeInfo: {
            name: 'John Doe',
            email: 'john@example.com',
            organization: 'Test High School',
            position: 'Business Teacher'
          },
          nominatorInfo: {
            name: 'Jane Smith',
            email: 'jane@example.com',
            organization: 'Another School',
            position: 'Principal'
          },
          nominationText: nominationText,
          agreedToTerms: true
        }),
      });
    });

    // Verify success message is shown
    await waitFor(() => {
      expect(screen.getByText('Nomination submitted successfully!')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should handle API errors gracefully and show error message', async () => {
    // Mock API error response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        message: 'Validation failed',
        error: 'Email is required'
      }),
    } as Response);

    render(<AwardNominationFormWrapper />);

    // Wait for awards to load and navigate through steps quickly
    await waitFor(() => {
      expect(screen.getByText('Submit an Award Nomination')).toBeInTheDocument();
    });

    // Quick navigation through steps with minimal valid data
    const awardRadio = screen.getByDisplayValue('award1');
    fireEvent.click(awardRadio);
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText('Nominee Information')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/nominee full name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/nominee email address/i), {
      target: { value: 'john@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText('Your Information')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/your full name/i), {
      target: { value: 'Jane Smith' }
    });
    fireEvent.change(screen.getByLabelText(/your email address/i), {
      target: { value: 'jane@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText('Nomination Statement')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/nomination statement/i), {
      target: { value: 'Great teacher who deserves recognition for exceptional work.' }
    });
    fireEvent.click(screen.getByRole('checkbox', { name: /i agree that the information provided is accurate/i }));

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit nomination/i }));

    // Verify error message is shown
    await waitFor(() => {
      expect(screen.getByText('Validation failed')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Verify error can be dismissed
    const dismissButton = screen.getByRole('button', { name: /dismiss/i });
    fireEvent.click(dismissButton);

    await waitFor(() => {
      expect(screen.queryByText('Validation failed')).not.toBeInTheDocument();
    });
  });

  it('should handle network errors gracefully', async () => {
    // Mock network error
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<AwardNominationFormWrapper />);

    // Navigate through steps quickly
    await waitFor(() => {
      expect(screen.getByText('Submit an Award Nomination')).toBeInTheDocument();
    });

    const awardRadio = screen.getByDisplayValue('award1');
    fireEvent.click(awardRadio);
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText('Nominee Information')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/nominee full name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/nominee email address/i), {
      target: { value: 'john@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText('Your Information')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/your full name/i), {
      target: { value: 'Jane Smith' }
    });
    fireEvent.change(screen.getByLabelText(/your email address/i), {
      target: { value: 'jane@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText('Nomination Statement')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/nomination statement/i), {
      target: { value: 'Great teacher who deserves recognition for exceptional work.' }
    });
    fireEvent.click(screen.getByRole('checkbox', { name: /i agree that the information provided is accurate/i }));

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit nomination/i }));

    // Verify network error message is shown
    await waitFor(() => {
      expect(screen.getByText('Network error. Please check your connection and try again.')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should display loading states during awards fetch', async () => {
    // Mock slow loading
    const mockAwardsRepository = require('@/lib/awards').awardsRepository;
    mockAwardsRepository.getAllAwards.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockAwards), 100))
    );

    render(<AwardNominationFormWrapper />);

    // Verify loading state is shown
    expect(screen.getByText('Loading awards...')).toBeInTheDocument();

    // Wait for awards to load
    await waitFor(() => {
      expect(screen.getByText('Submit an Award Nomination')).toBeInTheDocument();
    });

    expect(screen.queryByText('Loading awards...')).not.toBeInTheDocument();
  });

  it('should handle no available awards scenario', async () => {
    const mockAwardsRepository = require('@/lib/awards').awardsRepository;
    mockAwardsRepository.getAllAwards.mockResolvedValue([]);

    render(<AwardNominationFormWrapper />);

    await waitFor(() => {
      expect(screen.getByText('No Awards Available for Nomination')).toBeInTheDocument();
    });

    expect(screen.getByText('All award nomination deadlines have passed. Please check back next year for new nomination opportunities.')).toBeInTheDocument();
  });

  it('should handle awards loading error', async () => {
    const mockAwardsRepository = require('@/lib/awards').awardsRepository;
    mockAwardsRepository.getAllAwards.mockRejectedValue(new Error('Failed to load awards'));

    render(<AwardNominationFormWrapper />);

    await waitFor(() => {
      expect(screen.getByText('Unable to Load Nomination Form')).toBeInTheDocument();
    });

    expect(screen.getByText('Unable to load awards data. Please try again later.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });
});