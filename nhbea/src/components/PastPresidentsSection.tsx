import { PastPresident } from '@/types/pastPresidents';

interface PastPresidentsSectionProps {
  pastPresidents: PastPresident[];
}

export default function PastPresidentsSection({ pastPresidents }: PastPresidentsSectionProps) {
  console.log('🔍 PastPresidentsSection: Received', pastPresidents?.length || 0, 'presidents');
  
  // Fallback test data if no real data
  const testPresidents: PastPresident[] = [
    {
      id: 'fallback-1',
      name: 'James Dowding',
      term: '2022-2023',
      order: 1
    }
  ];

  // Use real data if available, otherwise use test data
  const displayPresidents = pastPresidents && pastPresidents.length > 0 ? pastPresidents : testPresidents;

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-amber-50 via-slate-50 to-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Distinguished header with legacy theme */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-16"></div>
            <div className="mx-4 text-amber-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-16"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--nhbea-royal-blue-deeper)] mb-4">
            Past Presidents
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Honoring the distinguished leaders who have shaped NHBEA's enduring legacy of excellence.
          </p>
        </div>

        {/* Elegant grid layout matching board members style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {displayPresidents.map((president, index) => (
            <div 
              key={president.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-amber-300 transition-all duration-200 relative overflow-hidden"
            >
              {/* Subtle legacy accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
              
              <div className="text-center">
                {/* Distinguished nameplate style */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
                    {president.name}
                  </h3>
                  <p className="text-[var(--nhbea-royal-blue)] font-medium text-sm mb-2">
                    President
                  </p>
                  
                  {/* Term display with elegant styling */}
                  {president.term && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-200">
                      <span className="text-amber-800 text-sm font-medium">
                        {president.term}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bio section */}
                {president.bio && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                      {president.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legacy tribute section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-white via-amber-50 to-white rounded-xl shadow-sm border border-amber-200 p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="text-amber-600">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[var(--nhbea-royal-blue-deeper)] mb-4">
              A Legacy of Leadership
            </h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              Each president has contributed their unique vision and dedication, building upon 
              the foundation laid by their predecessors to advance business education throughout 
              New Hampshire. Their collective wisdom continues to guide our mission today.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}