import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendInquiryNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listingId, sellerId, name, email, phone, message } = body;

    if (!listingId || !sellerId || !name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Save inquiry
    const { error: insertError } = await supabase.from("inquiries").insert({
      listing_id: listingId,
      seller_id: sellerId,
      buyer_name: name,
      buyer_email: email,
      buyer_phone: phone || null,
      message,
      status: "new",
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save inquiry" },
        { status: 500 }
      );
    }

    // Fetch seller info and listing title for email
    const [sellerResult, listingResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("email, full_name")
        .eq("id", sellerId)
        .single(),
      supabase
        .from("listings")
        .select("title, slug")
        .eq("id", listingId)
        .single(),
    ]);

    if (sellerResult.data && listingResult.data) {
      const origin = request.headers.get("origin") || "https://yt-pay.io";
      const listingUrl = `${origin}/cars/${listingResult.data.slug}`;

      await sendInquiryNotification({
        sellerEmail: sellerResult.data.email,
        sellerName: sellerResult.data.full_name || "Seller",
        buyerName: name,
        buyerEmail: email,
        buyerPhone: phone,
        message,
        listingTitle: listingResult.data.title,
        listingUrl,
      }).catch((err) => {
        // Log but don't fail the request if email fails
        console.error("Email notification error:", err);
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Inquiry API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
