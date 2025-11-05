'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getProjectImage, getHackathonImage, getLessonImage, getGrantImage } from '@/lib/images/imageHelper';
import { fetchUnsplashImage } from '@/lib/images/unsplashService';

interface OptimizedImageProps {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  containerClassName?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  priority?: boolean;
  fallbackText?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  sizes?: string;
  onError?: () => void;
  // Contextual image generation
  type?: 'project' | 'hackathon' | 'lesson' | 'grant';
  contextData?: {
    name?: string;
    title?: string;
    tagline?: string;
    techStack?: string[];
    tags?: string[];
    category?: string;
    chains?: string[];
    description?: string;
    project?: {
      name: string;
      techStack?: string[];
    };
    grantProgram?: string;
  };
}

// Generate a gradient placeholder based on text
function generateGradientPlaceholder(text: string): string {
  // Simple hash function to generate consistent colors
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash % 360);
  const saturation = 60 + (Math.abs(hash) % 20);
  const lightness = 20 + (Math.abs(hash) % 15);
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  containerClassName,
  placeholder = 'empty',
  blurDataURL,
  priority = false,
  fallbackText,
  objectFit = 'cover',
  sizes,
  onError,
  type,
  contextData,
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [unsplashImage, setUnsplashImage] = useState<string | null>(null);

  // Generate fallback text from alt if not provided
  const displayText = fallbackText || alt.charAt(0).toUpperCase();

  // Generate blur placeholder
  const blurPlaceholder = blurDataURL || generateGradientPlaceholder(alt);

  // Get contextual image URL synchronously (fallback to Picsum)
  const getContextualImageSync = (): string | null => {
    if (!type || !contextData) return null;
    
    try {
      switch (type) {
        case 'project':
          if (!contextData.name) return null;
          return getProjectImage({
            name: contextData.name,
            tagline: contextData.tagline,
            techStack: contextData.techStack,
            description: contextData.description,
            tags: contextData.tags,
          });
        case 'hackathon':
          if (!contextData.name) return null;
          return getHackathonImage({
            name: contextData.name,
            tagline: contextData.tagline,
            tags: contextData.tags,
            chains: contextData.chains,
          });
        case 'lesson':
          if (!contextData.title && !contextData.name) return null;
          return getLessonImage({
            title: contextData.title || contextData.name || '',
            name: contextData.name,
            category: contextData.category,
            tags: contextData.tags,
            description: contextData.description,
          });
        case 'grant':
          if (!contextData.project?.name) return null;
          return getGrantImage({
            project: {
              name: contextData.project.name,
              techStack: contextData.project.techStack,
            },
            grantProgram: contextData.grantProgram,
          });
        default:
          return null;
      }
    } catch (error) {
      console.error('Error generating contextual image:', error);
      return null;
    }
  };

  // Get keywords for Unsplash search using the same mapping as imageHelper
  const getUnsplashKeywords = (): string | null => {
    if (!type || !contextData) return null;
    
    try {
      // Use the same helper functions that generate the sync images
      // but extract keywords from them
      switch (type) {
        case 'project':
          if (!contextData.name) return null;
          // Use project keywords mapping
          if (contextData.tagline) {
            // Extract keywords from tagline
            const taglineWords = contextData.tagline.toLowerCase().split(' ');
            if (taglineWords.includes('defi') || taglineWords.includes('yield')) return 'decentralized finance cryptocurrency';
            if (taglineWords.includes('nft') || taglineWords.includes('art')) return 'digital art blockchain';
            if (taglineWords.includes('climate') || taglineWords.includes('carbon')) return 'climate environment green energy';
          }
          if (contextData.techStack && contextData.techStack.length > 0) {
            const firstTech = contextData.techStack[0].toLowerCase();
            if (firstTech === 'solidity') return 'blockchain code';
            if (firstTech === 'react') return 'web development code';
          }
          return 'blockchain cryptocurrency technology';
        case 'hackathon':
          if (!contextData.name) return null;
          if (contextData.name.includes('NFT') || contextData.name.includes('nft')) return 'digital art creativity';
          if (contextData.name.includes('Climate') || contextData.name.includes('climate')) return 'climate environment sustainability';
          if (contextData.name.includes('DeFi') || contextData.name.includes('defi')) return 'finance cryptocurrency trading';
          if (contextData.name.includes('Africa') || contextData.name.includes('africa')) return 'africa technology innovation';
          return 'technology innovation hackathon';
        case 'lesson':
          if (contextData.category) {
            const category = contextData.category.toLowerCase();
            if (category.includes('defi')) return 'decentralized finance cryptocurrency';
            if (category.includes('nft')) return 'digital art blockchain';
            if (category.includes('smart-contract')) return 'blockchain code smart contract';
            if (category.includes('dao')) return 'organization governance';
          }
          return 'education learning technology';
        case 'grant':
          if (contextData.project?.name) {
            return 'blockchain cryptocurrency technology';
          }
          return null;
        default:
          return null;
      }
    } catch (error) {
      return null;
    }
  };

  // Fetch Unsplash image asynchronously if we have keywords
  useEffect(() => {
    if (!src || src.includes('placeholder') || src === '') {
      const keywords = getUnsplashKeywords();
      if (keywords && typeof window !== 'undefined') {
        const imageWidth = width || (fill ? 800 : width) || 800;
        const imageHeight = height || (fill ? 600 : height) || 600;
        
        fetchUnsplashImage(keywords, imageWidth, imageHeight)
          .then((url) => {
            if (url) {
              setUnsplashImage(url);
            }
          })
          .catch((error) => {
            console.warn('Failed to fetch Unsplash image:', error);
          });
      }
    }
  }, [src, type, contextData?.name, contextData?.title, contextData?.tagline, contextData?.category, width, height, fill]);

  // Use Unsplash image if available, otherwise use sync fallback or provided src
  // syncFallback uses Picsum Photos which provides real images immediately
  const syncFallback = src && !src.includes('placeholder') && src !== '' && src !== null 
    ? src 
    : getContextualImageSync();
  
  // Prioritize Unsplash image if available, otherwise use sync fallback (Picsum)
  // This ensures we always have a real image, either from Unsplash (contextual) or Picsum (consistent)
  const actualSrc = unsplashImage || syncFallback || null;

  // Handle image load error
  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
    onError?.();
  };

  // Handle successful image load
  const handleLoad = () => {
    setIsLoading(false);
  };

  // If no src or image error, show fallback
  if (!actualSrc || imageError) {
    return (
      <div
        className={cn(
          'relative flex items-center justify-center overflow-hidden',
          containerClassName,
          fill ? 'w-full h-full' : '',
          className
        )}
        style={
          fill
            ? undefined
            : {
                width: width || '100%',
                height: height || '100%',
              }
        }
      >
        <div
          className="absolute inset-0 bg-gradient-to-br opacity-80"
          style={{
            background: `linear-gradient(135deg, ${generateGradientPlaceholder(alt)} 0%, ${generateGradientPlaceholder(alt + '2')} 100%)`,
          }}
        />
        <div className="relative z-10 text-4xl md:text-6xl font-bold text-white/20 select-none">
          {displayText}
        </div>
      </div>
    );
  }

  // If fill is true, use fill layout
  if (fill) {
    return (
      <div className={cn('relative overflow-hidden', containerClassName)}>
        {isLoading && (
          <div
            className="absolute inset-0 bg-gradient-to-br opacity-50 animate-pulse"
            style={{
              background: `linear-gradient(135deg, ${blurPlaceholder} 0%, ${blurPlaceholder} 100%)`,
            }}
          />
        )}
        <Image
          src={actualSrc}
          alt={alt}
          fill
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            objectFit === 'cover' && 'object-cover',
            objectFit === 'contain' && 'object-contain',
            objectFit === 'fill' && 'object-fill',
            objectFit === 'none' && 'object-none',
            objectFit === 'scale-down' && 'object-scale-down',
            className
          )}
          placeholder={placeholder}
          blurDataURL={placeholder === 'blur' ? blurPlaceholder : undefined}
          priority={priority}
          sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          onError={handleError}
          onLoad={handleLoad}
        />
      </div>
    );
  }

  // Otherwise use width/height layout
  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      {isLoading && (
        <div
          className="absolute inset-0 bg-gradient-to-br opacity-50 animate-pulse"
          style={{
            background: `linear-gradient(135deg, ${blurPlaceholder} 0%, ${blurPlaceholder} 100%)`,
          }}
        />
      )}
      <Image
        src={actualSrc}
        alt={alt}
        width={width || 400}
        height={height || 300}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill',
          objectFit === 'none' && 'object-none',
          objectFit === 'scale-down' && 'object-scale-down',
          className
        )}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? blurPlaceholder : undefined}
        priority={priority}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
}

