# Firebase Storage Organization Guide

This document explains the new organized structure for member images in Firebase Storage, separating public and private photos.

## Directory Structure

```
Firebase Storage Root/
├── public/
│   └── Member_Images/           # Publicly accessible member photos
│       ├── member1.jpg
│       └── member2.png
├── private/
│   └── Member_Images/          # Private member photos (auth required)
│       ├── private_member1.jpg
│       └── private_member2.png
└── Member_Images/              # Legacy directory (will be phased out)
    ├── old_image1.jpg
    └── old_image2.png
```

## Access Rules

### Public Images (`public/`)
- **Read**: Anyone can access (no authentication required)
- **Write**: Only authenticated users can upload/modify
- **Use Case**: Board members and members who opt for public directory listing

### Private Images (`private/`)
- **Read**: Only authenticated users can access
- **Write**: Only authenticated users can upload/modify
- **Use Case**: Members who want privacy but need images in admin areas

### Legacy Images (`Member_Images/`)
- **Read**: Anyone can access (for backward compatibility)
- **Write**: Only authenticated users can upload/modify
- **Status**: Will be migrated to organized structure

## Implementation Steps

### 1. Deploy Storage Rules
```bash
firebase deploy --only storage
```

### 2. Run Migration Script
```bash
node scripts/migration/organize-member-images.js
```

This script will:
- Analyze each member's `preferences.directoryListing` setting
- Copy images to `public/` or `private/` directories accordingly
- Update member records with new image paths
- Preserve original files for safety (manual cleanup required)

### 3. Verify Migration
- Check Firebase Console > Storage to see new directory structure
- Test that board member images load correctly on the website
- Verify public images are accessible without authentication

## Member Image Logic

The system determines image visibility based on:

```javascript
const isPublic = member.preferences?.directoryListing !== false;
```

- `directoryListing: true` → Public image
- `directoryListing: false` → Private image
- `directoryListing: undefined` → Public image (default)

## Code Changes

### New Components
- `MemberImage.tsx`: Handles async image loading from Firebase Storage
- `imageUtils.ts`: Utilities for Firebase Storage image URL generation

### Updated Components
- `BoardMembersSection.tsx`: Now uses `MemberImage` component with automatic fallback support

### Features
- Automatic fallback from new paths to legacy paths
- Loading states with spinner animation
- Error handling with placeholder icons
- Async image URL resolution

## Migration Benefits

1. **Privacy Control**: Members can choose public vs private visibility
2. **Performance**: Public images load faster (no auth required)
3. **Security**: Private images are protected
4. **Scalability**: Organized structure supports future growth
5. **Backward Compatibility**: Legacy paths still work during transition

## Rollback Plan

If issues occur:
1. Revert `firebase.json` and `storage.rules`
2. Deploy: `firebase deploy --only storage`
3. Update member records back to legacy paths
4. Remove new directory structure

## Testing Checklist

- [ ] Storage rules deploy successfully
- [ ] Public images load without authentication
- [ ] Private images require authentication
- [ ] Board member photos display correctly
- [ ] Loading states work properly
- [ ] Error handling shows placeholders
- [ ] Migration script runs without errors
- [ ] Member records updated correctly

## Future Enhancements

- Automatic image optimization/resizing
- CDN integration for better performance
- Bulk upload tools for administrators
- Image moderation workflow