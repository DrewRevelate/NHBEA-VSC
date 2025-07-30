'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { HallOfFameMember } from '@/types/dataModels';

interface EnhancedHallOfFameGridProps {
  members: HallOfFameMember[];
}

// Enhanced member card with modern design
function EnhancedMemberCard({ member, index }: { member: HallOfFameMember; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const formatAwardType = (awardType: string) => {
    switch (awardType) {
      case 'business_educator_of_the_year':
        return 'Business Educator of the Year';
      case 'lifetime_achievement':
        return 'Lifetime Achievement';
      case 'distinguished_service':
        return 'Distinguished Service';
      case 'innovation':
        return 'Innovation Award';
      default:
        return 'Distinguished Recognition';
    }
  };

  const getAwardBadgeColor = (awardType: string) => {
    switch (awardType) {
      case 'business_educator_of_the_year':
        return 'from-accent to-accent/80';
      case 'lifetime_achievement':
        return 'from-primary to-primary/90';
      case 'distinguished_service':
        return 'from-primary/90 to-primary';
      case 'innovation':
        return 'from-accent to-accent/80';
      default:
        return 'from-muted to-foreground';
    }
  };

  const getAwardIcon = (awardType: string) => {
    switch (awardType) {
      case 'business_educator_of_the_year':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'lifetime_achievement':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        );
      case 'innovation':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`nhbea-card-interactive overflow-hidden transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/30 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-card to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative p-8">
        {/* Award Badge */}
        <div className="absolute top-4 right-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getAwardBadgeColor(member.awardType)} shadow-lg`}>
            {getAwardIcon(member.awardType)}
            <span className="ml-1">{member.year}</span>
          </div>
        </div>

        {/* Member Photo */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-secondary to-muted shadow-lg ring-4 ring-card group-hover:ring-primary/20 transition-all duration-300">
              {member.imageUrl ? (
                <Image
                  src={member.imageUrl}
                  alt={`${member.name} - Hall of Fame ${member.year}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="128px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20 text-primary">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {/* Decorative ring */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-30 transition-opacity duration-300" style={{ padding: '2px' }}>
              <div className="w-full h-full rounded-full bg-card"></div>
            </div>
          </div>
        </div>

        {/* Member Info */}
        <div className="text-center mb-6">
          <h3 className="heading-4 mb-2 group-hover:text-primary transition-colors">
            {member.name}
          </h3>
          <p className="text-primary font-semibold text-sm mb-1">
            {formatAwardType(member.awardType)}
          </p>
          <p className="text-muted-foreground text-sm font-medium">
            Class of {member.year}
          </p>
        </div>

        {/* Biography */}
        {member.bio && (
          <div className="mb-6">
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
              {member.bio}
            </p>
          </div>
        )}

        {/* Achievements */}
        {member.achievements && member.achievements.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-foreground flex items-center">
              <svg className="w-4 h-4 mr-2 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Notable Achievements
            </h4>
            <div className="space-y-2">
              {member.achievements.slice(0, isHovered ? member.achievements.length : 3).map((achievement, idx) => (
                <div key={idx} className="flex items-start group-hover:transform group-hover:translate-x-1 transition-transform duration-200" style={{ transitionDelay: `${idx * 50}ms` }}>
                  <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-xs text-muted-foreground leading-relaxed">{achievement}</span>
                </div>
              ))}
              {!isHovered && member.achievements.length > 3 && (
                <div className="text-primary font-medium text-xs pl-5">
                  +{member.achievements.length - 3} more achievements
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
      </div>
    </div>
  );
}

// Loading skeleton component
function LoadingCard({ index }: { index: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className={`nhbea-card p-8 transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <div className="animate-pulse">
        <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-6"></div>
        <div className="space-y-3 mb-6">
          <div className="h-6 bg-muted rounded mx-auto w-3/4"></div>
          <div className="h-4 bg-muted rounded mx-auto w-1/2"></div>
          <div className="h-3 bg-muted rounded mx-auto w-1/4"></div>
        </div>
        <div className="space-y-2 mb-6">
          <div className="h-3 bg-muted rounded"></div>
          <div className="h-3 bg-muted rounded"></div>
          <div className="h-3 bg-muted rounded w-3/4"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-3 bg-muted rounded"></div>
          <div className="h-3 bg-muted rounded w-4/5"></div>
        </div>
      </div>
    </div>
  );
}

// Filter and sort controls
function FilterControls({ 
  members, 
  onFilter, 
  selectedFilter 
}: { 
  members: HallOfFameMember[]; 
  onFilter: (filter: string) => void;
  selectedFilter: string;
}) {
  const awardTypes = [...new Set(members.map(m => m.awardType))];
  const years = [...new Set(members.map(m => m.year))].sort((a, b) => b - a);

  const formatFilterLabel = (type: string) => {
    switch (type) {
      case 'all': return 'All Members';
      case 'business_educator_of_the_year': return 'Business Educator';
      case 'lifetime_achievement': return 'Lifetime Achievement';
      case 'distinguished_service': return 'Distinguished Service';
      case 'innovation': return 'Innovation';
      default: return type;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-12">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedFilter === 'all'
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          }`}
        >
          All Members ({members.length})
        </button>
        {awardTypes.map(type => {
          const count = members.filter(m => m.awardType === type).length;
          return (
            <button
              key={type}
              onClick={() => onFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedFilter === type
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              {formatFilterLabel(type)} ({count})
            </button>
          );
        })}
      </div>
      
      <div className="text-sm text-muted-foreground">
        Showing {members.filter(m => selectedFilter === 'all' || m.awardType === selectedFilter).length} of {members.length} members
      </div>
    </div>
  );
}

export default function EnhancedHallOfFameGrid({ members }: EnhancedHallOfFameGridProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredMembers = members.filter(member => 
    selectedFilter === 'all' || member.awardType === selectedFilter
  );

  if (isLoading) {
    return (
      <section className="nhbea-section bg-gradient-to-br from-background via-card to-secondary/10">
        <div className="nhbea-container">
          <div className="text-center mb-16">
            <div className="inline-block h-8 w-64 bg-muted rounded mb-4 animate-pulse"></div>
            <div className="h-4 w-96 bg-muted rounded mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }, (_, i) => (
              <LoadingCard key={i} index={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (members.length === 0) {
    return (
      <section className="nhbea-section bg-gradient-to-br from-background via-card to-secondary/10">
        <div className="nhbea-container-narrow text-center">
          <div className="nhbea-card p-12">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 012-2h10a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="heading-2 mb-4">Hall of Fame Coming Soon</h2>
            <p className="body-text text-lg leading-relaxed max-w-2xl mx-auto">
              Our Hall of Fame honorees will be displayed here soon. These distinguished educators 
              represent the pinnacle of excellence in New Hampshire business education.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="nhbea-section bg-muted/30">
      <div className="nhbea-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="heading-2 mb-4">
            Distinguished Honorees
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Celebrating the exceptional educators who have shaped business education 
            and inspired generations of students throughout New Hampshire.
          </p>
        </div>

        {/* Filter Controls */}
        <FilterControls 
          members={members}
          onFilter={setSelectedFilter}
          selectedFilter={selectedFilter}
        />

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMembers.map((member, index) => (
            <EnhancedMemberCard 
              key={member.id} 
              member={member} 
              index={index}
            />
          ))}
        </div>

        {/* No results message */}
        {filteredMembers.length === 0 && selectedFilter !== 'all' && (
          <div className="text-center py-12">
            <div className="nhbea-card p-8 max-w-md mx-auto">
              <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146.832-5.636 2.172M12 15v2a3 3 0 01-3 3H7a3 3 0 01-3-3v-2c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10a9.955 9.955 0 01-5.636-1.672" />
              </svg>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Members Found</h3>
              <p className="text-muted-foreground text-sm">
                No Hall of Fame members match the selected filter. Try selecting a different category.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}