"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Gavel, Clock, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AuctionBid {
  id: string;
  amount: number;
  createdAt: string;
  bidderInitials: string;
}

interface AuctionPanelProps {
  listingId: string;
  initialCurrentBid: number;
  initialBidCount: number;
  initialReserveMet: boolean;
  auctionEnd: string;
  startingBid: number;
  reservePrice?: number;
  initialBids?: AuctionBid[];
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);

function calculateMinIncrement(currentBid: number): number {
  if (currentBid < 1_000) return 50;
  if (currentBid < 10_000) return 100;
  if (currentBid < 50_000) return 250;
  if (currentBid < 100_000) return 500;
  return 1_000;
}

function formatTimeRemaining(endDate: Date): string {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

function formatBidTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AuctionPanel({
  listingId,
  initialCurrentBid,
  initialBidCount,
  initialReserveMet,
  auctionEnd,
  startingBid,
  reservePrice,
  initialBids = [],
}: AuctionPanelProps) {
  const [currentBid, setCurrentBid] = useState(initialCurrentBid);
  const [bidCount, setBidCount] = useState(initialBidCount);
  const [reserveMet, setReserveMet] = useState(initialReserveMet);
  const [bids, setBids] = useState<AuctionBid[]>(initialBids);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isEnded, setIsEnded] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const endDate = new Date(auctionEnd);
  const minIncrement = calculateMinIncrement(currentBid);
  const minimumBid = currentBid > 0 ? currentBid + minIncrement : startingBid;

  // Check auth
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  // Countdown timer
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      if (now >= endDate) {
        setIsEnded(true);
        setTimeRemaining("Ended");
      } else {
        setTimeRemaining(formatTimeRemaining(endDate));
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [auctionEnd]); // eslint-disable-line react-hooks/exhaustive-deps

  // Poll for bid updates every 5 seconds
  const fetchBidData = useCallback(async () => {
    try {
      const res = await fetch(`/api/bids?listingId=${listingId}`);
      if (!res.ok) return;

      const data = await res.json();
      setCurrentBid(data.currentBid);
      setBidCount(data.bidCount);
      setReserveMet(data.reserveMet);
      setBids(data.bids);
    } catch {
      // Silently fail on poll errors
    }
  }, [listingId]);

  useEffect(() => {
    const interval = setInterval(fetchBidData, 5000);
    return () => clearInterval(interval);
  }, [fetchBidData]);

  // Set default bid amount when minimum changes
  useEffect(() => {
    setBidAmount(String(minimumBid));
  }, [minimumBid]);

  const handlePlaceBid = async () => {
    setError(null);
    setSuccess(null);

    const amount = parseInt(bidAmount, 10);
    if (isNaN(amount) || amount < minimumBid) {
      setError(`Minimum bid is ${formatPrice(minimumBid)}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, amount }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to place bid");
        return;
      }

      setSuccess(`Bid of ${formatPrice(amount)} placed successfully!`);
      // Immediately refresh bid data
      await fetchBidData();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Current bid */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
          {isEnded ? "Winning Bid" : "Current Bid"}
        </p>
        <p className="mt-1 text-3xl font-bold text-stone-900">
          {currentBid > 0 ? formatPrice(currentBid) : formatPrice(startingBid)}
        </p>
        <div className="mt-2 flex items-center gap-3 text-sm text-stone-500">
          <span className="flex items-center gap-1">
            <Gavel className="size-3.5" />
            {bidCount} {bidCount === 1 ? "bid" : "bids"}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {timeRemaining}
          </span>
        </div>
      </div>

      {/* Reserve indicator */}
      {reservePrice != null && (
        <div
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
            reserveMet
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {reserveMet ? (
            <>
              <TrendingUp className="size-4" />
              Reserve met
            </>
          ) : (
            <>
              <AlertCircle className="size-4" />
              Reserve not met
            </>
          )}
        </div>
      )}

      {/* Bid form or ended state */}
      {isEnded ? (
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-center">
          <p className="text-sm font-semibold text-stone-700">
            Auction has ended
          </p>
          {currentBid > 0 && reserveMet && (
            <p className="mt-1 text-sm text-stone-500">
              Sold for {formatPrice(currentBid)}
            </p>
          )}
          {currentBid > 0 && !reserveMet && (
            <p className="mt-1 text-sm text-stone-500">
              Reserve was not met
            </p>
          )}
        </div>
      ) : isLoggedIn === false ? (
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-center">
          <p className="text-sm text-stone-600">
            <Link
              href="/auth/login"
              className="font-semibold text-amber-600 underline underline-offset-2 hover:text-amber-700"
            >
              Sign in
            </Link>{" "}
            to place a bid
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Your bid (min. {formatPrice(minimumBid)})
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={minimumBid}
                step={minIncrement}
                className="h-10 flex-1 rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 transition-colors focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
              />
              <button
                onClick={handlePlaceBid}
                disabled={isSubmitting}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-amber-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-amber-400 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Gavel className="size-4" />
                )}
                Bid
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {success}
            </p>
          )}
        </div>
      )}

      {/* Bid history */}
      {bids.length > 0 && (
        <div className="border-t border-stone-100 pt-4">
          <h4 className="mb-3 text-sm font-semibold text-stone-700">
            Bid History
          </h4>
          <div className="space-y-2">
            {bids.map((bid, index) => (
              <div
                key={bid.id}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                  index === 0 ? "bg-amber-50" : "bg-stone-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-full bg-stone-200 text-xs font-semibold text-stone-600">
                    {bid.bidderInitials}
                  </span>
                  <span className="font-semibold text-stone-800">
                    {formatPrice(bid.amount)}
                  </span>
                </div>
                <span className="text-xs text-stone-400">
                  {formatBidTime(bid.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact auction countdown for use in cards and sticky bars.
 */
export function AuctionCountdown({ auctionEnd }: { auctionEnd: string }) {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const endDate = new Date(auctionEnd);
    const tick = () => {
      const now = new Date();
      if (now >= endDate) {
        setIsEnded(true);
        setTimeRemaining("Ended");
      } else {
        setTimeRemaining(formatTimeRemaining(endDate));
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [auctionEnd]);

  return (
    <span
      className={`flex items-center gap-1 text-sm ${
        isEnded ? "text-red-600" : "text-stone-600"
      }`}
    >
      <Clock className="size-3.5" />
      {timeRemaining}
    </span>
  );
}
