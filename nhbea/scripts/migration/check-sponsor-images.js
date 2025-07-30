#!/usr/bin/env node
/**
 * Check for existing sponsor images in Firebase Storage
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

async function listSponsorImages() {
  const storage = admin.storage();
  const bucket = storage.bucket();
  
  try {
    console.log('🔍 Checking for sponsor images...');
    
    // Check various possible directories
    const possibleDirs = ['sponsors/', 'Sponsor_Images/', 'sponsor_images/', 'logos/'];
    
    for (const dir of possibleDirs) {
      try {
        const [files] = await bucket.getFiles({ prefix: dir });
        if (files.length > 0) {
          console.log(`📁 Found ${files.length} files in ${dir}:`);
          files.forEach(file => console.log(`  - ${file.name}`));
        } else {
          console.log(`📁 No files found in ${dir}`);
        }
      } catch (err) {
        console.log(`📁 Directory ${dir} not accessible`);
      }
    }
    
    // Also check root level for any sponsor-related files
    console.log('🔍 Checking root level for sponsor files...');
    const [rootFiles] = await bucket.getFiles();
    const sponsorFiles = rootFiles.filter(file => 
      file.name.toLowerCase().includes('sponsor') || 
      file.name.toLowerCase().includes('logo')
    );
    
    if (sponsorFiles.length > 0) {
      console.log(`📁 Found ${sponsorFiles.length} sponsor-related files in root:`);
      sponsorFiles.forEach(file => console.log(`  - ${file.name}`));
    } else {
      console.log('📁 No sponsor-related files found in root');
    }
    
    // Check Firestore for sponsor data to see what logoURL paths are used
    console.log('\n🔍 Checking Firestore for sponsor data...');
    const firestore = admin.firestore();
    const sponsorsSnapshot = await firestore.collection('sponsors').get();
    
    if (!sponsorsSnapshot.empty) {
      console.log(`📊 Found ${sponsorsSnapshot.size} sponsors in Firestore:`);
      sponsorsSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`  - ${data.name}: ${data.logoURL || 'No logo URL'}`);
      });
    } else {
      console.log('📊 No sponsors found in Firestore');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

listSponsorImages();