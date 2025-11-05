/**
 * Unsplash Image Service
 * Fetches real images from Unsplash based on search queries
 * Falls back to Picsum Photos if no API key is available
 */

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description?: string;
}

/**
 * Fetch a random image from Unsplash based on search query
 * This is the correct way to use Unsplash API
 */
export async function fetchUnsplashImage(
  query: string,
  width = 800,
  height = 600
): Promise<string | null> {
  // Access Key: your_unsplash_access_key_here
  const unsplashKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || 'your_unsplash_access_key_here';

  if (!unsplashKey) {
    // Fallback to Picsum Photos
    return getPicsumImage(query, width, height);
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&w=${width}&h=${height}&orientation=landscape&client_id=${unsplashKey}`,
      {
        headers: {
          'Accept-Version': 'v1',
        },
        // Cache for 1 hour to avoid rate limits
        cache: 'force-cache',
      }
    );

    if (!response.ok) {
      console.warn('Unsplash API error:', response.status);
      return getPicsumImage(query, width, height);
    }

    const data: UnsplashPhoto = await response.json();
    // Return the full image URL with dimensions
    return `${data.urls.regular}&w=${width}&h=${height}&fit=crop`;
  } catch (error) {
    console.error('Error fetching Unsplash image:', error);
    return getPicsumImage(query, width, height);
  }
}

/**
 * Get Picsum Photos image with seed for consistency
 */
function getPicsumImage(query: string, width: number, height: number): string {
  // Generate consistent seed from query
  let seed = 0;
  for (let i = 0; i < query.length; i++) {
    seed = ((seed << 5) - seed) + query.charCodeAt(i);
    seed = seed & seed;
  }
  seed = Math.abs(seed);
  
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

/**
 * Get cached image URL or fetch new one
 * Uses localStorage to cache image URLs
 */
export async function getCachedImage(
  key: string,
  query: string,
  width = 800,
  height = 600
): Promise<string> {
  // Try to get from cache first
  if (typeof window !== 'undefined') {
    const cacheKey = `image_${key}_${width}_${height}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // Fetch new image
  const imageUrl = await fetchUnsplashImage(query, width, height);
  
  if (imageUrl && typeof window !== 'undefined') {
    // Cache the URL
    const cacheKey = `image_${key}_${width}_${height}`;
    localStorage.setItem(cacheKey, imageUrl);
  }

  return imageUrl || getPicsumImage(query, width, height);
}

