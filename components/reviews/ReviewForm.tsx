'use client';

import { useState } from 'react';
import { submitReview } from '@/lib/actions/reviews';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  bookingId: string;
  userRole: 'performer' | 'seeker';
}

export default function ReviewForm({ bookingId, userRole }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitReview({
        bookingId,
        rating: { score: rating }, // Can be expanded to multi-metric
        comment,
        userRole,
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-zinc-900 p-6 rounded-xl text-center">
        <h3 className="text-xl font-bold text-white mb-2">Thank you for your feedback!</h3>
        <p className="text-zinc-400">
          Your review has been saved. It will become visible once the other party submits theirs or in 14 days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
      <h3 className="text-xl font-bold text-white mb-4">
        Rate your experience as a {userRole}
      </h3>

      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <Star
              className={`w-8 h-8 ${
                star <= rating ? 'fill-magenta text-magenta' : 'text-zinc-600'
              }`}
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment here..."
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white mb-4 h-32 focus:border-magenta focus:outline-none"
        required
      />

      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="w-full bg-magenta text-white font-bold py-3 rounded-lg hover:bg-magenta/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
