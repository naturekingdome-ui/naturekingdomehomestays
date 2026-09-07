import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import LuxuryFooter from "@/components/LuxuryFooter";
import Navigation from "@/components/Navigation";

const BASE_URL = "https://www.naturekingdomhomestay.com";

// Regenerate published posts periodically so admin edits go live without a
// redeploy. New slugs are still rendered on-demand and then cached.
export const revalidate = 60;

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  category: string | null;
  published: boolean;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
};

async function getPost(slug: string): Promise<Post | null> {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  return data ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const metaTitle = post.meta_title?.trim() || post.title;
  const metaDescription = post.meta_description?.trim() || post.excerpt || undefined;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical: `${BASE_URL}/blog/${post.slug}` },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "article",
      url: `${BASE_URL}/blog/${post.slug}`,
      images: post.cover_image_url
        ? [{ url: post.cover_image_url, width: 1200, height: 630, alt: post.title }]
        : undefined,
      publishedTime: post.published_at ?? undefined,
    },
  };
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("published", true);
  return (data ?? []).map((p) => ({ slug: p.slug }));
}

function renderContent(content: string) {
  // Split on double newline into paragraphs; lines starting with # become headings
  return content
    .split(/\n\n+/)
    .filter(Boolean)
    .map((block, i) => {
      const trimmed = block.trim();
      if (trimmed.startsWith("# ")) {
        return (
          <h2
            key={i}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              color: "#f5f5f0",
              fontWeight: 400,
              lineHeight: 1.2,
              margin: "2.5rem 0 1rem",
            }}
          >
            {trimmed.slice(2)}
          </h2>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h3
            key={i}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
              color: "#f5f5f0",
              fontWeight: 400,
              lineHeight: 1.25,
              margin: "2rem 0 0.75rem",
            }}
          >
            {trimmed.slice(3)}
          </h3>
        );
      }
      // Bullet list block
      if (trimmed.startsWith("- ")) {
        const items = trimmed.split("\n").filter((l) => l.startsWith("- "));
        return (
          <ul
            key={i}
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              color: "#c3c8c2",
              fontSize: "1rem",
              lineHeight: 1.75,
              margin: "1rem 0",
              paddingLeft: "1.25rem",
            }}
          >
            {items.map((item, j) => (
              <li key={j} style={{ marginBottom: "0.35rem" }}>
                {item.slice(2)}
              </li>
            ))}
          </ul>
        );
      }
      return (
        <p
          key={i}
          style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            color: "#c3c8c2",
            fontSize: "1rem",
            lineHeight: 1.85,
            margin: "1rem 0",
          }}
        >
          {trimmed}
        </p>
      );
    });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.meta_description?.trim() || post.excerpt,
    image: post.cover_image_url,
    datePublished: post.published_at,
    author: { "@type": "Organization", name: "Nature Kingdom" },
    publisher: {
      "@type": "Organization",
      name: "Nature Kingdom",
      url: BASE_URL,
    },
    mainEntityOfPage: `${BASE_URL}/blog/${post.slug}`,
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${BASE_URL}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <Navigation />
      <main style={{ background: "#0a0a0a", minHeight: "100vh" }}>
        {/* Cover Image */}
        {post.cover_image_url && (
          <div
            style={{
              position: "relative",
              height: "clamp(300px, 55vh, 580px)",
              width: "100%",
              background: "#0a0a0a",
            }}
          >
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.85) 100%)",
              }}
            />
          </div>
        )}

        {/* Header */}
        <section
          className="px-6 sm:px-10"
          style={{
            maxWidth: "820px",
            marginInline: "auto",
            paddingTop: post.cover_image_url ? "3rem" : "8rem",
            paddingBottom: "3rem",
            borderBottom: "1px solid rgba(233,195,73,0.1)",
          }}
        >
          {/* Breadcrumb */}
          <div
            className="flex items-center gap-2 mb-6"
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: "0.7rem",
              color: "#8d928d",
              letterSpacing: "0.1em",
            }}
          >
            <Link href="/" style={{ color: "#8d928d", textDecoration: "none" }}>
              Home
            </Link>
            <span>›</span>
            <Link href="/blog" style={{ color: "#8d928d", textDecoration: "none" }}>
              Blog
            </Link>
            {post.category && (
              <>
                <span>›</span>
                <span style={{ color: "#e9c349" }}>{post.category}</span>
              </>
            )}
          </div>

          {post.published_at && (
            <p
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                color: "#8d928d",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              {new Date(post.published_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#f5f5f0",
              fontWeight: 400,
              lineHeight: 1.15,
            }}
          >
            {post.title}
          </h1>

          {post.excerpt && (
            <p
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                color: "#8d928d",
                fontSize: "1.05rem",
                lineHeight: 1.7,
                marginTop: "1.25rem",
              }}
            >
              {post.excerpt}
            </p>
          )}
        </section>

        {/* Content */}
        <section className="px-6 sm:px-10 py-16" style={{ maxWidth: "820px", marginInline: "auto" }}>
          {post.content ? (
            <div>{renderContent(post.content)}</div>
          ) : (
            <p style={{ color: "#8d928d", fontFamily: "'Hanken Grotesk', sans-serif" }}>
              Content coming soon.
            </p>
          )}

          {/* CTA */}
          <div
            style={{
              marginTop: "4rem",
              paddingTop: "3rem",
              borderTop: "1px solid rgba(233,195,73,0.15)",
            }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.5rem",
                color: "#f5f5f0",
                marginBottom: "0.75rem",
              }}
            >
              Planning a visit to Chikmagalur?
            </p>
            <p
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                color: "#8d928d",
                fontSize: "0.9rem",
                lineHeight: 1.65,
                marginBottom: "1.5rem",
              }}
            >
              Stay at Nature Kingdom — surrounded by coffee estates, misty hills,
              and mountain mornings.
            </p>
            <Link
              href="/book"
              style={{
                display: "inline-block",
                border: "1px solid rgba(233,195,73,0.5)",
                color: "#e9c349",
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "0.875rem 2rem",
                textDecoration: "none",
              }}
            >
              Book a Stay
            </Link>
          </div>
        </section>
      </main>
      <LuxuryFooter />
    </>
  );
}
