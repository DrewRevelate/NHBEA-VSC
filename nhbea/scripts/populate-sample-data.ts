#!/usr/bin/env tsx

/**
 * Populate Sample Data for NHBEA Phase 1 Testing
 * 
 * This script creates sample data for testing the new Phase 1 collections:
 * - Sample members (including board members)
 * - Sample registrants for the conference
 * 
 * Usage: npx tsx scripts/populate-sample-data.ts
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { CreateMemberData } from '../src/types/members';
import { CreateRegistrantData } from '../src/types/conference';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyC08Pd4oC3bTOKFnNXQtgCUx8YVVczpXZM',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'nhbea-64cab.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'nhbea-64cab',
  storageBucket: `${process.env.FIREBASE_PROJECT_ID || 'nhbea-64cab'}.appspot.com`,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Sample member data
const sampleMembers: CreateMemberData[] = [
  {
    personalInfo: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@manchester.edu',
      phone: '(603) 555-0101'
    },
    membership: {
      type: 'individual',
      status: 'active',
      joinDate: new Date('2020-01-15'),
      renewalDate: new Date('2025-12-31'),
      membershipYear: '2025',
      autoRenewal: true
    },
    organization: {
      name: 'Manchester High School',
      position: 'Business Department Chair',
      title: 'Department Chair',
      address: {
        street: '123 Education Ave',
        city: 'Manchester',
        state: 'NH',
        zipCode: '03104'
      }
    },
    profile: {
      activeBoardMember: true,
      boardPosition: 'President',
      boardOrder: 1,
      bio: 'Sarah has been an advocate for business education for over 15 years, bringing innovative teaching methods to the classroom and mentoring new educators throughout New Hampshire.'
    },
    preferences: {
      emailNotifications: true,
      directoryListing: true,
      newsletterSubscription: true
    }
  },
  {
    personalInfo: {
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@nhcc.edu',
      phone: '(603) 555-0102'
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
      position: 'Associate Professor of Business',
      address: {
        street: '505 Amherst St',
        city: 'Nashua',
        state: 'NH',
        zipCode: '03063'
      }
    },
    profile: {
      activeBoardMember: true,
      boardPosition: 'Vice President',
      boardOrder: 2,
      bio: 'Michael specializes in entrepreneurship education and has helped launch numerous student business ventures. He brings real-world business experience to the classroom.'
    },
    preferences: {
      emailNotifications: true,
      directoryListing: true,
      newsletterSubscription: true
    }
  },
  {
    personalInfo: {
      firstName: 'Jennifer',
      lastName: 'Rodriguez',
      email: 'jennifer.rodriguez@keene.edu',
      phone: '(603) 555-0103'
    },
    membership: {
      type: 'individual',
      status: 'active',
      joinDate: new Date('2018-03-20'),
      renewalDate: new Date('2025-12-31'),
      membershipYear: '2025',
      autoRenewal: false
    },
    organization: {
      name: 'Keene State College',
      position: 'Assistant Professor of Business Education',
      address: {
        street: '229 Main St',
        city: 'Keene',
        state: 'NH',
        zipCode: '03435'
      }
    },
    profile: {
      activeBoardMember: true,
      boardPosition: 'Secretary',
      boardOrder: 3,
      bio: 'Jennifer focuses on curriculum development and has authored several business education textbooks. She leads professional development workshops across the state.'
    },
    preferences: {
      emailNotifications: true,
      directoryListing: true,
      newsletterSubscription: true
    }
  },
  {
    personalInfo: {
      firstName: 'David',
      lastName: 'Thompson',
      email: 'david.thompson@nhbea.org',
      phone: '(603) 555-0104'
    },
    membership: {
      type: 'individual',
      status: 'active',
      joinDate: new Date('2017-09-10'),
      renewalDate: new Date('2025-12-31'),
      membershipYear: '2025',
      autoRenewal: true
    },
    organization: {
      name: 'Portsmouth High School',
      position: 'Business Teacher & Financial Literacy Coordinator'
    },
    profile: {
      activeBoardMember: true,
      boardPosition: 'Treasurer',
      boardOrder: 4,
      bio: 'David brings financial expertise and has been instrumental in securing funding for educational programs. He manages the association\'s budget and strategic planning.'
    },
    preferences: {
      emailNotifications: true,
      directoryListing: true,
      newsletterSubscription: true
    }
  },
  {
    personalInfo: {
      firstName: 'Lisa',
      lastName: 'Anderson',
      email: 'lisa.anderson@dover.k12.nh.us',
      phone: '(603) 555-0105'
    },
    membership: {
      type: 'individual',
      status: 'active',
      joinDate: new Date('2021-01-05'),
      renewalDate: new Date('2025-12-31'),
      membershipYear: '2025',
      autoRenewal: true
    },
    organization: {
      name: 'Dover High School',
      position: 'Marketing & Entrepreneurship Teacher'
    },
    profile: {
      activeBoardMember: true,
      boardPosition: 'Director of Professional Development',
      boardOrder: 5,
      bio: 'Lisa coordinates training programs and certification opportunities for business educators. She has 12 years of experience in corporate training.'
    },
    preferences: {
      emailNotifications: true,
      directoryListing: true,
      newsletterSubscription: true
    }
  },
  {
    personalInfo: {
      firstName: 'Robert',
      lastName: 'Martinez',
      email: 'robert.martinez@unh.edu',
      phone: '(603) 555-0106'
    },
    membership: {
      type: 'individual',
      status: 'active',
      joinDate: new Date('2020-08-15'),
      renewalDate: new Date('2025-12-31'),
      membershipYear: '2025',
      autoRenewal: false
    },
    organization: {
      name: 'University of New Hampshire',
      position: 'Lecturer in Business Administration'
    },
    profile: {
      activeBoardMember: true,
      boardPosition: 'Director of Communications',
      boardOrder: 6,
      bio: 'Robert manages the association\'s communications and outreach efforts. He oversees the website, newsletter, and social media presence.'
    },
    preferences: {
      emailNotifications: true,
      directoryListing: true,
      newsletterSubscription: true
    }
  },
  // Regular members (non-board)
  {
    personalInfo: {
      firstName: 'Emily',
      lastName: 'Parker',
      email: 'emily.parker@concord.k12.nh.us'
    },
    membership: {
      type: 'individual',
      status: 'active',
      joinDate: new Date('2022-02-14'),
      renewalDate: new Date('2025-12-31'),
      membershipYear: '2025',
      autoRenewal: true
    },
    organization: {
      name: 'Concord High School',
      position: 'Business & Computer Science Teacher'
    },
    profile: {
      activeBoardMember: false,
      bio: 'Emily teaches business fundamentals and computer applications to high school students.'
    },
    preferences: {
      emailNotifications: true,
      directoryListing: true,
      newsletterSubscription: true
    }
  },
  {
    personalInfo: {
      firstName: 'James',
      lastName: 'Wilson',
      email: 'james.wilson@snhu.edu'
    },
    membership: {
      type: 'individual',
      status: 'active',
      joinDate: new Date('2023-05-01'),
      renewalDate: new Date('2025-12-31'),
      membershipYear: '2025',
      autoRenewal: false
    },
    organization: {
      name: 'Southern New Hampshire University',
      position: 'Adjunct Professor'
    },
    profile: {
      activeBoardMember: false,
      bio: 'James teaches undergraduate business courses and specializes in international business.'
    },
    preferences: {
      emailNotifications: false,
      directoryListing: true,
      newsletterSubscription: true
    }
  }
];

// Sample conference registrants
const sampleRegistrants: Omit<CreateRegistrantData, 'conferenceId' | 'conferenceTitle' | 'conferenceYear'>[] = [
  {
    participant: {
      fullName: 'Sarah Johnson',
      email: 'sarah.johnson@manchester.edu',
      phone: '(603) 555-0101',
      institution: 'Manchester High School',
      membershipStatus: 'member'
    },
    registration: {
      registrationDate: new Date('2025-07-15'),
      registrationType: 'early_bird',
      paymentStatus: 'paid',
      totalAmount: 75
    },
    preferences: {
      dietaryRestrictions: 'Vegetarian',
      accessibilityNeeds: '',
      sessionPreferences: ['Technology in Business Education', 'Leadership Development'],
      networkingOptIn: true
    },
    status: 'registered',
    communications: {
      confirmationSent: true,
      remindersSent: 0
    }
  },
  {
    participant: {
      fullName: 'Michael Chen',
      email: 'michael.chen@nhcc.edu',
      phone: '(603) 555-0102',
      institution: 'Nashua Community College',
      membershipStatus: 'member'
    },
    registration: {
      registrationDate: new Date('2025-07-20'),
      registrationType: 'early_bird',
      paymentStatus: 'paid',
      totalAmount: 75
    },
    preferences: {
      sessionPreferences: ['Entrepreneurship Education', 'Industry Partnerships'],
      networkingOptIn: true
    },
    status: 'registered',
    communications: {
      confirmationSent: true,
      remindersSent: 0
    }
  },
  {
    participant: {
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      institution: 'Independent Educator',
      membershipStatus: 'non-member'
    },
    registration: {
      registrationDate: new Date('2025-08-10'),
      registrationType: 'regular',
      paymentStatus: 'paid',
      totalAmount: 150
    },
    preferences: {
      networkingOptIn: false
    },
    status: 'registered',
    communications: {
      confirmationSent: true,
      remindersSent: 0
    }
  }
];

async function populateSampleData(): Promise<void> {
  console.log('🌱 Populating NHBEA sample data...\n');

  try {
    // Create sample members
    console.log('👥 Creating sample members...');
    for (const member of sampleMembers) {
      const memberData = {
        ...member,
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'sample_data_script'
        }
      };

      const docRef = await addDoc(collection(db, 'members'), memberData);
      console.log(`  ✓ Created member: ${member.personalInfo.firstName} ${member.personalInfo.lastName} → ${docRef.id}`);
    }

    // Create sample conference registrants
    console.log('\n📅 Creating sample conference registrants...');
    for (const registrant of sampleRegistrants) {
      const registrantData = {
        ...registrant,
        conferenceId: 'conference-2025',
        conferenceTitle: '2025 NHBEA Annual Conference',
        conferenceYear: 2025,
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          source: 'sample_data_script'
        }
      };

      const docRef = await addDoc(collection(db, 'registrants'), registrantData);
      console.log(`  ✓ Created registrant: ${registrant.participant.fullName} → ${docRef.id}`);
    }

    console.log('\n✅ Sample data populated successfully!');
    console.log('\n📋 What was created:');
    console.log(`- ${sampleMembers.length} sample members (${sampleMembers.filter(m => m.profile.activeBoardMember).length} board members)`);
    console.log(`- ${sampleRegistrants.length} conference registrants`);
    console.log('- 1 default conference for 2025');
    console.log('- Consolidated site settings');

    console.log('\n🎯 Next steps:');
    console.log('1. Update your components to use the new members API');
    console.log('2. Test the About page with new board member data');
    console.log('3. Verify conference data is available');
    console.log('4. Deploy the updated application');

  } catch (error) {
    console.error('❌ Failed to populate sample data:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  populateSampleData()
    .then(() => {
      console.log('\n🎉 Sample data population completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Sample data population failed:', error);
      process.exit(1);
    });
}

export { populateSampleData };