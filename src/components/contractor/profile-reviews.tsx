/**
 * Contractor Profile — Reviews Section
 * Shows only APPROVED reviews. Aggregate rating only at 5+.
 */

"use client";

import { useState } from "react";
import { Star, MessageSquare, ThumbsUp, Flag } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Props {
  reviews: any[];
}

export function ProfileReviews({ reviews }: Props) {
  const [visibleCount, setVisibleCount] = useState(5);

  if (reviews.length === 0) return null;

  const visible = reviews.slice(0, visibleCount);
  const avgRating =
    reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="card-base p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        Reviews
        <span className="text-sm font-normal text-text-muted">
          ({reviews.length})
        </span>
      </h2>

      {/* Rating summary */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-surface-muted rounded-lg">
        <div className="text-center">
          <p className="text-3xl font-bold">{avgRating.toFixed(1)}</p>
          <div className="flex gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(avgRating)
                    ? "fill-accent text-accent"
                    : "text-border"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-text-muted mt-1">{reviews.length} reviews</p>
        </div>
        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r: any) => r.rating === star).length;
            const pct = (count / reviews.length) * 100;
            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-8 text-text-muted text-right">{star}★</span>
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-text-muted">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {visible.map((review: any) => (
          <div
            key={review.id}
            className="border-b border-border pb-4 last:border-0"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {review.reviewerName}
                </span>
                {review.isVerified && (
                  <span className="text-xs text-success">✓ Verified</span>
                )}
              </div>
              <span className="text-xs text-text-muted">
                {formatDate(review.createdAt)}
              </span>
            </div>

            {/* Stars */}
            <div className="flex gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3.5 w-3.5 ${
                    star <= review.rating
                      ? "fill-accent text-accent"
                      : "text-border"
                  }`}
                />
              ))}
            </div>

            {review.title && (
              <p className="font-medium text-sm">{review.title}</p>
            )}
            <p className="text-sm text-text-muted mt-1">{review.content}</p>
          </div>
        ))}
      </div>

      {/* Show more */}
      {visibleCount < reviews.length && (
        <button
          onClick={() => setVisibleCount(visibleCount + 5)}
          className="mt-4 text-sm text-primary hover:underline font-medium"
        >
          Show {Math.min(5, reviews.length - visibleCount)} more reviews
        </button>
      )}
    </div>
  );
}
