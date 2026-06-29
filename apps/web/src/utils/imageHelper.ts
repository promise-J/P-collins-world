/**
 * Safely get the first image URL from a product's images array
 * Handles both string[] and { url: string }[] formats
 */
export const getFirstImageUrl = (images: any[] | undefined, fallback: string = "https://via.placeholder.com/300x300"): string => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return fallback;
    }
    
    const firstImage = images[0];
    
    if (typeof firstImage === 'string') {
      return firstImage;
    } else if (firstImage?.url) {
      return firstImage.url;
    }
    
    return fallback;
  };
  
  /**
   * Get all image URLs from a product's images array
   */
  export const getAllImageUrls = (images: any[] | undefined): string[] => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return [];
    }
    
    return images.map(img => {
      if (typeof img === 'string') {
        return img;
      } else if (img?.url) {
        return img.url;
      }
      return null;
    }).filter(Boolean) as string[];
  };