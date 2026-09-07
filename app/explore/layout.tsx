import type { Metadata } from "next";

const TITLE = "Things to Do in Chikmagalur | Nature Kingdom Homestay";
const DESCRIPTION =
  "Explore Mullayanagiri, Baba Budangiri, Jhari Falls, Hebbe Falls, Kemmanagundi, Hirekolale Lake and more from your stay at Nature Kingdom, Chikmagalur.";
const URL = "https://www.naturekingdomhomestay.com/explore";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "things to do in Chikmagalur",
    "places to visit in Chikmagalur",
    "Mullayanagiri",
    "Baba Budangiri",
    "Jhari Falls",
    "Hebbe Falls",
    "Kemmanagundi",
    "Hirekolale Lake",
  ],
  alternates: { canonical: URL },
  openGraph: { type: "website", url: URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
