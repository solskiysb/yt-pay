"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function approveListing(listingId: string) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("status")
    .eq("id", listingId)
    .single();

  const previousStatus = listing?.status ?? "unknown";

  const { error } = await supabase
    .from("listings")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
    })
    .eq("id", listingId);

  if (error) {
    throw new Error(`Failed to approve listing: ${error.message}`);
  }

  await supabase.from("moderation_events").insert({
    listing_id: listingId,
    admin_id: admin.id,
    action: "approved",
    previous_status: previousStatus,
    new_status: "approved",
  });

  revalidatePath("/admin");
  revalidatePath("/admin/moderation");
  revalidatePath("/admin/listings");
}

export async function rejectListing(listingId: string, reason: string) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("status")
    .eq("id", listingId)
    .single();

  const previousStatus = listing?.status ?? "unknown";

  const { error } = await supabase
    .from("listings")
    .update({
      status: "rejected",
      rejection_reason: reason,
    })
    .eq("id", listingId);

  if (error) {
    throw new Error(`Failed to reject listing: ${error.message}`);
  }

  await supabase.from("moderation_events").insert({
    listing_id: listingId,
    admin_id: admin.id,
    action: "rejected",
    reason,
    previous_status: previousStatus,
    new_status: "rejected",
  });

  revalidatePath("/admin");
  revalidatePath("/admin/moderation");
  revalidatePath("/admin/listings");
}

export async function toggleFeatured(listingId: string, featured: boolean) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("listings")
    .update({ is_featured: featured })
    .eq("id", listingId);

  if (error) {
    throw new Error(`Failed to toggle featured: ${error.message}`);
  }

  await supabase.from("moderation_events").insert({
    listing_id: listingId,
    admin_id: admin.id,
    action: featured ? "featured" : "unfeatured",
    previous_status: featured ? "not_featured" : "featured",
    new_status: featured ? "featured" : "not_featured",
  });

  revalidatePath("/admin");
  revalidatePath("/admin/listings");
}

export async function toggleBan(userId: string, banned: boolean) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ is_banned: banned })
    .eq("id", userId);

  if (error) {
    throw new Error(`Failed to toggle ban: ${error.message}`);
  }

  await supabase.from("moderation_events").insert({
    admin_id: admin.id,
    action: banned ? "user_banned" : "user_unbanned",
    reason: banned ? "Banned by admin" : "Unbanned by admin",
    previous_status: banned ? "active" : "banned",
    new_status: banned ? "banned" : "active",
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
}

export async function toggleVerified(userId: string, verified: boolean) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ is_verified: verified })
    .eq("id", userId);

  if (error) {
    throw new Error(`Failed to toggle verified: ${error.message}`);
  }

  revalidatePath("/admin/users");
}

export async function changeUserRole(userId: string, role: string) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  if (!["admin", "seller", "buyer"].includes(role)) {
    throw new Error("Invalid role");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) {
    throw new Error(`Failed to change role: ${error.message}`);
  }

  revalidatePath("/admin/users");
}
