export const siteConfig = {
  name: "EraMarque",
  tagline: "Curated Classics & Beautiful Cars",
  description:
    "Europe's curated marketplace for retro, classic and beautiful automobiles. Find your dream car.",
  url: "https://yt-pay.io",
  email: "hello@yt-pay.io",
};

export const pricingTiers = [
  {
    name: "Free",
    slug: "free" as const,
    listings: 1,
    monthlyPrice: 0,
    yearlyPrice: 0,
    popular: false,
    features: [
      "1 active listing",
      "Up to 10 photos",
      "Direct buyer inquiries",
      "No commission",
    ],
  },
  {
    name: "Collector",
    slug: "collector" as const,
    listings: 5,
    monthlyPrice: 19,
    yearlyPrice: 190,
    popular: true,
    features: [
      "Up to 5 active listings",
      "Up to 25 photos each",
      "Seller profile page",
      "Email lead notifications",
      "Priority support",
      "No commission",
    ],
  },
  {
    name: "Dealer",
    slug: "dealer" as const,
    listings: 25,
    monthlyPrice: 79,
    yearlyPrice: 790,
    popular: false,
    features: [
      "Up to 25 active listings",
      "Unlimited photos",
      "Verified dealer badge",
      "Priority placement",
      "Analytics dashboard",
      "Lead inbox",
      "No commission",
    ],
  },
] as const;

export type PricingTier = (typeof pricingTiers)[number];
export type TierSlug = PricingTier["slug"];
export type BillingInterval = "month" | "year";
