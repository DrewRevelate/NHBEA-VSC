import { db } from './firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { Organization, Member, Conference, ConferenceRegistrant, Award } from '@/types/dataModels';

/**
 * Seed data for NHBEA Enhanced CMS Collections
 * This creates comprehensive dummy data for all enhanced collections
 */

// Organizations dummy data
export const organizationsData: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: "Manchester High School",
    type: "school",
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
    isActive: true,
    notes: "Large urban high school with strong business education program"
  },
  {
    name: "Nashua Community College",
    type: "college",
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
    isActive: true,
    notes: "Two-year community college with business and entrepreneurship programs"
  },
  {
    name: "University of New Hampshire",
    type: "university",
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
    isActive: true,
    notes: "State university with comprehensive business school"
  },
  {
    name: "Concord High School",
    type: "school",
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
    isActive: true,
    notes: "Capital city high school with innovative business programs"
  },
  {
    name: "DECA New Hampshire",
    type: "nonprofit",
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
    isActive: true,
    notes: "Student organization for marketing, finance, hospitality and management"
  }
];

// Members dummy data
export const membersData: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    memberNumber: "NHBEA-2024-0001",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@manchester.k12.nh.us",
    phone: "(603) 555-0101",
    organizationId: "", // Will be set during seeding
    position: "Business Education Teacher",
    yearsExperience: 15,
    address: "123 Elm Street",
    city: "Manchester",
    state: "NH",
    zipCode: "03101",
    membershipType: "professional",
    status: "active",
    joinDate: new Date("2020-01-15"),
    renewalDate: new Date("2025-01-15"),
    expirationDate: new Date("2025-12-31"),
    isBoardMember: true,
    boardPosition: "President",
    boardStartDate: new Date("2023-07-01"),
    communicationPreferences: {
      newsletter: true,
      updates: true,
      events: true,
      mailings: true
    },
    paymentHistory: [
      {
        amount: 75,
        currency: "USD",
        paymentDate: new Date("2024-01-15"),
        description: "Annual Membership 2024",
        receiptUrl: "https://example.com/receipt-001"
      }
    ],
    notes: "Sarah has been an advocate for business education for over 15 years, bringing innovative teaching methods to the classroom."
  },
  {
    memberNumber: "NHBEA-2024-0002",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@nashuacc.edu",
    phone: "(603) 555-0102",
    organizationId: "", // Will be set during seeding
    position: "Associate Professor of Business",
    yearsExperience: 12,
    address: "456 Oak Avenue",
    city: "Nashua",
    state: "NH",
    zipCode: "03060",
    membershipType: "professional",
    status: "active",
    joinDate: new Date("2019-06-01"),
    renewalDate: new Date("2025-06-01"),
    expirationDate: new Date("2025-12-31"),
    isBoardMember: true,
    boardPosition: "Vice President",
    boardStartDate: new Date("2023-07-01"),
    communicationPreferences: {
      newsletter: true,
      updates: true,
      events: true,
      mailings: false
    },
    paymentHistory: [
      {
        amount: 75,
        currency: "USD",
        paymentDate: new Date("2024-06-01"),
        description: "Annual Membership 2024",
        receiptUrl: "https://example.com/receipt-002"
      }
    ],
    notes: "Michael specializes in entrepreneurship education and has helped launch numerous student business ventures."
  },
  {
    memberNumber: "NHBEA-2024-0003",
    firstName: "Jennifer",
    lastName: "Rodriguez",
    email: "jennifer.rodriguez@unh.edu",
    phone: "(603) 555-0103",
    organizationId: "", // Will be set during seeding
    position: "Curriculum Coordinator",
    yearsExperience: 18,
    address: "789 Pine Street",
    city: "Durham",
    state: "NH",
    zipCode: "03824",
    membershipType: "professional",
    status: "active",
    joinDate: new Date("2018-03-10"),
    renewalDate: new Date("2025-03-10"),
    expirationDate: new Date("2025-12-31"),
    isBoardMember: true,
    boardPosition: "Secretary",
    boardStartDate: new Date("2023-07-01"),
    communicationPreferences: {
      newsletter: true,
      updates: true,
      events: true,
      mailings: true
    },
    paymentHistory: [
      {
        amount: 75,
        currency: "USD",
        paymentDate: new Date("2024-03-10"),
        description: "Annual Membership 2024",
        receiptUrl: "https://example.com/receipt-003"
      }
    ],
    notes: "Jennifer focuses on curriculum development and has authored several business education textbooks."
  },
  {
    memberNumber: "NHBEA-2024-0004",
    firstName: "David",
    lastName: "Thompson",
    email: "david.thompson@concordk12.org",
    phone: "(603) 555-0104",
    organizationId: "", // Will be set during seeding
    position: "Department Head - Business",
    yearsExperience: 20,
    address: "321 Maple Drive",
    city: "Concord",
    state: "NH",
    zipCode: "03301",
    membershipType: "professional",
    status: "active",
    joinDate: new Date("2017-09-05"),
    renewalDate: new Date("2025-09-05"),
    expirationDate: new Date("2025-12-31"),
    isBoardMember: true,
    boardPosition: "Treasurer",
    boardStartDate: new Date("2023-07-01"),
    communicationPreferences: {
      newsletter: true,
      updates: true,
      events: true,
      mailings: true
    },
    paymentHistory: [
      {
        amount: 75,
        currency: "USD",
        paymentDate: new Date("2024-09-05"),
        description: "Annual Membership 2024",
        receiptUrl: "https://example.com/receipt-004"
      }
    ],
    notes: "David brings financial expertise and has been instrumental in securing funding for educational programs."
  },
  {
    memberNumber: "NHBEA-2024-0005",
    firstName: "Lisa",
    lastName: "Williams",
    email: "lisa.williams@decanh.org",
    phone: "(603) 555-0105",
    organizationId: "", // Will be set during seeding
    position: "Executive Director",
    yearsExperience: 8,
    address: "654 River Road",
    city: "Concord",
    state: "NH",
    zipCode: "03301",
    membershipType: "professional",
    status: "active",
    joinDate: new Date("2021-01-20"),
    renewalDate: new Date("2025-01-20"),
    expirationDate: new Date("2025-12-31"),
    isBoardMember: true,
    boardPosition: "Board Member",
    boardStartDate: new Date("2024-01-01"),
    communicationPreferences: {
      newsletter: true,
      updates: true,
      events: true,
      mailings: false
    },
    paymentHistory: [
      {
        amount: 75,
        currency: "USD",
        paymentDate: new Date("2024-01-20"),
        description: "Annual Membership 2024",
        receiptUrl: "https://example.com/receipt-005"
      }
    ],
    notes: "Lisa leads DECA NH and connects student organizations with professional development opportunities."
  },
  {
    memberNumber: "NHBEA-2024-0006",
    firstName: "Robert",
    lastName: "Martinez",
    email: "robert.martinez@manchester.k12.nh.us",
    phone: "(603) 555-0106",
    organizationId: "", // Will be set during seeding
    position: "Business Teacher",
    yearsExperience: 7,
    address: "987 Broadway",
    city: "Manchester",
    state: "NH",
    zipCode: "03104",
    membershipType: "professional",
    status: "active",
    joinDate: new Date("2022-08-15"),
    renewalDate: new Date("2025-08-15"),
    expirationDate: new Date("2025-12-31"),
    isBoardMember: false,
    communicationPreferences: {
      newsletter: true,
      updates: false,
      events: true,
      mailings: false
    },
    paymentHistory: [
      {
        amount: 75,
        currency: "USD",
        paymentDate: new Date("2024-08-15"),
        description: "Annual Membership 2024",
        receiptUrl: "https://example.com/receipt-006"
      }
    ],
    notes: "Robert is a dedicated teacher focusing on financial literacy and accounting principles."
  }
];

// Conference dummy data
export const conferencesData: Omit<Conference, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: "2025 NHBEA Annual Conference",
    theme: "Innovation in Business Education",
    description: "Join us for our premier annual conference featuring the latest trends in business education, networking opportunities, and professional development sessions. This year's theme focuses on integrating technology and innovation into traditional business curricula.",
    startDate: new Date("2025-10-24T09:00:00"),
    endDate: new Date("2025-10-24T17:00:00"),
    timezone: "America/New_York",
    isVirtual: false,
    venue: {
      name: "Manchester Community College",
      address: "1066 Front Street",
      city: "Manchester",
      state: "NH",
      zipCode: "03102",
      directions: "Located in Manchester, easily accessible via I-293 and Route 101. Free parking available on campus."
    },
    registrationFee: 65,
    currency: "USD",
    maxCapacity: 200,
    registrationDeadline: new Date("2025-10-01T23:59:59"),
    isRegistrationOpen: true,
    isActive: true,
    agenda: [
      {
        title: "Welcome & Opening Keynote",
        description: "Setting the Stage for Innovation in Business Education",
        startTime: new Date("2025-10-24T09:00:00"),
        endTime: new Date("2025-10-24T10:30:00"),
        speaker: "Dr. Maria Rodriguez",
        location: "Main Auditorium"
      },
      {
        title: "Technology Integration Workshop",
        description: "Hands-on session on integrating AI and digital tools in business curriculum",
        startTime: new Date("2025-10-24T10:45:00"),
        endTime: new Date("2025-10-24T12:00:00"),
        speaker: "Prof. James Kim",
        location: "Room 210"
      },
      {
        title: "Network Lunch",
        description: "Connect with fellow educators over lunch",
        startTime: new Date("2025-10-24T12:00:00"),
        endTime: new Date("2025-10-24T13:30:00"),
        location: "Student Center"
      }
    ],
    speakers: [
      {
        name: "Dr. Maria Rodriguez",
        title: "Dean of Business Education",
        organization: "Boston University",
        bio: "Leading expert in educational innovation with 20+ years experience",
        imageUrl: "https://example.com/speaker1.jpg"
      },
      {
        name: "Prof. James Kim",
        title: "Technology Integration Specialist",
        organization: "MIT Education Lab",
        bio: "Pioneer in AI-assisted learning and educational technology",
        imageUrl: "https://example.com/speaker2.jpg"
      }
    ],
    sponsors: [
      {
        name: "TechEd Solutions",
        level: "platinum",
        logoUrl: "https://example.com/sponsor1.png",
        website: "https://techedsolutions.com"
      }
    ],
    notes: "This is our flagship annual event. Expecting high attendance with waiting list likely."
  },
  {
    title: "Spring Professional Development Workshop",
    theme: "Preparing Students for the Digital Economy",
    description: "A focused half-day workshop designed to help educators prepare students for careers in the rapidly evolving digital economy. Features interactive sessions and practical takeaways.",
    startDate: new Date("2025-04-12T13:00:00"),
    endDate: new Date("2025-04-12T17:00:00"),
    timezone: "America/New_York",
    isVirtual: true,
    virtualUrl: "https://zoom.us/j/1234567890",
    registrationFee: 45,
    currency: "USD",
    maxCapacity: 100,
    registrationDeadline: new Date("2025-04-05T23:59:59"),
    isRegistrationOpen: true,
    isActive: true,
    agenda: [
      {
        title: "Digital Skills Assessment",
        description: "Understanding what digital skills students need",
        startTime: new Date("2025-04-12T13:00:00"),
        endTime: new Date("2025-04-12T14:30:00"),
        speaker: "Sarah Thompson",
        location: "Virtual Main Room"
      },
      {
        title: "Curriculum Design Workshop",
        description: "Practical session on updating course content",
        startTime: new Date("2025-04-12T14:45:00"),
        endTime: new Date("2025-04-12T16:15:00"),
        speaker: "Mike Chen",
        location: "Virtual Breakout Room"
      }
    ],
    speakers: [
      {
        name: "Sarah Thompson",
        title: "Digital Education Consultant",
        organization: "FutureSkills Consulting",
        bio: "Expert in workforce development and digital transformation",
        imageUrl: "https://example.com/speaker3.jpg"
      }
    ],
    sponsors: [],
    notes: "Virtual format allows broader participation. Record for later viewing."
  }
];

// Conference Registrants dummy data
export const registrantsData: Omit<ConferenceRegistrant, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    conferenceId: "", // Will be set during seeding
    memberId: "", // Will be set during seeding (links to Sarah Johnson)
    registrationDate: new Date("2024-09-15T10:30:00"),
    registrationStatus: "confirmed",
    paymentStatus: "completed",
    paymentAmount: 125,
    paymentDate: new Date("2024-09-15T10:35:00"),
    currency: "USD",
    receiptUrl: "https://example.com/receipts/conf-2025-001",
    dietaryRestrictions: "Vegetarian",
    accessibilityNeeds: "",
    checkedIn: false,
    notes: "Early bird registration - board member discount applied"
  },
  {
    conferenceId: "", // Will be set during seeding
    memberId: "", // Will be set during seeding (links to Michael Chen)
    registrationDate: new Date("2024-09-20T14:15:00"),
    registrationStatus: "confirmed",
    paymentStatus: "completed",
    paymentAmount: 125,
    paymentDate: new Date("2024-09-20T14:20:00"),
    currency: "USD",
    receiptUrl: "https://example.com/receipts/conf-2025-002",
    dietaryRestrictions: "",
    accessibilityNeeds: "",
    checkedIn: false,
    notes: "Presenting during technology workshop session"
  },
  {
    conferenceId: "", // Will be set during seeding
    guestInfo: {
      firstName: "Amanda",
      lastName: "Foster",
      email: "amanda.foster@keene.edu",
      phone: "(603) 555-0201",
      organization: "Keene State College",
      position: "Assistant Professor"
    },
    registrationDate: new Date("2024-10-01T09:45:00"),
    registrationStatus: "confirmed",
    paymentStatus: "completed",
    paymentAmount: 150, // Non-member rate
    paymentDate: new Date("2024-10-01T09:50:00"),
    currency: "USD",
    receiptUrl: "https://example.com/receipts/conf-2025-003",
    dietaryRestrictions: "Gluten-free",
    accessibilityNeeds: "Wheelchair accessible seating",
    checkedIn: false,
    notes: "Non-member registration - considering membership"
  },
  {
    conferenceId: "", // Will be set during seeding (Spring workshop)
    memberId: "", // Will be set during seeding (links to Jennifer Rodriguez)
    registrationDate: new Date("2025-03-01T11:20:00"),
    registrationStatus: "confirmed",
    paymentStatus: "completed",
    paymentAmount: 45,
    paymentDate: new Date("2025-03-01T11:25:00"),
    currency: "USD",
    receiptUrl: "https://example.com/receipts/workshop-spring-001",
    dietaryRestrictions: "",
    accessibilityNeeds: "",
    checkedIn: false,
    notes: "Virtual workshop registration - very interested in digital curriculum"
  }
];

// Awards data from V1 Data CSV file
export const awardsData: Omit<Award, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: "Educator of the Year",
    icon: "",
    description: `Our most prestigious award recognizing outstanding achievement in business education. Recipients demonstrate exceptional teaching skills, innovation in curriculum development, and significant positive impact on students.

The award includes:
- Recognition at the annual conference
- $1,000 professional development grant
- Automatic nomination for NBEA national awards
- Feature article in quarterly newsletter`,
    eligibility: "Must be a current NHBEA member with at least 5 years of teaching experience. Nominees should demonstrate excellence in teaching, professional development, and service to the business education community.",
    deadline: new Date("2025-05-01T08:00:00.000Z"),
    category: "Excellence",
    isActive: true
  },
  {
    name: "Kaliski Award",
    icon: "",
    description: `This award is presented to a retired business educator in New Hampshire who served and promoted business education in New Hampshire throughout their career. It is given each year in memory of Dr. Burt Kaliski for his tireless dedication to business education.
Please include in the nomination, a short statement (500 words or less) why the person being nominated is deserving of this award.`,
    eligibility: "N/A",
    deadline: new Date("2025-09-01T08:00:00.000Z"),
    category: "Lifetime",
    isActive: true
  }
];

// Function to seed awards with original IDs from CSV
export async function seedAwards(): Promise<string[]> {
  console.log('🏆 Seeding awards...');
  const awardIds: string[] = [];
  
  // Use original IDs from the CSV file
  const originalIds = ["O8KZ53z8yPOwuYErRFZw", "fQov02WYbLHCyvYR7808"];
  
  for (let i = 0; i < awardsData.length; i++) {
    const awardData = awardsData[i];
    const awardId = originalIds[i];
    
    await setDoc(doc(db, 'awards', awardId), {
      ...awardData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    awardIds.push(awardId);
    console.log(`   ✓ Created award: ${awardData.name} (ID: ${awardId})`);
  }
  
  return awardIds;
}

// Function to seed all data
export async function seedAllCollections(): Promise<void> {
  console.log('🌱 Starting comprehensive data seeding...');
  
  try {
    // 1. Seed Organizations first (needed for member references)
    console.log('📍 Seeding organizations...');
    const orgIds: string[] = [];
    
    for (const orgData of organizationsData) {
      const docRef = await addDoc(collection(db, 'organizations'), {
        ...orgData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      orgIds.push(docRef.id);
      console.log(`   ✓ Created organization: ${orgData.name}`);
    }

    // 2. Seed Members with organization references
    console.log('👥 Seeding members...');
    const memberIds: string[] = [];
    
    for (let i = 0; i < membersData.length; i++) {
      const memberData = membersData[i];
      // Assign organization IDs cyclically
      const orgIndex = i % orgIds.length;
      
      const docRef = await addDoc(collection(db, 'members'), {
        ...memberData,
        organizationId: orgIds[orgIndex],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      memberIds.push(docRef.id);
      console.log(`   ✓ Created member: ${memberData.firstName} ${memberData.lastName}`);
    }

    // 3. Seed Conferences
    console.log('🎓 Seeding conferences...');
    const conferenceIds: string[] = [];
    
    for (const confData of conferencesData) {
      const docRef = await addDoc(collection(db, 'conference'), {
        ...confData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      conferenceIds.push(docRef.id);
      console.log(`   ✓ Created conference: ${confData.title}`);
    }

    // 4. Seed Conference Registrants with proper references
    console.log('📝 Seeding conference registrants...');
    
    for (let i = 0; i < registrantsData.length; i++) {
      const registrantData = registrantsData[i];
      let finalRegistrantData = {
        ...registrantData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Assign conference references
      if (i < 3) {
        // First 3 registrants for main conference
        finalRegistrantData.conferenceId = conferenceIds[0];
      } else {
        // Last registrant for spring workshop
        finalRegistrantData.conferenceId = conferenceIds[1];
      }

      // Assign member references where applicable
      if (registrantData.memberId === "" && !registrantData.guestInfo) {
        // Assign to existing members (first few registrations)
        if (i < memberIds.length) {
          finalRegistrantData.memberId = memberIds[i];
        }
      }

      const docRef = await addDoc(collection(db, 'registrants'), finalRegistrantData);
      console.log(`   ✓ Created registrant: ${registrantData.guestInfo ? 
        `${registrantData.guestInfo.firstName} ${registrantData.guestInfo.lastName}` : 
        'Member registration'}`);
    }

    // 5. Seed Awards with original IDs from CSV
    console.log('🏆 Seeding awards from V1 data...');
    const awardIds = await seedAwards();

    // 6. Seed existing collections for backward compatibility
    console.log('🔄 Seeding legacy collections for compatibility...');
    
    // Add some homepage content
    await setDoc(doc(db, 'content', 'homepage'), {
      heroTitle: "New Hampshire Business Educators Association",
      heroSubtitle: "Empowering educators, inspiring students, strengthening business education",
      missionTitle: "Our Mission",
      missionContent: "NHBEA is dedicated to promoting excellence in business education through professional development, networking, and advocacy for business educators and students throughout New Hampshire.",
      aboutTitle: "About NHBEA",
      aboutContent: "The New Hampshire Business Educators Association serves as the premier professional organization for business educators in the state. We provide resources, support, and opportunities for growth to help our members deliver exceptional business education to their students."
    });

    // Add some sponsors
    const sponsorsData = [
      {
        name: "NH Department of Education",
        logoURL: "https://example.com/logos/nhdoe.png",
        website: "https://www.education.nh.gov",
        order: 1
      },
      {
        name: "Business & Industry Association of NH",
        logoURL: "https://example.com/logos/bia.png", 
        website: "https://www.nhbia.org",
        order: 2
      }
    ];

    for (const sponsor of sponsorsData) {
      await addDoc(collection(db, 'sponsors'), sponsor);
    }

    console.log('✅ All collections seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • ${orgIds.length} organizations created`);
    console.log(`   • ${memberIds.length} members created`);
    console.log(`   • ${conferenceIds.length} conferences created`);
    console.log(`   • ${registrantsData.length} registrants created`);
    console.log(`   • ${awardIds.length} awards created (with original V1 IDs)`);
    console.log('   • Homepage content added');
    console.log('   • Sponsors added');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

// Function to clear all collections (use with caution)
export async function clearAllCollections(): Promise<void> {
  console.log('⚠️  This would clear all collections - implement with caution');
  // Implementation would go here if needed for development
}