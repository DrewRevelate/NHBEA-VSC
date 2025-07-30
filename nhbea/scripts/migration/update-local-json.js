#!/usr/bin/env node
/**
 * Update local Members.json file with new image paths
 * This is for testing purposes - the real data is in Firestore
 */

const fs = require('fs');
const path = require('path');

const membersFile = path.join(__dirname, '../../../Members.json');

try {
  console.log('🔄 Updating local Members.json with new image paths...');
  
  const data = fs.readFileSync(membersFile, 'utf8');
  const members = JSON.parse(data);
  
  let updateCount = 0;
  
  members.forEach(member => {
    if (member.image && member.image.startsWith('Member_Images/')) {
      const fileName = path.basename(member.image);
      // All members in our data have directoryListing enabled, so use public
      member.image = `public/Member_Images/${fileName}`;
      updateCount++;
      console.log(`✅ Updated ${member.personalInfo?.firstName} ${member.personalInfo?.lastName}: ${member.image}`);
    }
  });
  
  fs.writeFileSync(membersFile, JSON.stringify(members, null, 2));
  
  console.log(`📊 Updated ${updateCount} image paths in local file`);
  console.log('✅ Local Members.json updated successfully!');
  
} catch (error) {
  console.error('❌ Error updating local file:', error);
  process.exit(1);
}