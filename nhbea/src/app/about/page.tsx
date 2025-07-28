import { Suspense } from 'react';
import { Metadata } from 'next';
import BoardMembersSection from '@/components/BoardMembersSection';
import PastPresidentsSection from '@/components/PastPresidentsSection';
import { getHomepageContent, defaultHomepageContent } from '@/lib/content';
import { getBoardMembers as getLegacyBoardMembers, defaultBoardMembers } from '@/lib/board';
import { getPastPresidents, defaultPastPresidents } from '@/lib/pastPresidents';
import { getBoardMembers, convertToLegacyBoardMember } from '@/lib/members';

export const metadata: Metadata = {
  title: 'About Us | New Hampshire Business Educators Association',
  description: 'Learn about NHBEA\'s mission, history, and leadership. Meet our current board members and honor our past presidents.',
  keywords: 'NHBEA, business education, New Hampshire, board members, past presidents, mission',
};

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

function ErrorFallback({ error }: { error: string }) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 m-4 text-sm">
        <p className="text-yellow-800">⚠️ Development Notice: Using fallback content ({error})</p>
      </div>
    );
  }
  return null;
}

async function AboutPage() {
  let aboutContent = defaultHomepageContent;
  let boardMembers = defaultBoardMembers;
  let pastPresidents = defaultPastPresidents;
  let contentError = null;
  let boardError = null;
  let presidentsError = null;
  

  try {
    const fetchedContent = await getHomepageContent();
    if (fetchedContent) {
      aboutContent = fetchedContent;
    }
  } catch (error) {
    contentError = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to fetch about content:', error);
  }

  try {
    // Try new enhanced members API first
    const enhancedBoardMembers = await getBoardMembers();
    if (enhancedBoardMembers && enhancedBoardMembers.length > 0) {
      // Convert to legacy format for existing component
      boardMembers = enhancedBoardMembers.map((member, index) => ({
        ...convertToLegacyBoardMember(member),
        id: `member-${index}`
      }));
    } else {
      // Fall back to legacy API if no enhanced members found
      const legacyBoardMembers = await getLegacyBoardMembers();
      if (legacyBoardMembers && legacyBoardMembers.length > 0) {
        boardMembers = legacyBoardMembers;
      }
    }
  } catch (error) {
    boardError = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to fetch board members:', error);
    // Keep using defaultBoardMembers
  }
  

  try {
    const fetchedPastPresidents = await getPastPresidents();
    if (fetchedPastPresidents && fetchedPastPresidents.length > 0) {
      pastPresidents = fetchedPastPresidents;
    }
  } catch (error) {
    presidentsError = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to fetch past presidents:', error);
    // Keep using defaultPastPresidents
  }
  

  return (
    <div className="min-h-screen">
      {/* Skip to content link for accessibility */}
      <a 
        href="#about-main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      {/* Hero Section */}
      <section 
        className="relative py-20 lg:py-32 overflow-hidden"
        role="banner"
        aria-label="About Us hero section"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
        </div>
        
        <div 
          className="absolute inset-0 overflow-hidden pointer-events-none" 
          aria-hidden="true"
          role="presentation"
        >
          <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full animate-pulse [will-change:opacity]"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full animate-pulse delay-1000 [will-change:opacity]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                About NHBEA
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              Discover our mission, meet our leadership, and learn about our commitment to excellence in business education.
            </p>
            <div className="mt-8 w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>
          </div>
        </div>
      </section>

      <main id="about-main-content" className="focus:outline-none" tabIndex={-1}>
        {contentError && <ErrorFallback error={contentError} />}
        
        {/* Mission Section */}
        <section className="py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white"></div>
          
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  {aboutContent.missionTitle}
                </span>
              </h2>
              <div className="text-lg md:text-xl text-slate-600 leading-relaxed font-light space-y-6">
                {(aboutContent.missionContent || '').split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index}>
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
              <div className="mt-8 w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50/30 to-indigo-50/30"></div>
          
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  {aboutContent.aboutTitle}
                </span>
              </h2>
              <div className="text-lg md:text-xl text-slate-600 leading-relaxed font-light space-y-6">
                {(aboutContent.aboutContent || '').split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index}>
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
              <div className="mt-8 w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>
            </div>
          </div>
        </section>

        {/* Board Members Section */}
        {boardError && <ErrorFallback error={boardError} />}
        <BoardMembersSection boardMembers={boardMembers} />

        {/* Past Presidents Section */}
        {presidentsError && <ErrorFallback error={presidentsError} />}
        <PastPresidentsSection pastPresidents={pastPresidents} />
      </main>
    </div>
  );
}

export default function About() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AboutPage />
    </Suspense>
  );
}