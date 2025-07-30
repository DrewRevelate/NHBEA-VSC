import { db } from './firebase';
import { collection, getDocs, addDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { Member, Organization, Conference, ConferenceRegistrant } from '@/types/dataModels';
import { LegacyBoardMember } from '@/types/members';

/**
 * Data Migration Utilities for NHBEA CMS Refactoring
 * These functions help migrate from old data structure to new enhanced data models
 */

// Migration function to create organizations from existing member data
export async function migrateToOrganizations(): Promise<void> {
  try {
    console.log('Starting organization migration...');
    
    // Get all existing members to extract unique organizations
    const membersSnapshot = await getDocs(collection(db, 'members'));
    const organizationMap = new Map<string, Organization>();
    
    membersSnapshot.forEach((doc) => {
      const memberData = doc.data();
      
      // Extract organization info from old member structure
      let organizationName = '';
      if (memberData.institution) {
        organizationName = memberData.institution;
      } else if (memberData.organization?.name) {
        organizationName = memberData.organization.name;
      }
      
      if (organizationName && !organizationMap.has(organizationName)) {
        const organization: Organization = {
          id: '', // Will be set by Firestore
          name: organizationName,
          type: 'school', // Default, can be updated later
          address: memberData.organization?.address || undefined,
          contact: {
            email: memberData.organization?.email,
            website: memberData.organization?.website
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          notes: `Migrated from member data on ${new Date().toISOString()}`
        };
        
        organizationMap.set(organizationName, organization);
      }
    });
    
    // Create organizations collection
    const organizationIds = new Map<string, string>();
    for (const [name, org] of organizationMap) {
      const docRef = await addDoc(collection(db, 'organizations'), org);
      organizationIds.set(name, docRef.id);
      console.log(`Created organization: ${name} with ID: ${docRef.id}`);
    }
    
    console.log(`Migration complete: Created ${organizationIds.size} organizations`);
    
    // Return the mapping for use in member migration
    return organizationIds;
  } catch (error) {
    console.error('Error migrating organizations:', error);
    throw new Error('Failed to migrate organizations');
  }
}

// Migration function to update members with organization references and board flags
export async function migrateMembersToNewSchema(organizationIds?: Map<string, string>): Promise<void> {
  try {
    console.log('Starting member migration...');
    
    // If no organization IDs provided, get them from existing organizations
    if (!organizationIds) {
      const orgsSnapshot = await getDocs(collection(db, 'organizations'));
      organizationIds = new Map();
      orgsSnapshot.forEach((doc) => {
        const orgData = doc.data();
        organizationIds!.set(orgData.name, doc.id);
      });
    }
    
    const membersSnapshot = await getDocs(collection(db, 'members'));
    let updatedCount = 0;
    
    for (const memberDoc of membersSnapshot.docs) {
      const memberData = memberDoc.data();
      const updates: Partial<Member> = {};
      
      // Map organization reference
      let organizationName = '';
      if (memberData.institution) {
        organizationName = memberData.institution;
      } else if (memberData.organization?.name) {
        organizationName = memberData.organization.name;
      }
      
      if (organizationName && organizationIds.has(organizationName)) {
        updates.organizationId = organizationIds.get(organizationName)!;
      }
      
      // Determine if member is board member based on existing data
      if (memberData.profile?.activeBoardMember || memberData.profile?.boardPosition) {
        updates.isBoardMember = true;
        updates.boardPosition = memberData.profile?.boardPosition || 'Board Member';
        updates.boardStartDate = new Date(); // Default, can be updated later
      } else {
        updates.isBoardMember = false;
      }
      
      // Update member number format if needed
      if (!memberData.memberNumber) {
        updates.memberNumber = `NHBEA-${new Date().getFullYear()}-${String(updatedCount + 1).padStart(4, '0')}`;
      }
      
      // Ensure required fields exist
      if (!memberData.status) {
        updates.status = memberData.membership?.status || 'active';
      }
      
      if (!memberData.membershipType) {
        updates.membershipType = memberData.membership?.type || 'professional';
      }
      
      // Update communication preferences
      if (!memberData.communicationPreferences) {
        updates.communicationPreferences = {
          newsletter: memberData.preferences?.newsletterSubscription || true,
          updates: memberData.preferences?.emailNotifications || true,
          events: true,
          mailings: memberData.preferences?.directoryListing || false
        };
      }
      
      // Add updatedAt timestamp
      updates.updatedAt = new Date();
      
      // Apply updates
      if (Object.keys(updates).length > 0) {
        await updateDoc(doc(db, 'members', memberDoc.id), updates);
        updatedCount++;
        console.log(`Updated member: ${memberData.firstName} ${memberData.lastName}`);
      }
    }
    
    console.log(`Migration complete: Updated ${updatedCount} members`);
  } catch (error) {
    console.error('Error migrating members:', error);
    throw new Error('Failed to migrate members');
  }
}

// Migration function to update conferences with virtual URL support
export async function migrateConferencesToNewSchema(): Promise<void> {
  try {
    console.log('Starting conference migration...');
    
    const conferencesSnapshot = await getDocs(collection(db, 'conference'));
    let updatedCount = 0;
    
    for (const conferenceDoc of conferencesSnapshot.docs) {
      const conferenceData = conferenceDoc.data();
      const updates: Partial<Conference> = {};
      
      // Add virtual conference support
      if (!conferenceData.hasOwnProperty('isVirtual')) {
        updates.isVirtual = false; // Default to in-person
      }
      
      // Ensure proper date fields
      if (conferenceData.date && !conferenceData.startDate) {
        updates.startDate = conferenceData.date;
        updates.endDate = conferenceData.date; // Same day by default
      }
      
      // Add missing fields
      if (!conferenceData.timezone) {
        updates.timezone = 'America/New_York'; // Default to Eastern Time
      }
      
      if (!conferenceData.currency) {
        updates.currency = 'USD';
      }
      
      if (!conferenceData.isRegistrationOpen) {
        updates.isRegistrationOpen = true;
      }
      
      if (!conferenceData.isActive) {
        updates.isActive = true;
      }
      
      // Add timestamps if missing
      if (!conferenceData.createdAt) {
        updates.createdAt = new Date();
      }
      
      updates.updatedAt = new Date();
      
      // Apply updates
      if (Object.keys(updates).length > 0) {
        await updateDoc(doc(db, 'conference', conferenceDoc.id), updates);
        updatedCount++;
        console.log(`Updated conference: ${conferenceData.title || 'Untitled'}`);
      }
    }
    
    console.log(`Migration complete: Updated ${updatedCount} conferences`);
  } catch (error) {
    console.error('Error migrating conferences:', error);
    throw new Error('Failed to migrate conferences');
  }
}

// Migration function to update registrants with proper references
export async function migrateRegistrantsToNewSchema(): Promise<void> {
  try {
    console.log('Starting registrant migration...');
    
    // Get all members for reference mapping
    const membersSnapshot = await getDocs(collection(db, 'members'));
    const memberEmailMap = new Map<string, string>();
    
    membersSnapshot.forEach((doc) => {
      const memberData = doc.data();
      if (memberData.email) {
        memberEmailMap.set(memberData.email.toLowerCase(), doc.id);
      }
    });
    
    const registrantsSnapshot = await getDocs(collection(db, 'registrants'));
    let updatedCount = 0;
    
    for (const registrantDoc of registrantsSnapshot.docs) {
      const registrantData = registrantDoc.data();
      const updates: Partial<ConferenceRegistrant> = {};
      
      // Try to link to member if email matches
      if (registrantData.email) {
        const memberId = memberEmailMap.get(registrantData.email.toLowerCase());
        if (memberId) {
          updates.memberId = memberId;
        } else {
          // Store as guest info
          updates.guestInfo = {
            firstName: registrantData.firstName || '',
            lastName: registrantData.lastName || '',
            email: registrantData.email,
            phone: registrantData.phone,
            organization: registrantData.organization,
            position: registrantData.position
          };
        }
      }
      
      // Ensure required fields
      if (!registrantData.registrationStatus) {
        updates.registrationStatus = 'confirmed';
      }
      
      if (!registrantData.paymentStatus) {
        updates.paymentStatus = registrantData.paid ? 'completed' : 'pending';
      }
      
      if (!registrantData.currency) {
        updates.currency = 'USD';
      }
      
      if (!registrantData.checkedIn) {
        updates.checkedIn = false;
      }
      
      // Add timestamps if missing
      if (!registrantData.createdAt) {
        updates.createdAt = registrantData.registrationDate || new Date();
      }
      
      updates.updatedAt = new Date();
      
      // Apply updates
      if (Object.keys(updates).length > 0) {
        await updateDoc(doc(db, 'registrants', registrantDoc.id), updates);
        updatedCount++;
        console.log(`Updated registrant: ${registrantData.firstName} ${registrantData.lastName}`);
      }
    }
    
    console.log(`Migration complete: Updated ${updatedCount} registrants`);
  } catch (error) {
    console.error('Error migrating registrants:', error);
    throw new Error('Failed to migrate registrants');
  }
}

// Main migration function to run all migrations in order
export async function runFullDataMigration(): Promise<void> {
  try {
    console.log('Starting full data migration...');
    
    // Step 1: Create organizations
    const organizationIds = await migrateToOrganizations();
    
    // Step 2: Update members with organization references and board flags
    await migrateMembersToNewSchema(organizationIds);
    
    // Step 3: Update conferences with virtual support
    await migrateConferencesToNewSchema();
    
    // Step 4: Update registrants with proper references
    await migrateRegistrantsToNewSchema();
    
    console.log('Full data migration completed successfully!');
  } catch (error) {
    console.error('Error during full migration:', error);
    throw new Error('Full data migration failed');
  }
}

// Utility function to migrate legacy board members to new member structure
export async function migrateLegacyBoardMembers(): Promise<void> {
  try {
    console.log('Starting legacy board member migration...');
    
    const boardMembersSnapshot = await getDocs(collection(db, 'boardMembers'));
    let migratedCount = 0;
    
    for (const boardMemberDoc of boardMembersSnapshot.docs) {
      const legacyData = boardMemberDoc.data() as LegacyBoardMember;
      
      // Check if member already exists in members collection
      const existingMemberQuery = query(
        collection(db, 'members'),
        where('email', '==', `${legacyData.name.toLowerCase().replace(' ', '.')}@nhbea.org`)
      );
      const existingMembers = await getDocs(existingMemberQuery);
      
      if (existingMembers.empty) {
        // Create new member from legacy board member
        const nameParts = legacyData.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        const newMember: Omit<Member, 'id' | 'createdAt' | 'updatedAt'> = {
          memberNumber: `NHBEA-${new Date().getFullYear()}-${String(migratedCount + 1).padStart(4, '0')}`,
          firstName,
          lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@nhbea.org`,
          phone: '',
          organizationId: 'default-org', // Would need to be set properly
          position: legacyData.title,
          yearsExperience: 5, // Default value
          address: '',
          city: '',
          state: 'NH',
          zipCode: '',
          membershipType: 'professional',
          status: 'active',
          joinDate: new Date(),
          renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          isBoardMember: true,
          boardPosition: legacyData.title,
          boardStartDate: new Date(),
          communicationPreferences: {
            newsletter: true,
            updates: true,
            events: true,
            mailings: true
          },
          paymentHistory: [],
          notes: legacyData.bio
        };
        
        const memberWithTimestamps = {
          ...newMember,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await addDoc(collection(db, 'members'), memberWithTimestamps);
        migratedCount++;
        console.log(`Migrated legacy board member: ${legacyData.name}`);
      } else {
        // Update existing member to be board member
        const existingMember = existingMembers.docs[0];
        await updateDoc(doc(db, 'members', existingMember.id), {
          isBoardMember: true,
          boardPosition: legacyData.title,
          boardStartDate: new Date(),
          updatedAt: new Date(),
          notes: legacyData.bio
        });
        console.log(`Updated existing member to board member: ${legacyData.name}`);
      }
    }
    
    console.log(`Legacy board member migration complete: ${migratedCount} members processed`);
  } catch (error) {
    console.error('Error migrating legacy board members:', error);
    throw new Error('Failed to migrate legacy board members');
  }
}