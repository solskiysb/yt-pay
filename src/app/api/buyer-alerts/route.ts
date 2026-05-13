import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendBuyerAlertConfirmation } from "@/lib/email";

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // 10 alerts per hour per IP
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

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, name, make, model, country, language } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error: insertError } = await supabase.from("buyer_alerts").insert({
      email: email.toLowerCase().trim(),
      name: name?.trim() || null,
      make: make || null,
      model: model || null,
      country: country || null,
      language: language || "en",
    });

    if (insertError) {
      console.error("Buyer alert insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create alert" },
        { status: 500 }
      );
    }

    // Send confirmation email (non-blocking)
    sendBuyerAlertConfirmation({
      email: email.toLowerCase().trim(),
      name: name?.trim() || undefined,
      make: make || undefined,
      model: model || undefined,
    }).catch((err) => {
      console.error("Buyer alert confirmation email error:", err);
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Buyer alert API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
