import { db } from './firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { HallOfFameMember } from '@/types/dataModels';
import { Member } from '@/types/dataModels';

// Enhanced function to get hall of fame members from the members collection
export async function getHallOfFameMembersFromMembers(): Promise<HallOfFameMember[]> {
  try {
    const q = query(
      collection(db, 'members'), 
      where('isHallOfFame', '==', true),
      orderBy('hallOfFameOrder', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    const hallOfFameMembers: HallOfFameMember[] = [];
    querySnapshot.forEach((doc) => {
      const member = { id: doc.id, ...doc.data() } as Member;
      
      // Transform Member to HallOfFameMember format
      const hofMember: HallOfFameMember = {
        id: member.id,
        memberId: member.id,
        name: `${member.firstName} ${member.lastName}`,
        year: member.hallOfFameYear || new Date().getFullYear(),
        awardType: member.hallOfFameAwardType || 'other',
        bio: member.bio || '',
        imageUrl: member.imageUrl,
        achievements: member.achievements,
        order: member.hallOfFameOrder || 999
      };
      
      hallOfFameMembers.push(hofMember);
    });
    
    return hallOfFameMembers;
  } catch (error) {
    console.error('Error fetching hall of fame members from members collection:', error);
    throw new Error('Failed to fetch hall of fame members');
  }
}

// Main function to get hall of fame members
export async function getHallOfFameMembers(): Promise<HallOfFameMember[]> {
  try {
    return await getHallOfFameMembersFromMembers();
  } catch (error) {
    console.error('Error fetching hall of fame members:', error);
    return defaultHallOfFameMembers;
  }
}

// Default hall of fame members fallback for when Firestore is unavailable
export const defaultHallOfFameMembers: HallOfFameMember[] = [
  {
    id: '1',
    name: 'Distinguished Educator',
    year: 2024,
    awardType: 'business_educator_of_the_year',
    bio: 'A dedicated educator who has made significant contributions to business education in New Hampshire.',
    imageUrl: '',
    achievements: ['Teacher of the Year 2023', 'Curriculum Innovation Award'],
    order: 1
  }
];