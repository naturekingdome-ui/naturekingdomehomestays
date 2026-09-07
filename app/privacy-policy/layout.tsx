import type { Metadata } from "next";

const TITLE = "Privacy Policy | Nature Kingdom Homestay";
const DESCRIPTION =
  "How Nature Kingdom Homestay collects, uses and protects the information you share when you enquire, book or browse the site.";
const URL = "https://www.naturekingdomhomestay.com/privacy-policy";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  // Utility page — keep it out of the index but let link equity flow.
  robots: { index: false, follow: true },
  openGraph: { type: "website", url: URL, title: TITLE, description: DESCRIPTION },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
