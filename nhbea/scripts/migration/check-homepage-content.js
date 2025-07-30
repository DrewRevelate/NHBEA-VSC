#!/usr/bin/env node
/**
 * Check and optionally create homepage content in Firestore
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

async function checkHomepageContent() {
  console.log('🔍 Checking homepage content in Firestore...');
  
  try {
    const docRef = firestore.collection('content').doc('homepage');
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      console.log('✅ Homepage content found:');
      const data = docSnap.data();
      console.log(`   - Hero Title: ${data.heroTitle || 'Not set'}`);
      console.log(`   - Hero Subtitle: ${data.heroSubtitle || 'Not set'}`);
      console.log(`   - Mission Title: ${data.missionTitle || 'Not set'}`);
      console.log(`   - About Title: ${data.aboutTitle || 'Not set'}`);
    } else {
      console.log('❌ No homepage content found in Firestore');
      console.log('🔄 Creating default homepage content...');
      
      const defaultContent = {
        heroTitle: "New Hampshire Business Educators Association",
        heroSubtitle: "Promoting excellence in business education throughout New Hampshire through professional development, networking, and career advancement opportunities.",
        missionTitle: "Our Mission", 
        missionContent: "The New Hampshire Business Educators Association is dedicated to promoting excellence in business education through professional development, networking, and advocacy for educators across the state.",
        aboutTitle: "About NHBEA",
        aboutContent: "Founded to support business educators in New Hampshire, NHBEA provides resources, professional development opportunities, and a community for educators to share best practices and advance the field of business education.",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      await docRef.set(defaultContent);
      console.log('✅ Default homepage content created successfully!');
    }
    
  } catch (error) {
    console.error('❌ Error checking homepage content:', error.message);
  }
}

// Also check collections structure
async function checkCollections() {
  console.log('\n🔍 Checking Firestore collections...');
  
  try {
    const collections = await firestore.listCollections();
    console.log('📋 Available collections:');
    collections.forEach(collection => {
      console.log(`   - ${collection.id}`);
    });
    
    // Check content collection specifically
    const contentRef = firestore.collection('content');
    const contentSnap = await contentRef.get();
    
    console.log(`\n📊 Content collection has ${contentSnap.size} documents`);
    contentSnap.forEach(doc => {
      console.log(`   - ${doc.id}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking collections:', error.message);
  }
}

// Run checks
if (require.main === module) {
  Promise.all([checkHomepageContent(), checkCollections()])
    .then(() => {
      console.log('\n✅ Homepage content check completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Check failed:', error);
      process.exit(1);
    });
}

module.exports = {
  checkHomepageContent,
  checkCollections
};