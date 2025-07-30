import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewsletterSignup from './NewsletterSignup';
import { addNewsletterSubscriber } from '@/lib/newsletter';

// Mock the newsletter server action
jest.mock('@/lib/newsletter', () => ({
  addNewsletterSubscriber: jest.fn(),
}));

const mockAddNewsletterSubscriber = addNewsletterSubscriber as jest.MockedFunction<typeof addNewsletterSubscriber>;

describe('NewsletterSignup Component', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders newsletter signup form with all elements', () => {
      render(<NewsletterSignup />);

      expect(screen.getByRole('region', { name: /newsletter subscription/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /stay updated/i })).toBeInTheDocument();
      expect(screen.getByText(/subscribe to our newsletter/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /subscribe to newsletter/i })).toBeInTheDocument();
      expect(screen.getByText(/we respect your privacy/i)).toBeInTheDocument();
    });

    it('renders with compact variant', () => {
      render(<NewsletterSignup variant="compact" />);

      const heading = screen.getByRole('heading', { name: /stay updated/i });
      expect(heading).toHaveClass('text-xl');
    });

    it('renders with default variant', () => {
      render(<NewsletterSignup variant="default" />);

      const heading = screen.getByRole('heading', { name: /stay updated/i });
      expect(heading).toHaveClass('text-2xl', 'lg:text-3xl');
    });

    it('applies custom className', () => {
      render(<NewsletterSignup className="custom-class" />);

      const section = screen.getByRole('region', { name: /newsletter subscription/i });
      expect(section).toHaveClass('custom-class');
    });
  });

  describe('Form Validation', () => {
    it('shows validation error for empty email', async () => {
      const user = userEvent.setup();
      render(<NewsletterSignup />);

      const submitButton = screen.getByRole('button', { name: /subscribe to newsletter/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('shows validation error for invalid email format', async () => {
      const user = userEvent.setup();
      render(<NewsletterSignup />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'invalid-email');

      const submitButton = screen.getByRole('button', { name: /subscribe to newsletter/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      });
    });

    it('shows validation error for email that is too long', async () => {
      const user = userEvent.setup();
      render(<NewsletterSignup />);

      const longEmail = 'a'.repeat(250) + '@example.com';
      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, longEmail);

      const submitButton = screen.getByRole('button', { name: /subscribe to newsletter/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email is too long/i)).toBeInTheDocument();
      });
    });

    it('validates email format correctly', async () => {
      const user = userEvent.setup();
      render(<NewsletterSignup />);

      const emailInput = screen.getByLabelText(/email address/i);
      
      // Test valid email
      await user.clear(emailInput);
      await user.type(emailInput, 'valid@example.com');

      // Should not show validation error
      expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('submits form successfully with valid email', async () => {
      const user = userEvent.setup();
      
      mockAddNewsletterSubscriber.mockResolvedValueOnce({
        success: true,
        message: 'Thank you for subscribing! You will receive our latest updates.',
      });

      render(<NewsletterSignup />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /subscribe to newsletter/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAddNewsletterSubscriber).toHaveBeenCalledWith('test@example.com');
      });

      await waitFor(() => {
        expect(screen.getByText(/thank you for subscribing/i)).toBeInTheDocument();
      });

      // Form should be cleared after successful submission
      expect(emailInput).toHaveValue('');
    });

    it('shows loading state during submission', async () => {
      const user = userEvent.setup();
      
      let resolvePromise: (value: any) => void;
      const subscriberPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      
      mockAddNewsletterSubscriber.mockReturnValueOnce(subscriberPromise as Promise<any>);

      render(<NewsletterSignup />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /subscribe to newsletter/i });
      await user.click(submitButton);

      // Check loading state
      await waitFor(() => {
        expect(screen.getByText('Subscribing...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /subscribing to newsletter/i })).toBeDisabled();
      });

      // Resolve the promise
      resolvePromise!({
        success: true,
        message: 'Success!',
      });

      await waitFor(() => {
        expect(screen.queryByText('Subscribing...')).not.toBeInTheDocument();
      });
    });

    it('handles server error response', async () => {
      const user = userEvent.setup();
      
      mockAddNewsletterSubscriber.mockResolvedValueOnce({
        success: false,
        message: 'You are already subscribed to our newsletter.',
        error: 'Email already subscribed',
      });

      render(<NewsletterSignup />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'existing@example.com');

      const submitButton = screen.getByRole('button', { name: /subscribe to newsletter/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/you are already subscribed/i)).toBeInTheDocument();
      });

      // Form should not be cleared on error
      expect(emailInput).toHaveValue('existing@example.com');
    });

    it('handles network error', async () => {
      const user = userEvent.setup();
      
      mockAddNewsletterSubscriber.mockRejectedValueOnce(new Error('Network error'));

      render(<NewsletterSignup />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /subscribe to newsletter/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
    });

    it('disables form elements during submission', async () => {
      const user = userEvent.setup();
      
      let resolvePromise: (value: any) => void;
      const subscriberPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      
      mockAddNewsletterSubscriber.mockReturnValueOnce(subscriberPromise as Promise<any>);

      render(<NewsletterSignup />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /subscribe to newsletter/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(emailInput).toBeDisabled();
        expect(submitButton).toBeDisabled();
      });

      // Resolve the promise
      resolvePromise!({
        success: true,
        message: 'Success!',
      });

      await waitFor(() => {
        expect(emailInput).toBeEnabled();
        expect(submitButton).toBeEnabled();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<NewsletterSignup />);

      expect(screen.getByRole('region', { name: /newsletter subscription/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /subscribe to newsletter/i })).toBeInTheDocument();
    });

    it('associates error messages with form field', async () => {
      const user = userEvent.setup();
      render(<NewsletterSignup />);

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole('button', { name: /subscribe to newsletter/i });
      
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/email is required/i);
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveAttribute('role', 'alert');
        expect(emailInput).toHaveAttribute('aria-invalid', 'true');
        expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');
      });
    });

    it('announces status messages with proper roles', async () => {
      const user = userEvent.setup();
      
      mockAddNewsletterSubscriber.mockResolvedValueOnce({
        success: true,
        message: 'Thank you for subscribing!',
      });

      render(<NewsletterSignup />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /subscribe to newsletter/i });
      await user.click(submitButton);

      await waitFor(() => {
        const statusMessage = screen.getByText(/thank you for subscribing/i);
        expect(statusMessage.closest('div')).toHaveAttribute('role', 'status');
        expect(statusMessage.closest('div')).toHaveAttribute('aria-live', 'polite');
      });
    });

    it('announces error messages with alert role', async () => {
      const user = userEvent.setup();
      
      mockAddNewsletterSubscriber.mockResolvedValueOnce({
        success: false,
        message: 'Error occurred',
      });

      render(<NewsletterSignup />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /subscribe to newsletter/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/error occurred/i);
        expect(errorMessage.closest('div')).toHaveAttribute('role', 'alert');
      });
    });
  });

  describe('Responsive Design', () => {
    it('renders responsive layout classes', () => {
      render(<NewsletterSignup />);

      const form = screen.getByRole('form');
      const flexContainer = form.querySelector('.flex');
      
      expect(flexContainer).toHaveClass('flex-col', 'sm:flex-row');
    });

    it('applies responsive text sizing', () => {
      render(<NewsletterSignup />);

      const heading = screen.getByRole('heading', { name: /stay updated/i });
      expect(heading).toHaveClass('text-2xl', 'lg:text-3xl');
    });
  });
});