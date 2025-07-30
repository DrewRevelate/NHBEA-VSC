import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConferenceFAQ from './ConferenceFAQ';
import { ConferenceFAQ as ConferenceFAQType } from '@/types/conference';

const mockFAQs: ConferenceFAQType[] = [
  {
    id: 'faq-1',
    category: 'registration',
    question: 'How do I register for the conference?',
    answer: 'You can register online through our registration portal. Registration is $65 for all attendees.',
    order: 1,
    tags: ['registration', 'cost', 'pricing'],
    lastUpdated: new Date('2025-07-15')
  },
  {
    id: 'faq-2',
    category: 'venue',
    question: 'Where is the conference being held?',
    answer: 'The conference will be held at Manchester Community College in Manchester, NH. The venue offers modern facilities and is easily accessible by car and public transportation.',
    order: 2,
    tags: ['location', 'venue', 'accessibility'],
    lastUpdated: new Date('2025-07-10')
  },
  {
    id: 'faq-3',
    category: 'sessions',
    question: 'What types of sessions are available?',
    answer: 'We offer keynote presentations, workshops, panel discussions, and networking sessions.\n\nAll sessions are designed to provide practical insights and actionable strategies for business education.',
    order: 3,
    tags: ['sessions', 'workshops', 'keynote'],
    lastUpdated: new Date('2025-07-12')
  },
  {
    id: 'faq-4',
    category: 'accommodation',
    question: 'Are there hotel discounts available?',
    answer: 'Yes, we have negotiated special rates with nearby hotels. Check our accommodation page for details and booking codes.',
    order: 4,
    tags: ['hotels', 'discounts', 'accommodation'],
    lastUpdated: new Date('2025-07-08')
  },
  {
    id: 'faq-5',
    category: 'general',
    question: 'What should I bring to the conference?',
    answer: 'Bring a laptop or tablet for interactive sessions, business cards for networking, and comfortable shoes for walking between sessions.',
    order: 5,
    tags: ['preparation', 'networking', 'equipment'],
    lastUpdated: new Date('2025-07-05')
  }
];

// Mock alert function
const mockAlert = jest.fn();
global.alert = mockAlert;

describe('ConferenceFAQ', () => {
  const defaultProps = {
    faqs: mockFAQs,
    className: 'test-faq-section'
  };

  beforeEach(() => {
    mockAlert.mockClear();
  });

  it('renders the FAQ section with title', () => {
    render(<ConferenceFAQ {...defaultProps} />);

    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(screen.getByText(/Find answers to common questions about our conference/)).toBeInTheDocument();
  });

  it('displays all FAQ questions', () => {
    render(<ConferenceFAQ {...defaultProps} />);

    expect(screen.getByText('How do I register for the conference?')).toBeInTheDocument();
    expect(screen.getByText('Where is the conference being held?')).toBeInTheDocument();
    expect(screen.getByText('What types of sessions are available?')).toBeInTheDocument();
    expect(screen.getByText('Are there hotel discounts available?')).toBeInTheDocument();
    expect(screen.getByText('What should I bring to the conference?')).toBeInTheDocument();
  });

  it('shows category badges for each FAQ', () => {
    render(<ConferenceFAQ {...defaultProps} />);

    // Categories are shown in lowercase in badges (multiple instances: badge, tag, and stats)
    expect(screen.getAllByText('registration')).toHaveLength(3); // Badge, tag, and stats
    expect(screen.getAllByText('venue')).toHaveLength(2); // Badge and stats
    expect(screen.getAllByText('sessions')).toHaveLength(3); // Badge, tag, and stats
    expect(screen.getAllByText('accommodation')).toHaveLength(2); // Badge and stats
    expect(screen.getAllByText('general')).toHaveLength(2); // Badge and stats
  });

  it('displays FAQ tags', () => {
    render(<ConferenceFAQ {...defaultProps} />);

    // Tags are shown separately from category badges
    expect(screen.getAllByText('registration')).toHaveLength(3); // Badge, tag, and stats
    expect(screen.getByText('cost')).toBeInTheDocument();
    expect(screen.getByText('location')).toBeInTheDocument();
    expect(screen.getAllByText('sessions')).toHaveLength(3); // Badge, tag, and stats
  });

  it('expands FAQ when clicked', async () => {
    render(<ConferenceFAQ {...defaultProps} />);

    const faqButton = screen.getByText('How do I register for the conference?');
    fireEvent.click(faqButton);

    await waitFor(() => {
      expect(screen.getByText(/You can register online through our registration portal/)).toBeInTheDocument();
      expect(screen.getByText(/Registration is \$65 for all attendees/)).toBeInTheDocument();
    });
  });

  it('collapses FAQ when clicked again', async () => {
    render(<ConferenceFAQ {...defaultProps} />);

    const faqButton = screen.getByText('How do I register for the conference?');
    
    // Expand
    fireEvent.click(faqButton);
    await waitFor(() => {
      expect(screen.getByText(/You can register online through our registration portal/)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Collapse
    fireEvent.click(faqButton);
    await waitFor(() => {
      expect(screen.queryByText(/You can register online through our registration portal/)).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows last updated date for FAQs', async () => {
    render(<ConferenceFAQ {...defaultProps} />);

    const faqButton = screen.getByText('How do I register for the conference?');
    fireEvent.click(faqButton);

    await waitFor(() => {
      expect(screen.getByText(/Last updated: July 15, 2025/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles multi-paragraph answers correctly', async () => {
    render(<ConferenceFAQ {...defaultProps} />);

    const faqButton = screen.getByText('What types of sessions are available?');
    fireEvent.click(faqButton);

    await waitFor(() => {
      expect(screen.getByText(/We offer keynote presentations, workshops, panel discussions/)).toBeInTheDocument();
      expect(screen.getByText(/All sessions are designed to provide practical insights/)).toBeInTheDocument();
    });
  });

  it('filters FAQs by search term', async () => {
    render(<ConferenceFAQ {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search FAQs...');
    fireEvent.change(searchInput, { target: { value: 'register' } });

    await waitFor(() => {
      expect(screen.getByText('How do I register for the conference?')).toBeInTheDocument();
      expect(screen.queryByText('Where is the conference being held?')).not.toBeInTheDocument();
      expect(screen.getByText('Showing 1 of 5 questions')).toBeInTheDocument();
    });
  });

  it('filters FAQs by category', async () => {
    render(<ConferenceFAQ {...defaultProps} />);

    const categorySelect = screen.getByDisplayValue('All Categories (5)');
    fireEvent.change(categorySelect, { target: { value: 'venue' } });

    await waitFor(() => {
      expect(screen.getByText('Where is the conference being held?')).toBeInTheDocument();
      expect(screen.queryByText('How do I register for the conference?')).not.toBeInTheDocument();
      expect(screen.getByText('Showing 1 of 5 questions')).toBeInTheDocument();
    });
  });

  it('shows category counts in dropdown', () => {
    render(<ConferenceFAQ {...defaultProps} />);

    expect(screen.getByText('All Categories (5)')).toBeInTheDocument();
    
    // Find the select element and check its options
    const categorySelect = screen.getByDisplayValue('All Categories (5)');
    expect(categorySelect).toBeInTheDocument();
  });

  it('expands all FAQs when "Expand All" is clicked', async () => {
    render(<ConferenceFAQ {...defaultProps} />);

    const expandAllButton = screen.getByText('Expand All');
    fireEvent.click(expandAllButton);

    await waitFor(() => {
      expect(screen.getByText(/You can register online through our registration portal/)).toBeInTheDocument();
      expect(screen.getByText(/The conference will be held at the New Hampshire Convention Center/)).toBeInTheDocument();
      expect(screen.getByText(/We offer keynote presentations, workshops/)).toBeInTheDocument();
    });
  });

  it('collapses all FAQs when "Collapse All" is clicked', async () => {
    render(<ConferenceFAQ {...defaultProps} />);

    // First expand all
    const expandAllButton = screen.getByText('Expand All');
    fireEvent.click(expandAllButton);

    await waitFor(() => {
      expect(screen.getByText(/You can register online through our registration portal/)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Then collapse all
    const collapseAllButton = screen.getByText('Collapse All');
    fireEvent.click(collapseAllButton);

    await waitFor(() => {
      expect(screen.queryByText(/You can register online through our registration portal/)).not.toBeInTheDocument();
      expect(screen.queryByText(/The conference will be held at the New Hampshire Convention Center/)).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('opens FAQ submission form when "Ask Question" is clicked', async () => {
    render(<ConferenceFAQ {...defaultProps} />);

    const askQuestionButton = screen.getByText('Ask Question');
    fireEvent.click(askQuestionButton);

    await waitFor(() => {
      expect(screen.getByText('Ask a Question')).toBeInTheDocument();
      expect(screen.getByText(/Can't find the answer you're looking for/)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('What would you like to know about the conference?')).toBeInTheDocument();
    });
  });

  it('closes FAQ submission form when close button is clicked', async () => {
    render(<ConferenceFAQ {...defaultProps} />);

    // Open form
    const askQuestionButton = screen.getByText('Ask Question');
    fireEvent.click(askQuestionButton);

    await waitFor(() => {
      expect(screen.getByText('Ask a Question')).toBeInTheDocument();
    });

    // Close form - find the X button by looking for the SVG path
    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find(button => 
      button.querySelector('path[d="M6 18L18 6M6 6l12 12"]')
    );
    
    if (closeButton) {
      fireEvent.click(closeButton);
    }

    await waitFor(() => {
      expect(screen.queryByText('Ask a Question')).not.toBeInTheDocument();
    });
  });

  it('submits FAQ question and shows success message', async () => {
    render(<ConferenceFAQ {...defaultProps} />);

    // Open form
    const askQuestionButton = screen.getByText('Ask Question');
    fireEvent.click(askQuestionButton);

    await waitFor(() => {
      expect(screen.getByText('Ask a Question')).toBeInTheDocument();
    });

    // Fill and submit form
    const questionInput = screen.getByPlaceholderText('What would you like to know about the conference?');
    fireEvent.change(questionInput, { target: { value: 'What time does the conference start?' } });

    const submitButton = screen.getByText('Submit Question');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Thank you for your question! We\'ll review it and add it to our FAQ if appropriate.');
      expect(screen.queryByText('Ask a Question')).not.toBeInTheDocument();
    });
  });

  it('disables submit button when question is empty', async () => {
    render(<ConferenceFAQ {...defaultProps} />);

    // Open form
    const askQuestionButton = screen.getByText('Ask Question');
    fireEvent.click(askQuestionButton);

    await waitFor(() => {
      const submitButton = screen.getByText('Submit Question');
      expect(submitButton).toBeDisabled();
    });
  });

  it('shows category statistics', () => {
    render(<ConferenceFAQ {...defaultProps} />);

    expect(screen.getByText('FAQ Categories')).toBeInTheDocument();
    
    // Check for category counts in the stats section
    const categoryButtons = screen.getAllByText('1'); // Each category has 1 FAQ
    expect(categoryButtons.length).toBeGreaterThan(0);
  });

  it('filters by category when category stat button is clicked', async () => {
    render(<ConferenceFAQ {...defaultProps} />);

    // Find and click a category button in the stats section
    const categoryStatsSection = screen.getByText('FAQ Categories').closest('div');
    const registrationButton = categoryStatsSection?.querySelector('button');
    
    if (registrationButton) {
      fireEvent.click(registrationButton);
      
      await waitFor(() => {
        expect(screen.getByText('Showing 1 of 5 questions')).toBeInTheDocument();
      });
    }
  });

  it('shows "no FAQs found" message when search has no results', async () => {
    render(<ConferenceFAQ {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search FAQs...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent search term' } });

    await waitFor(() => {
      expect(screen.getByText('No FAQs found')).toBeInTheDocument();
      expect(screen.getByText(/No questions match "nonexistent search term"/)).toBeInTheDocument();
      expect(screen.getByText('Clear Search')).toBeInTheDocument();
    });
  });

  it('clears search when "Clear Search" button is clicked', async () => {
    render(<ConferenceFAQ {...defaultProps} />);

    // Perform search with no results
    const searchInput = screen.getByPlaceholderText('Search FAQs...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.getByText('No FAQs found')).toBeInTheDocument();
    });

    // Clear search
    const clearSearchButton = screen.getByText('Clear Search');
    fireEvent.click(clearSearchButton);

    await waitFor(() => {
      expect(screen.getByText('How do I register for the conference?')).toBeInTheDocument();
      expect(screen.getByText('Showing 5 of 5 questions')).toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    const { container } = render(<ConferenceFAQ {...defaultProps} />);
    
    expect(container.firstChild).toHaveClass('test-faq-section');
  });

  it('handles empty FAQ list', () => {
    render(<ConferenceFAQ faqs={[]} />);

    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(screen.getByText('No FAQs found')).toBeInTheDocument();
  });

  it('searches through FAQ tags', async () => {
    render(<ConferenceFAQ {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search FAQs...');
    
    // Verify initial state
    expect(screen.getByText('How do I register for the conference?')).toBeInTheDocument();
    expect(screen.getByText('What should I bring to the conference?')).toBeInTheDocument();
    
    fireEvent.change(searchInput, { target: { value: 'networking' } });

    // Check that search value is set
    expect(searchInput).toHaveValue('networking');

    // Check that filtering worked - the FAQ with 'networking' tag should be visible
    expect(screen.getByText('What should I bring to the conference?')).toBeInTheDocument();
    expect(screen.queryByText('How do I register for the conference?')).not.toBeInTheDocument();
    // The text is split across elements, so use a regex
    expect(screen.getByText(/Showing \d+ of 5 questions/)).toBeInTheDocument();
  });

  it('searches through FAQ answers', async () => {
    render(<ConferenceFAQ {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search FAQs...');
    fireEvent.change(searchInput, { target: { value: 'Convention Center' } });

    await waitFor(() => {
      expect(screen.getByText('Where is the conference being held?')).toBeInTheDocument();
      expect(screen.queryByText('How do I register for the conference?')).not.toBeInTheDocument();
      expect(screen.getByText('Showing 1 of 5 questions')).toBeInTheDocument();
    });
  });

  it('disables expand all button when no FAQs are visible', async () => {
    render(<ConferenceFAQ {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search FAQs...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      const expandAllButton = screen.getByText('Expand All');
      expect(expandAllButton).toBeDisabled();
    });
  });

  it('disables collapse all button when no FAQs are expanded', () => {
    render(<ConferenceFAQ {...defaultProps} />);

    const collapseAllButton = screen.getByText('Collapse All');
    expect(collapseAllButton).toBeDisabled();
  });

  it('displays correct question count in category select', () => {
    render(<ConferenceFAQ {...defaultProps} />);

    const categorySelect = screen.getByDisplayValue('All Categories (5)');
    expect(categorySelect).toBeInTheDocument();
  });
});