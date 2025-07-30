const admin = require('firebase-admin');
const fs = require('fs');

// Load environment variables manually
const envPath = '.env.local';
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

// Initialize Firebase Admin SDK using environment variables
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID || 'nhbea-64cab',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

// Award data from CSV file
const awards = [
  {
    id: "O8KZ53z8yPOwuYErRFZw",
    name: "Educator of the Year",
    icon: null,
    description: `Our most prestigious award recognizing outstanding achievement in business education. Recipients demonstrate exceptional teaching skills, innovation in curriculum development, and significant positive impact on students.

The award includes:
- Recognition at the annual conference
- $1,000 professional development grant
- Automatic nomination for NBEA national awards
- Feature article in quarterly newsletter`,
    eligibility: "Must be a current NHBEA member with at least 5 years of teaching experience. Nominees should demonstrate excellence in teaching, professional development, and service to the business education community.",
    deadline: new Date("2025-05-01T08:00:00.000Z"),
    category: "Excellence",
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: "fQov02WYbLHCyvYR7808", 
    name: "Kaliski Award",
    icon: null,
    description: `This award is presented to a retired business educator in New Hampshire who served and promoted business education in New Hampshire throughout their career. It is given each year in memory of Dr. Burt Kaliski for his tireless dedication to business education.
Please include in the nomination, a short statement (500 words or less) why the person being nominated is deserving of this award.`,
    eligibility: "N/A",
    deadline: new Date("2025-09-01T08:00:00.000Z"),
    category: "Lifetime",
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

async function importAwards() {
  try {
    console.log('🏆 Starting award import...');
    
    const batch = db.batch();
    
    for (const award of awards) {
      const { id, ...awardData } = award;
      const awardRef = db.collection('awards').doc(id);
      
      console.log(`📝 Adding award: ${awardData.name}`);
      batch.set(awardRef, awardData);
    }
    
    await batch.commit();
    console.log('✅ Awards imported successfully!');
    
    // Verify the data
    console.log('\n🔍 Verifying imported data...');
    const awardsSnapshot = await db.collection('awards').get();
    
    console.log(`Found ${awardsSnapshot.size} awards in database:`);
    awardsSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`- ${data.name} (${data.category})`);
    });
    
  } catch (error) {
    console.error('❌ Error importing awards:', error);
    process.exit(1);
  }
}

// Run the import
importAwards().then(() => {
  console.log('\n🎉 Import complete!');
  process.exit(0);
});