# Data Models & Database Schema
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