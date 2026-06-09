import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { ReviewService } from '@/services/review.service';
import { Card, Button, TextArea, Avatar, Spinner } from '@/ui';
import { Star, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => ReviewService.getProductReviews(productId),
  });

  const createReviewMutation = useMutation({
    mutationFn: (payload: { rating: number; comment: string }) =>
      ReviewService.createReview(productId, payload),
    onSuccess: () => {
      toast.success('Review submitted!');
      setComment('');
      setRating(0);
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    },
  });

  const handleSubmit = () => {
    if (!isAuthenticated) {
      toast.error('Please login to leave a review');
      return;
    }
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    createReviewMutation.mutate({ rating, comment });
  };

  const reviews = data?.data || [];
  const averageRating = data?.averageRating || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-3xl font-bold text-[var(--color-brand-text)]">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={star <= averageRating ? 'fill-[var(--color-brand-secondary)] text-[var(--color-brand-secondary)]' : 'text-gray-300'}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500 mt-1">{reviews.length} reviews</div>
        </div>
      </div>

      {/* Write Review */}
      {isAuthenticated && (
        <Card>
          <h3 className="font-semibold mb-3">Write a Review</h3>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-600">Your Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)}>
                  <Star
                    size={20}
                    className={star <= rating ? 'fill-[var(--color-brand-secondary)] text-[var(--color-brand-secondary)]' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>
          </div>
          <TextArea
            label="Your Review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={4}
          />
          <Button
            onClick={handleSubmit}
            loading={createReviewMutation.isPending}
            className="mt-3"
          >
            Submit Review
          </Button>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review: any) => (
          <Card key={review._id}>
            <div className="flex gap-3">
              <Avatar name={review.userId?.firstName} src={review.userId?.avatar} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {review.userId?.firstName} {review.userId?.lastName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={star <= review.rating ? 'fill-[var(--color-brand-secondary)] text-[var(--color-brand-secondary)]' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-gray-600">{review.comment}</p>
              </div>
            </div>
          </Card>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No reviews yet. Be the first to review!
          </div>
        )}
      </div>
    </div>
  );
}