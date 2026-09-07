import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import LuxuryFooter from "@/components/LuxuryFooter";
import Navigation from "@/components/Navigation";

// Regenerate the listing periodically so newly published / edited posts
// appear without a full redeploy.
export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: "Chikmagalur Travel Guide & Local Tips | Nature Kingdom Homestay" },
  description:
    "Explore Chikmagalur travel guides, trekking routes, coffee estate stories, nearby attractions, weekend itineraries and local tips from Nature Kingdom.",
  keywords: [
    "Chikmagalur travel guide",
    "Chikmagalur blog",
    "things to do in Chikmagalur",
    "Chikmagalur itinerary",
    "Chikmagalur trekking",
    "coffee estate Chikmagalur",
  ],
  openGraph: {
    title: "Chikmagalur Travel Guide & Local Tips | Nature Kingdom Homestay",
    description:
      "Explore Chikmagalur travel guides, trekking routes, coffee estate stories, nearby attractions, weekend itineraries and local tips from Nature Kingdom.",
  },
  alternates: { canonical: "https://www.naturekingdomhomestay.com/blog" },
};

const PAGE_SIZE = 9;

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  published_at: string | null;
};

async function getPosts(page: number): Promise<{ posts: Post[]; total: number }> {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const { data, count } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, cover_image_url, category, published_at", {
      count: "exact",
    })
    .eq("published", true)
    .order("published_at", { ascending: false })
    .range(from, to);
  return { posts: data ?? [], total: count ?? 0 };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const { posts, total } = await getPosts(page);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pillBase = {
    fontFamily: "'Hanken Grotesk', sans-serif",
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    padding: "0.5rem 0.9rem",
    border: "1px solid rgba(233,195,73,0.25)",
    borderRadius: "2px",
    textDecoration: "none",
    transition: "all 0.25s ease",
  } as const;
  const pillIdle = { ...pillBase, color: "#8d928d" };
  const pillActive = {
    ...pillBase,
    color: "#0a0a0a",
    background: "#e9c349",
    borderColor: "#e9c349",
  };

  return (
    <>
      <Navigation />
      <main style={{ background: "#0a0a0a", minHeight: "100vh" }}>
        {/* Hero */}
        <section
          style={{ borderBottom: "1px solid rgba(233,195,73,0.1)" }}
          className="px-[8vw] pt-36 pb-20"
        >
          <p
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              color: "#e9c349",
              letterSpacing: "0.25em",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
            }}
          >
            Nature Kingdom · Journal
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              color: "#f5f5f0",
              fontWeight: 400,
              lineHeight: 1.1,
              maxWidth: "700px",
            }}
          >
            Chikmagalur, up close
          </h1>
          <p
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              color: "#c3c8c2",
              fontSize: "1rem",
              lineHeight: 1.75,
              maxWidth: "520px",
              marginTop: "1.25rem",
            }}
          >
            Travel guides, trekking routes, coffee estate stories, and honest
            tips from people who live here.
          </p>
        </section>

        {/* Posts Grid */}
        <section className="px-[8vw] py-20">
          {posts.length === 0 ? (
            <p style={{ color: "#c3c8c2", fontFamily: "'Hanken Grotesk', sans-serif" }}>
              {total === 0
                ? "No posts published yet — check back soon."
                : "Nothing on this page."}{" "}
              <Link href="/blog" style={{ color: "#e9c349" }}>
                Back to the latest
              </Link>
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <article>
                    {/* Cover Image */}
                    <div
                      className="overflow-hidden mb-5"
                      style={{
                        aspectRatio: "16/9",
                        background: "#141412",
                        position: "relative",
                      }}
                    >
                      {post.cover_image_url ? (
                        <Image
                          src={post.cover_image_url}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background: "#141412",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span style={{ color: "#434844", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
                            No image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 mb-3">
                      {post.category && (
                        <span
                          style={{
                            fontFamily: "'Hanken Grotesk', sans-serif",
                            color: "#e9c349",
                            fontSize: "0.65rem",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                          }}
                        >
                          {post.category}
                        </span>
                      )}
                      {post.published_at && (
                        <span style={{ color: "#434844", fontSize: "0.65rem" }}>·</span>
                      )}
                      {post.published_at && (
                        <span
                          style={{
                            fontFamily: "'Hanken Grotesk', sans-serif",
                            color: "#8d928d",
                            fontSize: "0.7rem",
                          }}
                        >
                          {formatDate(post.published_at)}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: "#f5f5f0",
                        fontSize: "1.25rem",
                        fontWeight: 400,
                        lineHeight: 1.35,
                        marginBottom: "0.625rem",
                        transition: "color 0.3s ease",
                      }}
                      className="group-hover:text-[#e9c349]"
                    >
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p
                        style={{
                          fontFamily: "'Hanken Grotesk', sans-serif",
                          color: "#8d928d",
                          fontSize: "0.875rem",
                          lineHeight: 1.65,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {post.excerpt}
                      </p>
                    )}

                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "1rem",
                        fontFamily: "'Hanken Grotesk', sans-serif",
                        color: "#e9c349",
                        fontSize: "0.7rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                      }}
                    >
                      Read →
                    </span>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav
              className="flex items-center justify-center flex-wrap gap-2 mt-20"
              aria-label="Blog pagination"
            >
              {page > 1 && (
                <Link
                  href={page - 1 === 1 ? "/blog" : `/blog?page=${page - 1}`}
                  style={pillIdle}
                >
                  ← Prev
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={n === 1 ? "/blog" : `/blog?page=${n}`}
                  aria-current={n === page ? "page" : undefined}
                  style={n === page ? pillActive : pillIdle}
                >
                  {n}
                </Link>
              ))}
              {page < totalPages && (
                <Link href={`/blog?page=${page + 1}`} style={pillIdle}>
                  Next →
                </Link>
              )}
            </nav>
          )}
        </section>
      </main>
      <LuxuryFooter />
    </>
  );
}
