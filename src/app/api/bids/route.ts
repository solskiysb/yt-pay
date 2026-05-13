import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Rate limiting: max 1 bid per 10 seconds per user
const bidRateLimit = new Map<string, number>();

function isBidRateLimited(userId: string): boolean {
  const now = Date.now();
  const lastBid = bidRateLimit.get(userId);

  if (lastBid && now - lastBid < 10_000) {
    return true;
  }

  bidRateLimit.set(userId, now);
  return false;
}

// Periodic cleanup
if (typeof globalThis !== "undefined") {
  setInterval(() => {
    const cutoff = Date.now() - 60_000;
    for (const [userId, ts] of bidRateLimit) {
      if (ts < cutoff) {
        bidRateLimit.delete(userId);
      }
    }
  }, 60_000).unref?.();
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Rate limit
    if (isBidRateLimited(user.id)) {
      return NextResponse.json(
        { error: "Please wait 10 seconds between bids" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { listingId, amount } = body;

    if (!listingId || !amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    // Fetch listing
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select(
        "id, listing_type, auction_end, current_bid, starting_bid, reserve_price, bid_count, seller_id, status"
      )
      .eq("id", listingId)
      .single();

    if (listingError || !listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Validate auction conditions
    if (listing.listing_type !== "auction") {
      return NextResponse.json(
        { error: "This listing is not an auction" },
        { status: 400 }
      );
    }

    if (listing.status !== "approved") {
      return NextResponse.json(
        { error: "This auction is not active" },
        { status: 400 }
      );
    }

    if (listing.seller_id === user.id) {
      return NextResponse.json(
        { error: "You cannot bid on your own listing" },
        { status: 400 }
      );
    }

    const now = new Date();
    const auctionEnd = new Date(listing.auction_end);
    if (now >= auctionEnd) {
      return NextResponse.json(
        { error: "This auction has ended" },
        { status: 400 }
      );
    }

    const currentBid = listing.current_bid ?? 0;
    const startingBid = listing.starting_bid ?? 0;

    // Must be >= starting_bid
    if (amount < startingBid) {
      return NextResponse.json(
        { error: `Bid must be at least ${startingBid}` },
        { status: 400 }
      );
    }

    // Must be > current_bid
    if (amount <= currentBid) {
      return NextResponse.json(
        { error: `Bid must be higher than current bid of ${currentBid}` },
        { status: 400 }
      );
    }

    // Insert bid
    const { data: bid, error: bidError } = await supabase
      .from("bids")
      .insert({
        listing_id: listingId,
        bidder_id: user.id,
        amount,
      })
      .select("id, amount, created_at")
      .single();

    if (bidError) {
      console.error("Bid insert error:", bidError);
      return NextResponse.json(
        { error: "Failed to place bid" },
        { status: 500 }
      );
    }

    // Update listing
    const reserveMet =
      listing.reserve_price != null && amount >= listing.reserve_price;

    const { error: updateError } = await supabase
      .from("listings")
      .update({
        current_bid: amount,
        bid_count: (listing.bid_count ?? 0) + 1,
        reserve_met: reserveMet || listing.reserve_price == null,
      })
      .eq("id", listingId);

    if (updateError) {
      console.error("Listing update error:", updateError);
      // Bid was placed but listing update failed - not ideal but bid is recorded
    }

    return NextResponse.json({
      success: true,
      bid: {
        id: bid.id,
        amount: bid.amount,
        createdAt: bid.created_at,
      },
    });
  } catch (err) {
    console.error("Bids API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listingId");

    if (!listingId) {
      return NextResponse.json(
        { error: "listingId is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch bids
    const { data: bids, error: bidsError } = await supabase
      .from("bids")
      .select("id, amount, created_at, profiles(full_name)")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (bidsError) {
      console.error("Bids fetch error:", bidsError);
      return NextResponse.json(
        { error: "Failed to fetch bids" },
        { status: 500 }
      );
    }

    // Fetch current listing state
    const { data: listing } = await supabase
      .from("listings")
      .select("current_bid, bid_count, reserve_met, auction_end")
      .eq("id", listingId)
      .single();

    const formattedBids = (bids ?? []).map(
      (row: Record<string, unknown>) => {
        const profileData = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
        const name = (profileData as { full_name?: string } | null)?.full_name ?? "Anonymous";
        const parts = name.split(" ");
        const initials =
          parts.length >= 2
            ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
            : name.substring(0, 2).toUpperCase();

        return {
          id: row.id as string,
          amount: row.amount as number,
          createdAt: row.created_at as string,
          bidderInitials: initials,
        };
      }
    );

    return NextResponse.json({
      bids: formattedBids,
      currentBid: listing?.current_bid ?? 0,
      bidCount: listing?.bid_count ?? 0,
      reserveMet: listing?.reserve_met ?? false,
      auctionEnd: listing?.auction_end ?? null,
    });
  } catch (err) {
    console.error("Bids GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
