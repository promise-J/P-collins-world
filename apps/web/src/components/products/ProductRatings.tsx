import { Star } from 'lucide-react';

interface ProductRatingsProps {
  rating: number;
  totalReviews?: number;
  showCount?: boolean;
}

export function ProductRatings({ rating, totalReviews = 0, showCount = true }: ProductRatingsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={16} className="fill-[var(--color-brand-secondary)] text-[var(--color-brand-secondary)]" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star size={16} className="text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star size={16} className="fill-[var(--color-brand-secondary)] text-[var(--color-brand-secondary)]" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={16} className="text-gray-300" />
        ))}
      </div>
      {showCount && totalReviews > 0 && (
        <span className="text-sm text-gray-500">({totalReviews} reviews)</span>
      )}
      {showCount && totalReviews === 0 && (
        <span className="text-sm text-gray-500">No reviews yet</span>
      )}
    </div>
  );
}

// Rating Breakdown Component
interface RatingBreakdownProps {
  ratings: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  totalReviews: number;
}

export function RatingBreakdown({ ratings, totalReviews }: RatingBreakdownProps) {
  const getPercentage = (count: number) => (count / totalReviews) * 100;

  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((star) => (
        <div key={star} className="flex items-center gap-3">
          <div className="flex items-center gap-1 w-12">
            <span className="text-sm">{star}</span>
            <Star size={14} className="fill-[var(--color-brand-secondary)] text-[var(--color-brand-secondary)]" />
          </div>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-brand-secondary)] rounded-full"
              style={{ width: `${getPercentage(ratings[star as keyof typeof ratings])}%` }}
            />
          </div>
          <span className="text-sm text-gray-500 w-12">
            {ratings[star as keyof typeof ratings]}
          </span>
        </div>
      ))}
    </div>
  );
}