#!/usr/bin/env node
/**
 * Test homepage functions
 */

const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const firestore = admin.firestore();

async function testHomepageFunctions() {
  console.log('🧪 Testing homepage functions...\n');
  
  try {
    // Test 1: Homepage content loading
    console.log('1️⃣ Testing homepage content loading...');
    const docRef = firestore.collection('content').doc('homepage');
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      const data = docSnap.data();
      console.log('   ✅ Homepage content loaded successfully');
      console.log(`   📄 Hero Title: "${data.heroTitle}"`);
      console.log(`   📄 Mission Title: "${data.missionTitle}"`);
    } else {
      console.log('   ❌ Homepage content not found');
    }
    
    // Test 2: Sponsors loading
    console.log('\n2️⃣ Testing sponsors loading...');
    const sponsorsRef = firestore.collection('sponsors');
    const sponsorsSnap = await sponsorsRef.get();
    
    console.log(`   ✅ Found ${sponsorsSnap.size} sponsors`);
    let sponsorsWithImages = 0;
    sponsorsSnap.forEach(doc => {
      const data = doc.data();
      if (data.logoURL) {
        sponsorsWithImages++;
      }
    });
    console.log(`   🖼️  ${sponsorsWithImages} sponsors have logo URLs`);
    
    // Test 3: Members loading (for any homepage stats)
    console.log('\n3️⃣ Testing members loading...');
    const membersRef = firestore.collection('members');
    const membersSnap = await membersRef.get();
    
    console.log(`   ✅ Found ${membersSnap.size} members`);
    let boardMembers = 0;
    membersSnap.forEach(doc => {
      const data = doc.data();
      if (data.profile?.activeBoardMember) {
        boardMembers++;
      }
    });
    console.log(`   👥 ${boardMembers} active board members`);
    
    // Test 4: Check storage access
    console.log('\n4️⃣ Testing storage access...');
    const storage = admin.storage();
    const bucket = storage.bucket();
    
    const [publicFiles] = await bucket.getFiles({ prefix: 'public/' });
    const [memberImages] = await bucket.getFiles({ prefix: 'public/Member_Images/' });
    const [sponsorImages] = await bucket.getFiles({ prefix: 'public/Sponsors/' });
    
    console.log(`   ✅ ${publicFiles.length} total public files`);
    console.log(`   👤 ${memberImages.length} public member images`);
    console.log(`   🏢 ${sponsorImages.length} public sponsor images`);
    
    console.log('\n🎉 All homepage functions tested successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  }
}

// Run tests
if (require.main === module) {
  testHomepageFunctions()
    .then(() => {
      console.log('\n✅ Homepage tests completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Tests failed:', error);
      process.exit(1);
    });
}

module.exports = { testHomepageFunctions };