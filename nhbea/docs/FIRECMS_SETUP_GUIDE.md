# 🚀 FireCMS Enhanced Collections Setup Guide

## Quick Start (3 Steps)

### 1. 🌱 Seed Your Database First
1. Visit: http://localhost:3000/admin/migrate
2. Select: **"🌱 Seed All Collections with Dummy Data (Start Here!)"**
3. Click **"Run Migration"**
4. Wait for success message

### 2. 🔧 Update FireCMS Configuration
1. Visit your FireCMS dashboard: https://app.firecms.co/p/nhbea-64cab
2. Go to **"Collections"** section
3. Create these 4 new collections:

#### **Organizations Collection**
```
Path: organizations
Fields:
- name (string) - Organization Name
- type (select) - school, college, university, business, government, nonprofit, other
- address (map):
  - street (string)
  - city (string) 
  - state (string)
  - zipCode (string)
- contact (map):
  - phone (string)
  - email (string)
  - website (string, url: true)
- isActive (boolean)
- notes (string, multiline: true)
```

#### **Enhanced Members Collection**
```
Path: members
Fields:
- memberNumber (string) - Member Number
- firstName (string) - First Name
- lastName (string) - Last Name
- email (string) - Email Address
- phone (string) - Phone Number
- organizationId (reference to organizations) - Organization
- position (string) - Position/Title
- yearsExperience (number) - Years of Experience
- address (string) - Street Address
- city (string) - City
- state (string) - State
- zipCode (string) - ZIP Code
- membershipType (select) - professional, student, retired, honorary
- status (select) - active, inactive, suspended, expired
- isBoardMember (boolean) - Board Member
- boardPosition (select) - President, Vice President, Secretary, Treasurer, Past President, Board Member
- communicationPreferences (map):
  - newsletter (boolean)
  - updates (boolean)
  - events (boolean)
  - mailings (boolean)
- notes (string, multiline: true)
```

#### **Enhanced Conference Collection**
```
Path: conference
Fields:
- title (string) - Conference Title
- theme (string) - Theme
- description (string, multiline: true) - Description
- startDate (timestamp) - Start Date
- endDate (timestamp) - End Date
- timezone (string) - Timezone
- isVirtual (boolean) - Virtual Conference
- virtualUrl (string, url: true) - Virtual Conference URL
- venue (map):
  - name (string) - Venue Name
  - address (string) - Address
  - city (string) - City
  - state (string) - State
  - zipCode (string) - ZIP Code
  - directions (string) - Directions
- registrationFee (number) - Registration Fee
- currency (string) - Currency
- maxCapacity (number) - Maximum Capacity
- registrationDeadline (timestamp) - Registration Deadline
- isRegistrationOpen (boolean) - Registration Open
- isActive (boolean) - Active
- notes (string, multiline: true)
```

#### **Enhanced Registrants Collection**
```
Path: registrants
Fields:
- conferenceId (reference to conference) - Conference
- memberId (reference to members) - Member
- guestInfo (map):
  - firstName (string)
  - lastName (string)
  - email (string)
  - phone (string)
  - organization (string)
  - position (string)
- registrationStatus (select) - pending, confirmed, cancelled, waitlisted
- paymentStatus (select) - pending, completed, failed, refunded
- paymentAmount (number) - Payment Amount
- currency (string) - Currency
- receiptUrl (string, url: true) - Receipt URL
- dietaryRestrictions (string) - Dietary Restrictions
- accessibilityNeeds (string) - Accessibility Needs
- checkedIn (boolean) - Checked In
- notes (string, multiline: true)
```

### 3. ✅ Verify Everything Works
1. Check Firestore Console: https://console.firebase.google.com/project/nhbea-64cab/firestore
2. Verify collections exist with data
3. Visit: http://localhost:3000/about (see board members from enhanced data)
4. Test FireCMS: https://app.firecms.co/p/nhbea-64cab

## What You'll See After Setup

### In Firestore Console:
- **organizations**: 5 educational institutions
- **members**: 6 members (5 board members with proper roles)
- **conference**: 2 conferences (1 in-person, 1 virtual)
- **registrants**: 4 registrations with proper member links

### In FireCMS Dashboard:
- Rich forms with dropdowns and references
- Board members managed through members collection
- Virtual conference support with URL fields
- Registrant linking to members and payment tracking

### On Your Website:
- Board members automatically loaded from enhanced data
- Proper hierarchical ordering (President, VP, Secretary, etc.)
- All existing functionality preserved

## Troubleshooting

### "Collections not showing in FireCMS"
- Make sure you're logged into: https://app.firecms.co/p/nhbea-64cab
- Recreate collections manually using the field definitions above
- Ensure paths match exactly (organizations, members, conference, registrants)

### "No data in collections"
- Re-run the seed migration at: http://localhost:3000/admin/migrate
- Check Firestore console for data: https://console.firebase.google.com/project/nhbea-64cab/firestore

### "Board members not showing on website"
- Visit: http://localhost:3000/about
- Check browser console for errors
- Verify members collection has isBoardMember: true entries

## Next Steps

1. **Customize the data**: Edit entries in FireCMS to match your real organization
2. **Add more members**: Use the enhanced members form in FireCMS
3. **Create conferences**: Use the enhanced conference form with virtual options
4. **Test registrations**: Create registrants that link to members

Your enhanced CMS is now ready! 🎉