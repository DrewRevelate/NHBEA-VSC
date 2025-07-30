import { PastPresident } from '@/types/pastPresidents';

interface PastPresidentsSectionProps {
  pastPresidents: PastPresident[];
}

export default function PastPresidentsSection({ pastPresidents }: PastPresidentsSectionProps) {
  console.log('🔍 PastPresidentsSection: Rendering with', pastPresidents?.length || 0, 'presidents');
  console.log('🔍 PastPresidentsSection: Data:', JSON.stringify(pastPresidents, null, 2));
  
  // Always render something to test UI
  const testData = pastPresidents && pastPresidents.length > 0 ? pastPresidents : [
    {
      id: 'test-1',
      name: 'Test Past President',
      term: '2023-2024',
      order: 1
    }
  ];
  
  console.log('🔍 PastPresidentsSection: Using data:', testData);

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50/30 to-indigo-50/30"></div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-indigo-400/5 rounded-full"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-400/5 to-purple-400/5 rounded-full"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              Past Presidents
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            Honoring the visionary leaders who have shaped NHBEA's legacy and guided our association through the years.
          </p>
          <div className="mt-8 w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>
        </div>
        
        {/* Timeline Layout */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-indigo-600 transform md:-translate-x-0.5" aria-hidden="true"></div>
            
            {/* Presidents List */}
            <div className="space-y-12">
              {testData.map((president, index) => (
                <div
                  key={president.id}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } opacity-0 animate-[fadeInUp_0.8s_ease-out_${index * 150}ms_forwards]`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-white border-4 border-blue-600 rounded-full transform -translate-x-2 md:-translate-x-2 z-10 shadow-lg"></div>
                  
                  {/* Content Card */}
                  <div className={`w-full md:w-5/12 ml-16 md:ml-0 ${
                    index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                  }`}>
                    <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-900/10 border border-white/20 p-6 md:p-8 group-hover:shadow-xl group-hover:shadow-blue-900/20 transition-all duration-500">
                      {/* Hover background effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10">
                        {/* Term Badge */}
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white mb-4">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {president.term}
                        </div>
                        
                        {/* President Name */}
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
                          {president.name}
                        </h3>
                        
                        {/* Decorative line */}
                        <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 mb-4"></div>
                        
                        <p className="text-slate-600 text-sm">
                          Served as President during the {president.term} term, contributing to NHBEA's mission of excellence in business education.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Legacy Message */}
        <div className="text-center mt-16 lg:mt-20">
          <div className="inline-flex flex-col items-center space-y-4 bg-white/60 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl shadow-blue-900/10 border border-white/20 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
              Continuing the Legacy
            </h3>
            <p className="text-lg text-slate-600 leading-relaxed">
              Each president has contributed their unique vision and leadership, building upon the foundation laid by their predecessors to advance business education in New Hampshire.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}