import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { supabaseAdmin } from "@/lib/supabase";
import type { ApiPackage } from "@/components/PackagesSection";
import { fetchUpcomingSeasonalRates, type UpcomingSeason } from "@/lib/pricing";

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: "Best Homestay in Chikmagalur | Nature Kingdom" },
  description:
    "Experience a peaceful nature homestay in Chikmagalur surrounded by coffee estates, misty mountains and the Western Ghats. Enjoy luxury stays, estate walks, home-style meals and campfire evenings.",
  keywords: [
    "Chikmagalur homestay",
    "best homestay in Chikmagalur",
    "luxury homestay Chikmagalur",
    "nature stay Chikmagalur",
    "coffee estate stay",
    "Chikmagalur resort",
    "coffee estate homestay",
    "Western Ghats stay",
    "Chikkamagaluru homestay",
  ],
  alternates: {
    canonical: "https://www.naturekingdomhomestay.com/",
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

async function fetchSeasons(): Promise<UpcomingSeason[]> {
  try {
    return await fetchUpcomingSeasonalRates();
  } catch {
    return [];
  }
}

export default async function Page() {
  const [packages, upcomingSeasons] = await Promise.all([fetchPackages(), fetchSeasons()]);
  return <HomePage initialPackages={packages} upcomingSeasons={upcomingSeasons} />;
}
