#!/usr/bin/env node

/**
 * Deploy Enhanced CMS Data Models
 * This script helps deploy the enhanced data models to FireCMS and Firestore
 */

const fs = require('fs');
const path = require('path');

// Configuration
const FIRECMS_PROJECT_URL = 'https://app.firecms.co/p/nhbea-64cab';
const FIRESTORE_PROJECT_ID = 'nhbea-64cab';

console.log('🚀 NHBEA Enhanced CMS Deployment Guide');
console.log('=====================================\n');

console.log('This script will guide you through deploying the enhanced data models.\n');

// Step 1: FireCMS Configuration
console.log('📋 STEP 1: Update FireCMS Configuration');
console.log('---------------------------------------');
console.log('1. Visit your FireCMS dashboard:', FIRECMS_PROJECT_URL);
console.log('2. Go to "Collections" or "Schema" section');
console.log('3. The updated firecms.config.js file contains new collections:');
console.log('   • organizations - Track educational institutions');
console.log('   • members (enhanced) - Members with org references and board flags');
console.log('   • conference (enhanced) - Conferences with virtual URL support');
console.log('   • registrants (enhanced) - Registrants with member links and receipts');
console.log('4. Import or recreate these collections in your FireCMS interface\n');

// Step 2: Firestore Database Migration
console.log('🗄️  STEP 2: Run Database Migration');
console.log('----------------------------------');
console.log('Run the migration functions to update your existing data:');
console.log('');
console.log('// Option A: Full automatic migration');
console.log('import { runFullDataMigration } from "./src/lib/dataMigration";');
console.log('await runFullDataMigration();');
console.log('');
console.log('// Option B: Step-by-step migration');
console.log('import { ');
console.log('  migrateToOrganizations,');
console.log('  migrateMembersToNewSchema,');  
console.log('  migrateConferencesToNewSchema,');
console.log('  migrateRegistrantsToNewSchema');
console.log('} from "./src/lib/dataMigration";');
console.log('');
console.log('// Run each migration step');
console.log('const orgIds = await migrateToOrganizations();');
console.log('await migrateMembersToNewSchema(orgIds);');
console.log('await migrateConferencesToNewSchema();');
console.log('await migrateRegistrantsToNewSchema();');
console.log('');

// Step 3: Verify Data
console.log('✅ STEP 3: Verify Migration');
console.log('---------------------------');
console.log('After migration, verify in Firestore console:');
console.log('1. Visit: https://console.firebase.google.com/project/' + FIRESTORE_PROJECT_ID + '/firestore');
console.log('2. Check that new collections exist:');
console.log('   • organizations (new)');
console.log('   • members (updated with organizationId, isBoardMember fields)');
console.log('   • conference (updated with isVirtual, virtualUrl fields)');
console.log('   • registrants (updated with memberId, receiptUrl fields)');
console.log('');

// Step 4: Test Application  
console.log('🧪 STEP 4: Test Application');
console.log('---------------------------');
console.log('Test that your application works with the new data models:');
console.log('1. Run: npm run dev');
console.log('2. Visit /about page to see board members');
console.log('3. Verify board members are loaded from enhanced members collection');
console.log('4. Check that organization references work correctly');
console.log('');

// Step 5: Optional Legacy Cleanup
console.log('🧹 STEP 5: Legacy Data Cleanup (Optional)');
console.log('------------------------------------------');
console.log('After verifying everything works, you may optionally:');
console.log('1. Remove the old boardMembers collection (legacy)');
console.log('2. Update any remaining code to use enhanced APIs');
console.log('3. Remove legacy type definitions if no longer needed');
console.log('');

console.log('📚 Additional Resources:');
console.log('- FireCMS Documentation: https://firecms.co/docs');
console.log('- Firestore Console: https://console.firebase.google.com/project/' + FIRESTORE_PROJECT_ID);
console.log('- Enhanced Data Models: /src/types/dataModels.ts');
console.log('- Migration Functions: /src/lib/dataMigration.ts');
console.log('');

console.log('🎉 Deployment complete! Your enhanced CMS data models are ready.');

// Create a simple migration runner script
const migrationScript = `
// Run this in your browser console or in a Node.js script
// Make sure you have Firebase initialized

import { runFullDataMigration } from './src/lib/dataMigration.js';

async function runMigration() {
  try {
    console.log('Starting data migration...');
    await runFullDataMigration();
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Uncomment to run:
// runMigration();
`;

fs.writeFileSync(
  path.join(__dirname, '..', 'run-migration.js'), 
  migrationScript
);

console.log('📝 Created run-migration.js script for easy migration execution.');