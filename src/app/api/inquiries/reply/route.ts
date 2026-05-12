import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendReplyNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Require authenticated seller
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { inquiryId, message } = body;

    if (!inquiryId || !message?.trim()) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch inquiry (RLS ensures seller owns it)
    const { data: inquiry, error: fetchError } = await supabase
      .from("inquiries")
      .select("*, listings(make, model, year, slug)")
      .eq("id", inquiryId)
      .single();

    if (fetchError || !inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }

    // Update inquiry with reply
    const { error: updateError } = await supabase
      .from("inquiries")
      .update({
        seller_reply: message.trim(),
        replied_at: new Date().toISOString(),
        status: "replied",
      })
      .eq("id", inquiryId);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        { error: "Failed to save reply" },
        { status: 500 }
      );
    }

    // Send email to buyer
    const listing = inquiry.listings as {
      make: string;
      model: string;
      year: number;
      slug: string;
    } | null;
    const listingTitle = listing
      ? `${listing.year} ${listing.make} ${listing.model}`
      : "your inquiry";
    const origin = request.headers.get("origin") || "https://yt-pay.io";
    const listingUrl = listing ? `${origin}/cars/${listing.slug}` : origin;

    await sendReplyNotification({
      buyerEmail: inquiry.buyer_email,
      buyerName: inquiry.buyer_name,
      sellerMessage: message.trim(),
      listingTitle,
      listingUrl,
    }).catch((err) => {
      console.error("Reply email error:", err);
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reply API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
