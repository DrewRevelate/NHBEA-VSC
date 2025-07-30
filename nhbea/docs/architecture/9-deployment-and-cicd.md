# 9. Deployment and CI/CD

## 9.1 Deployment Architecture
- **Platform**: Firebase Hosting + Cloud Functions with automatic CDN distribution
- **Build Process**: Next.js static export (no ISR - static only) + Cloud Functions deployment
- **Environment Management**: Separate Firebase projects for staging and production
- **API Routes**: Firebase Hosting rewrites route `/api/*` to Cloud Functions
- **Static Assets**: Served directly from Firebase Hosting CDN

## 9.2 CI/CD Pipeline Stages

```yaml