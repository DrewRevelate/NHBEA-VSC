# Frontend Architecture
Component Architecture: Components will be organized by feature or as shared UI elements within /src/components/. All components will be built with React and TypeScript, using ShadCN UI as a base.

State Management: For this application's scope, global state management is not required. Component-level state will be managed with React Hooks (useState, useReducer). Server state (data fetched from Firestore) will be managed via React Server Components and data fetching functions in /src/lib/.

Routing: All routing is handled by the Next.js App Router, with routes defined by the folder structure inside /src/app/.