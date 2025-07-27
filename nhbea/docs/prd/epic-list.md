# Epic List
Epic 1: Foundation, Core Content, and User Engagement

Goal: Establish the core project infrastructure, display foundational content like the homepage and board member lists, and provide an initial way for users to engage via a newsletter signup.

Epic 2: Membership Application and Dues Automation

Goal: Implement the complete membership application flow for both professional and student members, including secure online payment processing for dues.

Epic 3: Conference Registration and Association Honors

Goal: Launch the full conference registration system with online payments and establish the pages for association honors, including awards, nominations, and the Hall of Fame.

Epic 1: Foundation, Core Content, and User Engagement
Expanded Goal: This epic lays the essential groundwork for the entire application. It includes setting up the project, establishing the main layout and styling, and fetching the first pieces of dynamic content from the CMS to display on the homepage and 'About Us' pages. Upon completion, NHBEA will have a live, professional-looking 'brochure' site and a basic channel for user engagement.

Story 1.1: Project Initialization and Core Layout
As a Board Member,
I want the initial Next.js project to be set up with the core layout and styling,
so that we have a consistent foundation for all future pages.

Acceptance Criteria:

The Next.js project is initialized using the App Router, TypeScript, and Tailwind CSS.

The project is successfully connected to the Firebase project for hosting and Firestore.

A main layout component is created containing a placeholder Header and Footer.

The ShadCN UI component library is installed and a basic theme is configured globally.

The initial project can be deployed to Firebase Hosting.

Story 1.2: Display Dynamic Homepage Content
As a Visitor,
I want to see the main content on the homepage,
so that I can quickly understand the mission of NHBEA and see current information.

Acceptance Criteria:

The homepage fetches and displays the hero section and other page content from the Cloud Firestore database.

The homepage dynamically fetches and displays the reel of sponsor logos from Firestore.

All content sections are styled professionally.

The page is fully responsive.

Story 1.3: Display "About Us", Board, and Past Presidents Pages
As a Visitor,
I want to learn about the association's mission and its leadership,
so that I can understand the organization's history and people.

Acceptance Criteria:

An "About Us" page is created that displays mission and history content from Firestore.

The "About Us" page dynamically displays the list of Current Board Members from Firestore.

A page or section is created that dynamically displays the list of Past Presidents.

All new pages are accessible from the main site navigation and are fully responsive.

Story 1.4: Implement Newsletter Signup
As a Visitor,
I want to be able to sign up for the NHBEA newsletter,
so that I can stay informed about the association's activities.

Acceptance Criteria:

A newsletter signup form is present on the site.

The form includes basic client-side validation for email format.

Upon successful submission, the email is saved to a Cloud Firestore collection.

The user is shown a clear success message after submission.

Epic 2: Membership Application and Dues Automation
Expanded Goal: This epic focuses on automating the entire membership lifecycle. It will provide dedicated, user-friendly forms for both paying professional members and free student members. The successful completion of this epic will deliver a core business objective by replacing a manual administrative task with a secure, reliable, and automated online system.

Story 2.1: Professional Membership Application and Payment
As a Professional,
I want to fill out an application form and pay my annual dues online,
so that I can easily join or renew my membership.

Acceptance Criteria:

A "Professional Membership" form is created to collect applicant details.

Form submissions are validated using Zod.

Upon submission, the system generates a Square payment link for the annual fee.

The user is redirected to the Square hosted checkout page to complete payment.

After payment, the user is redirected to a success or failure page on the NHBEA site.

Story 2.2: Student Membership Application
As a Student,
I want to fill out a detailed application for a free membership,
so that I can get involved with the association.

Acceptance Criteria:

A "Student Membership" form is created to collect detailed applicant information.

Form submissions are validated using Zod.

Upon submission, the application data is saved to a "student-applicants" collection in Firestore for board review.

The user is shown a clear success message confirming their application has been received.

Epic 3: Conference Registration and Association Honors
Expanded Goal: This epic delivers the second major operational feature: online conference registration. It also completes the MVP by building out the pages dedicated to celebrating the association's legacy and honoring its members. This epic leverages the payment integration built in Epic 2 and finalizes the website's core feature set for launch.

Story 3.1: Conference Registration and Payment
As a Visitor,
I want to learn about the annual conference and pay the registration fee online,
so that I can easily sign up for the event.

Acceptance Criteria:

A "Conference" page is created that displays details for the active conference, fetched from Firestore.

The page includes a registration form to collect attendee information.

Upon submission, the system generates a Square payment link for the conference fee.

The user is redirected to the Square hosted checkout page to complete payment.

The system includes a confirmation page to verify the transaction was successful.

Story 3.2: Display Awards and Nomination Form
As a Member,
I want to see the available awards and nominate a deserving colleague through a simple form,
so that I can participate in recognizing excellence in our field.

Acceptance Criteria:

An "Awards" page is created that displays the list of available NHBEA awards from Firestore.

The page includes a multi-step form for users to submit nominations.

The form submission is saved to a "nominations" collection in Firestore.

The user is shown a success message upon completing a nomination.

Story 3.3: Hall of Fame Display
As a Visitor,
I want to view a list of past "Business Educator of the Year" award winners,
so that I can see the legacy of the association's most honored members.

Acceptance Criteria:

A "Hall of Fame" page is created.

The page dynamically fetches and displays the list of past award winners from Firestore.

The layout is professional and responsive.