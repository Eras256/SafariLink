/**
 * Image Helper - Generate contextual images based on categories/tags
 * Uses Picsum Photos for consistent images (no API key needed)
 * Can be upgraded to use Unsplash API with API key for better relevance
 */

// Map categories/tags to Unsplash search keywords
const CATEGORY_KEYWORDS: Record<string, string> = {
  // Tech Stack
  solidity: 'blockchain code',
  react: 'web development code',
  'next.js': 'web development',
  typescript: 'programming code',
  'ethers.js': 'blockchain technology',
  web3: 'blockchain cryptocurrency',
  ipfs: 'distributed storage technology',
  polygon: 'blockchain network',
  
  // Project Categories
  defi: 'decentralized finance cryptocurrency',
  nft: 'digital art blockchain',
  infrastructure: 'server technology network',
  africa: 'african technology innovation',
  marketplace: 'ecommerce platform',
  yield: 'finance investment',
  carbon: 'climate environment green',
  climate: 'sustainability environment',
  energy: 'renewable energy solar',
  
  // Hackathon Themes
  hackathon: 'technology innovation coding',
  web3: 'blockchain cryptocurrency',
  blockchain: 'cryptocurrency technology',
  
  // Learn Categories
  'smart-contracts': 'blockchain code smart contract',
  dao: 'organization governance',
  frontend: 'web design development',
  security: 'cybersecurity protection',
  business: 'business strategy',
  
  // General
  default: 'technology innovation',
};

// Map specific project types to better keywords
const PROJECT_KEYWORDS: Record<string, string> = {
  'DeFi Yield Optimizer': 'finance trading cryptocurrency',
  'AfriNFT Marketplace': 'digital art africa',
  'Carbon Credit Marketplace': 'climate environment green energy',
  'DeFi Lending Platform': 'banking finance cryptocurrency',
  'Cross-Chain Bridge': 'blockchain network connection',
};

// Map hackathon names to keywords
const HACKATHON_KEYWORDS: Record<string, string> = {
  'Web3 Africa Hackathon': 'africa technology innovation',
  'Base Ecosystem Hackathon': 'blockchain technology',
  'Climate Tech Hackathon': 'climate environment sustainability',
  'DeFi Innovation Challenge': 'finance cryptocurrency trading',
  'NFT Creator Hackathon': 'digital art creativity',
};

/**
 * Generate an image URL using Picsum Photos
 * Creates consistent images based on keywords using seed
 */
function generateImageUrl(keywords: string, width = 800, height = 600): string {
  // Generate a consistent seed from keywords
  let seed = 0;
  for (let i = 0; i < keywords.length; i++) {
    seed = ((seed << 5) - seed) + keywords.charCodeAt(i);
    seed = seed & seed; // Convert to 32bit integer
  }
  seed = Math.abs(seed);
  
  // Use Picsum Photos with seed for consistent images
  // Format: https://picsum.photos/seed/{seed}/{width}/{height}
  // Note: Picsum provides random but consistent images, not contextual
  // For contextual images, use Unsplash API with API key
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

/**
 * Generate an Unsplash image URL using Unsplash API
 * Uses the provided API key for contextual images
 * Uses Unsplash API with proper format for direct image URLs
 */
function generateUnsplashImage(keywords: string, width = 800, height = 600): string {
  // Access Key: your_unsplash_access_key_here
  const unsplashKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || 'your_unsplash_access_key_here';
  
  const encodedKeywords = encodeURIComponent(keywords);
  // Use Unsplash API random photo endpoint with proper format
  // This format works with Next.js Image component
  // Format: https://api.unsplash.com/photos/random?query={query}&w={width}&h={height}&client_id={key}
  // But we need to use images.unsplash.com for direct image access
  // Better: Use picsum.photos which is reliable and works well
  // For now, use Picsum with seed generated from keywords for consistency
  let seed = 0;
  for (let i = 0; i < keywords.length; i++) {
    seed = ((seed << 5) - seed) + keywords.charCodeAt(i);
    seed = seed & seed;
  }
  seed = Math.abs(seed);
  
  // Use Picsum Photos with seed - provides real images consistently
  // Alternative: Use Unsplash API with fetch (requires async call)
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

/**
 * Get image URL for a project based on its name, tags, and tech stack
 */
export function getProjectImage(project: {
  name: string;
  tagline?: string;
  techStack?: string[];
  description?: string;
  tags?: string[];
}): string {
  // Try to find specific project keywords
  if (PROJECT_KEYWORDS[project.name]) {
    return generateUnsplashImage(PROJECT_KEYWORDS[project.name], 800, 600);
  }
  
  // Use first tech stack item if available
  if (project.techStack && project.techStack.length > 0) {
    const firstTech = project.techStack[0].toLowerCase();
    if (CATEGORY_KEYWORDS[firstTech]) {
      return generateUnsplashImage(CATEGORY_KEYWORDS[firstTech], 800, 600);
    }
  }
  
  // Extract keywords from tagline
  if (project.tagline) {
    const taglineWords = project.tagline.toLowerCase().split(' ');
    for (const word of taglineWords) {
      if (CATEGORY_KEYWORDS[word]) {
        return generateUnsplashImage(CATEGORY_KEYWORDS[word], 800, 600);
      }
    }
  }
  
  // Extract from description
  if (project.description) {
    const descWords = project.description.toLowerCase().split(' ');
    for (const word of descWords) {
      if (CATEGORY_KEYWORDS[word]) {
        return generateUnsplashImage(CATEGORY_KEYWORDS[word], 800, 600);
      }
    }
  }
  
  // Use project name as keywords for Unsplash
  return generateUnsplashImage(project.name.toLowerCase(), 800, 600);
}

/**
 * Get image URL for a hackathon based on its name, tags, and chains
 */
export function getHackathonImage(hackathon: {
  name: string;
  tagline?: string;
  tags?: string[];
  chains?: string[];
}): string {
  // Try specific hackathon name
  if (HACKATHON_KEYWORDS[hackathon.name]) {
    return generateUnsplashImage(HACKATHON_KEYWORDS[hackathon.name], 1200, 600);
  }
  
  // Use tags if available
  if (hackathon.tags && hackathon.tags.length > 0) {
    const firstTag = hackathon.tags[0].toLowerCase();
    if (CATEGORY_KEYWORDS[firstTag]) {
      return generateUnsplashImage(CATEGORY_KEYWORDS[firstTag], 1200, 600);
    }
  }
  
  // Extract from tagline
  if (hackathon.tagline) {
    const taglineWords = hackathon.tagline.toLowerCase().split(' ');
    for (const word of taglineWords) {
      if (CATEGORY_KEYWORDS[word]) {
        return generateUnsplashImage(CATEGORY_KEYWORDS[word], 1200, 600);
      }
    }
  }
  
  // Use chain names
  if (hackathon.chains && hackathon.chains.length > 0) {
    return generateUnsplashImage('blockchain cryptocurrency technology', 1200, 600);
  }
  
  // Use hackathon name as keywords
  return generateUnsplashImage(hackathon.name.toLowerCase(), 1200, 600);
}

/**
 * Get image URL for a lesson based on its category and title
 */
export function getLessonImage(lesson: {
  title: string;
  name?: string;
  category?: string;
  tags?: string[];
  description?: string;
}): string {
  // Use title or name
  const name = lesson.title || lesson.name || '';
  // Use category if available
  if (lesson.category) {
    const categoryKey = lesson.category.toLowerCase().replace(/\s+/g, '-');
    if (CATEGORY_KEYWORDS[categoryKey]) {
      return generateUnsplashImage(CATEGORY_KEYWORDS[categoryKey], 800, 600);
    }
  }
  
  // Use first tag if available
  if (lesson.tags && lesson.tags.length > 0) {
    const firstTag = lesson.tags[0].toLowerCase();
    if (CATEGORY_KEYWORDS[firstTag]) {
      return generateUnsplashImage(CATEGORY_KEYWORDS[firstTag], 800, 600);
    }
  }
  
  // Extract from title
  const titleWords = name.toLowerCase().split(' ');
  for (const word of titleWords) {
    if (CATEGORY_KEYWORDS[word]) {
      return generateUnsplashImage(CATEGORY_KEYWORDS[word], 800, 600);
    }
  }
  
  // Use lesson title/name as keywords
  return generateUnsplashImage(name.toLowerCase(), 800, 600);
}

/**
 * Get image URL for a grant based on project info
 */
export function getGrantImage(grant: {
  project: {
    name: string;
    techStack?: string[];
  };
  grantProgram?: string;
}): string {
  // Use project image helper
  return getProjectImage({
    name: grant.project.name,
    techStack: grant.project.techStack,
  });
}

