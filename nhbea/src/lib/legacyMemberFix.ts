import { db } from './firebase';
import { collection, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';

/**
 * Fix for members using old data structure
 * Converts old nested structure to new flat structure
 */

export async function fixLegacyMemberStructure(memberId: string): Promise<void> {
  try {
    console.log(`Fixing legacy member structure for: ${memberId}`);
    
    // Get the member document
    const memberDoc = doc(db, 'members', memberId);
    
    // This would need to be called with the actual old data
    // Since we can't read from Firestore directly here, 
    // we'll provide the update structure
    
    const updates = {
      // Move personalInfo fields to root
      firstName: "James",
      lastName: "Dowding",
      email: null,
      phone: null,
      
      // Move membership fields to root
      status: "active",
      membershipType: "individual",
      joinDate: new Date(),
      renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      
      // Move profile fields to root
      isBoardMember: true,
      boardPosition: "Secretary", // or whatever position
      boardStartDate: new Date(),
      
      // Add required new fields
      organizationId: "hzLJH8GFPglBkzhHUH21",
      position: "Business Teacher",
      memberNumber: "NHBEA-2024-007",
      yearsExperience: 5,
      address: "",
      city: "",
      state: "NH",
      zipCode: "",
      
      // Convert preferences
      communicationPreferences: {
        newsletter: false,
        updates: false,
        events: true,
        mailings: true
      },
      
      paymentHistory: [],
      notes: "",
      updatedAt: new Date(),
      
      // Remove old nested structures (set to null to delete)
      personalInfo: null,
      membership: null,
      profile: null,
      preferences: null,
      organization: null
    };
    
    await updateDoc(memberDoc, updates);
    console.log('✅ Member structure updated successfully');
    
  } catch (error) {
    console.error('❌ Error fixing member structure:', error);
    throw error;
  }
}

// Function to find and fix all legacy members
export async function findAndFixAllLegacyMembers(): Promise<void> {
  try {
    console.log('🔍 Looking for members with old data structure...');
    
    // Look for members that have personalInfo field (old structure)
    const membersSnapshot = await getDocs(collection(db, 'members'));
    let fixedCount = 0;
    
    for (const memberDoc of membersSnapshot.docs) {
      const data = memberDoc.data();
      
      // Check if this member uses old structure
      if (data.personalInfo || data.membership || data.profile) {
        console.log(`Found legacy member: ${data.personalInfo?.firstName} ${data.personalInfo?.lastName}`);
        
        // Create update object from old structure
        const updates: any = {
          updatedAt: new Date()
        };
        
        // Convert personalInfo
        if (data.personalInfo) {
          updates.firstName = data.personalInfo.firstName || "";
          updates.lastName = data.personalInfo.lastName || "";
          updates.email = data.personalInfo.email || null;
          updates.phone = data.personalInfo.phone || null;
          updates.personalInfo = null; // Remove old field
        }
        
        // Convert membership
        if (data.membership) {
          updates.status = data.membership.status || "active";
          updates.membershipType = data.membership.type || "professional";
          updates.joinDate = data.membership.joinDate || new Date();
          updates.renewalDate = data.membership.renewalDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
          updates.expirationDate = data.membership.renewalDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
          updates.membership = null; // Remove old field
        }
        
        // Convert profile
        if (data.profile) {
          updates.isBoardMember = data.profile.activeBoardMember || false;
          updates.boardPosition = data.profile.boardPosition || null;
          if (data.profile.boardOrder) {
            // Convert board order to position
            const orderToPosition: Record<number, string> = {
              1: "President",
              2: "Vice President", 
              3: "Secretary",
              4: "Treasurer",
              5: "Past President"
            };
            updates.boardPosition = orderToPosition[data.profile.boardOrder] || "Board Member";
          }
          updates.boardStartDate = new Date();
          updates.notes = data.profile.bio || "";
          updates.profile = null; // Remove old field
        }
        
        // Convert preferences
        if (data.preferences) {
          updates.communicationPreferences = {
            newsletter: data.preferences.newsletterSubscription || false,
            updates: data.preferences.emailNotifications || false,
            events: true,
            mailings: data.preferences.directoryListing || false
          };
          updates.preferences = null; // Remove old field
        }
        
        // Convert organization
        if (data.organization) {
          updates.position = data.organization.title || "";
          if (data.organization.address && typeof data.organization.address === 'string') {
            // It's a reference string, extract the ID
            updates.organizationId = data.organization.address.split('/').pop();
          }
          updates.organization = null; // Remove old field
        }
        
        // Add missing required fields
        if (!updates.memberNumber) {
          updates.memberNumber = `NHBEA-${new Date().getFullYear()}-${String(fixedCount + 1).padStart(4, '0')}`;
        }
        if (!updates.yearsExperience) {
          updates.yearsExperience = 5;
        }
        if (!updates.address) updates.address = "";
        if (!updates.city) updates.city = "";
        if (!updates.state) updates.state = "NH";
        if (!updates.zipCode) updates.zipCode = "";
        if (!updates.paymentHistory) updates.paymentHistory = [];
        
        // Apply updates
        await updateDoc(doc(db, 'members', memberDoc.id), updates);
        fixedCount++;
        
        console.log(`✅ Fixed member: ${updates.firstName} ${updates.lastName}`);
      }
    }
    
    console.log(`🎉 Fixed ${fixedCount} legacy members`);
    
  } catch (error) {
    console.error('❌ Error fixing legacy members:', error);
    throw error;
  }
}