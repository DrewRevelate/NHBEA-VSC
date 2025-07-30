import { Suspense, lazy } from 'react';
import { StandardPageLayout } from '@/components/StandardPageLayout';
import { FlexibleHero } from '@/components/FlexibleHero';
import { StandardErrorBoundary } from '@/components/StandardErrorBoundary';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { LoadingSpinner, LoadingSkeleton } from '@/components/LoadingSpinner';
import EnhancedMissionSection from '@/components/EnhancedMissionSection';
import BoardMembersSection from '@/components/BoardMembersSection';
import PastPresidentsSection from '@/components/PastPresidentsSection';
import { getHomepageContent, defaultHomepageContent } from '@/lib/content';
import { getBoardMembers as getLegacyBoardMembers, defaultBoardMembers } from '@/lib/board';
import { getPastPresidents, defaultPastPresidents } from '@/lib/pastPresidents';
import { getBoardMembers, convertToLegacyBoardMember } from '@/lib/members';
import { Member } from '@/types/dataModels';

// Lazy load non-critical sections for performance optimization
const HeritageSection = lazy(() => import('@/components/HeritageSection'));
const ValuesImpactSection = lazy(() => import('@/components/ValuesImpactSection'));
const LeadershipOverviewSection = lazy(() => import('@/components/LeadershipOverviewSection'));

// Metadata is now handled by StandardPageLayout

async function AboutPage() {
  let aboutContent = defaultHomepageContent;
  let boardMembers = defaultBoardMembers;
  let enhancedBoardMembers: Member[] | undefined = undefined;  
  let pastPresidents = defaultPastPresidents;

  // Fetch content with error handling built into StandardErrorBoundary
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
    // Keep using defaultBoardMembers
  }

  try {
    const fetchedPastPresidents = await getPastPresidents();
    console.log('🔍 Past Presidents fetched:', fetchedPastPresidents?.length || 0);
    if (fetchedPastPresidents && fetchedPastPresidents.length > 0) {
      pastPresidents = fetchedPastPresidents;
    } else {
      // For testing, let's use default data to verify the component works
      console.log('🔍 Using default past presidents for testing');
      pastPresidents = defaultPastPresidents;
    }
  } catch (error) {
    console.error('Failed to fetch past presidents:', error);
    // Keep using defaultPastPresidents
  }

  // Configure FlexibleHero props
  const aboutHeroProps = {
    variant: 'about' as const,
    title: 'About NHBEA',
    subtitle: 'Dedicated to advancing business education throughout New Hampshire since 1960',
    boardCount: boardMembers?.length || 15,
    establishedYear: 1960
  };

  return (
    <StandardPageLayout
      hero={{ component: FlexibleHero, props: aboutHeroProps }}
      error={{ boundary: true }}
      loading={{ enabled: true }}
      meta={{
        title: 'About - NHBEA',
        description: 'Learn about our mission, values, and leadership team committed to advancing business education in New Hampshire',
        openGraph: true,
        twitterCard: true
      }}
      main={{ id: 'about-main-content', focusable: true }}
      className="min-h-screen"
    >
      <div className="space-y-0">
        <StandardErrorBoundary>
          <EnhancedMissionSection
            title={aboutContent.missionTitle}
            content={aboutContent.missionContent}
          />
        </StandardErrorBoundary>

        <StandardErrorBoundary>
          <Suspense fallback={<LoadingSkeleton variant="content" />}>
            <HeritageSection />
          </Suspense>
        </StandardErrorBoundary>

        <StandardErrorBoundary>
          <Suspense fallback={<LoadingSkeleton variant="content" />}>
            <ValuesImpactSection />
          </Suspense>
        </StandardErrorBoundary>

        <StandardErrorBoundary>
          <Suspense fallback={<LoadingSkeleton variant="content" />}>
            <LeadershipOverviewSection />
          </Suspense>
        </StandardErrorBoundary>

        <StandardErrorBoundary>
          <div id="board-members">
            <BoardMembersSection 
              boardMembers={boardMembers} 
              enhancedMembers={enhancedBoardMembers} 
            />
          </div>
        </StandardErrorBoundary>

        <StandardErrorBoundary>
          <div id="past-presidents">
            <PastPresidentsSection pastPresidents={pastPresidents} />
          </div>
        </StandardErrorBoundary>
      </div>
    </StandardPageLayout>
  );
}

export default function About() {
  return <AboutPage />;
}