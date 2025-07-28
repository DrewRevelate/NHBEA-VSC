#!/usr/bin/env tsx

/**
 * Phase 1 Migration Script for NHBEA Database Schema
 * 
 * This script migrates from the current 4-collection setup to the enhanced Phase 1 structure:
 * - boardMembers → members (enhanced)
 * - pastPresidents → members (historical)
 * - content → unchanged (for now)
 * - sponsors → unchanged (for now)
 * - site_settings + sitesettings → site_settings (consolidated)
 * 
 * Usage: npx tsx scripts/migrate-phase1.ts
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, getDoc, addDoc } from 'firebase/firestore';
import { LegacyBoardMember } from '../src/types/members';
import { CreateMemberData } from '../src/types/members';
import { SiteSettings } from '../src/types/siteSettings';

// Firebase configuration (should match your .env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyC08Pd4oC3bTOKFnNXQtgCUx8YVVczpXZM',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'nhbea-64cab.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'nhbea-64cab',
  storageBucket: `${process.env.FIREBASE_PROJECT_ID || 'nhbea-64cab'}.appspot.com`,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase (avoid duplicate app error)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

interface MigrationStats {
  boardMembersMigrated: number;
  pastPresidentsMigrated: number;
  conferenceCreated: boolean;
  siteSettingsConsolidated: boolean;
  errors: string[];
}

// Helper functions for migration
async function createMember(memberData: CreateMemberData): Promise<string> {
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
}

function convertLegacyBoardMember(legacyMember: LegacyBoardMember): CreateMemberData {
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

const defaultConference = {
  title: '2025 NHBEA Annual Conference',
  description: 'Join us for our annual conference featuring the latest in business education trends, networking opportunities, and professional development sessions.',
  year: 2025,
  schedule: {
    date: new Date('2025-10-15'),
    startTime: '09:00',
    endTime: '17:00',
    timezone: 'America/New_York'
  },
  location: {
    venue: 'Manchester Downtown Hotel',
    address: {
      street: '700 Elm St',
      city: 'Manchester',
      state: 'NH',
      zipCode: '03101'
    },
    virtualOption: false
  },
  registration: {
    isOpen: true,
    openDate: new Date('2025-07-01'),
    closeDate: new Date('2025-10-10'),
    capacity: 150,
    currentCount: 0,
    waitlistEnabled: true,
    fees: {
      member: 100,
      nonMember: 150,
      student: 50,
      earlyBird: {
        amount: 75,
        deadline: new Date('2025-09-01')
      }
    },
    requiredFields: ['fullName', 'email', 'institution'],
    waitingList: []
  },
  media: {
    imageURL: '/images/conference-2025.jpg'
  },
  status: 'registration_open',
  metadata: {
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system',
    featured: true
  }
};

/**
 * Main migration function
 */
async function runMigration(): Promise<MigrationStats> {
  const stats: MigrationStats = {
    boardMembersMigrated: 0,
    pastPresidentsMigrated: 0,
    conferenceCreated: false,
    siteSettingsConsolidated: false,
    errors: []
  };

  console.log('🚀 Starting NHBEA Phase 1 Database Migration...\n');

  try {
    // Step 1: Migrate Board Members to Enhanced Members Collection
    console.log('📋 Step 1: Migrating board members...');
    await migrateBoardMembers(stats);

    // Step 2: Migrate Past Presidents to Members Collection (as historical records)
    console.log('🏆 Step 2: Migrating past presidents...');
    await migratePastPresidents(stats);

    // Step 3: Create Default Conference for 2025
    console.log('📅 Step 3: Creating default conference...');
    await createDefaultConference(stats);

    // Step 4: Consolidate Site Settings
    console.log('⚙️ Step 4: Consolidating site settings...');
    await consolidateSiteSettings(stats);

    console.log('\n✅ Migration completed successfully!');
    printMigrationSummary(stats);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    stats.errors.push(`Migration failed: ${error}`);
  }

  return stats;
}

/**
 * Migrate board members from legacy format to enhanced members collection
 */
async function migrateBoardMembers(stats: MigrationStats): Promise<void> {
  try {
    const boardMembersRef = collection(db, 'boardMembers');
    const snapshot = await getDocs(boardMembersRef);

    if (snapshot.empty) {
      console.log('  ⚠️ No board members found in legacy collection');
      return;
    }

    for (const docSnapshot of snapshot.docs) {
      try {
        const legacyData = { id: docSnapshot.id, ...docSnapshot.data() } as LegacyBoardMember;
        
        // Convert legacy format to new enhanced format
        const memberData: CreateMemberData = convertLegacyBoardMember(legacyData);
        
        // Add migration metadata
        memberData.metadata = {
          ...memberData.metadata,
          createdBy: 'phase1_migration'
        };

        // Create new member document
        const memberId = await createMember(memberData);
        
        console.log(`  ✓ Migrated board member: ${legacyData.name} → ${memberId}`);
        stats.boardMembersMigrated++;

      } catch (error) {
        const errorMsg = `Failed to migrate board member ${docSnapshot.id}: ${error}`;
        console.error(`  ❌ ${errorMsg}`);
        stats.errors.push(errorMsg);
      }
    }

  } catch (error) {
    const errorMsg = `Board members migration failed: ${error}`;
    console.error(`  ❌ ${errorMsg}`);
    stats.errors.push(errorMsg);
  }
}

/**
 * Migrate past presidents to members collection as historical records
 */
async function migratePastPresidents(stats: MigrationStats): Promise<void> {
  try {
    const pastPresidentsRef = collection(db, 'pastPresidents');
    const snapshot = await getDocs(pastPresidentsRef);

    if (snapshot.empty) {
      console.log('  ⚠️ No past presidents found in legacy collection');
      return;
    }

    for (const docSnapshot of snapshot.docs) {
      try {
        const legacyData = docSnapshot.data();
        
        // Create member record for past president
        const memberData: CreateMemberData = {
          personalInfo: {
            firstName: legacyData.name?.split(' ')[0] || '',
            lastName: legacyData.name?.split(' ').slice(1).join(' ') || '',
            email: `${legacyData.name?.toLowerCase().replace(/\s+/g, '.')}@nhbea.org`
          },
          membership: {
            type: 'individual',
            status: 'inactive', // Past presidents are typically inactive unless they're current members
            joinDate: new Date(legacyData.year_served || legacyData.term?.split('-')[0] || '2000'),
            renewalDate: new Date(), // Will be updated if they become active again
            membershipYear: legacyData.year_served || legacyData.term?.split('-')[0] || '2000',
            autoRenewal: false
          },
          organization: {
            name: 'Unknown', // Past presidents may not have current organization info
            position: 'Former NHBEA President'
          },
          profile: {
            activeBoardMember: false,
            boardPosition: `President (${legacyData.year_served || legacyData.term})`,
            bio: `Served as NHBEA President during ${legacyData.year_served || legacyData.term}`
          },
          preferences: {
            emailNotifications: false,
            directoryListing: false,
            newsletterSubscription: false
          },
          metadata: {
            createdBy: 'phase1_migration'
          }
        };

        const memberId = await createMember(memberData);
        
        console.log(`  ✓ Migrated past president: ${legacyData.name} (${legacyData.year_served || legacyData.term}) → ${memberId}`);
        stats.pastPresidentsMigrated++;

      } catch (error) {
        const errorMsg = `Failed to migrate past president ${docSnapshot.id}: ${error}`;
        console.error(`  ❌ ${errorMsg}`);
        stats.errors.push(errorMsg);
      }
    }

  } catch (error) {
    const errorMsg = `Past presidents migration failed: ${error}`;
    console.error(`  ❌ ${errorMsg}`);
    stats.errors.push(errorMsg);
  }
}

/**
 * Create default conference for current year
 */
async function createDefaultConference(stats: MigrationStats): Promise<void> {
  try {
    // Check if conference already exists for current year
    const currentYear = new Date().getFullYear();
    const conferenceId = `conference-${currentYear}`;
    const conferenceRef = doc(db, 'conference', conferenceId);
    const existingConference = await getDoc(conferenceRef);

    if (existingConference.exists()) {
      console.log(`  ⚠️ Conference for ${currentYear} already exists`);
      return;
    }

    // Create new conference with default data
    const conferenceData = {
      ...defaultConference,
      year: currentYear,
      title: `${currentYear} NHBEA Annual Conference`,
      metadata: {
        ...defaultConference.metadata,
        createdBy: 'phase1_migration'
      }
    };

    await setDoc(conferenceRef, conferenceData);
    
    console.log(`  ✓ Created default conference for ${currentYear}`);
    stats.conferenceCreated = true;

  } catch (error) {
    const errorMsg = `Failed to create default conference: ${error}`;
    console.error(`  ❌ ${errorMsg}`);
    stats.errors.push(errorMsg);
  }
}

/**
 * Consolidate site_settings and sitesettings into single collection
 */
async function consolidateSiteSettings(stats: MigrationStats): Promise<void> {
  try {
    // Get data from both potential settings collections
    const siteSettingsRef = doc(db, 'site_settings', 'global');
    const siteSettingsRefAlt = doc(db, 'sitesettings', 'global');
    
    const [siteSettingsDoc, siteSettingsAltDoc] = await Promise.all([
      getDoc(siteSettingsRef),
      getDoc(siteSettingsRefAlt)
    ]);

    // Merge data from both sources
    const siteSettingsData = siteSettingsDoc.exists() ? siteSettingsDoc.data() : {};
    const siteSettingsAltData = siteSettingsAltDoc.exists() ? siteSettingsAltDoc.data() : {};

    // Create consolidated settings structure (filter out undefined values)
    const consolidatedSettings: any = {
      identity: {
        siteName: siteSettingsAltData.sitename || siteSettingsData.siteName || 'NHBEA',
        tagline: siteSettingsAltData.tagline || siteSettingsData.tagline || 'New Hampshire Business Educators Association',
        description: siteSettingsData.description || 'Promoting excellence in business education throughout New Hampshire'
      },
      contact: {
        primaryEmail: siteSettingsData.primaryEmail || 'info@nhbea.org'
      },
      socialLinks: {},
      content: {
        footerText: siteSettingsAltData.footertext || siteSettingsData.footerText || '© 2025 New Hampshire Business Educators Association',
        copyrightText: '© 2025 New Hampshire Business Educators Association'
      },
      features: {
        membershipEnabled: true,
        conferenceRegistrationEnabled: true,
        nominationsEnabled: false, // Will be enabled in Phase 2
        publicDirectoryEnabled: true,
        maintenanceMode: false
      },
      system: {
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        currency: 'USD'
      },
      metadata: {
        updatedAt: new Date(),
        updatedBy: 'phase1_migration',
        version: '1.0.0'
      }
    };

    // Save consolidated settings
    await setDoc(doc(db, 'site_settings', 'global'), consolidatedSettings);
    
    console.log('  ✓ Site settings consolidated successfully');
    stats.siteSettingsConsolidated = true;

  } catch (error) {
    const errorMsg = `Failed to consolidate site settings: ${error}`;
    console.error(`  ❌ ${errorMsg}`);
    stats.errors.push(errorMsg);
  }
}

/**
 * Print migration summary
 */
function printMigrationSummary(stats: MigrationStats): void {
  console.log('\n📊 Migration Summary:');
  console.log('========================');
  console.log(`Board Members Migrated: ${stats.boardMembersMigrated}`);
  console.log(`Past Presidents Migrated: ${stats.pastPresidentsMigrated}`);
  console.log(`Conference Created: ${stats.conferenceCreated ? 'Yes' : 'No'}`);
  console.log(`Site Settings Consolidated: ${stats.siteSettingsConsolidated ? 'Yes' : 'No'}`);
  
  if (stats.errors.length > 0) {
    console.log(`\n⚠️ Errors encountered: ${stats.errors.length}`);
    stats.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  }

  console.log('\n📋 Next Steps:');
  console.log('1. Update your application code to use the new members API');
  console.log('2. Test the new member and conference functionality');
  console.log('3. Update FireCMS configuration for the new collections');
  console.log('4. Deploy the updated application');
  console.log('5. Verify all functionality works as expected');
  
  if (stats.errors.length === 0) {
    console.log('\n🎉 Migration completed successfully with no errors!');
  } else {
    console.log('\n⚠️ Migration completed with errors. Please review and fix the issues above.');
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  runMigration()
    .then((stats) => {
      process.exit(stats.errors.length > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

export { runMigration };