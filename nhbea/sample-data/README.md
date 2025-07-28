# Sample Data CSV Files for NHBEA FireCMS

This directory contains CSV files with sample data for your NHBEA website collections.

## Files Included

### 1. `content.csv`
- **Purpose**: Homepage content sections
- **Collection**: `content`
- **Records**: 1 homepage content record
- **Fields**: heroTitle, heroSubtitle, missionTitle, missionContent, aboutTitle, aboutContent

### 2. `boardMembers.csv` 
- **Purpose**: Current board member information
- **Collection**: `boardMembers`
- **Records**: 6 board members
- **Fields**: name, title, bio, imageURL (empty), order
- **Positions Included**: President, Vice President, Secretary, Treasurer, Directors

### 3. `pastPresidents.csv`
- **Purpose**: Historical list of past presidents
- **Collection**: `pastPresidents` 
- **Records**: 15 past presidents (2008-2023)
- **Fields**: name, term, order
- **Timeline**: 15 years of leadership history

### 4. `sponsors.csv`
- **Purpose**: Organization sponsors and partners
- **Collection**: `sponsors`
- **Records**: 8 potential sponsors
- **Fields**: name, logoURL (empty), website, order
- **Types**: Educational institutions, government, business organizations

## How to Use These Files

### Option 1: Manual Import via FireCMS
1. Visit https://app.firecms.co/p/nhbea-64cab
2. Create each collection manually
3. Use the CSV data to add records through the web interface

### Option 2: Firebase Console Import
1. Go to Firebase Console > Firestore Database
2. Use import functionality (if available)
3. Convert CSV to JSON format if needed

### Option 3: Firestore Admin SDK Script
If you need a bulk import script, the CSV data can be converted to a Node.js script for batch uploading.

## Customization Notes

### Board Members
- **imageURL fields are empty** - Add actual profile photos after initial setup
- **Bio content** - Replace with actual board member information
- **Order field** - Controls display order on website (1 = first)

### Past Presidents  
- **Terms are sample data** - Replace with actual historical terms
- **Names are fictional** - Replace with real past presidents
- **Order field** - 1 = most recent president

### Content
- **Sample mission statement** - Customize with your actual mission
- **Hero content** - Update with your preferred homepage messaging
- **imageURL fields** - Add hero images and other visual content

### Sponsors
- **logoURL fields are empty** - Add actual sponsor logos after setup
- **Websites are real** - Sample NH educational/business organizations
- **Replace with actual sponsors** - Update with organizations that actually sponsor NHBEA

## Data Validation

Each CSV follows the exact schema defined in your TypeScript interfaces:
- All required fields are included
- Data types match expected formats
- Order fields ensure proper display sequence
- IDs are unique and meaningful

## Next Steps

1. **Import the data** using your preferred method
2. **Deploy your site**: `npm run deploy`
3. **Test at**: https://nhbea-64cab.web.app/about
4. **Replace sample data** with actual organization information
5. **Add images** for board members and sponsors

## Need Help?

If you need assistance with importing or customizing this data, refer to:
- `FIRECMS_SETUP.md` for detailed setup instructions
- FireCMS documentation: https://firecms.co/docs
- Firebase Console: https://console.firebase.google.com/project/nhbea-64cab