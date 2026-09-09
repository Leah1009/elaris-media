import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const BodySchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const json = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Invalid review." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_review", {
    p_token: token,
    p_rating: parsed.data.rating,
    p_comment: parsed.data.comment || null,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ ok: true });
}
