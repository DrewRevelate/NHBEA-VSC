import { db } from './firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Sponsor } from '@/types/sponsors';

export async function getSponsors(): Promise<Sponsor[]> {
  try {
    const q = query(collection(db, 'sponsors'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const sponsors: Sponsor[] = [];
    querySnapshot.forEach((doc) => {
      sponsors.push({
        id: doc.id,
        ...doc.data()
      } as Sponsor);
    });
    
    return sponsors;
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    throw new Error('Failed to fetch sponsors');
  }
}

// Default sponsors fallback for when Firestore is unavailable
export const defaultSponsors: Sponsor[] = [
  {
    id: '1',
    name: 'Sample Sponsor 1',
    logoURL: '/placeholder-logo.png',
    website: 'https://example.com',
    order: 1
  },
  {
    id: '2',
    name: 'Sample Sponsor 2',
    logoURL: '/placeholder-logo.png',
    website: 'https://example.com',
    order: 2
  }
];