// Simple client-side script to import awards data
// This can be run from the browser console on the FireCMS admin page

const awards = [
  {
    name: "Educator of the Year",
    icon: "",
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
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Kaliski Award",
    icon: "",
    description: `This award is presented to a retired business educator in New Hampshire who served and promoted business education in New Hampshire throughout their career. It is given each year in memory of Dr. Burt Kaliski for his tireless dedication to business education.
Please include in the nomination, a short statement (500 words or less) why the person being nominated is deserving of this award.`,
    eligibility: "N/A",
    deadline: new Date("2025-09-01T08:00:00.000Z"),
    category: "Lifetime",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Function to import awards using Firestore web SDK
async function importAwards() {
  // This assumes firebase/firestore is available globally (as it would be in FireCMS)
  const { collection, addDoc, doc, setDoc } = window.firebase || {};
  
  if (!window.firebase) {
    console.error('Firebase not available. Run this in the FireCMS admin interface.');
    return;
  }
  
  console.log('🏆 Starting award import...');
  
  try {
    for (const [index, award] of awards.entries()) {
      // Use the original IDs from CSV
      const docId = index === 0 ? "O8KZ53z8yPOwuYErRFZw" : "fQov02WYbLHCyvYR7808";
      
      const awardRef = doc(window.db, 'awards', docId);
      await setDoc(awardRef, award);
      
      console.log(`✅ Added award: ${award.name}`);
    }
    
    console.log('🎉 All awards imported successfully!');
    
  } catch (error) {
    console.error('❌ Error importing awards:', error);
  }
}

// Manual data for direct entry into FireCMS
console.log('📋 Award data ready for manual entry:');
console.log(JSON.stringify(awards, null, 2));

// If running in FireCMS environment, run the import
if (typeof window !== 'undefined' && window.firebase) {
  importAwards();
}

// Export for manual use
if (typeof module !== 'undefined') {
  module.exports = { awards, importAwards };
}