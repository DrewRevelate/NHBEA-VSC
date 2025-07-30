import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StudentMembershipForm from './StudentMembershipForm';
import { StudentApplicationSubmissionResult } from '@/types/membership';
import { StudentMembershipFormData } from '@/types/membership';

// Mock successful submission
const mockSuccessfulSubmit = jest.fn<Promise<StudentApplicationSubmissionResult>, [StudentMembershipFormData]>();
const mockFailedSubmit = jest.fn<Promise<StudentApplicationSubmissionResult>, [StudentMembershipFormData]>();

describe('StudentMembershipForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validFormData = {
    personalInfo: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@student.edu',
      phone: '(555) 987-6543'
    },
    academicInfo: {
      institution: 'Test University',
      major: 'Business Education',
      graduationYear: new Date().getFullYear() + 1,
      gpa: 3.75
    },
    essay: 'I am passionate about business education and want to contribute to the NHBEA community by sharing my insights and learning from experienced educators. This opportunity would help me develop professionally.',
    references: [
      {
        name: 'Dr. John Professor',
        email: 'j.professor@university.edu',
        relationship: 'Academic Advisor'
      },
      {
        name: 'Prof. Mary Teacher',
        email: 'm.teacher@university.edu',
        relationship: 'Course Instructor'
      }
    ]
  };

  const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
    // Fill personal information
    await user.type(screen.getByLabelText(/first name/i), validFormData.personalInfo.firstName);
    await user.type(screen.getByLabelText(/last name/i), validFormData.personalInfo.lastName);
    await user.type(document.getElementById('personalInfo.email')!, validFormData.personalInfo.email);
    await user.type(screen.getByLabelText(/phone number/i), validFormData.personalInfo.phone);
    
    // Fill academic information
    await user.type(screen.getByLabelText(/institution/i), validFormData.academicInfo.institution);
    await user.type(screen.getByLabelText(/major/i), validFormData.academicInfo.major);
    await user.clear(screen.getByLabelText(/graduation year/i));
    await user.type(screen.getByLabelText(/graduation year/i), validFormData.academicInfo.graduationYear.toString());
    await user.clear(screen.getByLabelText(/gpa/i));
    await user.type(screen.getByLabelText(/gpa/i), validFormData.academicInfo.gpa.toString());
    
    // Fill essay
    await user.type(screen.getByLabelText(/why do you want to join/i), validFormData.essay);
    
    // Fill references
    const referenceNameInputs = screen.getAllByLabelText(/full name/i);
    const referenceEmailInputs = screen.getAllByLabelText(/email address/i).filter(input => 
      input.getAttribute('id')?.includes('references')
    );
    const referenceRelationshipInputs = screen.getAllByLabelText(/relationship/i);
    
    for (let i = 0; i < validFormData.references.length; i++) {
      await user.type(referenceNameInputs[i], validFormData.references[i].name);
      await user.type(referenceEmailInputs[i], validFormData.references[i].email);
      await user.type(referenceRelationshipInputs[i], validFormData.references[i].relationship);
    }
  };

  it('renders form with all required fields', () => {
    render(<StudentMembershipForm onSubmit={mockSuccessfulSubmit} />);

    // Check header
    expect(screen.getByText('Student Membership Application')).toBeInTheDocument();
    expect(screen.getByText(/apply for a free student membership/i)).toBeInTheDocument();

    // Check personal information fields
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(document.getElementById('personalInfo.email')).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();

    // Check academic information fields
    expect(screen.getByLabelText(/institution/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/major/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/graduation year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gpa/i)).toBeInTheDocument();

    // Check essay field
    expect(screen.getByLabelText(/why do you want to join/i)).toBeInTheDocument();

    // Check references section
    expect(screen.getByText(/references \(2-3 required\)/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/full name/i)).toHaveLength(2); // Default 2 references

    // Check submit button - use text instead of role
    expect(screen.getByText('Submit Application')).toBeInTheDocument();
  });

  it('allows adding and removing references', async () => {
    const user = userEvent.setup();
    render(<StudentMembershipForm onSubmit={mockSuccessfulSubmit} />);

    // Initially should have 2 references
    expect(screen.getAllByText(/reference \d+/i)).toHaveLength(2);

    // Add a third reference
    const addButton = screen.getByText('+ Add Reference');
    await user.click(addButton);
    expect(screen.getAllByText(/reference \d+/i)).toHaveLength(3);

    // Should not show add button when at max (3)
    expect(screen.queryByText('+ Add Reference')).not.toBeInTheDocument();

    // Remove a reference
    const removeButtons = screen.getAllByLabelText(/remove reference/i);
    await user.click(removeButtons[0]);
    expect(screen.getAllByText(/reference \d+/i)).toHaveLength(2);
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<StudentMembershipForm onSubmit={mockSuccessfulSubmit} />);

    const submitButton = screen.getByText('Submit Application');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getAllByText(/email is required/i)).toHaveLength(3); // Personal + 2 references
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/institution is required/i)).toBeInTheDocument();
      expect(screen.getByText(/major.*is required/i)).toBeInTheDocument();
      expect(screen.getByText(/essay is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<StudentMembershipForm onSubmit={mockSuccessfulSubmit} />);

    const emailInput = document.getElementById('personalInfo.email')!;
    await user.type(emailInput, 'invalid-email');
    
    const submitButton = screen.getByText('Submit Application');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('validates GPA range', async () => {
    const user = userEvent.setup();
    render(<StudentMembershipForm onSubmit={mockSuccessfulSubmit} />);

    const gpaInput = screen.getByLabelText(/gpa/i);
    await user.clear(gpaInput);
    await user.type(gpaInput, '5.0');
    
    const submitButton = screen.getByText('Submit Application');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/gpa cannot be greater than 4\.0/i)).toBeInTheDocument();
    });
  });

  it('validates graduation year', async () => {
    const user = userEvent.setup();
    render(<StudentMembershipForm onSubmit={mockSuccessfulSubmit} />);

    const graduationYearInput = screen.getByLabelText(/graduation year/i);
    await user.clear(graduationYearInput);
    await user.type(graduationYearInput, '2020'); // Past year
    
    const submitButton = screen.getByText('Submit Application');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/graduation year must be.*or later/i)).toBeInTheDocument();
    });
  });

  it('validates essay length', async () => {
    const user = userEvent.setup();
    render(<StudentMembershipForm onSubmit={mockSuccessfulSubmit} />);

    const essayInput = screen.getByLabelText(/why do you want to join/i);
    await user.type(essayInput, 'Too short'); // Less than 100 characters
    
    const submitButton = screen.getByText('Submit Application');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/essay must be at least 100 characters/i)).toBeInTheDocument();
    });
  });

  it.skip('validates minimum references', async () => {
    const user = userEvent.setup();
    render(<StudentMembershipForm onSubmit={mockSuccessfulSubmit} />);

    // Fill in the required personal info to avoid other validation errors
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(document.getElementById('personalInfo.email')!, 'john@test.com');
    await user.type(screen.getByLabelText(/phone number/i), '(555) 123-4567');
    
    // Fill in required academic info
    await user.type(screen.getByLabelText(/institution/i), 'Test University');
    await user.type(screen.getByLabelText(/major/i), 'Business');
    
    // Fill in essay
    await user.type(screen.getByLabelText(/why do you want to join/i), 'I want to join NHBEA because I am passionate about business education and want to contribute to the community.');

    // Add a third reference first to enable remove buttons
    const addButton = screen.getByText('+ Add Reference');
    await user.click(addButton);
    
    // Fill in one complete reference
    const referenceNames = screen.getAllByLabelText(/full name/i);
    const referenceEmails = screen.getAllByLabelText(/email address/i).filter(input => 
      input.getAttribute('id')?.includes('references')
    );
    const referenceRelationships = screen.getAllByLabelText(/relationship/i);
    
    await user.type(referenceNames[0], 'Dr. John Smith');
    await user.type(referenceEmails[0], 'john.smith@university.edu');
    await user.type(referenceRelationships[0], 'Professor');
    
    // Now remove two references to have only 1 complete reference (below minimum of 2)
    const removeButtons = screen.getAllByLabelText(/remove reference/i);
    await user.click(removeButtons[1]);
    await user.click(removeButtons[1]); // Click the second button twice since it shifts after first removal

    const submitButton = screen.getByText('Submit Application');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('At least 2 references are required')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    
    mockSuccessfulSubmit.mockResolvedValue({
      success: true,
      message: 'Application submitted successfully'
    });

    render(<StudentMembershipForm onSubmit={mockSuccessfulSubmit} />);

    await fillValidForm(user);

    const submitButton = screen.getByText('Submit Application');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSuccessfulSubmit).toHaveBeenCalledWith(expect.objectContaining({
        personalInfo: expect.objectContaining({
          firstName: validFormData.personalInfo.firstName,
          lastName: validFormData.personalInfo.lastName,
          email: validFormData.personalInfo.email,
          phone: validFormData.personalInfo.phone
        }),
        academicInfo: expect.objectContaining({
          institution: validFormData.academicInfo.institution,
          major: validFormData.academicInfo.major,
          graduationYear: validFormData.academicInfo.graduationYear,
          gpa: validFormData.academicInfo.gpa
        }),
        essay: validFormData.essay,
        references: expect.arrayContaining([
          expect.objectContaining({
            name: validFormData.references[0].name,
            email: validFormData.references[0].email,
            relationship: validFormData.references[0].relationship
          }),
          expect.objectContaining({
            name: validFormData.references[1].name,
            email: validFormData.references[1].email,
            relationship: validFormData.references[1].relationship
          })
        ])
      }));
    });
  });

  it('displays success message after successful submission', async () => {
    const user = userEvent.setup();
    const successMessage = 'Your application has been submitted successfully!';
    
    mockSuccessfulSubmit.mockResolvedValue({
      success: true,
      message: successMessage
    });

    render(<StudentMembershipForm onSubmit={mockSuccessfulSubmit} />);

    await fillValidForm(user);

    const submitButton = screen.getByText('Submit Application');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Application Submitted Successfully!')).toBeInTheDocument();
      expect(screen.getByText(successMessage)).toBeInTheDocument();
      expect(screen.getByText(/what happens next/i)).toBeInTheDocument();
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

    render(<StudentMembershipForm onSubmit={mockFailedSubmit} />);

    await fillValidForm(user);

    const submitButton = screen.getByText('Submit Application');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('disables form during submission', async () => {
    const user = userEvent.setup();
    
    // Mock a slow submission
    mockSuccessfulSubmit.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ success: true, message: 'Success' }), 1000))
    );

    render(<StudentMembershipForm onSubmit={mockSuccessfulSubmit} />);

    await fillValidForm(user);

    const submitButton = screen.getByText('Submit Application');
    await user.click(submitButton);

    // Check that button shows loading state
    expect(screen.getByText(/submitting application/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Check that form inputs are disabled
    expect(screen.getByLabelText(/first name/i)).toBeDisabled();
    expect(document.getElementById('personalInfo.email')).toBeDisabled();
  });

  it('meets accessibility requirements', () => {
    render(<StudentMembershipForm onSubmit={mockSuccessfulSubmit} />);

    // Check for proper labels
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(document.getElementById('personalInfo.email')).toBeInTheDocument();

    // Check for required field indicators
    expect(screen.getByText(/first name \*/i)).toBeInTheDocument();
    expect(screen.getAllByText(/email address \*/i)).toHaveLength(3); // Personal + 2 references

    // Check for proper form structure
    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
    expect(screen.getByText('Submit Application')).toBeInTheDocument();
  });
});