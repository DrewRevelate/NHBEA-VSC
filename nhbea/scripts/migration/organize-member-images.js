#!/usr/bin/env node
/**
 * Firebase Storage Image Organization Script
 * 
 * This script migrates existing member images from Member_Images/ to organized
 * public/Member_Images/ and private/Member_Images/ directories.
 * 
 * Usage: node scripts/migration/organize-member-images.js
 */

const admin = require('firebase-admin');
const path = require('path');
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

const storage = admin.storage();
const firestore = admin.firestore();

/**
 * Main function to organize member images
 */
async function organizeImages() {
  console.log('🔄 Starting Firebase Storage image organization...');
  
  try {
    const bucket = storage.bucket();
    
    // Get all files in the Member_Images directory
    const [files] = await bucket.getFiles({
      prefix: 'Member_Images/',
    });
    
    console.log(`📁 Found ${files.length} files in Member_Images directory`);
    
    // Create public and private directories
    console.log('📂 Creating directory structure...');
    
    let movedCount = 0;
    let errorCount = 0;
    
    for (const file of files) {
      try {
        const fileName = path.basename(file.name);
        const isPublicImage = await shouldBePublic(fileName);
        
        const destinationPath = isPublicImage 
          ? `public/Member_Images/${fileName}`
          : `private/Member_Images/${fileName}`;
        
        // Copy the file to the new location
        const [newFile] = await file.copy(destinationPath);
        console.log(`✅ Moved ${file.name} → ${destinationPath}`);
        
        // Optionally delete the original file (uncomment to enable)
        // await file.delete();
        
        movedCount++;
      } catch (error) {
        console.error(`❌ Error processing ${file.name}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Migration Summary:`);
    console.log(`✅ Successfully moved: ${movedCount} files`);
    console.log(`❌ Errors: ${errorCount} files`);
    
    // Update member records to use new public paths
    await updateMemberImagePaths();
    
    console.log('✅ Image organization completed!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

/**
 * Determine if an image should be public based on member preferences
 */
async function shouldBePublic(fileName) {
  try {
    // Query members collection to see if this image belongs to a member
    // who wants their photo to be public (directory listing enabled)
    const membersRef = firestore.collection('members');
    const snapshot = await membersRef
      .where('image', '==', `Member_Images/${fileName}`)
      .get();
    
    if (snapshot.empty) {
      // Default to public if we can't find the member record
      console.log(`⚠️  Member not found for ${fileName}, defaulting to public`);
      return true;
    }
    
    const memberDoc = snapshot.docs[0];
    const memberData = memberDoc.data();
    
    // Check if member has directory listing enabled (public profile)
    const isPublic = memberData.preferences?.directoryListing !== false;
    
    console.log(`👤 ${fileName}: ${isPublic ? 'PUBLIC' : 'PRIVATE'} (Member: ${memberData.personalInfo?.firstName} ${memberData.personalInfo?.lastName})`);
    
    return isPublic;
    
  } catch (error) {
    console.error(`⚠️  Error checking member for ${fileName}, defaulting to public:`, error.message);
    return true;
  }
}

/**
 * Update member records to use new public image paths
 */
async function updateMemberImagePaths() {
  console.log('\n🔄 Updating member image paths...');
  
  try {
    const membersRef = firestore.collection('members');
    const snapshot = await membersRef.get();
    
    let updateCount = 0;
    
    for (const doc of snapshot.docs) {
      const memberData = doc.data();
      
      if (memberData.image && memberData.image.startsWith('Member_Images/')) {
        const fileName = path.basename(memberData.image);
        const isPublic = memberData.preferences?.directoryListing !== false;
        
        const newImagePath = isPublic 
          ? `public/Member_Images/${fileName}`
          : `private/Member_Images/${fileName}`;
        
        await doc.ref.update({
          image: newImagePath
        });
        
        console.log(`✅ Updated ${doc.id}: ${memberData.image} → ${newImagePath}`);
        updateCount++;
      }
    }
    
    console.log(`📊 Updated ${updateCount} member records`);
    
  } catch (error) {
    console.error('❌ Error updating member image paths:', error);
    throw error;
  }
}

/**
 * Utility function to deploy the new storage rules
 */
async function deployStorageRules() {
  console.log('\n🚀 Don\'t forget to deploy the new storage rules:');
  console.log('   firebase deploy --only storage');
  console.log('\n📋 Storage rules location: storage.rules');
}

// Run the migration
if (require.main === module) {
  organizeImages()
    .then(() => {
      deployStorageRules();
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = {
  organizeImages,
  shouldBePublic,
  updateMemberImagePaths
};