// Add dummy data to all FireCMS collections using Firebase v9+ SDK
// Run with: node scripts/add-dummy-data.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';

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

async function addDummyData() {
  try {
    console.log('Adding dummy data to all collections...');

    // 1. Organizations Collection
    console.log('Adding organization...');
    const orgRef = await addDoc(collection(db, "organizations"), {
      name: "Keene State College",
      type: "college",
      address: {
        street: "229 Main Street",
        city: "Keene",
        state: "NH",
        zipCode: "03435"
      },
      contact: {
        phone: "(603) 352-1909",
        email: "info@keene.edu",
        website: "https://www.keene.edu"
      },
      isActive: true,
      notes: "Public liberal arts college in Keene, New Hampshire",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log("Organization document written with ID: ", orgRef.id);

    // 2. Members Collection
    console.log('Adding member...');
    const memberRef = await addDoc(collection(db, "members"), {
      memberNumber: "NHBEA-2025-0001",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@keene.edu",
      phone: "(603) 555-1234",
      organizationId: orgRef.id,
      position: "Business Education Professor",
      yearsExperience: 15,
      address: "123 Elm Street",
      city: "Keene",
      state: "NH",
      zipCode: "03431",
      membershipType: "professional",
      status: "active",
      joinDate: new Date('2020-01-15'),
      renewalDate: new Date('2025-01-15'),
      expirationDate: new Date('2026-01-15'),
      isBoardMember: true,
      boardPosition: "President",
      boardStartDate: new Date('2024-07-01'),
      communicationPreferences: {
        newsletter: true,
        updates: true,
        events: true,
        mailings: true
      },
      paymentHistory: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      notes: "Current board president, excellent leader"
    });
    console.log("Member document written with ID: ", memberRef.id);

    // 3. Conference Collection
    console.log('Adding conference...');
    const conferenceRef = await addDoc(collection(db, "conference"), {
      title: "2025 NHBEA Annual Conference",
      theme: "Innovation in Business Education",
      description: "Join us for our annual conference featuring the latest trends and best practices in business education.",
      startDate: new Date('2025-03-15T09:00:00'),
      endDate: new Date('2025-03-15T16:00:00'),
      timezone: "America/New_York",
      isVirtual: false,
      venue: {
        name: "Keene State College Student Center",
        address: "229 Main Street",
        city: "Keene",
        state: "NH",
        zipCode: "03435",
        directions: "Main entrance, second floor ballroom"
      },
      registrationFee: 75.00,
      currency: "USD",
      maxCapacity: 150,
      registrationDeadline: new Date('2025-03-01T23:59:59'),
      isRegistrationOpen: true,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      notes: "Annual flagship conference event"
    });
    console.log("Conference document written with ID: ", conferenceRef.id);

    // 4. Conference Registrants Collection
    console.log('Adding conference registrant...');
    const registrantRef = await addDoc(collection(db, "registrants"), {
      conferenceId: conferenceRef.id,
      memberId: memberRef.id,
      registrationDate: new Date('2025-01-15T10:30:00'),
      registrationStatus: "confirmed",
      paymentStatus: "completed",
      paymentAmount: 75.00,
      currency: "USD",
      paymentDate: new Date('2025-01-15T10:35:00'),
      receiptUrl: "https://example.com/receipt/12345",
      dietaryRestrictions: "",
      accessibilityNeeds: "",
      checkedIn: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      notes: "Board member registration"
    });
    console.log("Registrant document written with ID: ", registrantRef.id);

    // 5. Homepage Content Collection (using setDoc with specific ID)
    console.log('Adding homepage content...');
    await setDoc(doc(db, "content", "homepage"), {
      heroTitle: "New Hampshire Business Educators Association",
      heroSubtitle: "Empowering educators, inspiring students, and strengthening business education across New Hampshire",
      heroImageURL: "",
      missionTitle: "Our Mission",
      missionContent: "NHBEA is dedicated to promoting excellence in business education through professional development, networking, and advocacy for business educators and students throughout New Hampshire.",
      aboutTitle: "About NHBEA",
      aboutContent: "The New Hampshire Business Educators Association serves as the premier professional organization for business educators in the state. We provide resources, support, and opportunities for growth to help our members deliver exceptional business education to their students.",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log("Content document written with ID: homepage");

    // 6. Board Members Collection
    console.log('Adding board member...');
    const boardRef = await addDoc(collection(db, "boardMembers"), {
      name: "Sarah Johnson",
      title: "President",
      bio: "Sarah has been an advocate for business education for over 15 years, bringing innovative teaching methods to the classroom.",
      imageURL: "",
      order: 1
    });
    console.log("Board member document written with ID: ", boardRef.id);

    // 7. Past Presidents Collection
    console.log('Adding past president...');
    const pastPresRef = await addDoc(collection(db, "pastPresidents"), {
      name: "Robert Williams",
      term: "2022-2023",
      order: 1
    });
    console.log("Past president document written with ID: ", pastPresRef.id);

    // 8. Sponsors Collection
    console.log('Adding sponsor...');
    const sponsorRef = await addDoc(collection(db, "sponsors"), {
      name: "Sample Business Partner",
      logoURL: "",
      website: "https://example.com",
      order: 1
    });
    console.log("Sponsor document written with ID: ", sponsorRef.id);

    // 9. Student Applicants Collection
    console.log('Adding student applicant...');
    const studentRef = await addDoc(collection(db, "studentApplicants"), {
      personalInfo: {
        firstName: "Emma",
        lastName: "Wilson",
        email: "emma.wilson@student.keene.edu",
        phone: "(603) 555-9876"
      },
      academicInfo: {
        institution: "Keene State College",
        major: "Business Administration",
        graduationYear: 2026,
        gpa: 3.7
      },
      essay: "I am passionate about business education and want to contribute to the future of the field...",
      references: [
        {
          name: "Dr. Smith",
          email: "dr.smith@keene.edu",
          relationship: "Professor"
        },
        {
          name: "Jane Doe",
          email: "jane.doe@keene.edu",
          relationship: "Academic Advisor"
        }
      ],
      submittedAt: serverTimestamp(),
      status: "pending"
    });
    console.log("Student applicant document written with ID: ", studentRef.id);

    // 10. Newsletter Subscribers Collection
    console.log('Adding newsletter subscriber...');
    const newsletterRef = await addDoc(collection(db, "newsletterSubscribers"), {
      email: "newsletter@example.com",
      timestamp: serverTimestamp(),
      status: "active",
      source: "website"
    });
    console.log("Newsletter subscriber document written with ID: ", newsletterRef.id);

    console.log('\n✅ All dummy data added successfully!');
    console.log('You can now view all collections in FireCMS at: https://app.firecms.co/p/nhbea-64cab');

  } catch (e) {
    console.error("Error adding documents: ", e);
  }
}

// Run the function
addDummyData();