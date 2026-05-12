import { createClient } from "@supabase/supabase-js";

function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();

    if (!slug || typeof slug !== "string") {
      return Response.json({ error: "Invalid slug" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase.rpc("increment_views", {
      listing_slug: slug,
    });

    if (error) {
      console.error("increment_views error:", error);
      return Response.json({ error: "Failed to increment views" }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
}
