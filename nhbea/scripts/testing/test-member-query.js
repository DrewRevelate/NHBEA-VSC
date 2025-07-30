// Test member queries to debug why board members aren't showing
// Run with: node scripts/test-member-query.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

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

async function testMemberQueries() {
  try {
    console.log('Testing member queries...\n');

    // Test 1: Get all members
    console.log('1. Getting all members...');
    const allMembersQuery = query(collection(db, 'members'));
    const allMembersSnapshot = await getDocs(allMembersQuery);
    console.log(`Found ${allMembersSnapshot.size} total members`);
    
    allMembersSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`- ${doc.id}: ${data.personalInfo?.firstName || 'No firstName'} ${data.personalInfo?.lastName || 'No lastName'}`);
      console.log(`  Board Member: ${data.profile?.activeBoardMember || 'undefined'}`);
      console.log(`  Board Position: ${data.profile?.boardPosition || 'undefined'}`);
      console.log(`  Status: ${data.membership?.status || 'undefined'}`);
      console.log('');
    });

    // Test 2: Try the enhanced board members query
    console.log('\n2. Testing enhanced board members query...');
    try {
      const boardQuery = query(
        collection(db, 'members'),
        where('profile.activeBoardMember', '==', true),
        where('membership.status', '==', 'active')
      );
      const boardSnapshot = await getDocs(boardQuery);
      console.log(`Found ${boardSnapshot.size} enhanced board members`);
      
      boardSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`- ${data.personalInfo?.firstName} ${data.personalInfo?.lastName} - ${data.profile?.boardPosition}`);
      });
    } catch (error) {
      console.log('Enhanced board query failed:', error.message);
    }

    // Test 3: Try legacy board members query (fallback)
    console.log('\n3. Testing legacy board members query...');
    try {
      const legacyBoardQuery = query(collection(db, 'boardMembers'));
      const legacyBoardSnapshot = await getDocs(legacyBoardQuery);
      console.log(`Found ${legacyBoardSnapshot.size} legacy board members`);
      
      legacyBoardSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`- ${data.name} - ${data.title}`);
      });
    } catch (error) {
      console.log('Legacy board query failed:', error.message);
    }

    // Test 4: Try past presidents query
    console.log('\n4. Testing past presidents query...');
    try {
      const pastPresQuery = query(
        collection(db, 'members'),
        where('profile.isPastPresident', '==', true)
      );
      const pastPresSnapshot = await getDocs(pastPresQuery);
      console.log(`Found ${pastPresSnapshot.size} past presidents`);
      
      pastPresSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`- ${data.personalInfo?.firstName} ${data.personalInfo?.lastName} - ${data.profile?.presidencyTerm}`);
      });
    } catch (error) {
      console.log('Past presidents query failed:', error.message);
    }

    // Test 5: Check legacy past presidents
    console.log('\n5. Testing legacy past presidents query...');
    try {
      const legacyPastPresQuery = query(collection(db, 'pastPresidents'));
      const legacyPastPresSnapshot = await getDocs(legacyPastPresQuery);
      console.log(`Found ${legacyPastPresSnapshot.size} legacy past presidents`);
      
      legacyPastPresSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`- ${data.name} - ${data.term}`);
      });
    } catch (error) {
      console.log('Legacy past presidents query failed:', error.message);
    }

  } catch (e) {
    console.error("Error testing queries: ", e);
  }
}

// Run the function
testMemberQueries();