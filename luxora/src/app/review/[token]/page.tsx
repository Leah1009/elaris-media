import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReviewForm } from "@/components/review-form";

export default async function PublicReviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_review_request", { p_token: token }).maybeSingle();

  if (!data) notFound();

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">
        {data.business_name}
      </span>
      <h1 className="mt-2 font-display text-3xl text-charcoal">How was your visit?</h1>
      <div className="mt-8">
        {data.status === "completed" ? (
          <p className="text-sm text-ink">This review link has already been used — thank you!</p>
        ) : (
          <ReviewForm token={token} />
        )}
      </div>
    </main>
  );
}
