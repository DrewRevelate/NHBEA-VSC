import { Suspense, lazy } from 'react';
import { StandardPageLayout } from '@/components/StandardPageLayout';
import { StandardErrorBoundary } from '@/components/StandardErrorBoundary';
import { LoadingSkeleton } from '@/components/LoadingSpinner';
import AboutHeroSection from '@/components/AboutHeroSection';
import EnhancedAboutSection from '@/components/EnhancedAboutSection';
import BoardMembersSection from '@/components/BoardMembersSection';
import PastPresidentsSection from '@/components/PastPresidentsSection';
import { getHomepageContent, defaultHomepageContent } from '@/lib/content';
import { getBoardMembers as getLegacyBoardMembers, defaultBoardMembers } from '@/lib/board';
import { getPastPresidents, defaultPastPresidents } from '@/lib/pastPresidents';
import { getBoardMembers, convertToLegacyBoardMember } from '@/lib/members';
import { Member } from '@/types/dataModels';

// Lazy load sections for better performance
const EnhancedMissionSection = lazy(() => import('@/components/EnhancedMissionSection'));
const StatisticsSection = lazy(() => import('@/components/StatisticsSection'));
const TrustBadgesSection = lazy(() => import('@/components/TrustBadgesSection'));

async function EnhancedAboutPage() {
  let aboutContent = defaultHomepageContent;
  let boardMembers = defaultBoardMembers;
  let enhancedBoardMembers: Member[] | undefined = undefined;  
  let pastPresidents = defaultPastPresidents;

  // Fetch content with error handling
  try {
    const fetchedContent = await getHomepageContent();
    if (fetchedContent) {
      aboutContent = fetchedContent;
    }
  } catch (error) {
    console.error('Failed to fetch about content:', error);
  }

  try {
    // Try new enhanced members API first
    const fetchedEnhancedMembers = await getBoardMembers();
    if (fetchedEnhancedMembers && fetchedEnhancedMembers.length > 0) {
      enhancedBoardMembers = fetchedEnhancedMembers;
      // Also convert to legacy format as fallback
      boardMembers = fetchedEnhancedMembers.map((member, index) => ({
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
    console.error('Failed to fetch board members:', error);
  }

  try {
    const fetchedPastPresidents = await getPastPresidents();
    if (fetchedPastPresidents && fetchedPastPresidents.length > 0) {
      pastPresidents = fetchedPastPresidents;
    } else {
      pastPresidents = defaultPastPresidents;
    }
  } catch (error) {
    console.error('Failed to fetch past presidents:', error);
  }

  return (
    <StandardPageLayout
      error={{ boundary: true }}
      loading={{ enabled: true }}
      meta={{
        title: 'About - NHBEA',
        description: 'Discover NHBEA\'s 64-year legacy of advancing business education excellence in New Hampshire. Learn about our mission, impact, and dedicated community of educators.',
        openGraph: true,
        twitterCard: true
      }}
      main={{ id: 'about-main-content', focusable: true }}
      className="min-h-screen"
    >
      {/* Enhanced Hero Section */}
      <StandardErrorBoundary>
        <AboutHeroSection
          title="About NHBEA"
          subtitle="Dedicated to advancing business education excellence in New Hampshire since 1960"
          boardCount={boardMembers?.length || 15}
          establishedYear={1960}
          memberCount={500}
          schoolCount={50}
        />
      </StandardErrorBoundary>

      {/* Story & Impact Section */}
      <StandardErrorBoundary>
        <EnhancedAboutSection />
      </StandardErrorBoundary>

      {/* Mission Section */}
      <StandardErrorBoundary>
        <Suspense fallback={<LoadingSkeleton variant="content" />}>
          <section className="py-20 bg-white">
            <div className="container mx-auto px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                  Our <span className="bg-gradient-to-r from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)] bg-clip-text text-transparent">Mission</span>
                </h2>
                <div className="text-xl text-gray-600 leading-relaxed space-y-6">
                  <p>
                    The New Hampshire Business Educators Association is dedicated to promoting excellence in business education throughout the state. We serve as a vital resource for educators, students, and the broader business community.
                  </p>
                  <p>
                    Through professional development, networking opportunities, and innovative programs, we empower educators to inspire the next generation of business leaders while fostering strong connections between academia and industry.
                  </p>
                </div>
                
                {/* Mission pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                  <div className="group p-8 bg-gradient-to-br from-[var(--nhbea-royal-blue)]/5 to-[var(--nhbea-royal-blue)]/10 rounded-2xl border border-[var(--nhbea-royal-blue)]/20 hover:border-[var(--nhbea-royal-blue)]/30 transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Educational Excellence</h3>
                    <p className="text-gray-600">Promoting the highest standards in business education curriculum and teaching methodologies</p>
                  </div>

                  <div className="group p-8 bg-gradient-to-br from-[var(--nhbea-accent-orange)]/5 to-[var(--nhbea-accent-orange)]/10 rounded-2xl border border-[var(--nhbea-accent-orange)]/20 hover:border-[var(--nhbea-accent-orange)]/30 transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--nhbea-accent-orange)] to-[var(--nhbea-accent-orange-dark)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Development</h3>
                    <p className="text-gray-600">Supporting continuous growth and career advancement for our educator community</p>
                  </div>

                  <div className="group p-8 bg-gradient-to-br from-[var(--nhbea-accent-green)]/5 to-[var(--nhbea-accent-green)]/10 rounded-2xl border border-[var(--nhbea-accent-green)]/20 hover:border-[var(--nhbea-accent-green)]/30 transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--nhbea-accent-green)] to-[var(--nhbea-accent-green-dark)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Community Impact</h3>
                    <p className="text-gray-600">Building stronger communities through quality business education and student success</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Suspense>
      </StandardErrorBoundary>

      {/* Leadership Sections with Enhanced Spacing */}
      <div className="bg-gradient-to-br from-slate-50 to-white">
        <StandardErrorBoundary>
          <div id="board-members" className="py-20">
            <BoardMembersSection 
              boardMembers={boardMembers} 
              enhancedMembers={enhancedBoardMembers} 
            />
          </div>
        </StandardErrorBoundary>

        <StandardErrorBoundary>
          <div id="past-presidents" className="py-20 border-t border-gray-100">
            <PastPresidentsSection pastPresidents={pastPresidents} />
          </div>
        </StandardErrorBoundary>
      </div>

      {/* Trust & Statistics Sections */}
      <StandardErrorBoundary>
        <Suspense fallback={<LoadingSkeleton variant="content" />}>
          <StatisticsSection />
        </Suspense>
      </StandardErrorBoundary>

      <StandardErrorBoundary>
        <Suspense fallback={<LoadingSkeleton variant="content" />}>
          <TrustBadgesSection />
        </Suspense>
      </StandardErrorBoundary>
    </StandardPageLayout>
  );
}

export default function About() {
  return <EnhancedAboutPage />;
}