#!/usr/bin/env python3
"""
Replace car listing photos with real ones from Wikimedia Commons.

Fetches all listings from Supabase, searches Wikimedia Commons for matching
car photos, scores them, and updates listing_images with the best 2 results.
"""

import re
import time
import requests
from typing import Optional

# Supabase config
SUPABASE_URL = "https://fnaajvxbxrakqzjheecz.supabase.co/rest/v1"
SUPABASE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuYWFqdnhieHJha3F6amhlZWN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODYwMjQzMywiZXhwIjoyMDk0MTc4NDMzfQ."
    "1k4FG7Pj-pI3JLMOjHytrQr76YQIAOhsUcy6DYJx1Iw"
)
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

# Words that indicate non-exterior photos or non-real-car images
EXCLUDE_WORDS = [
    "interior", "cockpit", "dashboard", "logo", "drawing",
    "model", "toy", "miniature", "sketch", "diagram",
    "emblem", "badge", "steering", "seat", "instrument",
    "engine bay", "trunk", "boot", "diecast", "scale model",
    "poster", "brochure", "advertisement", "ad ",
]


def supabase_get(endpoint: str, params: Optional[dict] = None) -> list:
    """GET request to Supabase REST API."""
    resp = requests.get(
        f"{SUPABASE_URL}/{endpoint}",
        headers=HEADERS,
        params=params or {},
    )
    resp.raise_for_status()
    return resp.json()


def supabase_delete(endpoint: str, params: dict) -> None:
    """DELETE request to Supabase REST API."""
    resp = requests.delete(
        f"{SUPABASE_URL}/{endpoint}",
        headers=HEADERS,
        params=params,
    )
    resp.raise_for_status()


def supabase_post(endpoint: str, data: list) -> None:
    """POST request to Supabase REST API."""
    resp = requests.post(
        f"{SUPABASE_URL}/{endpoint}",
        headers=HEADERS,
        json=data,
    )
    resp.raise_for_status()


def search_wikimedia(query: str, limit: int = 10) -> list[dict]:
    """Search Wikimedia Commons for images."""
    params = {
        "action": "query",
        "generator": "search",
        "gsrnamespace": 6,  # File namespace
        "gsrsearch": query,
        "gsrlimit": limit,
        "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata",
        "iiurlwidth": 1200,
        "format": "json",
    }
    try:
        resp = requests.get(
            "https://commons.wikimedia.org/w/api.php",
            params=params,
            headers={
                "User-Agent": "YtPayCarListings/1.0 (https://yt-pay.io; contact@yt-pay.io)",
            },
            timeout=15,
        )
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"    Wikimedia API error: {e}")
        return []

    data = resp.json()
    pages = data.get("query", {}).get("pages", {})
    results = []
    for page in pages.values():
        info = page.get("imageinfo", [{}])[0]
        if info.get("mime", "").startswith("image/"):
            width = info.get("width", 0)
            height = info.get("height", 0)
            if width >= 800:
                results.append({
                    "url": info.get("thumburl") or info.get("url"),
                    "width": width,
                    "height": height,
                    "title": page.get("title", ""),
                })
    return results


def build_search_query(make: str, model: str, year: int) -> list[str]:
    """Build search queries from make/model/year.

    Returns a list of queries to try in order (most specific first).
    Uses generation codes when present in the model name.
    """
    queries = []

    # Extract generation code if present: e.g., "911 Turbo (930)" -> "930"
    gen_match = re.search(r"\(([A-Za-z0-9]+)\)", model)
    generation_code = gen_match.group(1) if gen_match else None

    # Clean model name: remove generation codes in parens, trim specs
    clean_model = re.sub(r"\s*\([^)]*\)", "", model).strip()
    # Remove detailed spec suffixes like "2.7", "2.5", "4.2 Sovereign"
    # Keep the base model name
    base_model = clean_model.split()[0] if clean_model else model

    # Strategy 1: make + generation code (if available)
    if generation_code:
        queries.append(f"{make} {generation_code}")

    # Strategy 2: make + clean model (without parens)
    queries.append(f"{make} {clean_model}")

    # Strategy 3: make + base model only (simplest)
    if base_model != clean_model:
        queries.append(f"{make} {base_model}")

    return queries


def is_excluded(title: str) -> bool:
    """Check if an image title suggests it's not an exterior car photo."""
    title_lower = title.lower()
    for word in EXCLUDE_WORDS:
        if word in title_lower:
            return True
    return False


def score_photo(photo: dict, make: str, model: str) -> float:
    """Score a photo for relevance and quality.

    Higher score = better match.
    """
    if is_excluded(photo["title"]):
        return -1.0

    score = 0.0
    title_lower = photo["title"].lower()
    make_lower = make.lower()
    model_lower = model.lower().split()[0]  # First word of model

    # Title contains make
    if make_lower in title_lower:
        score += 3.0

    # Title contains model
    if model_lower in title_lower:
        score += 3.0

    # Resolution bonus
    width = photo["width"]
    if width >= 2000:
        score += 2.0
    elif width >= 1200:
        score += 1.0

    # Landscape orientation (typical car photo)
    if photo["width"] > photo["height"]:
        score += 1.5

    # JPEG preferred (real photos, not SVG diagrams)
    if photo["title"].lower().endswith((".jpg", ".jpeg")):
        score += 0.5

    return score


def fetch_all_listings() -> list[dict]:
    """Fetch all listings from Supabase (handles pagination)."""
    all_listings = []
    offset = 0
    batch_size = 100

    while True:
        batch = supabase_get(
            "listings",
            {
                "select": "id,make,model,year,slug",
                "limit": batch_size,
                "offset": offset,
                "order": "created_at.asc",
            },
        )
        all_listings.extend(batch)
        if len(batch) < batch_size:
            break
        offset += batch_size

    return all_listings


def fetch_listing_images(listing_id: str) -> list[dict]:
    """Fetch images for a listing."""
    return supabase_get(
        "listing_images",
        {
            "select": "id,url,sort_order",
            "listing_id": f"eq.{listing_id}",
            "order": "sort_order.asc",
        },
    )


def update_listing_images(listing_id: str, photos: list[dict]) -> None:
    """Delete old images and insert new ones for a listing."""
    # Delete existing images
    supabase_delete("listing_images", {"listing_id": f"eq.{listing_id}"})

    # Insert new images
    new_images = []
    for i, photo in enumerate(photos):
        new_images.append({
            "listing_id": listing_id,
            "url": photo["url"],
            "sort_order": i,
            "is_primary": i == 0,
        })

    if new_images:
        supabase_post("listing_images", new_images)


def find_best_photos(make: str, model: str, year: int) -> list[dict]:
    """Search Wikimedia and return the best 2 photos for a car."""
    queries = build_search_query(make, model, year)

    all_candidates = []

    for query in queries:
        results = search_wikimedia(query, limit=15)
        time.sleep(0.5)  # Rate limiting

        # Score and collect
        for photo in results:
            photo["score"] = score_photo(photo, make, model)

        # Filter out excluded
        good = [p for p in results if p["score"] > 0]
        all_candidates.extend(good)

        # If we have enough good candidates, stop
        if len(all_candidates) >= 4:
            break

    if not all_candidates:
        return []

    # Deduplicate by URL
    seen_urls = set()
    unique = []
    for p in all_candidates:
        if p["url"] not in seen_urls:
            seen_urls.add(p["url"])
            unique.append(p)

    # Sort by score descending, take top 2
    unique.sort(key=lambda x: x["score"], reverse=True)
    return unique[:2]


def main():
    print("=== Fix Car Listing Photos ===\n")

    # 1. Fetch all listings
    print("Fetching listings from Supabase...")
    listings = fetch_all_listings()
    total = len(listings)
    print(f"Found {total} listings.\n")

    updated = 0
    unchanged = 0
    failed = 0

    for i, listing in enumerate(listings, 1):
        lid = listing["id"]
        make = listing["make"]
        model = listing["model"]
        year = listing["year"]
        label = f"{make} {model} {year}"

        # Search Wikimedia
        photos = find_best_photos(make, model, year)

        if photos:
            try:
                update_listing_images(lid, photos)
                print(
                    f"[{i}/{total}] {label} — "
                    f"found {len(photos)} candidates, "
                    f"updated {len(photos)} photos"
                )
                updated += 1
            except requests.RequestException as e:
                print(f"[{i}/{total}] {label} — FAILED to update: {e}")
                failed += 1
        else:
            print(f"[{i}/{total}] {label} — no good photos found, keeping existing")
            unchanged += 1

    # Summary
    print("\n=== Summary ===")
    print(f"Total listings:  {total}")
    print(f"Updated:         {updated}")
    print(f"Unchanged:       {unchanged}")
    print(f"Failed:          {failed}")


if __name__ == "__main__":
    main()
