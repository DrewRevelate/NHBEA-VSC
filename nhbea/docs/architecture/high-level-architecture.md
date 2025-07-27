# High-Level Architecture
Technical Summary
The NHBEA Connect application is designed with a modern, serverless, Jamstack-style architecture. The frontend is a responsive Next.js application deployed on Firebase Hosting, which leverages a global CDN for high performance. All backend services, including the database (Cloud Firestore) and static asset storage, are provided by Firebase. This approach minimizes infrastructure management, provides excellent scalability, and aligns with the project's goal of creating an efficient, modern, and easy-to-manage platform.

High-Level Architecture Diagram
Code snippet

graph TD
    User[User's Browser] -->|HTTPS| App(Next.js App on Firebase Hosting/CDN);

    subgraph Firebase
        App -->|Client SDK| Firestore[Cloud Firestore DB];
        App -->|Client SDK| Storage[Firebase Storage];
    end

    subgraph Server-Side Logic
        App -- Server Action / API Route -->|HTTPS| Logic(Serverless Functions);
    end

    subgraph External Services
        Logic -->|API Call| Square[Square API for Payments];
    end

    subgraph CMS Admin
        BoardMember[Board Member] -->|HTTPS| FireCMS[FireCMS Portal];
        FireCMS -->|Admin SDK| Firestore;
    end
Architectural Patterns
Serverless Architecture: All backend logic is handled by serverless functions (Next.js API routes or direct Firebase integrations), eliminating the need for server management.

Component-Based UI: The frontend is built using reusable React components, promoting maintainability and consistency, as defined in the UI/UX Specification.

Repository Pattern: Data access logic is abstracted into dedicated functions within the /src/lib/ directory, separating business logic from direct data source interactions.