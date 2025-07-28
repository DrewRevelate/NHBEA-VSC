import Image from 'next/image';
import { BoardMember } from '@/types/board';

interface BoardMembersSectionProps {
  boardMembers: BoardMember[];
}

export default function BoardMembersSection({ boardMembers }: BoardMembersSectionProps) {
  if (!boardMembers || boardMembers.length === 0) {
    return null;
  }

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white"></div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-indigo-400/5 rounded-full"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-400/5 to-purple-400/5 rounded-full"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              Current Board Members
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            Meet the dedicated leaders who guide NHBEA's mission and vision for excellence in business education.
          </p>
          <div className="mt-8 w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>
        </div>
        
        {/* Board Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12">
          {boardMembers.map((member, index) => (
            <div
              key={member.id}
              className={`group relative opacity-0 animate-[fadeInUp_0.8s_ease-out_${index * 200}ms_forwards]`}
            >
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg shadow-blue-900/10 border border-white/20 p-8 group-hover:shadow-xl group-hover:shadow-blue-900/20 transition-all duration-500 h-full">
                {/* Hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 text-center">
                  {/* Member Photo */}
                  <div className="mb-6">
                    <div className="relative w-32 h-32 mx-auto">
                      {member.imageURL ? (
                        <Image
                          src={member.imageURL}
                          alt={`${member.name} photo`}
                          fill
                          className="object-cover rounded-full shadow-lg"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-lg">
                          <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 font-semibold text-lg">
                        {member.title}
                      </p>
                    </div>
                    
                    <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
                    
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}