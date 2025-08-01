import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "NHBEA Connect - New Hampshire Business Education Association",
    template: "%s | NHBEA Connect"
  },
  description: "New Hampshire Business Education Association - Supporting business educators across the state with professional development, networking, and career advancement opportunities since 1923.",
  metadataBase: new URL("https://nhbea-64cab.web.app"),
  keywords: [
    "business education",
    "New Hampshire",
    "educators",
    "professional development",
    "teaching excellence",
    "career advancement",
    "networking",
    "awards",
    "NHBEA"
  ],
  authors: [{ name: "New Hampshire Business Education Association" }],
  creator: "NHBEA",
  publisher: "New Hampshire Business Education Association",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "NHBEA Connect",
    title: "New Hampshire Business Education Association",
    description: "Supporting business educators across New Hampshire with professional development, networking, and career advancement opportunities since 1923.",
    url: "https://nhbea-64cab.web.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Hampshire Business Education Association",
    description: "Supporting business educators across New Hampshire with professional development opportunities since 1923.",
  },
  verification: {
    google: "verify-google-site", // Add actual verification code when available
  },
  alternates: {
    canonical: "https://nhbea-64cab.web.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Font preloading for performance optimization */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Georgia:wght@400;700&display=swap"
        />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "New Hampshire Business Education Association",
              "alternateName": "NHBEA",
              "url": "https://nhbea-64cab.web.app",
              "description": "New Hampshire Business Education Association - Supporting business educators across the state with professional development, networking, and career advancement opportunities since 1923.",
              "foundingDate": "1923",
              "address": {
                "@type": "PostalAddress",
                "addressRegion": "NH",
                "addressCountry": "US"
              },
              "sameAs": [
                "https://nhbea-64cab.web.app"
              ],
              "knowsAbout": [
                "Business Education",
                "Professional Development",
                "Teaching Excellence",
                "Career Advancement",
                "Educational Leadership"
              ],
              "memberOf": {
                "@type": "Organization",
                "name": "National Business Education Association"
              }
            }),
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning={true}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
