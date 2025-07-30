#!/usr/bin/env node
/**
 * Firebase Storage Sponsor Images Organization Script
 * 
 * This script migrates existing sponsor images from Sponsors/ to organized
 * public/Sponsors/ directory and updates Firestore records with correct logoURL paths.
 * 
 * Usage: node scripts/migration/organize-sponsor-images.js
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
 * Main function to organize sponsor images
 */
async function organizeSponsorImages() {
  console.log('🔄 Starting Firebase Storage sponsor image organization...');
  
  try {
    const bucket = storage.bucket();
    
    // Get all files in the Sponsors directory
    const [files] = await bucket.getFiles({
      prefix: 'Sponsors/',
    });
    
    // Filter out the directory itself, only get actual files
    const imageFiles = files.filter(file => !file.name.endsWith('/'));
    
    console.log(`📁 Found ${imageFiles.length} sponsor image files`);
    
    let movedCount = 0;
    let errorCount = 0;
    
    for (const file of imageFiles) {
      try {
        const fileName = path.basename(file.name);
        const destinationPath = `public/Sponsors/${fileName}`;
        
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
    
    // Update sponsor records with new image paths
    await updateSponsorImagePaths();
    
    console.log('✅ Sponsor image organization completed!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

/**
 * Update sponsor records in Firestore with new image paths
 */
async function updateSponsorImagePaths() {
  console.log('\n🔄 Updating sponsor image paths in Firestore...');
  
  try {
    const sponsorsRef = firestore.collection('sponsors');
    const snapshot = await sponsorsRef.get();
    
    if (snapshot.empty) {
      console.log('📊 No sponsors found in Firestore');
      return;
    }
    
    // Create a mapping of sponsor names to potential image files
    const bucket = storage.bucket();
    const [publicFiles] = await bucket.getFiles({
      prefix: 'public/Sponsors/',
    });
    
    const imageFiles = publicFiles.filter(file => !file.name.endsWith('/'));
    console.log(`📁 Found ${imageFiles.length} files in public/Sponsors/`);
    
    let updateCount = 0;
    
    for (const doc of snapshot.docs) {
      const sponsorData = doc.data();
      const sponsorName = sponsorData.name;
      
      // Try to find a matching image file for this sponsor
      const matchingImage = findMatchingImage(sponsorName, imageFiles);
      
      if (matchingImage) {
        await doc.ref.update({
          logoURL: matchingImage.name
        });
        
        console.log(`✅ Updated ${sponsorName}: ${matchingImage.name}`);
        updateCount++;
      } else {
        console.log(`⚠️  No matching image found for: ${sponsorName}`);
      }
    }
    
    console.log(`📊 Updated ${updateCount} sponsor records`);
    
  } catch (error) {
    console.error('❌ Error updating sponsor image paths:', error);
    throw error;
  }
}

/**
 * Find matching image file for a sponsor name
 */
function findMatchingImage(sponsorName, imageFiles) {
  const normalizedSponsorName = sponsorName.toLowerCase()
    .replace(/[^a-z0-9]/g, ''); // Remove spaces and special chars
  
  // Try exact matches first
  for (const file of imageFiles) {
    const fileName = path.basename(file.name, path.extname(file.name)).toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    
    if (fileName === normalizedSponsorName) {
      return file;
    }
  }
  
  // Try partial matches
  for (const file of imageFiles) {
    const fileName = path.basename(file.name, path.extname(file.name)).toLowerCase();
    
    // Check if sponsor name contains file name or vice versa
    if (sponsorName.toLowerCase().includes(fileName.replace(/[^a-z0-9]/g, '')) ||
        fileName.includes(normalizedSponsorName)) {
      return file;
    }
  }
  
  // Manual mappings for known mismatches
  const manualMappings = {
    'pearson education': 'pearson',
    'cengage learning': 'cengage',
    'intuit education': 'intuit',
    'nh banking association': 'nh bankers association',
    'deca nh': 'deca',
    'future business leaders of america': 'fbla',
    'junior achievement of nh': 'junior achievement usa',
    'mcgraw hill education': 'mcgraw hill'
  };
  
  const mappedName = manualMappings[sponsorName.toLowerCase()];
  if (mappedName) {
    const normalizedMapped = mappedName.replace(/[^a-z0-9]/g, '');
    for (const file of imageFiles) {
      const fileName = path.basename(file.name, path.extname(file.name)).toLowerCase()
        .replace(/[^a-z0-9]/g, '');
      
      if (fileName.includes(normalizedMapped) || normalizedMapped.includes(fileName)) {
        return file;
      }
    }
  }
  
  return null;
}

// Run the migration
if (require.main === module) {
  organizeSponsorImages()
    .then(() => {
      console.log('\n🚀 Don\'t forget to update your components to use the new image utilities!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = {
  organizeSponsorImages,
  updateSponsorImagePaths,
  findMatchingImage
};