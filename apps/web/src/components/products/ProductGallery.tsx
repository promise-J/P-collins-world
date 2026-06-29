import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { PropertyLightbox } from '../properties/PropertyLightbox';

// 1. Keep the exact object layout you requested
interface ProductGalleryProps {
  images: { url: string; publicId: string }[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');

  // 2. Standardize fallback data into the exact same object shape
  const defaultImages = images?.length > 0 
    ? images 
    : [{ url: 'https://via.placeholder.com/600x400?text=No+Image', publicId: 'placeholder' }];

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? defaultImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === defaultImages.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = () => {
    // 3. Extract the '.url' string property before passing it to the Lightbox state
    setLightboxImage(defaultImages[selectedIndex].url);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative group">
          <img
            // 4. Access the image URL string path here
            src={defaultImages[selectedIndex].url}
            alt={`${title} - Image ${selectedIndex + 1}`}
            className="w-full h-[400px] object-cover rounded-xl cursor-pointer"
            onClick={openLightbox}
          />
          
          {/* Navigation Arrows */}
          {defaultImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Zoom Button */}
          <button
            onClick={openLightbox}
            className="absolute bottom-2 right-2 p-2 rounded-lg bg-black/50 hover:bg-black/70 transition-colors"
          >
            <ZoomIn size={20} className="text-white" />
          </button>
        </div>

        {/* Thumbnails */}
        {defaultImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {defaultImages.map((img, index) => (
              <button
                // 5. Use publicId as a stable, unique item key instead of index
                key={img.publicId || index}
                onClick={() => handleThumbnailClick(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all
                  ${selectedIndex === index ? 'border-[var(--color-brand-primary)]' : 'border-transparent'}
                `}
              >
                <img
                  // 6. Access the thumbnail URL string path here
                  src={img.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <PropertyLightbox
        open={lightboxOpen}
        image={lightboxImage}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
