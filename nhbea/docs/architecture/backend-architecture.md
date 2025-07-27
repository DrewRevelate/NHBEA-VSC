# Backend Architecture
Architecture Style: The backend is serverless. There is no traditional, always-on server.

Logic: Server-side logic, such as creating Square payment links or processing form submissions that require admin privileges, will be implemented as Next.js Server Actions. This keeps the logic co-located with the components that use it and simplifies the architecture.

Data Access: All database interactions will be performed through functions in /src/lib/, using the Firebase Admin SDK for server-side operations and the Firebase Client SDK for client-side reads.