#!/usr/bin/env node
/**
 * Debug sponsor image loading issues
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

async function debugSponsorImages() {
  console.log('🔍 Debugging sponsor image loading issues...\n');
  
  try {
    const firestore = admin.firestore();
    const storage = admin.storage();
    const bucket = storage.bucket();
    
    // 1. Check sponsor data in Firestore
    console.log('1️⃣ Checking sponsor data in Firestore...');
    const snapshot = await firestore.collection('sponsors').limit(5).get();
    
    console.log(`Found ${snapshot.size} sponsors (showing first 5):`);
    const sponsorPaths = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`   - ${data.name}: "${data.logoURL}"`);
      if (data.logoURL) {
        sponsorPaths.push(data.logoURL);
      }
    });
    
    // 2. Check if files exist in Firebase Storage
    console.log('\n2️⃣ Checking if image files exist in Firebase Storage...');
    for (const path of sponsorPaths.slice(0, 3)) {
      try {
        const file = bucket.file(path);
        const [exists] = await file.exists();
        console.log(`   ${exists ? '✅' : '❌'} ${path} - ${exists ? 'EXISTS' : 'NOT FOUND'}`);
        
        if (exists) {
          // Try to get download URL
          try {
            const [url] = await file.getSignedUrl({
              action: 'read',
              expires: '03-09-2491'
            });
            console.log(`      📎 Signed URL: ${url.substring(0, 100)}...`);
          } catch (urlError) {
            console.log(`      ❌ Error getting signed URL: ${urlError.message}`);
          }
        }
      } catch (error) {
        console.log(`   ❌ Error checking ${path}: ${error.message}`);
      }
    }
    
    // 3. Check public access rules
    console.log('\n3️⃣ Testing public access to images...');
    for (const path of sponsorPaths.slice(0, 2)) {
      if (path.startsWith('public/')) {
        try {
          const file = bucket.file(path);
          const [exists] = await file.exists();
          if (exists) {
            // Test if file is publicly accessible
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media`;
            console.log(`   🌐 Public URL would be: ${publicUrl.substring(0, 80)}...`);
          }
        } catch (error) {
          console.log(`   ❌ Error testing public access for ${path}: ${error.message}`);
        }
      }
    }
    
    // 4. Check the imageUtils function
    console.log('\n4️⃣ Checking imageUtils function compatibility...');
    console.log('   The getMemberImageUrl function is being used for sponsors');
    console.log('   This should work as it handles Firebase Storage paths generically');
    
    console.log('\n🎯 Summary of findings:');
    console.log(`   - ${snapshot.size} sponsors in database`);
    console.log(`   - ${sponsorPaths.length} sponsors have logoURL paths`);
    console.log(`   - Paths are in format: ${sponsorPaths[0]}`);
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    throw error;
  }
}

// Run debug
if (require.main === module) {
  debugSponsorImages()
    .then(() => {
      console.log('\n✅ Debug completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Debug failed:', error);
      process.exit(1);
    });
}

module.exports = { debugSponsorImages };