import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-admin-token") === process.env.ADMIN_PASSWORD;
}

// Public: returns only published posts. Admin: returns all.
export async function GET(req: NextRequest) {
  const admin = isAdmin(req);

  let query = supabaseAdmin
    .from("blog_posts")
    .select("id, title, slug, excerpt, cover_image_url, category, published, published_at, created_at")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (!admin) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    title,
    slug,
    excerpt,
    content,
    cover_image_url,
    category,
    published,
    meta_title,
    meta_description,
  } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .insert({
      title,
      slug,
      excerpt: excerpt || null,
      content: content || null,
      cover_image_url: cover_image_url || null,
      category: category || null,
      meta_title: meta_title || null,
      meta_description: meta_description || null,
      published: published ?? false,
      published_at: published ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
