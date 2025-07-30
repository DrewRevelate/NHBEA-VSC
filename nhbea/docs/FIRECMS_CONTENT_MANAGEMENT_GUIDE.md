# FireCMS Content Management Guide for NHBEA

**Version**: 2.0  
**Last Updated**: July 28, 2025  
**Target Audience**: Content managers, developers, stakeholders

## 🆕 What's New in v2.0
- ✅ **Content Validation System**: Automatic validation prevents content issues
- ✅ **Fallback Content Strategy**: Site never breaks due to missing content  
- ✅ **Enhanced Error Handling**: Better troubleshooting and user experience
- ✅ **Developer Warnings**: Development mode shows content quality warnings

## Overview

This guide provides comprehensive instructions for managing content in the NHBEA website using FireCMS. It covers content creation, updates, validation, and troubleshooting workflows.

## 🎯 Quick Start Checklist

Before making any content changes:
- [ ] Access FireCMS dashboard: https://app.firecms.co/p/nhbea-64cab
- [ ] Verify you have edit permissions
- [ ] Understand which collection affects which page
- [ ] Know the required field formats
- [ ] Test changes on staging before publishing

## 📊 Content Collections Overview

### 1. `content` Collection - Homepage & Static Content
**Purpose**: Stores main website content like hero sections, mission statements  
**Critical Document**: `homepage` (ID must be exactly "homepage")

**Required Fields**:
```javascript
{
  "heroTitle": "New Hampshire Business Educators Association",
  "heroSubtitle": "Empowering educators, inspiring students...",
  "missionTitle": "Our Mission", 
  "missionContent": "NHBEA is dedicated to...",
  "aboutTitle": "About NHBEA",
  "aboutContent": "The New Hampshire Business Educators..."
}
```

**⚠️ CRITICAL**: The document ID MUST be `homepage` or the homepage will show undefined text.

### 2. `boardMembers` Collection - Current Leadership
**Purpose**: Displays current board members on About page  
**Display**: Responsive grid cards with photos and bios

**Required Fields**:
```javascript
{
  "name": "Full Name",
  "title": "Board Position", 
  "bio": "Brief biography...",
  "order": 1,                    // Display order (1 = first)
  "imageURL": "https://..."      // Optional profile photo
}
```

**Best Practices**:
- Keep bios to 2-3 sentences
- Use consistent title formatting
- Order field determines display sequence
- Images should be 400x400px minimum

### 3. `pastPresidents` Collection - Historical Leadership
**Purpose**: Timeline display of past presidents on About page  
**Display**: Chronological timeline with term information

**Required Fields**:
```javascript
{
  "name": "Full Name",
  "term": "2022-2023",          // Format: YYYY-YYYY
  "order": 1                    // 1 = most recent
}
```

**Best Practices**:
- Use consistent term format: "YYYY-YYYY"
- Order 1 = most recent president
- Keep names formal (First Last)

### 4. `sponsors` Collection - Partner Organizations
**Purpose**: Sponsor logos and links on homepage  
**Display**: Grid of clickable sponsor logos

**Required Fields**:
```javascript
{
  "name": "Organization Name",
  "logoURL": "https://...",     // Logo image URL
  "website": "https://...",     // Organization website
  "order": 1                    // Display order
}
```

**Best Practices**:
- Logo images should be SVG or high-res PNG
- Test all website links before publishing
- Use consistent aspect ratios for logos

## 🔄 Content Update Workflows

### Adding New Board Members

1. **Access FireCMS**
   - Go to https://app.firecms.co/p/nhbea-64cab
   - Navigate to `boardMembers` collection

2. **Create New Document**
   - Click "Add Document"
   - Fill in all required fields
   - Set appropriate order number
   - Upload profile photo (optional but recommended)

3. **Validation Checklist**
   - [ ] Name is properly formatted
   - [ ] Title matches organization standards
   - [ ] Bio is concise and professional
   - [ ] Order number is unique and logical
   - [ ] Image URL is accessible (if provided)

4. **Publishing**
   - Save document
   - Changes appear immediately on live site
   - Verify display on https://nhbea-64cab.web.app/about

### Updating Homepage Content

1. **Locate Homepage Document**
   - In `content` collection
   - Find document with ID "homepage"
   - ⚠️ **NEVER change this document ID**

2. **Edit Content Fields**
   - Update heroTitle, heroSubtitle as needed
   - Modify mission and about content
   - Keep line breaks using `\n` for paragraphs

3. **Content Guidelines**
   - Hero title should be concise (under 60 characters)
   - Hero subtitle should explain value proposition
   - Mission content can include multiple paragraphs
   - About content should be welcoming and informative

4. **Testing Changes**
   - Save changes in FireCMS
   - Visit homepage: https://nhbea-64cab.web.app
   - Verify content displays correctly
   - Check mobile responsiveness

### Managing Past Presidents

1. **Adding New Presidents**
   - When leadership changes, add new president to collection
   - Set order = 1 (most recent)
   - Increment order of all existing presidents

2. **Updating Terms**
   - Use format "YYYY-YYYY" for terms
   - Update when terms officially change
   - Ensure chronological order is maintained

## 🚨 Troubleshooting Common Issues

### Homepage Shows "undefined" Text ✅ RESOLVED
**Symptoms**: Homepage displays `$undefined` instead of content  
**Previous Cause**: Missing or incorrectly named homepage document  
**Current Status**: ✅ **FIXED** - Content validation system now prevents this issue
**Automatic Solution**: 
- System automatically uses fallback content if homepage document is missing
- Validation ensures all required fields are present
- Site will never show undefined text again

**Manual Check** (if needed):
1. Check `content` collection for document with ID "homepage"
2. Verify all required fields are filled
3. Ensure document ID is exactly "homepage" (no caps, spaces)

### Board Members Not Displaying
**Symptoms**: About page shows empty board section  
**Cause**: Invalid data or missing required fields  
**Solution**:
1. Check `boardMembers` collection has documents
2. Verify all required fields (name, title, bio, order) are filled
3. Ensure order numbers are valid integers

### Images Not Loading
**Symptoms**: Broken image icons instead of photos  
**Cause**: Invalid image URLs or access permissions  
**Solution**:
1. Test image URLs in browser
2. Ensure images are publicly accessible
3. Use Firebase Storage for hosting images
4. Check image format (JPG, PNG, WebP preferred)

### Timeline Display Issues
**Symptoms**: Past presidents showing in wrong order  
**Cause**: Incorrect order field values  
**Solution**:
1. Review order field in `pastPresidents` collection
2. Ensure order 1 = most recent
3. No duplicate order numbers
4. Sequential numbering (1, 2, 3...)

### Content Validation Warnings (Development Mode)
**Symptoms**: Console warnings about content validation  
**Cause**: Content doesn't meet quality standards but is still functional  
**Examples**: 
- "Mission content seems too short for effective communication"
- "Image URL appears to be invalid or inaccessible"

**Solution**:
1. **For short content**: Expand content to be more descriptive (50+ characters recommended)
2. **For invalid images**: Check image URL accessibility, use Firebase Storage for hosting
3. **For missing fields**: Add optional fields like imageURL for better user experience

**Note**: These are warnings, not errors - the site will still work with fallback content

### Content Not Updating on Website
**Symptoms**: Changed content in FireCMS but website still shows old content  
**Cause**: Caching or validation issues  
**Solution**:
1. Wait 1-2 minutes for changes to propagate
2. Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)
3. Check browser console for validation errors
4. Verify all required fields are properly filled
5. Clear browser cache if issue persists

## 🔐 Content Security & Backup

### Access Control
- Only authorized personnel should have FireCMS access
- Use strong passwords and 2FA when available
- Regular access review for departing staff

### Content Backup
- Firebase automatically backs up Firestore data
- Export collections periodically for manual backup
- Document major content changes with dates/reasons

### Version Control
- FireCMS doesn't have built-in versioning
- Consider documenting major content changes
- Keep records of who made changes and when

## 📈 Content Best Practices

### Writing Guidelines
- **Tone**: Professional yet approachable
- **Length**: Concise but informative
- **Format**: Use proper grammar and punctuation
- **Consistency**: Match existing content style

### Image Standards
- **Board Photos**: 400x400px minimum, square aspect ratio
- **Sponsor Logos**: SVG preferred, transparent backgrounds
- **File Size**: Keep under 1MB for web performance
- **Alt Text**: Descriptive for accessibility

### SEO Considerations
- **Page Titles**: Include relevant keywords
- **Meta Descriptions**: Compelling and descriptive
- **Content Structure**: Use proper heading hierarchy
- **Image Alt Text**: Descriptive and keyword-relevant

## ✅ Content Validation System

### Automatic Validation
The website now includes an automatic content validation system that:
- **Validates required fields** before content is displayed
- **Provides fallback content** if fields are missing or invalid
- **Shows development warnings** when content has issues
- **Ensures the site never breaks** due to invalid content

### Validation Rules
**Homepage Content (`content/homepage`)**:
- `heroTitle`: Required, minimum 1 character
- `heroSubtitle`: Required, minimum 1 character  
- `heroImageURL`: Optional, must be valid URL if provided
- `missionTitle`: Required, minimum 1 character
- `missionContent`: Required, minimum 1 character
- `aboutTitle`: Required, minimum 1 character
- `aboutContent`: Required, minimum 1 character

**Content Sections**:
- `id`: Required, unique identifier
- `title`: Required, minimum 1 character
- `content`: Required, minimum 1 character
- `imageURL`: Optional, must be valid URL if provided
- `order`: Required, must be non-negative integer

### Content Quality Warnings
The system will show development warnings for:
- Content that's too short (under 50 characters for mission/about)
- Invalid or inaccessible image URLs
- Missing optional but recommended fields

### Fallback Content Strategy
If content fails validation or is missing:
- **Homepage**: Uses default NHBEA content
- **Sections**: Invalid sections are skipped
- **Images**: Invalid URLs are handled gracefully
- **Site never breaks**: Always shows meaningful content

## 🛠️ Technical Integration Notes

### Static Site Generation
- Content changes appear immediately on live site
- No rebuild required for content updates
- Fallback content ensures site never breaks
- Content validation prevents display issues

### Development Workflow
- Developers: Test with staging Firestore database
- Content: Always use production FireCMS for real changes
- Coordination: Communicate major content changes
- Validation: System automatically validates all content

### Performance Considerations
- Large images may slow page loading
- Too many board members may need pagination
- Consider image optimization for better performance
- Validation adds minimal performance overhead

## 📞 Support & Escalation

### Content Issues
1. **Self-service**: Check this guide and troubleshooting section
2. **FireCMS Issues**: Contact FireCMS support
3. **Website Problems**: Contact development team
4. **Urgent Issues**: Use emergency contact procedures

### Emergency Procedures
If the website is down or showing critical errors:
1. Document the issue with screenshots
2. Note exact time and what changed recently
3. Contact technical team immediately
4. Do not make additional changes until resolved

## 📚 Additional Resources

- **FireCMS Documentation**: https://firecms.co/docs
- **Firebase Console**: https://console.firebase.google.com/project/nhbea-64cab
- **Website Analytics**: [Insert analytics URL]
- **Brand Guidelines**: [Insert brand guide location]

---

**Remember**: Content changes are live immediately. Always double-check your changes before saving. When in doubt, ask for review before publishing major updates.

**Next Update Due**: Review this guide quarterly or after major platform changes.