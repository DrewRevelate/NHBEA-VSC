import { db } from './firebase';
import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { HomepageContent, ContentSection } from '@/types/content';

export async function getHomepageContent(): Promise<HomepageContent | null> {
  try {
    const docRef = doc(db, 'content', 'homepage');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as HomepageContent;
    } else {
      console.warn('No homepage content found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    throw new Error('Failed to fetch homepage content');
  }
}

export async function getContentSections(): Promise<ContentSection[]> {
  try {
    const q = query(collection(db, 'content'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const sections: ContentSection[] = [];
    querySnapshot.forEach((doc) => {
      if (doc.id !== 'homepage') {
        sections.push({
          id: doc.id,
          ...doc.data()
        } as ContentSection);
      }
    });
    
    return sections;
  } catch (error) {
    console.error('Error fetching content sections:', error);
    throw new Error('Failed to fetch content sections');
  }
}

// Default content fallback for when Firestore is unavailable
export const defaultHomepageContent: HomepageContent = {
  heroTitle: "New Hampshire Business Educators Association",
  heroSubtitle: "Promoting excellence in business education throughout New Hampshire",
  missionTitle: "Our Mission",
  missionContent: "The New Hampshire Business Educators Association is dedicated to promoting excellence in business education through professional development, networking, and advocacy for educators across the state.",
  aboutTitle: "About NHBEA",
  aboutContent: "Founded to support business educators in New Hampshire, NHBEA provides resources, professional development opportunities, and a community for educators to share best practices and advance the field of business education."
};