export const siteConfig = {
  name: "YT Pay",
  tagline: "Curated Classics & Beautiful Cars",
  description:
    "Europe's curated marketplace for retro, classic and beautiful automobiles. Find your dream car.",
  url: "https://yt-pay.io",
  email: "hello@yt-pay.io",
};

export const pricingTiers = [
  {
    name: "Starter",
    listings: 1,
    price: 39,
    pricePerListing: 39,
    earlyAdopterPrice: 19,
    popular: false,
    features: [
      "1 active listing",
      "Up to 10 photos",
      "60 days active",
      "Direct buyer inquiries",
      "No commission on sale",
    ],
  },
  {
    name: "Collector",
    listings: 5,
    price: 149,
    pricePerListing: 30,
    earlyAdopterPrice: 79,
    popular: true,
    features: [
      "Up to 5 active listings",
      "Up to 20 photos each",
      "90 days active",
      "Priority support",
      "Featured badge on 1 listing",
      "No commission on sale",
    ],
  },
  {
    name: "Dealer",
    listings: 20,
    price: 399,
    pricePerListing: 20,
    earlyAdopterPrice: 199,
    popular: false,
    features: [
      "Up to 20 active listings",
      "Unlimited photos",
      "120 days active",
      "Verified dealer badge",
      "Featured badge on 3 listings",
      "Priority placement in search",
      "No commission on sale",
    ],
  },
] as const;
