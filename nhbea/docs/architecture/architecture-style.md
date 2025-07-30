# Architecture Style
The backend follows a **Serverless-First Architecture** with no traditional always-on servers. All backend logic runs as ephemeral Firebase Cloud Functions. The static frontend communicates with these functions via HTTP API calls, routed through Firebase Hosting rewrites.
