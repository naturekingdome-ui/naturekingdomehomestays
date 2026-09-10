import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import type { ApiPackage } from "@/components/PackagesSection";
import PackagesSection from "@/components/PackagesSection";
import StayInfoShell from "@/components/StayInfoShell";
import { fetchUpcomingSeasonalRates } from "@/lib/pricing";

const BASE_URL = "https://www.naturekingdomhomestay.com";
const PAGE_URL = `${BASE_URL}/stay-info/rates/`;

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Rates & Packages — Nature Kingdom Homestay",
  description: "Current room rates and stay packages at Nature Kingdom Homestay, Chikmagalur.",
  alternates: { canonical: PAGE_URL },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: "Nature Kingdom",
    title: "Rates & Packages — Nature Kingdom Homestay",
    description: "Current room rates and stay packages at Nature Kingdom Homestay, Chikmagalur.",
    locale: "en_IN",
  },
};

async function fetchPackages(): Promise<ApiPackage[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("packages")
      .select("*")
      .order("price", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function RatesPage() {
  const [packages, upcomingSeasons] = await Promise.all([
    fetchPackages(),
    fetchUpcomingSeasonalRates().catch(() => []),
  ]);
  return (
    <StayInfoShell>
      <PackagesSection initialPackages={packages} upcomingSeasons={upcomingSeasons} />
    </StayInfoShell>
  );
}
