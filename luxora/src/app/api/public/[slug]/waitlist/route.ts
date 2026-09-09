import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getBookableBusinessBySlug } from "@/lib/luxora/public-booking";

const BodySchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().optional(),
  email: z.union([z.email(), z.literal("")]).optional(),
  serviceId: z.string().optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBookableBusinessBySlug(slug);
  if (!business) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  const json = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("waitlist").insert({
    business_id: business.id,
    full_name: data.fullName,
    phone: data.phone || null,
    email: data.email || null,
    service_id: data.serviceId || null,
    status: "waiting",
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ joined: true });
}
