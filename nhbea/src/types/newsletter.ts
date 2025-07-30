export interface NewsletterSubscriber {
  email: string;
  timestamp: Date;
  status: 'active' | 'pending' | 'unsubscribed';
}

export interface NewsletterFormData {
  email: string;
}

export interface NewsletterSubmissionResult {
  success: boolean;
  message: string;
  error?: string;
}