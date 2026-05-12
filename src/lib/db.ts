import { createClient } from "@/lib/supabase/server";
import type { Car } from "./types";

// Type for a listing row joined with its images from Supabase
export interface DbListing {
  id: string;
  slug: string;
  seller_id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  description: string;
  short_description: string;
  condition: string;
  location: string;
  engine: string | null;
  transmission: string | null;
  drivetrain: string | null;
  exterior_color: string | null;
  interior_color: string | null;
  body_type: string | null;
  features: string[];
  is_featured: boolean;
  status: string;
  views_count: number;
  contacts_count: number;
  created_at: string;
  listing_images: { url: string; sort_order: number; is_primary: boolean }[];
}

/**
 * Convert a Supabase listing row (with images) to the Car type used by components.
 */
export function dbListingToCar(listing: DbListing): Car {
  const images = [...(listing.listing_images ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => img.url);

  // Map DB status to the Car status union
  const statusMap: Record<string, Car["status"]> = {
    approved: "active",
    sold: "sold",
    draft: "draft",
    pending_review: "draft",
    pending_payment: "draft",
    rejected: "draft",
    archived: "draft",
  };

  return {
    id: listing.slug,
    dbId: listing.id,
    make: listing.make,
    model: listing.model,
    year: listing.year,
    price: listing.price,
    mileage: listing.mileage,
    location: listing.location,
    description: listing.description,
    shortDescription: listing.short_description,
    images:
      images.length > 0
        ? images
        : ["https://placehold.co/800x600?text=No+Photo"],
    seller: {
      name: "Seller",
      email: "contact@yt-pay.io",
    },
    specs: {
      engine: listing.engine ?? "N/A",
      transmission: listing.transmission ?? "N/A",
      drivetrain: listing.drivetrain ?? "N/A",
      exteriorColor: listing.exterior_color ?? "N/A",
      interiorColor: listing.interior_color ?? "N/A",
      bodyType: listing.body_type ?? "N/A",
    },
    features: listing.features ?? [],
    condition: (["excellent", "good", "fair"].includes(listing.condition)
      ? listing.condition
      : "good") as Car["condition"],
    featured: listing.is_featured,
    status: statusMap[listing.status] ?? "draft",
    createdAt: listing.created_at,
  };
}

/**
 * Fetch public listings with optional filters.
 * Only returns approved + sold listings for public views.
 * Supports pagination via `page` and `limit` params.
 */
export async function getListings(params?: {
  make?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  search?: string;
  hideSold?: boolean;
  limit?: number;
  page?: number;
}): Promise<{ cars: Car[]; totalCount: number }> {
  const supabase = await createClient();

  const page = params?.page ?? 1;
  const limit = params?.limit ?? 24;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("listings")
    .select("*, listing_images(*)", { count: "exact" })
    .in("status", params?.hideSold ? ["approved"] : ["approved", "sold"])
    .order("created_at", { ascending: false });

  if (params?.make) {
    query = query.eq("make", params.make);
  }
  if (params?.minPrice !== undefined) {
    query = query.gte("price", params.minPrice);
  }
  if (params?.maxPrice !== undefined) {
    query = query.lte("price", params.maxPrice);
  }
  if (params?.minYear !== undefined) {
    query = query.gte("year", params.minYear);
  }
  if (params?.maxYear !== undefined) {
    query = query.lte("year", params.maxYear);
  }
  if (params?.search) {
    const term = `%${params.search}%`;
    query = query.or(
      `make.ilike.${term},model.ilike.${term},description.ilike.${term}`
    );
  }

  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("getListings error:", error);
    return { cars: [], totalCount: 0 };
  }

  return {
    cars: (data as DbListing[]).map(dbListingToCar),
    totalCount: count ?? 0,
  };
}

/**
 * A listing enriched with its database UUID and seller ID,
 * needed for the inquiry form on the detail page.
 */
export interface ListingDetail extends Car {
  dbId: string;
  sellerId: string;
  sellerName: string;
}

/**
 * Fetch a single listing by its slug (used as the public URL id).
 * Returns enriched data including the DB UUID and seller info for the inquiry form.
 */
export async function getListingBySlug(slug: string): Promise<ListingDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select("*, listing_images(*), profiles(full_name)")
    .eq("slug", slug)
    .in("status", ["approved", "sold"])
    .single();

  if (error || !data) {
    return null;
  }

  const listing = data as DbListing & { profiles?: { full_name: string | null } | null };
  const car = dbListingToCar(listing);
  const sellerName = listing.profiles?.full_name || "Seller";

  return {
    ...car,
    dbId: listing.id,
    sellerId: listing.seller_id,
    sellerName,
    seller: {
      ...car.seller,
      name: sellerName,
    },
  };
}

/**
 * Fetch featured listings for the homepage.
 */
export async function getFeaturedListings(): Promise<Car[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select("*, listing_images(*)")
    .eq("is_featured", true)
    .in("status", ["approved", "sold"])
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("getFeaturedListings error:", error);
    return [];
  }

  return (data as DbListing[]).map(dbListingToCar);
}

/**
 * Fetch distinct makes from approved/sold listings for the filter dropdown.
 */
export async function getListingMakes(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select("make")
    .in("status", ["approved", "sold"]);

  if (error) {
    console.error("getListingMakes error:", error);
    return [];
  }

  const makes = [...new Set((data ?? []).map((row) => row.make as string))];
  return makes.sort();
}

/**
 * Fetch a raw DB listing by its UUID (for dashboard / edit pages).
 */
export async function getListingById(id: string): Promise<DbListing | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select("*, listing_images(*)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as DbListing;
}

/**
 * Fetch all listings belonging to a specific seller.
 */
export async function getSellerListings(sellerId: string): Promise<DbListing[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select("*, listing_images(*)")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getSellerListings error:", error);
    return [];
  }

  return (data ?? []) as DbListing[];
}
