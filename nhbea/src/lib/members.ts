import { db } from './firebase';
import { collection, doc, getDoc, getDocs, query, where, orderBy, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Member, CreateMemberData, UpdateMemberData, LegacyBoardMember } from '@/types/members';

/**
 * Enhanced Members API for NHBEA Phase 1 Implementation
 * Provides comprehensive member management functionality
 */

// Get all active members
export async function getActiveMembers(): Promise<Member[]> {
  try {
    const q = query(
      collection(db, 'members'),
      where('membership.status', '==', 'active'),
      orderBy('personalInfo.lastName')
    );
    const querySnapshot = await getDocs(q);
    
    const members: Member[] = [];
    querySnapshot.forEach((doc) => {
      members.push({
        ...doc.data(),
        metadata: {
          ...doc.data().metadata,
          createdAt: doc.data().metadata?.createdAt?.toDate() || new Date(),
          updatedAt: doc.data().metadata?.updatedAt?.toDate() || new Date(),
          lastLoginAt: doc.data().metadata?.lastLoginAt?.toDate()
        },
        membership: {
          ...doc.data().membership,
          joinDate: doc.data().membership?.joinDate?.toDate() || new Date(),
          renewalDate: doc.data().membership?.renewalDate?.toDate() || new Date()
        }
      } as Member);
    });
    
    return members;
  } catch (error) {
    console.error('Error fetching active members:', error);
    throw new Error('Failed to fetch active members');
  }
}

// Get current board members (backward compatible with existing BoardMembersSection)
export async function getBoardMembers(): Promise<Member[]> {
  try {
    const q = query(
      collection(db, 'members'),
      where('profile.activeBoardMember', '==', true),
      orderBy('profile.boardOrder')
    );
    const querySnapshot = await getDocs(q);
    
    const boardMembers: Member[] = [];
    querySnapshot.forEach((doc) => {
      boardMembers.push({
        ...doc.data(),
        metadata: {
          ...doc.data().metadata,
          createdAt: doc.data().metadata?.createdAt?.toDate() || new Date(),
          updatedAt: doc.data().metadata?.updatedAt?.toDate() || new Date(),
          lastLoginAt: doc.data().metadata?.lastLoginAt?.toDate()
        },
        membership: {
          ...doc.data().membership,
          joinDate: doc.data().membership?.joinDate?.toDate() || new Date(),
          renewalDate: doc.data().membership?.renewalDate?.toDate() || new Date()
        }
      } as Member);
    });
    
    return boardMembers;
  } catch (error) {
    console.error('Error fetching board members:', error);
    throw new Error('Failed to fetch board members');
  }
}

// Get members for public directory (only those who opted in)
export async function getPublicDirectoryMembers(): Promise<Member[]> {
  try {
    const q = query(
      collection(db, 'members'),
      where('membership.status', '==', 'active'),
      where('preferences.directoryListing', '==', true),
      orderBy('personalInfo.lastName')
    );
    const querySnapshot = await getDocs(q);
    
    const members: Member[] = [];
    querySnapshot.forEach((doc) => {
      members.push({
        ...doc.data(),
        metadata: {
          ...doc.data().metadata,
          createdAt: doc.data().metadata?.createdAt?.toDate() || new Date(),
          updatedAt: doc.data().metadata?.updatedAt?.toDate() || new Date(),
          lastLoginAt: doc.data().metadata?.lastLoginAt?.toDate()
        },
        membership: {
          ...doc.data().membership,
          joinDate: doc.data().membership?.joinDate?.toDate() || new Date(),
          renewalDate: doc.data().membership?.renewalDate?.toDate() || new Date()
        }
      } as Member);
    });
    
    return members;
  } catch (error) {
    console.error('Error fetching public directory members:', error);
    throw new Error('Failed to fetch public directory members');
  }
}

// Get a single member by ID
export async function getMemberById(memberId: string): Promise<Member | null> {
  try {
    const docRef = doc(db, 'members', memberId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        metadata: {
          ...data.metadata,
          createdAt: data.metadata?.createdAt?.toDate() || new Date(),
          updatedAt: data.metadata?.updatedAt?.toDate() || new Date(),
          lastLoginAt: data.metadata?.lastLoginAt?.toDate()
        },
        membership: {
          ...data.membership,
          joinDate: data.membership?.joinDate?.toDate() || new Date(),
          renewalDate: data.membership?.renewalDate?.toDate() || new Date()
        }
      } as Member;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching member by ID:', error);
    throw new Error('Failed to fetch member');
  }
}

// Create a new member
export async function createMember(memberData: CreateMemberData): Promise<string> {
  try {
    const now = new Date();
    const memberWithMetadata = {
      ...memberData,
      metadata: {
        createdAt: now,
        updatedAt: now,
        ...memberData.metadata
      }
    };
    
    const docRef = await addDoc(collection(db, 'members'), memberWithMetadata);
    return docRef.id;
  } catch (error) {
    console.error('Error creating member:', error);
    throw new Error('Failed to create member');
  }
}

// Update an existing member
export async function updateMember(memberId: string, updateData: UpdateMemberData): Promise<void> {
  try {
    const docRef = doc(db, 'members', memberId);
    const updateWithMetadata = {
      ...updateData,
      metadata: {
        ...updateData.metadata,
        updatedAt: new Date()
      }
    };
    
    await updateDoc(docRef, updateWithMetadata);
  } catch (error) {
    console.error('Error updating member:', error);
    throw new Error('Failed to update member');
  }
}

// Delete a member (soft delete by setting status to inactive)
export async function deactivateMember(memberId: string): Promise<void> {
  try {
    await updateMember(memberId, {
      membership: { status: 'inactive' },
      metadata: { updatedAt: new Date() }
    });
  } catch (error) {
    console.error('Error deactivating member:', error);
    throw new Error('Failed to deactivate member');
  }
}

// Hard delete a member (use with caution)
export async function deleteMember(memberId: string): Promise<void> {
  try {
    const docRef = doc(db, 'members', memberId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting member:', error);
    throw new Error('Failed to delete member');
  }
}

// Migration utility: Convert legacy board member to new member format
export function convertLegacyBoardMember(legacyMember: LegacyBoardMember): CreateMemberData {
  const nameParts = legacyMember.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  return {
    personalInfo: {
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@nhbea.org`,
    },
    membership: {
      type: 'individual',
      status: 'active',
      joinDate: new Date(),
      renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      membershipYear: new Date().getFullYear().toString(),
      autoRenewal: false
    },
    organization: {
      name: 'NHBEA',
      position: legacyMember.title
    },
    profile: {
      imageURL: legacyMember.imageURL,
      bio: legacyMember.bio,
      activeBoardMember: true,
      boardPosition: legacyMember.title,
      boardOrder: legacyMember.order || 999
    },
    preferences: {
      emailNotifications: true,
      directoryListing: true,
      newsletterSubscription: true
    }
  };
}

// Default fallback members for development/testing
export const defaultMembers: Member[] = [
  {
    personalInfo: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@nhbea.org'
    },
    membership: {
      type: 'individual',
      status: 'active',
      joinDate: new Date('2020-01-01'),
      renewalDate: new Date('2025-12-31'),
      membershipYear: '2025',
      autoRenewal: true
    },
    organization: {
      name: 'Manchester High School',
      position: 'Business Teacher'
    },
    profile: {
      activeBoardMember: true,
      boardPosition: 'President',
      boardOrder: 1,
      bio: 'Sarah has been an advocate for business education for over 15 years, bringing innovative teaching methods to the classroom.'
    },
    preferences: {
      emailNotifications: true,
      directoryListing: true,
      newsletterSubscription: true
    },
    metadata: {
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date(),
      createdBy: 'system'
    }
  },
  {
    personalInfo: {
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@nhbea.org'
    },
    membership: {
      type: 'individual',
      status: 'active',
      joinDate: new Date('2019-06-15'),
      renewalDate: new Date('2025-12-31'),
      membershipYear: '2025',
      autoRenewal: true
    },
    organization: {
      name: 'Nashua Community College',
      position: 'Associate Professor'
    },
    profile: {
      activeBoardMember: true,
      boardPosition: 'Vice President',
      boardOrder: 2,
      bio: 'Michael specializes in entrepreneurship education and has helped launch numerous student business ventures.'
    },
    preferences: {
      emailNotifications: true,
      directoryListing: true,
      newsletterSubscription: true
    },
    metadata: {
      createdAt: new Date('2019-06-15'),
      updatedAt: new Date(),
      createdBy: 'system'
    }
  }
];

// Backward compatibility: Convert new Member to legacy BoardMember format
export function convertToLegacyBoardMember(member: Member): LegacyBoardMember {
  return {
    id: '', // Will be set by the calling function
    name: `${member.personalInfo.firstName} ${member.personalInfo.lastName}`,
    title: member.profile.boardPosition || member.organization.position,
    bio: member.profile.bio || '',
    imageURL: member.profile.imageURL,
    order: member.profile.boardOrder
  };
}