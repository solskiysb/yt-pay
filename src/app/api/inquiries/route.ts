import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendInquiryNotification } from "@/lib/email";

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // 5 inquiries per hour per IP
const WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + WINDOW });
    return false;
  }

  if (entry.count >= RATE_LIMIT) {
    return true;
  }

  entry.count++;
  return false;
}

// Periodically clean up expired entries to prevent memory leaks
if (typeof globalThis !== "undefined") {
  const CLEANUP_INTERVAL = 10 * 60 * 1000; // every 10 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimit) {
      if (now > entry.resetTime) {
        rateLimit.delete(ip);
      }
    }
  }, CLEANUP_INTERVAL).unref?.();
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many inquiries. Please try again later." },
        { status: 429 }
      );
    }

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
