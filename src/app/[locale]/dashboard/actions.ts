"use server";

import { createClient } from "@/lib/supabase/server";
import { requireSeller } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateListingStatus(
  listingId: string,
  newStatus: string
) {
  const { user } = await requireSeller();
  const supabase = await createClient();

  // Verify ownership
  const { data: listing } = await supabase
    .from("listings")
    .select("id, seller_id, status")
    .eq("id", listingId)
    .single();

  if (!listing || listing.seller_id !== user.id) {
    throw new Error("Not found or unauthorized");
  }

  // The DB trigger will validate allowed transitions
  const { error } = await supabase
    .from("listings")
    .update({ status: newStatus })
    .eq("id", listingId)
    .eq("seller_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/listings");
  revalidatePath("/cars");
}

export async function markAsSold(listingId: string, soldPrice?: number) {
  const { user } = await requireSeller();
  const supabase = await createClient();

  const update: Record<string, unknown> = { status: "sold" };
  if (soldPrice) update.sold_price = soldPrice;

  const { error } = await supabase
    .from("listings")
    .update(update)
    .eq("id", listingId)
    .eq("seller_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/listings");
  revalidatePath("/cars");
}
