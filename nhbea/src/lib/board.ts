import { db } from './firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { BoardMember } from '@/types/board';

export async function getBoardMembers(): Promise<BoardMember[]> {
  try {
    const q = query(collection(db, 'boardMembers'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const boardMembers: BoardMember[] = [];
    querySnapshot.forEach((doc) => {
      boardMembers.push({
        id: doc.id,
        ...doc.data()
      } as BoardMember);
    });
    
    return boardMembers;
  } catch (error) {
    console.error('Error fetching board members:', error);
    throw new Error('Failed to fetch board members');
  }
}

// Default board members fallback for when Firestore is unavailable
export const defaultBoardMembers: BoardMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'President',
    bio: 'Sarah has been an advocate for business education for over 15 years, bringing innovative teaching methods to the classroom.',
    order: 1
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Vice President',
    bio: 'Michael specializes in entrepreneurship education and has helped launch numerous student business ventures.',
    order: 2
  },
  {
    id: '3',
    name: 'Jennifer Rodriguez',
    title: 'Secretary',
    bio: 'Jennifer focuses on curriculum development and has authored several business education textbooks.',
    order: 3
  },
  {
    id: '4',
    name: 'David Thompson',
    title: 'Treasurer',
    bio: 'David brings financial expertise and has been instrumental in securing funding for educational programs.',
    order: 4
  }
];