import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, Play } from 'lucide-react';
import { PropertyLightbox } from './PropertyLightbox';

interface MediaItem {
  url: string;
  type?: 'image' | 'video';
  publicId?: string;
  thumbnail?: string; // Add optional thumbnail property
}

interface PropertyGalleryProps {
  media: MediaItem[];
  title: string;
}

export function PropertyGallery({ media, title }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState<MediaItem | null>(null);

  // Fix: Explicitly type defaultMedia with proper type
  const defaultMedia: MediaItem[] = media?.length > 0 
    ? media 
    : [{ url: 'https://via.placeholder.com/800x500?text=No+Image', type: 'image' }];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? defaultMedia.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === defaultMedia.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = () => {
    const current = defaultMedia[selectedIndex];
    if (current.type !== 'video') {
      setLightboxMedia(current);
      setLightboxOpen(true);
    }
  };

  const currentMedia = defaultMedia[selectedIndex];

  return (
    <>
      <div className="space-y-4">
        {/* Main Media */}
        <div className="relative group">
          {currentMedia.type === 'video' ? (
            <video
              src={currentMedia.url}
              className="w-full h-[450px] object-cover rounded-xl"
              controls
              poster={currentMedia.thumbnail}
            />
          ) : (
            <img
              src={currentMedia.url}
              alt={`${title} - Image ${selectedIndex + 1}`}
              className="w-full h-[450px] object-cover rounded-xl cursor-pointer"
              onClick={openLightbox}
            />
          )}

          {/* Navigation Arrows */}
          {defaultMedia.length > 1 && (
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

          {/* Zoom Button (Images Only) */}
          {currentMedia.type !== 'video' && (
            <button
              onClick={openLightbox}
              className="absolute bottom-2 right-2 p-2 rounded-lg bg-black/50 hover:bg-black/70 transition-colors"
            >
              <ZoomIn size={20} className="text-white" />
            </button>
          )}
        </div>

        {/* Thumbnails */}
        {defaultMedia.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {defaultMedia.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all relative
                  ${selectedIndex === index ? 'border-[var(--color-brand-primary)]' : 'border-transparent'}
                `}
              >
                {item.type === 'video' ? (
                  <div className="relative w-full h-full">
                    <img
                      src={item.thumbnail || item.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play size={16} className="text-white" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxMedia && lightboxMedia.type !== 'video' && (
        <PropertyLightbox
          open={lightboxOpen}
          image={lightboxMedia.url}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}