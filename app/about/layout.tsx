import type { Metadata } from "next";

const TITLE = "About Us | Nature Kingdom Homestay";
const DESCRIPTION =
  "Discover Nature Kingdom, a private nature homestay in Bommenahalli, Chikmagalur, surrounded by coffee estates, spice plantations and the Western Ghats.";
const URL = "https://www.naturekingdomhomestay.com/about";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "Chikmagalur homestay",
    "nature homestay Chikmagalur",
    "coffee estate homestay",
    "Bommenahalli homestay",
    "Western Ghats stay",
  ],
  alternates: { canonical: URL },
  openGraph: { type: "website", url: URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
