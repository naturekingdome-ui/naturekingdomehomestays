import type { Metadata } from "next";

const TITLE = "Luxury homestay in Chikmagalur | Nature Kingdom";
const DESCRIPTION =
  "Wake up to mountain air, explore coffee estates, enjoy cycling, home-cooked Karnataka meals and evening campfires at Nature Kingdom, Chikmagalur.";
const URL = "https://www.naturekingdomhomestay.com/experience";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "Chikmagalur nature experiences",
    "coffee estate experience",
    "things to do in Chikmagalur",
    "nature stay Chikmagalur",
    "Chikmagalur activities",
  ],
  alternates: { canonical: URL },
  openGraph: { type: "website", url: URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
