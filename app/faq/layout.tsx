import type { Metadata } from "next";

const TITLE = "FAQs | Nature Kingdom Homestay";
const DESCRIPTION =
  "Find answers about bookings, rooms, meals, activities, facilities, check-in, travel, nearby attractions and staying at Nature Kingdom in Chikmagalur.";
const URL = "https://www.naturekingdomhomestay.com/faq";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "Nature Kingdom FAQ",
    "Chikmagalur homestay FAQ",
    "homestay booking Chikmagalur",
    "Chikmagalur stay",
    "homestay facilities",
  ],
  alternates: { canonical: URL },
  openGraph: { type: "website", url: URL, title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
