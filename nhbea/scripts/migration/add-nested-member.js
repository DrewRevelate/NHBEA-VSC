// Add a member with the correct nested structure to match FireCMS
// Run with: node scripts/add-nested-member.js

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

async function addNestedMember() {
  try {
    console.log('Adding member with nested structure...');

    // Create organization first
    const orgRef = await addDoc(collection(db, "organizations"), {
      name: "Plymouth State University",
      type: "university",
      address: {
        street: "17 High Street",
        city: "Plymouth",
        state: "NH",
        zipCode: "03264"
      },
      contact: {
        phone: "(603) 535-5000",
        email: "info@plymouth.edu",
        website: "https://www.plymouth.edu"
      },
      isActive: true,
      notes: "Public university in Plymouth, New Hampshire",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Add member with nested structure matching FireCMS
    const memberRef = await addDoc(collection(db, "members"), {
      personalInfo: {
        firstName: "Dorothy",
        lastName: "O'Gara",
        phone: "(603) 555-1234",
        email: "dorothy.ogara@plymouth.edu"
      },
      organization: {
        address: orgRef.id, // Reference to organization
        title: "Professor"
      },
      membership: {
        type: "individual",
        membershipYear: "2025",
        status: "active",
        renewalDate: new Date('2025-12-31'),
        autoRenewal: true,
        joinDate: new Date('2020-01-15')
      },
      profile: {
        activeBoardMember: true,
        boardPosition: "President",
        boardOrder: 1,
        bio: "Dorothy has been a dedicated educator and leader in business education for over 20 years. She brings extensive experience in curriculum development and educational leadership to her role as President.",
        isPastPresident: false,
        isHallOfFame: false
      },
      preferences: {
        emailNotifications: false,
        directoryListing: true,
        newsletterSubscription: false
      },
      metadata: {
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        createdBy: "admin"
      }
    });

    console.log("Member document written with ID: ", memberRef.id);

    // Add another member - Vice President
    const vpRef = await addDoc(collection(db, "members"), {
      personalInfo: {
        firstName: "Michael",
        lastName: "Johnson",
        phone: "(603) 555-5678",
        email: "michael.johnson@plymouth.edu"
      },
      organization: {
        address: orgRef.id,
        title: "Associate Professor"
      },
      membership: {
        type: "individual",
        membershipYear: "2025",
        status: "active",
        renewalDate: new Date('2025-12-31'),
        autoRenewal: true,
        joinDate: new Date('2019-08-20')
      },
      profile: {
        activeBoardMember: true,
        boardPosition: "Vice President",
        boardOrder: 2,
        bio: "Michael specializes in entrepreneurship education and has helped launch numerous student business ventures.",
        isPastPresident: false,
        isHallOfFame: false
      },
      preferences: {
        emailNotifications: true,
        directoryListing: true,
        newsletterSubscription: true
      },
      metadata: {
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        createdBy: "admin"
      }
    });

    console.log("VP Member document written with ID: ", vpRef.id);

    // Add a past president
    const pastPresRef = await addDoc(collection(db, "members"), {
      personalInfo: {
        firstName: "Robert",
        lastName: "Williams",
        phone: "(603) 555-9999",
        email: "robert.williams@retired.edu"
      },
      organization: {
        address: orgRef.id,
        title: "Retired Professor"
      },
      membership: {
        type: "individual",
        membershipYear: "2025",
        status: "active",
        renewalDate: new Date('2025-12-31'),
        autoRenewal: true,
        joinDate: new Date('2005-01-15')
      },
      profile: {
        activeBoardMember: false,
        bio: "Robert served as president from 2021-2022 and has been a pillar of the business education community for over 30 years.",
        isPastPresident: true,
        presidencyTerm: "2021-2022",
        presidencyOrder: 1, // Most recent past president
        isHallOfFame: true,
        hallOfFameYear: 2022,
        hallOfFameAwardType: "lifetime_achievement",
        hallOfFameOrder: 1,
        achievements: [
          "Lifetime Achievement Award 2022",
          "30+ Years of Distinguished Service",
          "Mentored over 100 business educators"
        ]
      },
      preferences: {
        emailNotifications: true,
        directoryListing: true,
        newsletterSubscription: true
      },
      metadata: {
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        createdBy: "admin"
      }
    });

    console.log("Past President document written with ID: ", pastPresRef.id);

    console.log('\n✅ All nested member data added successfully!');
    console.log('Members now use the proper nested structure matching FireCMS');
    console.log('You can view the updated Members collection in FireCMS at: https://app.firecms.co/p/nhbea-64cab');

  } catch (e) {
    console.error("Error adding nested member documents: ", e);
  }
}

// Run the function
addNestedMember();