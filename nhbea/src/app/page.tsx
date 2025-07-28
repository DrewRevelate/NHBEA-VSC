import { Suspense } from 'react';
import HeroSection from '@/components/HeroSection';
import ContentSection from '@/components/ContentSection';
import SponsorsSection from '@/components/SponsorsSection';
import { getHomepageContent, defaultHomepageContent } from '@/lib/content';
import { getSponsors, defaultSponsors } from '@/lib/sponsors';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

function ErrorFallback({ error }: { error: string }) {
  // For production, we'll hide errors and silently use fallback content
  // Only show in development mode
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 m-4 text-sm">
        <p className="text-yellow-800">⚠️ Development Notice: Using fallback content ({error})</p>
      </div>
    );
  }
  return null;
}

async function HomePage() {
  let homepageContent = defaultHomepageContent;
  let sponsors = defaultSponsors;
  let contentError = null;
  let sponsorsError = null;

  try {
    const fetchedContent = await getHomepageContent();
    if (fetchedContent) {
      homepageContent = fetchedContent;
    }
  } catch (error) {
    contentError = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to fetch homepage content:', error);
  }

  try {
    sponsors = await getSponsors();
  } catch (error) {
    sponsorsError = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to fetch sponsors:', error);
  }

  // Ensure we always have valid content
  const safeContent = homepageContent || defaultHomepageContent;

  return (
    <div className="min-h-screen">
      {contentError && <ErrorFallback error={contentError} />}
      
      <HeroSection content={safeContent} />
      
      <main id="main-content" className="focus:outline-none" tabIndex={-1}>
        <ContentSection
          title={safeContent.missionTitle}
          content={safeContent.missionContent}
        />
        
        <ContentSection
          title={safeContent.aboutTitle}
          content={safeContent.aboutContent}
          reverse
        />
        
        {sponsorsError && <ErrorFallback error={sponsorsError} />}
        <SponsorsSection sponsors={sponsors} />
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomePage />
    </Suspense>
  );
}
