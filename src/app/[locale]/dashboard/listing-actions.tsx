"use client";

import { useTransition } from "react";
import { Archive, Tag, Play, Pause, RotateCcw } from "lucide-react";
import { updateListingStatus, markAsSold } from "./actions";

interface Props {
  listingId: string;
  status: string;
}

export function ListingActions({ listingId, status }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleAction(newStatus: string) {
    startTransition(async () => {
      try {
        if (newStatus === "sold") {
          await markAsSold(listingId);
        } else {
          await updateListingStatus(listingId, newStatus);
        }
      } catch (e) {
        console.error("Action failed:", e);
      }
    });
  }

  const buttonClass =
    "flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-colors disabled:opacity-50";

  return (
    <div className="flex items-center gap-1">
      {status === "approved" && (
        <>
          <button
            onClick={() => handleAction("sold")}
            disabled={isPending}
            className={`${buttonClass} text-purple-600 hover:bg-purple-50`}
            title="Mark as Sold"
          >
            <Tag className="size-3.5" />
            Sold
          </button>
          <button
            onClick={() => handleAction("paused")}
            disabled={isPending}
            className={`${buttonClass} text-amber-600 hover:bg-amber-50`}
            title="Pause listing"
          >
            <Pause className="size-3.5" />
          </button>
          <button
            onClick={() => handleAction("archived")}
            disabled={isPending}
            className={`${buttonClass} text-stone-500 hover:bg-stone-100`}
            title="Archive"
          >
            <Archive className="size-3.5" />
          </button>
        </>
      )}
      {status === "paused" && (
        <>
          <button
            onClick={() => handleAction("approved")}
            disabled={isPending}
            className={`${buttonClass} text-emerald-600 hover:bg-emerald-50`}
            title="Reactivate"
          >
            <Play className="size-3.5" />
            Activate
          </button>
          <button
            onClick={() => handleAction("archived")}
            disabled={isPending}
            className={`${buttonClass} text-stone-500 hover:bg-stone-100`}
            title="Archive"
          >
            <Archive className="size-3.5" />
          </button>
        </>
      )}
      {status === "draft" && (
        <button
          onClick={() => handleAction("pending_review")}
          disabled={isPending}
          className={`${buttonClass} text-blue-600 hover:bg-blue-50`}
          title="Submit for review"
        >
          <Play className="size-3.5" />
          Submit
        </button>
      )}
      {status === "rejected" && (
        <button
          onClick={() => handleAction("draft")}
          disabled={isPending}
          className={`${buttonClass} text-stone-600 hover:bg-stone-100`}
          title="Edit and resubmit"
        >
          <RotateCcw className="size-3.5" />
          Revise
        </button>
      )}
      {status === "sold" && (
        <button
          onClick={() => handleAction("archived")}
          disabled={isPending}
          className={`${buttonClass} text-stone-500 hover:bg-stone-100`}
          title="Archive"
        >
          <Archive className="size-3.5" />
        </button>
      )}
    </div>
  );
}
