"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const LOCAL_STORAGE_KEY = "yt-pay-favorites";

function getLocalFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function setLocalFavorites(ids: string[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ids));
}

export function SaveButton({ listingId }: { listingId: string }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        // Check if favorited in Supabase
        supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("listing_id", listingId)
          .maybeSingle()
          .then(({ data }) => {
            setSaved(!!data);
            setLoading(false);
          });
      } else {
        // Not logged in — check localStorage
        const local = getLocalFavorites();
        setSaved(local.includes(listingId));
        setLoading(false);
      }
    });
  }, [listingId]);

  const toggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (loading) return;

      const supabase = createClient();

      if (!userId) {
        // Not logged in — toggle in localStorage
        const local = getLocalFavorites();
        if (local.includes(listingId)) {
          setLocalFavorites(local.filter((id) => id !== listingId));
          setSaved(false);
        } else {
          setLocalFavorites([...local, listingId]);
          setSaved(true);
          setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 3000);
        }
        return;
      }

      // Logged in — toggle in Supabase
      setLoading(true);
      if (saved) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("listing_id", listingId);
        setSaved(false);
      } else {
        await supabase
          .from("favorites")
          .insert({ user_id: userId, listing_id: listingId });
        setSaved(true);
      }
      setLoading(false);
    },
    [listingId, userId, saved, loading]
  );

  return (
    <div className="relative">
      <button
        onClick={toggle}
        disabled={loading}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
          saved
            ? "bg-red-500 text-white shadow-sm"
            : "bg-white/80 text-stone-500 backdrop-blur-sm hover:bg-white hover:text-red-500"
        } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        aria-label={saved ? "Remove from saved" : "Save car"}
      >
        <Heart
          className={`size-4 ${saved ? "fill-current" : ""}`}
        />
      </button>

      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-stone-900 px-3 py-2 text-xs text-white shadow-lg">
          Sign in to save across devices
          <div className="absolute -top-1 right-3 h-2 w-2 rotate-45 bg-stone-900" />
        </div>
      )}
    </div>
  );
}
