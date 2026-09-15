"use client";

import { deleteReview } from "@/lib/luxora/reviews-actions";

export function DeleteReviewForm({ reviewId }: { reviewId: string }) {
  return (
    <form
      action={deleteReview}
      onSubmit={(e) => {
        if (!window.confirm("Delete this review? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="reviewId" value={reviewId} />
      <button type="submit" className="text-xs text-danger underline underline-offset-2">
        Delete
      </button>
    </form>
  );
}
