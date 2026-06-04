import { getPublishedReviews } from '@/lib/actions/reviews';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface ProfileReviewListProps {
  performerId: string;
}

export default async function ProfileReviewList({ performerId }: ProfileReviewListProps) {
  const reviews = await getPublishedReviews(performerId);

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-zinc-500 py-8">
        No reviews yet. Be the first to book this artist!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review: any) => {
        const seeker = Array.isArray(review.seeker) ? review.seeker[0] : review.seeker;
        if (!seeker) return null;

        return (
          <div key={review.id} className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-800">
                {seeker.avatar_url ? (
                  <Image
                    src={seeker.avatar_url}
                    alt={seeker.full_name || 'Talent Seeker'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold">
                    {(seeker.full_name?.[0] || 'T').toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <div className="text-white font-bold">{seeker.full_name}</div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.performer_rating.score
                          ? 'fill-magenta text-magenta'
                          : 'text-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="ml-auto text-zinc-500 text-sm">
                {new Date(review.created_at).toLocaleDateString()}
              </div>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              {review.performer_comment}
            </p>
          </div>
        );
      })}
    </div>
  );
}
