NHBEA Connect Fullstack Architecture Document
1. Introduction
This document outlines the complete fullstack architecture for NHBEA Connect, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

Starter Template: The project is a greenfield build based on the Next.js App Router framework with a serverless Firebase backend. This combination serves as our foundational template.

Change Log
Date	Version	Description	Author
2025-07-27	1.0	Initial architecture based on approved PRD and specs.	Winston, Architect

Export to Sheets
2. High-Level Architecture
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

3. Tech Stack
Category	Technology	Version	Purpose	Rationale
Framework	Next.js	~14.x	Frontend and server-side rendering	Modern, high-performance React framework.
Language	TypeScript	~5.x	Type safety for JavaScript	Ensures code quality and maintainability.
UI Library	React	~18.x	Building user interfaces	Industry-standard for component-based UI.
UI Components	ShadCN UI	Latest	Accessible, unstyled component primitives	Provides a strong foundation for a custom design system.
Styling	Tailwind CSS	Latest	Utility-first CSS framework	Enables rapid, consistent styling.
Backend	Firebase	Latest	Database, Hosting, Storage	Provides a complete, scalable serverless backend.
Database	Cloud Firestore	N/A	NoSQL document database	Flexible data modeling and real-time capabilities.
Payment API	Square API	v2	Processing fees and dues	Secure, PCI-compliant payment processing.
Form Handling	React Hook Form	Latest	Managing form state and validation	High-performance and easy-to-use form management.
Validation	Zod	Latest	Schema validation	Provides robust, type-safe data validation.
Testing	Jest & RTL	Latest	Unit & integration testing	Standard for testing React applications.
E2E Testing	Cypress	Latest	End-to-end user flow testing	Reliable testing for critical user journeys.

Export to Sheets
4. Data Models & Database Schema
The application will use Cloud Firestore, a NoSQL database. Data will be organized into top-level collections.

content: Stores dynamic text and image URLs for pages like the homepage and "About Us". Each document represents a page or section.

boardMembers: Stores information for each current board member (name, title, bio, imageURL).

pastPresidents: Stores a list of past presidents (name, term).

hallOfFame: Stores information for each "Educator of the Year" (name, year, bio).

sponsors: Stores sponsor information (name, logoURL, website).

conference: A single document containing the details for the current conference (theme, date, location, fee).

studentApplicants: Stores submitted student membership applications for board review.

nominations: Stores submitted award nominations.

newsletterSubscribers: Stores emails from the newsletter signup form.

5. Unified Project Structure
The project will follow the standard Next.js App Router structure as defined in the README.md. This monorepo structure is ideal for this project.

.
├── src
│   ├── app/                  # Main application routes
│   ├── components/           # Reusable React components
│   ├── lib/                  # Core application logic and utilities
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets (images, fonts, etc.)
├── firebase.json             # Firebase configuration for hosting
├── firestore.rules           # Firestore security rules
└── package.json              # Project dependencies and scripts
6. Frontend Architecture
Component Architecture: Components will be organized by feature or as shared UI elements within /src/components/. All components will be built with React and TypeScript, using ShadCN UI as a base.

State Management: For this application's scope, global state management is not required. Component-level state will be managed with React Hooks (useState, useReducer). Server state (data fetched from Firestore) will be managed via React Server Components and data fetching functions in /src/lib/.

Routing: All routing is handled by the Next.js App Router, with routes defined by the folder structure inside /src/app/.

7. Backend Architecture
Architecture Style: The backend is serverless. There is no traditional, always-on server.

Logic: Server-side logic, such as creating Square payment links or processing form submissions that require admin privileges, will be implemented as Next.js Server Actions. This keeps the logic co-located with the components that use it and simplifies the architecture.

Data Access: All database interactions will be performed through functions in /src/lib/, using the Firebase Admin SDK for server-side operations and the Firebase Client SDK for client-side reads.

8. Deployment and CI/CD
Deployment Platform: The application will be deployed to Firebase Hosting, which provides a global CDN, automatic SSL, and tight integration with the Firebase backend.

CI/CD Pipeline: A GitHub Actions workflow will be created to automate deployments. The pipeline will trigger on pushes to the main branch, install dependencies, build the Next.js application, and deploy to Firebase Hosting.

9. Security
Authentication: No user authentication is required for the MVP.

Authorization: Content management will be handled outside the app via the FireCMS portal, which connects to Firebase with admin credentials.

Data Security: All data in Firestore will be protected by firestore.rules. The rules will be configured to allow public reads for most content while restricting writes to authenticated admin users (or server-side functions).

Payment Security: All payments are handled by Square's secure, hosted checkout pages. The application does not handle or store any credit card information, drastically reducing PCI compliance scope.

10. Checklist Results Report
A validation check using the Architect Checklist was performed. The architecture is sound and ready for implementation.

Requirements Alignment: The architecture directly supports all functional and non-functional requirements in the PRD.

Clarity & Simplicity: The serverless approach using Next.js and Firebase is a simple, modern, and powerful solution for this project's needs.

AI Agent Suitability: The well-defined project structure, use of TypeScript, and clear separation of concerns in the /lib directory make this architecture highly suitable for implementation by AI developer agents.