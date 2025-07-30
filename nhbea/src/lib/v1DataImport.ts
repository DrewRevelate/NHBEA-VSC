import { db } from './firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { V1Member, V1Organization, V1Registrant, V1Sponsor } from '@/types/v1DataModels';

/**
 * V1 Data Import Functions
 * Import CSV data exactly as it exists in V1 structure
 */

// Organizations - Import from Organizations.csv
export const v1OrganizationsData: Omit<V1Organization, 'id'>[] = [
  {
    name: "Concord High School",
    type: "school",
    isActive: true,
    address: {
      street: "170 Warren St",
      city: "Concord", 
      state: "NH",
      zipCode: "03301"
    },
    contact: {
      phone: "(603) 225-0811",
      email: "chs@sau8.org",
      website: "https://www.concordk12.org"
    },
    notes: "Capital city high school with innovative business programs",
    createdAt: new Date("2025-07-28T14:38:28.920Z"),
    updatedAt: new Date("2025-07-28T14:38:28.920Z")
  },
  {
    name: "DECA New Hampshire", 
    type: "nonprofit",
    isActive: true,
    address: {
      street: "25 Capitol St",
      city: "Concord",
      state: "NH", 
      zipCode: "03301"
    },
    contact: {
      phone: "(603) 271-3495",
      email: "info@decanh.org",
      website: "https://www.decanh.org"
    },
    notes: "Student organization for marketing, finance, hospitality and management",
    createdAt: new Date("2025-07-28T14:38:29.041Z"),
    updatedAt: new Date("2025-07-28T14:38:29.041Z")
  },
  {
    name: "Nashua High School North",
    type: "school",
    isActive: true,
    address: {
      street: "8 Titan Way",
      city: "Nashua", 
      state: "New Hampshire",
      zipCode: "03063"
    },
    contact: {
      phone: null,
      email: null,
      website: "https://www.nashua.edu/north"
    },
    notes: null,
    createdAt: new Date("2025-07-28T14:44:34.735Z"),
    updatedAt: new Date("2025-07-28T14:49:10.363Z")
  },
  {
    name: "Manchester High School",
    type: "school", 
    isActive: true,
    address: {
      street: "195 McGregor St",
      city: "Manchester",
      state: "NH",
      zipCode: "03102"
    },
    contact: {
      phone: "(603) 624-6300",
      email: "info@manchester.k12.nh.us", 
      website: "https://www.manchester.k12.nh.us"
    },
    notes: "Large urban high school with strong business education program",
    createdAt: new Date("2025-07-28T14:38:27.959Z"),
    updatedAt: new Date("2025-07-28T14:38:27.959Z")
  },
  {
    name: "University of New Hampshire",
    type: "university",
    isActive: true,
    address: {
      street: "105 Main St",
      city: "Durham",
      state: "NH",
      zipCode: "03824"
    },
    contact: {
      phone: "(603) 862-1234",
      email: "business@unh.edu",
      website: "https://www.unh.edu"
    },
    notes: "State university with comprehensive business school",
    createdAt: new Date("2025-07-28T14:38:28.788Z"),
    updatedAt: new Date("2025-07-28T14:38:28.788Z")
  },
  {
    name: "Nashua Community College",
    type: "college",
    isActive: true,
    address: {
      street: "505 Amherst St", 
      city: "Nashua",
      state: "NH",
      zipCode: "03063"
    },
    contact: {
      phone: "(603) 578-8900",
      email: "admissions@nashuacc.edu",
      website: "https://www.nashuacc.edu"
    },
    notes: "Two-year community college with business and entrepreneurship programs",
    createdAt: new Date("2025-07-28T14:38:28.647Z"),
    updatedAt: new Date("2025-07-28T14:38:28.647Z")
  }
];

// Members - Import from Members.csv (James Dowding example)
export const v1MembersData: Omit<V1Member, 'id'>[] = [
  {
    personalInfo: {
      firstName: "James",
      lastName: "Dowding",
      phone: null,
      email: null
    },
    organization: {
      address: "organizations/hzLJH8GFPglBkzhHUH21", // Reference to Nashua High School North
      title: "Business Teacher"
    },
    membership: {
      type: "individual",
      membershipYear: null,
      status: "active",
      renewalDate: null,
      autoRenewal: true,
      joinDate: null
    },
    profile: {
      activeBoardMember: true,
      boardPosition: "Past President",
      boardOrder: 3,
      bio: null
    },
    preferences: {
      emailNotifications: false,
      directoryListing: true, 
      newsletterSubscription: false
    },
    metadata: {
      createdBy: null,
      createdAt: new Date("2025-07-28T14:45:07.551Z"),
      updatedAt: new Date("2025-07-28T14:48:49.820Z")
    }
  }
];

// Registrants - Import from Registrants.csv
export const v1RegistrantsData: Omit<V1Registrant, 'id'>[] = [
  {
    participant: {
      institution: "Nashua Community College",
      fullName: {
        first_name: null,
        last_name: null
      },
      phone: "(603) 555-0102",
      email: "michael.chen@nhcc.edu",
      membershipStatus: "member"
    },
    registration: {
      registrationType: "early_bird",
      totalAmount: 75,
      registrationDate: new Date("2025-07-20T00:00:00.000Z"),
      paymentStatus: "paid"
    },
    status: "registered",
    preferences: {
      networkingOptIn: true,
      accessibilityNeeds: null,
      sessionPreferences: ["Entrepreneurship Education", "Industry Partnerships"],
      dietaryRestrictions: ""
    },
    communications: {
      remindersSent: 0,
      confirmationSent: true
    },
    conferenceTitle: "2025 NHBEA Annual Conference",
    conferenceId: "conference-2025", 
    conferenceYear: 2025,
    metadata: {
      updatedAt: new Date("2025-07-28T00:42:58.126Z"),
      source: "sample_data_script",
      createdAt: new Date("2025-07-28T00:42:58.126Z")
    }
  },
  {
    participant: {
      institution: "Independent Educator",
      fullName: {
        first_name: null,
        last_name: null
      },
      phone: null,
      email: "jane.smith@example.com",
      membershipStatus: "non-member"
    },
    registration: {
      registrationType: "regular",
      totalAmount: 150,
      registrationDate: new Date("2025-08-10T00:00:00.000Z"),
      paymentStatus: "paid"
    },
    status: "registered",
    preferences: {
      networkingOptIn: false,
      accessibilityNeeds: null,
      sessionPreferences: [],
      dietaryRestrictions: ""
    },
    communications: {
      remindersSent: 0,
      confirmationSent: true
    },
    conferenceTitle: "2025 NHBEA Annual Conference",
    conferenceId: "conference-2025",
    conferenceYear: 2025,
    metadata: {
      updatedAt: new Date("2025-07-28T00:42:58.236Z"),
      source: "sample_data_script", 
      createdAt: new Date("2025-07-28T00:42:58.236Z")
    }
  },
  {
    participant: {
      institution: "Manchester High School",
      fullName: {
        first_name: null,
        last_name: null
      },
      phone: "(603) 555-0101",
      email: "sarah.johnson@manchester.edu",
      membershipStatus: "member"
    },
    registration: {
      registrationType: "early_bird",
      totalAmount: 75,
      registrationDate: new Date("2025-07-15T00:00:00.000Z"),
      paymentStatus: "paid"
    },
    status: "registered",
    preferences: {
      networkingOptIn: true,
      accessibilityNeeds: null,
      sessionPreferences: ["Technology in Business Education", "Leadership Development"],
      dietaryRestrictions: "Vegetarian"
    },
    communications: {
      remindersSent: 0,
      confirmationSent: true
    },
    conferenceTitle: "2025 NHBEA Annual Conference",
    conferenceId: "conference-2025",
    conferenceYear: 2025,
    metadata: {
      updatedAt: new Date("2025-07-28T00:42:58.008Z"),
      source: "sample_data_script",
      createdAt: new Date("2025-07-28T00:42:58.008Z")
    }
  }
];

// Sponsors - Import from Sponsors.csv
export const v1SponsorsData: Omit<V1Sponsor, 'id'>[] = [
  {
    name: "NH Department of Education",
    website: "https://www.education.nh.gov",
    order: 1,
    logo: null
  },
  {
    name: "New Hampshire Department of Education",
    website: "https://www.education.nh.gov/",
    order: 1,
    logo: null
  },
  {
    name: "University of New Hampshire",
    website: "https://www.unh.edu/",
    order: 2,
    logo: null
  },
  {
    name: "Southern New Hampshire University", 
    website: "https://www.snhu.edu/",
    order: 3,
    logo: null
  },
  {
    name: "Keene State College",
    website: "https://www.keene.edu/",
    order: 4,
    logo: null
  },
  {
    name: "Plymouth State University",
    website: "https://www.plymouth.edu/",
    order: 5,
    logo: null
  },
  {
    name: "New Hampshire Business & Industry Association",
    website: "https://www.nhbia.org/",
    order: 6,
    logo: null
  },
  {
    name: "Greater Manchester Chamber of Commerce",
    website: "https://www.manchester-chamber.org/",
    order: 7,
    logo: null
  },
  {
    name: "Nashua Regional Planning Commission",
    website: "https://www.nashuarpc.org/",
    order: 8,
    logo: null
  },
  {
    name: "Business & Industry Association of NH",
    website: "https://www.nhbia.org",
    order: 2,
    logo: null
  }
];

// Function to import all V1 data preserving exact structure
export async function importV1Data(): Promise<void> {
  console.log('📁 Starting V1 Data Import - Preserving Exact Structure...');
  
  try {
    // 1. Import Organizations first (needed for member references)
    console.log('🏢 Importing organizations...');
    const orgIdMap = new Map<string, string>();
    
    for (const orgData of v1OrganizationsData) {
      const docRef = await addDoc(collection(db, 'organizations'), orgData);
      // Map organization name to ID for member references
      orgIdMap.set(orgData.name, docRef.id);
      console.log(`   ✓ Created organization: ${orgData.name} (${docRef.id})`);
    }

    // 2. Import Members with V1 nested structure preserved
    console.log('👥 Importing members...');
    for (const memberData of v1MembersData) {
      // Update organization reference with actual ID
      const orgName = "Nashua High School North"; // From the reference
      const orgId = orgIdMap.get(orgName);
      if (orgId) {
        memberData.organization.address = `organizations/${orgId}`;
      }
      
      const docRef = await addDoc(collection(db, 'members'), memberData);
      console.log(`   ✓ Created member: ${memberData.personalInfo.firstName} ${memberData.personalInfo.lastName} (${docRef.id})`);
    }

    // 3. Import Registrants with V1 nested structure preserved  
    console.log('📝 Importing registrants...');
    for (const registrantData of v1RegistrantsData) {
      const docRef = await addDoc(collection(db, 'registrants'), registrantData);
      console.log(`   ✓ Created registrant: ${registrantData.participant.email} (${docRef.id})`);
    }

    // 4. Import Sponsors
    console.log('🤝 Importing sponsors...');
    for (const sponsorData of v1SponsorsData) {
      const docRef = await addDoc(collection(db, 'sponsors'), sponsorData);
      console.log(`   ✓ Created sponsor: ${sponsorData.name} (${docRef.id})`);
    }

    // 5. Add basic content
    console.log('📄 Adding content...');
    await setDoc(doc(db, 'content', 'homepage'), {
      heroTitle: "New Hampshire Business Educators Association",
      heroSubtitle: "Empowering educators, inspiring students, strengthening business education",
      missionTitle: "Our Mission",
      missionContent: "NHBEA is dedicated to promoting excellence in business education through professional development, networking, and advocacy for business educators and students throughout New Hampshire.",
      aboutTitle: "About NHBEA", 
      aboutContent: "The New Hampshire Business Educators Association serves as the premier professional organization for business educators in the state."
    });

    console.log('✅ V1 Data Import Complete!');
    console.log(`📊 Summary:`);
    console.log(`   • ${v1OrganizationsData.length} organizations imported`);
    console.log(`   • ${v1MembersData.length} members imported (including James Dowding)`);
    console.log(`   • ${v1RegistrantsData.length} registrants imported`);
    console.log(`   • ${v1SponsorsData.length} sponsors imported`);
    
  } catch (error) {
    console.error('❌ Error importing V1 data:', error);
    throw error;
  }
}