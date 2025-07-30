# 12.1 Architecture Migration Notes

## Firebase Cloud Functions Migration
The architecture was updated to use Firebase Cloud Functions instead of Next.js API routes to support static export deployment:

### Key Changes Made:
1. **API Routes Removed**: All Next.js API routes in `/src/app/api/` migrated to Cloud Functions
2. **Static Export Enabled**: `output: 'export'` maintained for optimal performance
3. **Hosting Rewrites**: Firebase Hosting configured to route `/api/*` to Cloud Functions
4. **Function Structure**: Single Cloud Function exports multiple endpoints via Express router
5. **Environment Variables**: Square API credentials moved to Cloud Functions environment

### Benefits of Migration:
- **Static Performance**: Frontend served from CDN with minimal server overhead
- **Cost Optimization**: Pay-per-function-call vs always-on server costs
- **Scalability**: Automatic scaling for traffic spikes (conference registration)
- **Deployment Simplicity**: Single Firebase deploy handles both hosting and functions

### Technical Implementation:
```javascript
// functions/index.js structure
exports.api = functions.https.onRequest(app);

// Express routes handle multiple endpoints:
app.post('/membership', membershipHandler);
app.post('/conference', conferenceHandler);
app.post('/newsletter', newsletterHandler);
app.get('/health', healthHandler);
```

### Deployment Commands:
```bash