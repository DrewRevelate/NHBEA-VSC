// Add enhanced member data with board, past president, and hall of fame flags
// Run with: node scripts/add-enhanced-members.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlvHBg0YQyqrD1nh9Ga9X5_ZoIiRqjNFk",
  authDomain: "nhbea-64cab.firebaseapp.com",
  projectId: "nhbea-64cab",
  storageBucket: "nhbea-64cab.firebasestorage.app",
  messagingSenderId: "888734142033",
  appId: "1:888734142033:web:b8537b82a30b8b2e3c2e98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addEnhancedMembers() {
  try {
    console.log('Adding enhanced member data...');

    // First, get a reference organization ID (assuming we have one from previous script)
    const orgRef = await addDoc(collection(db, "organizations"), {
      name: "Example High School",
      type: "school",
      address: {
        street: "456 Education Ave",
        city: "Manchester",
        state: "NH",
        zipCode: "03101"
      },
      contact: {
        phone: "(603) 555-0123",
        email: "info@examplehs.edu",
        website: "https://www.examplehs.edu"
      },
      isActive: true,
      notes: "Sample high school for demo purposes",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('Sample organization created with ID:', orgRef.id);

    // 1. Current Board President (also a past president and hall of fame member)
    console.log('Adding current board president...');
    const presidentRef = await addDoc(collection(db, "members"), {
      memberNumber: "NHBEA-2024-0001",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@keene.edu",
      phone: "(603) 555-1234",
      organizationId: orgRef.id,
      position: "Business Education Professor",
      yearsExperience: 20,
      address: "123 Elm Street",
      city: "Keene",
      state: "NH",
      zipCode: "03431",
      membershipType: "professional",
      status: "active",
      joinDate: new Date('2018-01-15'),
      renewalDate: new Date('2025-01-15'),
      expirationDate: new Date('2026-01-15'),
      
      // Current Board Member
      isBoardMember: true,
      boardPosition: "President",
      boardStartDate: new Date('2024-07-01'),
      boardOrder: 1,
      
      // Past President
      isPastPresident: true,
      presidencyTerm: "2022-2023",
      presidencyStartDate: new Date('2022-07-01'),
      presidencyEndDate: new Date('2023-06-30'),
      presidencyOrder: 2,
      
      // Hall of Fame
      isHallOfFame: true,
      hallOfFameYear: 2023,
      hallOfFameAwardType: "business_educator_of_the_year",
      hallOfFameOrder: 1,
      achievements: [
        "Business Educator of the Year 2023",
        "Curriculum Innovation Award 2021",
        "Outstanding Service Award 2020"
      ],
      
      // Profile Information
      bio: "Sarah has been a passionate advocate for business education for over 20 years. She has served in multiple leadership roles and has been instrumental in modernizing business curriculum across New Hampshire schools.",
      imageUrl: "",
      
      communicationPreferences: {
        newsletter: true,
        updates: true,
        events: true,
        mailings: true
      },
      paymentHistory: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      notes: "Exceptional leader and educator"
    });
    console.log("President member document written with ID: ", presidentRef.id);

    // 2. Vice President
    console.log('Adding vice president...');
    const vpRef = await addDoc(collection(db, "members"), {
      memberNumber: "NHBEA-2023-0007",
      firstName: "Michael",
      lastName: "Chen",
      email: "michael.chen@unh.edu",
      phone: "(603) 555-2345",
      organizationId: orgRef.id,
      position: "Business Department Chair",
      yearsExperience: 12,
      address: "789 Oak Lane",
      city: "Durham",
      state: "NH",
      zipCode: "03824",
      membershipType: "professional",
      status: "active",
      joinDate: new Date('2019-03-10'),
      renewalDate: new Date('2025-03-10'),
      expirationDate: new Date('2026-03-10'),
      
      // Current Board Member
      isBoardMember: true,
      boardPosition: "Vice President",
      boardStartDate: new Date('2024-07-01'),
      boardOrder: 2,
      
      // Not a past president
      isPastPresident: false,
      
      // Not in hall of fame
      isHallOfFame: false,
      
      // Profile Information
      bio: "Michael specializes in entrepreneurship education and has helped launch numerous student business ventures. He brings innovative teaching methods and industry connections to the association.",
      imageUrl: "",
      
      communicationPreferences: {
        newsletter: true,
        updates: true,
        events: true,
        mailings: false
      },
      paymentHistory: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      notes: "Strong advocate for entrepreneurship education"
    });
    console.log("Vice President member document written with ID: ", vpRef.id);

    // 3. Past President (not current board member)
    console.log('Adding past president...');
    const pastPresRef = await addDoc(collection(db, "members"), {
      memberNumber: "NHBEA-2020-0012",
      firstName: "Robert",
      lastName: "Williams",
      email: "robert.williams@plymouth.edu",
      phone: "(603) 555-3456",
      organizationId: orgRef.id,
      position: "Retired Business Teacher",
      yearsExperience: 35,
      address: "456 Pine Street",
      city: "Plymouth",
      state: "NH",
      zipCode: "03264",
      membershipType: "retired",
      status: "active",
      joinDate: new Date('2005-08-20'),
      renewalDate: new Date('2025-08-20'),
      expirationDate: new Date('2026-08-20'),
      
      // Not current board member
      isBoardMember: false,
      
      // Past President
      isPastPresident: true,
      presidencyTerm: "2021-2022",
      presidencyStartDate: new Date('2021-07-01'),
      presidencyEndDate: new Date('2022-06-30'),
      presidencyOrder: 1, // Most recent past president
      
      // Hall of Fame
      isHallOfFame: true,
      hallOfFameYear: 2022,
      hallOfFameAwardType: "lifetime_achievement",
      hallOfFameOrder: 2,
      achievements: [
        "Lifetime Achievement Award 2022",
        "35 Years of Distinguished Service",
        "Mentor to over 200 business educators"
      ],
      
      // Profile Information
      bio: "Robert served as a business educator for 35 years and mentored countless teachers throughout New Hampshire. His dedication to the profession and leadership in the association have left a lasting impact on business education in the state.",
      imageUrl: "",
      
      communicationPreferences: {
        newsletter: true,
        updates: true,
        events: true,
        mailings: true
      },
      paymentHistory: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      notes: "Respected veteran educator and mentor"
    });
    console.log("Past President member document written with ID: ", pastPresRef.id);

    // 4. Hall of Fame Member (not board or past president)
    console.log('Adding hall of fame member...');
    const hofRef = await addDoc(collection(db, "members"), {
      memberNumber: "NHBEA-2015-0003",
      firstName: "Jennifer",
      lastName: "Rodriguez",
      email: "jennifer.rodriguez@snhu.edu",
      phone: "(603) 555-4567",
      organizationId: orgRef.id,
      position: "Business Curriculum Specialist",
      yearsExperience: 18,
      address: "321 Maple Drive",
      city: "Hooksett",
      state: "NH",
      zipCode: "03106",
      membershipType: "professional",
      status: "active",
      joinDate: new Date('2015-09-12'),
      renewalDate: new Date('2025-09-12'),
      expirationDate: new Date('2026-09-12'),
      
      // Not current board member
      isBoardMember: false,
      
      // Not a past president
      isPastPresident: false,
      
      // Hall of Fame
      isHallOfFame: true,
      hallOfFameYear: 2021,
      hallOfFameAwardType: "business_educator_of_the_year",
      hallOfFameOrder: 3,
      achievements: [
        "Business Educator of the Year 2021",
        "Curriculum Development Excellence Award",
        "Published 3 business education textbooks"
      ],
      
      // Profile Information
      bio: "Jennifer is a renowned curriculum developer who has authored several influential business education textbooks. Her innovative approaches to teaching business concepts have been adopted by schools throughout New England.",
      imageUrl: "",
      
      communicationPreferences: {
        newsletter: true,
        updates: true,
        events: true,
        mailings: true
      },
      paymentHistory: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      notes: "Leading curriculum development expert"
    });
    console.log("Hall of Fame member document written with ID: ", hofRef.id);

    // 5. Regular Board Member
    console.log('Adding regular board member...');
    const boardRef = await addDoc(collection(db, "members"), {
      memberNumber: "NHBEA-2022-0015",
      firstName: "David",
      lastName: "Thompson",
      email: "david.thompson@nashua.edu",
      phone: "(603) 555-5678",
      organizationId: orgRef.id,
      position: "Business Teacher",
      yearsExperience: 8,
      address: "654 Birch Road",
      city: "Nashua",
      state: "NH",
      zipCode: "03060",
      membershipType: "professional",
      status: "active",
      joinDate: new Date('2022-01-10'),
      renewalDate: new Date('2025-01-10'),
      expirationDate: new Date('2026-01-10'),
      
      // Current Board Member
      isBoardMember: true,
      boardPosition: "Treasurer",
      boardStartDate: new Date('2024-07-01'),
      boardOrder: 4,
      
      // Not a past president
      isPastPresident: false,
      
      // Not in hall of fame
      isHallOfFame: false,
      
      // Profile Information
      bio: "David brings financial expertise and fresh perspectives to the board. He has been instrumental in modernizing the association's financial processes and securing funding for new educational programs.",
      imageUrl: "",
      
      communicationPreferences: {
        newsletter: true,
        updates: true,
        events: true,
        mailings: false
      },
      paymentHistory: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      notes: "Excellent financial management skills"
    });
    console.log("Board member document written with ID: ", boardRef.id);

    console.log('\n✅ All enhanced member data added successfully!');
    console.log('Members now include proper flags for board, past president, and hall of fame status');
    console.log('You can view the updated Members collection in FireCMS at: https://app.firecms.co/p/nhbea-64cab');

  } catch (e) {
    console.error("Error adding enhanced member documents: ", e);
  }
}

// Run the function
addEnhancedMembers();