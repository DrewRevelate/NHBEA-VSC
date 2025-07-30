'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getSponsorImageUrl } from '@/lib/imageUtils';

interface SponsorImageProps {
  logoURL?: string;
  sponsorName: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function SponsorImage({ 
  logoURL, 
  sponsorName, 
  className = "relative z-10 object-contain max-w-full max-h-full grayscale group-hover:grayscale-0 transition-all duration-500",
  width = 160,
  height = 160 
}: SponsorImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!!logoURL);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!logoURL || logoURL.trim() === '') {
      setIsLoading(false);
      return;
    }

    async function loadImage() {
      try {
        setIsLoading(true);
        setHasError(false);
        const url = await getSponsorImageUrl(logoURL);
        setImageUrl(url);
      } catch (error) {
        console.warn('Failed to load sponsor image:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadImage();
  }, [logoURL]);

  // Show placeholder while loading or if no image/error
  if (isLoading || !imageUrl || hasError || !logoURL || logoURL.trim() === '') {
    return (
      <div className="relative z-10 text-center">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <div className="w-8 h-8 border-2 border-[var(--nhbea-royal-blue)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="text-4xl font-bold text-slate-400 mb-2">
              {sponsorName.charAt(0).toUpperCase()}
            </div>
            <div className="text-xs text-slate-500">
              {sponsorName}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={`${sponsorName} logo`}
      width={width}
      height={height}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}