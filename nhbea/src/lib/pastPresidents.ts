import { db } from './firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { PastPresident } from '@/types/pastPresidents';

export async function getPastPresidents(): Promise<PastPresident[]> {
  try {
    const q = query(collection(db, 'pastPresidents'), orderBy('order', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const pastPresidents: PastPresident[] = [];
    querySnapshot.forEach((doc) => {
      pastPresidents.push({
        id: doc.id,
        ...doc.data()
      } as PastPresident);
    });
    
    return pastPresidents;
  } catch (error) {
    console.error('Error fetching past presidents:', error);
    throw new Error('Failed to fetch past presidents');
  }
}

// Default past presidents fallback for when Firestore is unavailable
export const defaultPastPresidents: PastPresident[] = [
  {
    id: '1',
    name: 'Robert Williams',
    term: '2022-2023',
    order: 1
  },
  {
    id: '2',
    name: 'Maria Garcia',
    term: '2021-2022',
    order: 2
  },
  {
    id: '3',
    name: 'James Smith',
    term: '2020-2021',
    order: 3
  },
  {
    id: '4',
    name: 'Patricia Davis',
    term: '2019-2020',
    order: 4
  },
  {
    id: '5',
    name: 'Christopher Brown',
    term: '2018-2019',
    order: 5
  }
];