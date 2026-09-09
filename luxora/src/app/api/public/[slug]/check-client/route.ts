import { createClient } from "@/lib/supabase/server";
import { getBookableBusinessBySlug } from "@/lib/luxora/public-booking";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const url = new URL(request.url);
  const phone = url.searchParams.get("phone");
  const email = url.searchParams.get("email");

  if (!phone && !email) {
    return Response.json({ match: null });
  }

  const business = await getBookableBusinessBySlug(slug);
  if (!business) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  const supabase = await createClient();
  const { data } = await supabase.rpc("find_client_for_booking", {
    p_business_id: business.id,
    p_phone: phone,
    p_email: email,
  });

  const match = data?.[0] ?? null;
  return Response.json({ match });
}
