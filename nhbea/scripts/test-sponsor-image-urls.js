#!/usr/bin/env node
/**
 * Test the new sponsor image URL generation
 */

require('dotenv').config({ path: '.env.local' });

async function testSponsorImageUrls() {
  console.log('🧪 Testing sponsor image URL generation...\n');
  
  // Test paths from our database
  const testPaths = [
    'public/Sponsors/Pearson.jpg',
    'public/Sponsors/Cengage.png',
    'public/Sponsors/TD Bank.png'
  ];
  
  for (const path of testPaths) {
    console.log(`Testing: ${path}`);
    
    // Construct direct public URL like our function does
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    const encodedPath = encodeURIComponent(path);
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`;
    
    console.log(`   Generated URL: ${publicUrl}`);
    
    // Test if accessible
    try {
      const response = await fetch(publicUrl, { method: 'HEAD' });
      console.log(`   Status: ${response.status} ${response.statusText}`);
      console.log(`   Content-Type: ${response.headers.get('content-type')}`);
      console.log(`   Accessible: ${response.ok ? '✅ YES' : '❌ NO'}`);
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }
    console.log('');
  }
}

// We need fetch in Node.js
if (typeof fetch === 'undefined') {
  console.log('Installing node-fetch for testing...');
  try {
    // Try to use fetch from node (18+)
    global.fetch = require('node:fetch');
  } catch (e) {
    console.log('Node fetch not available, installing node-fetch...');
    // For older Node versions, would need to install node-fetch
    process.exit(0);
  }
}

testSponsorImageUrls()
  .then(() => console.log('✅ URL testing completed!'))
  .catch(console.error);