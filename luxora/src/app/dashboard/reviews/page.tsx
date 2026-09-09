import { createClient } from "@/lib/supabase/server";
import { getBusinessContext } from "@/lib/luxora/business-context";
import { getAppUrl } from "@/lib/luxora/app-url";
import { requestReview, respondToReview, setReviewVisibility } from "@/lib/luxora/reviews-actions";

export default async function ReviewsPage() {
  const ctx = await getBusinessContext();
  const supabase = await createClient();
  const appUrl = await getAppUrl();

  const [{ data: reviews }, { data: pendingAppointments }, { data: summary }] = await Promise.all([
    supabase
      .from("reviews")
      .select("id, rating, comment, status, response, created_at, client:client_id(full_name)")
      .eq("business_id", ctx.business.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("appointments")
      .select("id, start_at, client:client_id(full_name), review_requests(id, token, status)")
      .eq("business_id", ctx.business.id)
      .eq("status", "completed")
      .order("start_at", { ascending: false })
      .limit(25),
    supabase
      .from("reviews")
      .select("rating")
      .eq("business_id", ctx.business.id)
      .eq("status", "published"),
  ]);

  const publishedRatings = summary ?? [];
  const averageRating =
    publishedRatings.length > 0
      ? (publishedRatings.reduce((sum, r) => sum + r.rating, 0) / publishedRatings.length).toFixed(1)
      : null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl text-charcoal">Reviews</h1>
        {averageRating ? (
          <p className="mt-1 text-sm text-ink">
            {averageRating} ★ average from {publishedRatings.length} published review
            {publishedRatings.length === 1 ? "" : "s"}
          </p>
        ) : (
          <p className="mt-1 text-sm text-ink/60">No published reviews yet.</p>
        )}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg text-charcoal">Request a review</h2>
        <p className="text-sm text-ink/70">
          Send a link for a completed appointment — the client can leave a rating without creating an
          account.
        </p>
        <div className="overflow-x-auto rounded-sm border border-border bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink/60">
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Review link</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {(pendingAppointments ?? []).map((a) => {
                const request = a.review_requests;
                return (
                  <tr key={a.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-ink">{a.client?.full_name ?? "—"}</td>
                    <td className="px-4 py-3 text-ink">{new Date(a.start_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-mono text-xs text-ink/70">
                      {request ? (
                        request.status === "completed" ? (
                          <span className="text-ink/50">Submitted</span>
                        ) : (
                          `${appUrl}/review/${request.token}`
                        )
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {!request ? (
                        <form action={requestReview}>
                          <input type="hidden" name="appointmentId" value={a.id} />
                          <button
                            type="submit"
                            className="rounded-sm border border-border px-3 py-1.5 text-xs text-charcoal transition hover:bg-cream-deep"
                          >
                            Send request
                          </button>
                        </form>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg text-charcoal">Collected reviews</h2>
        <div className="flex flex-col gap-4">
          {(reviews ?? []).map((review) => (
            <div key={review.id} className="rounded-sm border border-border bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gold-deep">{"★".repeat(review.rating)}</span>
                  <span className="text-ink/30">{"★".repeat(5 - review.rating)}</span>
                  <span className="ml-2 text-sm text-charcoal">{review.client?.full_name ?? "Client"}</span>
                </div>
                <form action={setReviewVisibility}>
                  <input type="hidden" name="reviewId" value={review.id} />
                  <input
                    type="hidden"
                    name="status"
                    value={review.status === "published" ? "hidden" : "published"}
                  />
                  <button type="submit" className="text-xs text-ink/60 underline underline-offset-2">
                    {review.status === "published" ? "Hide" : "Publish"}
                  </button>
                </form>
              </div>
              {review.comment ? <p className="mt-2 text-sm text-ink">{review.comment}</p> : null}
              <p className="mt-1 text-xs text-ink/50">{new Date(review.created_at).toLocaleDateString()}</p>

              {review.response ? (
                <p className="mt-3 rounded-sm bg-cream-deep p-3 text-sm text-charcoal">
                  <span className="font-medium">Your response: </span>
                  {review.response}
                </p>
              ) : null}
              <form action={respondToReview} className="mt-3 flex gap-2">
                <input type="hidden" name="reviewId" value={review.id} />
                <input
                  name="response"
                  defaultValue={review.response ?? ""}
                  placeholder="Write a response…"
                  className="flex-1 rounded-sm border border-border px-3 py-1.5 text-sm"
                />
                <button
                  type="submit"
                  className="rounded-sm border border-border px-3 py-1.5 text-xs text-charcoal transition hover:bg-cream-deep"
                >
                  Save
                </button>
              </form>
            </div>
          ))}
          {(!reviews || reviews.length === 0) && (
            <p className="text-sm text-ink/60">No reviews submitted yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
