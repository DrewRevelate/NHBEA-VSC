# FireCMS Setup Guide for NHBEA

This guide will help you set up your FireCMS instance at https://app.firecms.co/p/nhbea-64cab with the correct data structure for your NHBEA website.

## Quick Setup Steps

### 1. Access Your FireCMS Dashboard
Visit: https://app.firecms.co/p/nhbea-64cab

### 2. Create Required Collections

You need to create 4 collections in your Firestore database. For each collection, use the following structure:

#### Collection: `content`
**Path**: `content`
**Purpose**: Homepage content sections

Create a document with ID: `homepage` and these fields:
```json
{
  "heroTitle": "New Hampshire Business Educators Association",
  "heroSubtitle": "Empowering educators, inspiring students, and strengthening business education across New Hampshire", 
  "missionTitle": "Our Mission",
  "missionContent": "NHBEA is dedicated to promoting excellence in business education through professional development, networking, and advocacy for business educators and students throughout New Hampshire.",
  "aboutTitle": "About NHBEA",
  "aboutContent": "The New Hampshire Business Educators Association serves as the premier professional organization for business educators in the state. We provide resources, support, and opportunities for growth to help our members deliver exceptional business education to their students."
}
```

#### Collection: `boardMembers`
**Path**: `boardMembers`
**Purpose**: Current board member information

Create documents with these fields (one document per board member):
```json
{
  "name": "Sarah Johnson",
  "title": "President", 
  "bio": "Sarah has been an advocate for business education for over 15 years, bringing innovative teaching methods to the classroom.",
  "order": 1,
  "imageURL": "" // Optional - add photo URLs later
}
```

Sample board members to add:
- Sarah Johnson (President, order: 1)
- Michael Chen (Vice President, order: 2) 
- Jennifer Rodriguez (Secretary, order: 3)
- David Thompson (Treasurer, order: 4)

#### Collection: `pastPresidents`
**Path**: `pastPresidents` 
**Purpose**: Historical list of past presidents

Create documents with these fields (one document per past president):
```json
{
  "name": "Robert Williams",
  "term": "2022-2023",
  "order": 1
}
```

Sample past presidents to add:
- Robert Williams (2022-2023, order: 1)
- Maria Garcia (2021-2022, order: 2)
- James Smith (2020-2021, order: 3)
- Patricia Davis (2019-2020, order: 4)
- Christopher Brown (2018-2019, order: 5)

#### Collection: `sponsors` 
**Path**: `sponsors`
**Purpose**: Organization sponsors (optional for now)

Create documents with these fields:
```json
{
  "name": "Sponsor Name",
  "logoURL": "https://example.com/logo.png",
  "website": "https://sponsor-website.com", 
  "order": 1
}
```

## Quick Data Entry Method

### Option 1: Manual Entry in FireCMS
1. Go to your FireCMS dashboard
2. Create each collection manually
3. Add documents using the web interface

### Option 2: Direct Firestore Import
If you have admin access to your Firebase console:
1. Go to Firebase Console > Firestore Database
2. Use the import/export feature with the sample data from `firecms.config.js`

## Testing the Connection

After adding the data:

1. **Build and deploy your site**:
   ```bash
   npm run deploy
   ```

2. **Visit your site**: https://nhbea-64cab.web.app/about

3. **Verify sections appear**:
   - Board Members section with member cards
   - Past Presidents timeline
   - Mission and about content

## Troubleshooting

### If sections still don't appear:
1. Check Firestore security rules allow read access
2. Verify collection names match exactly: `content`, `boardMembers`, `pastPresidents`
3. Ensure document IDs are set (especially `homepage` for content)
4. Check browser console for any Firebase errors

### Security Rules
Make sure your Firestore security rules allow public read access:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Next Steps

1. Add real board member photos by uploading to Firebase Storage
2. Update content with your actual mission statement
3. Add sponsor information if needed
4. Customize styling and branding as desired

## Need Help?

- FireCMS Documentation: https://firecms.co/docs
- Firebase Console: https://console.firebase.google.com/project/nhbea-64cab
- Your FireCMS Instance: https://app.firecms.co/p/nhbea-64cab