import { db } from './firebase';
import { collection, doc, getDoc, setDoc, updateDoc, getDocs } from 'firebase/firestore';
import { NewsletterSubscriber, NewsletterSubmissionResult } from '@/types/newsletter';

/**
 * Adds a new newsletter subscriber to Firestore
 * Uses email as document ID to prevent duplicates
 * 
 * @param email - The email address to subscribe
 * @returns Promise<NewsletterSubmissionResult>
 */
export async function addNewsletterSubscriber(email: string): Promise<NewsletterSubmissionResult> {
  try {
    // Normalize email address
    const normalizedEmail = email.toLowerCase().trim();
    
    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return {
        success: false,
        message: 'Please enter a valid email address.',
        error: 'Invalid email format'
      };
    }

    // Create subscriber document
    const subscriberData: NewsletterSubscriber = {
      email: normalizedEmail,
      timestamp: new Date(),
      status: 'active'
    };

    // Use email as document ID to prevent duplicates
    const docRef = doc(db, 'newsletterSubscribers', normalizedEmail);
    
    // Check if email already exists
    const existingDoc = await getDoc(docRef);
    if (existingDoc.exists()) {
      const existingData = existingDoc.data() as NewsletterSubscriber;
      if (existingData.status === 'active') {
        return {
          success: false,
          message: 'You are already subscribed to our newsletter.',
          error: 'Email already subscribed'
        };
      } else {
        // Reactivate subscription
        await updateDoc(docRef, {
          status: 'active',
          timestamp: new Date()
        });
        return {
          success: true,
          message: 'Welcome back! Your newsletter subscription has been reactivated.'
        };
      }
    }

    // Add new subscriber
    await setDoc(docRef, subscriberData);

    return {
      success: true,
      message: 'Thank you for subscribing! You will receive our latest updates.'
    };

  } catch (error) {
    console.error('Error adding newsletter subscriber:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Gets all newsletter subscribers (for admin use)
 * 
 * @returns Promise<NewsletterSubscriber[]>
 */
export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const snapshot = await getDocs(collection(db, 'newsletterSubscribers'));
    return snapshot.docs.map(doc => doc.data() as NewsletterSubscriber);
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return [];
  }
}

/**
 * Unsubscribes an email from the newsletter
 * 
 * @param email - The email address to unsubscribe
 * @returns Promise<NewsletterSubmissionResult>
 */
export async function unsubscribeNewsletter(email: string): Promise<NewsletterSubmissionResult> {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const docRef = doc(db, 'newsletterSubscribers', normalizedEmail);
    
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return {
        success: false,
        message: 'Email address not found in our newsletter list.',
        error: 'Email not found'
      };
    }

    await updateDoc(docRef, {
      status: 'unsubscribed',
      timestamp: new Date()
    });

    return {
      success: true,
      message: 'You have been successfully unsubscribed from our newsletter.'
    };

  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}