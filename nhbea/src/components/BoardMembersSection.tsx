import { BoardMember } from '@/types/board';
import { Member } from '@/types/dataModels';
import MemberImage from './MemberImage';

// Extended interface for display with optional fields
interface DisplayBoardMember extends BoardMember {
  secondaryTitle?: string;
}

interface BoardMembersSectionProps {
  boardMembers: BoardMember[];
  enhancedMembers?: Member[]; // Optional prop for enhanced data model
}

export default function BoardMembersSection({ boardMembers, enhancedMembers }: BoardMembersSectionProps) {
  // Helper function to determine display order based on board position
  function getBoardPositionOrder(position?: string): number {
    const orderMap: Record<string, number> = {
      'President': 1,
      'Vice President': 2,
      'Secretary': 3,
      'Treasurer': 4,
      'Past President': 5,
      'Board Member': 6
    };
    
    return orderMap[position || 'Board Member'] || 6;
  }
  
  // If enhanced members are provided, convert them to display format
  let displayMembers: DisplayBoardMember[] = boardMembers || [];
  
  if (enhancedMembers && enhancedMembers.length > 0) {
    displayMembers = enhancedMembers
      .filter(member => member.profile?.activeBoardMember)
      .map(member => {
        // Build name with optional prefix
        const prefix = member.personalInfo?.prefix;
        const firstName = member.personalInfo?.firstName?.trim() || '';
        const lastName = member.personalInfo?.lastName?.trim() || '';
        const fullName = prefix 
          ? `${prefix} ${firstName} ${lastName}`.trim()
          : `${firstName} ${lastName}`.trim();

        return {
          id: member.id,
          name: fullName,
          title: member.profile?.boardPosition || 'Board Member',
          secondaryTitle: member.organization?.secondary_title,
          bio: member.profile?.bio || '',
          imageURL: member.image,
          order: member.profile?.boardOrder || getBoardPositionOrder(member.profile?.boardPosition)
        };
      })
      .sort((a, b) => (a.order || 999) - (b.order || 999));
  }

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Clean, professional header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--nhbea-royal-blue-deeper)] mb-4">
            Board of Directors
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Meet the dedicated leaders who guide NHBEA's mission for excellence in business education.
          </p>
        </div>
        
        {/* Clean, consistent grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all duration-200"
            >
              <div className="text-center">
                {/* Member photo with Firebase Storage integration */}
                <div className="mb-4">
                  <MemberImage
                    imagePath={member.imageURL}
                    memberName={member.name}
                  />
                </div>

                {/* Clean member info */}
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[var(--nhbea-royal-blue)] font-medium text-sm mb-1">
                    {member.title}
                  </p>
                  {member.secondaryTitle && (
                    <p className="text-[var(--color-text-secondary)] text-xs mb-3 italic">
                      {member.secondaryTitle}
                    </p>
                  )}
                  {!member.secondaryTitle && <div className="mb-3"></div>}
                  {member.bio && (
                    <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}