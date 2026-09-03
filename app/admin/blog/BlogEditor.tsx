"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { adminHeaders, getStoredToken } from "@/lib/adminAuth";

const CATEGORIES = [
  "Chikmagalur Travel Guide",
  "Family Vacation",
  "Couples & Honeymoon",
  "Coffee Estate",
  "Trekking & Adventure",
  "Weekend Getaway",
  "Resort Experience",
];

export type PostForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  category: string;
  published: boolean;
  meta_title: string;
  meta_description: string;
};

type Props = {
  initialData?: Partial<PostForm> & { id?: string };
  mode: "new" | "edit";
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function BlogEditor({ initialData, mode }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<PostForm>({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    excerpt: initialData?.excerpt ?? "",
    content: initialData?.content ?? "",
    cover_image_url: initialData?.cover_image_url ?? "",
    category: initialData?.category ?? "",
    published: initialData?.published ?? false,
    meta_title: initialData?.meta_title ?? "",
    meta_description: initialData?.meta_description ?? "",
  });

  const [slugManual, setSlugManual] = useState(mode === "edit");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(title: string) {
    setForm((f) => ({
      ...f,
      title,
      slug: slugManual ? f.slug : slugify(title),
    }));
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", headers: { "x-admin-token": getStoredToken() ?? "" }, body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) { setError(data.error ?? "Upload failed"); return; }
    setForm((f) => ({ ...f, cover_image_url: data.url }));
  }

  async function handleSave(publish?: boolean) {
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      published: publish !== undefined ? publish : form.published,
    };

    const url = mode === "edit" ? `/api/blog/${initialData?.id}` : "/api/blog";
    const method = mode === "edit" ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: adminHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) { setError(data.error ?? "Failed to save"); return; }

    router.push("/admin/blog");
  }

  return (
    <div className="min-h-screen bg-[#0e1a13] text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="text-white/40 hover:text-white transition text-sm">
            ← Blog Posts
          </Link>
          <span className="text-white/20">|</span>
          <h1 className="text-sm font-medium text-white/70">
            {mode === "new" ? "New Post" : "Edit Post"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2 bg-white/5 text-white/60 text-xs rounded-lg hover:bg-white/10 transition disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-2 bg-[#e9c349] text-[#0e1a13] text-xs font-semibold rounded-lg hover:bg-[#e9c349]/90 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : form.published ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Title */}
        <div>
          <input
            type="text"
            placeholder="Post title"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full bg-transparent text-white placeholder-white/20 text-3xl font-serif border-b border-white/10 pb-3 focus:outline-none focus:border-[#e9c349]/40"
            style={{ fontFamily: "'Playfair Display', serif" }}
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">
            URL Slug
          </label>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5">
            <span className="text-white/25 text-xs flex-shrink-0">/blog/</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => {
                setSlugManual(true);
                setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
              }}
              className="flex-1 bg-transparent text-white/70 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Category + Published */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#e9c349]/40 appearance-none"
            >
              <option value="">No category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-[#0e1a13]">{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">
              Status
            </label>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, published: !f.published }))}
                className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${
                  form.published ? "bg-green-500" : "bg-white/20"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    form.published ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
              <span className="text-sm text-white/60">
                {form.published ? "Published" : "Draft"}
              </span>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-3">
            Cover Image
          </label>

          {form.cover_image_url ? (
            <div className="relative">
              <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={form.cover_image_url}
                  alt="Cover"
                  fill
                  className="object-cover"
                  sizes="(max-width: 900px) 100vw, 800px"
                />
              </div>
              <button
                onClick={() => setForm((f) => ({ ...f, cover_image_url: "" }))}
                className="absolute top-3 right-3 w-7 h-7 bg-black/60 text-white/70 rounded-full text-xs hover:bg-black/80 transition flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="border border-dashed border-white/15 rounded-xl p-10 text-center cursor-pointer hover:border-[#e9c349]/30 hover:bg-white/[0.02] transition"
            >
              {uploading ? (
                <p className="text-white/40 text-sm">Uploading...</p>
              ) : (
                <>
                  <p className="text-white/40 text-sm mb-1">Click to upload cover image</p>
                  <p className="text-white/20 text-xs">JPEG, PNG, WebP · Max 5 MB</p>
                </>
              )}
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
          />

          {/* Or paste URL */}
          {!form.cover_image_url && (
            <div className="mt-2">
              <input
                type="url"
                placeholder="Or paste an image URL"
                value={form.cover_image_url}
                onChange={(e) => setForm((f) => ({ ...f, cover_image_url: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#e9c349]/40"
              />
            </div>
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">
            Excerpt <span className="normal-case text-white/20 ml-1">(shown in listings + meta description)</span>
          </label>
          <textarea
            rows={2}
            placeholder="A short description of this post..."
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#e9c349]/40 resize-none"
          />
          <p className="text-[10px] text-white/20 mt-1">{form.excerpt.length}/160 characters</p>
        </div>

        {/* SEO meta overrides */}
        <div className="border border-white/10 rounded-xl p-5 space-y-4">
          <p className="text-[10px] text-white/30 uppercase tracking-widest">
            SEO <span className="normal-case text-white/20 ml-1">(optional — overrides the search-result title/description)</span>
          </p>

          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">
              Meta title <span className="normal-case text-white/20 ml-1">(falls back to the post title)</span>
            </label>
            <input
              type="text"
              placeholder={form.title || "Search-result title"}
              value={form.meta_title}
              onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#e9c349]/40"
            />
            <p className={`text-[10px] mt-1 ${form.meta_title.length > 60 ? "text-amber-400/70" : "text-white/20"}`}>
              {form.meta_title.length}/60 characters
            </p>
          </div>

          <div>
            <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">
              Meta description <span className="normal-case text-white/20 ml-1">(falls back to the excerpt)</span>
            </label>
            <textarea
              rows={2}
              placeholder={form.excerpt || "Search-result description"}
              value={form.meta_description}
              onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#e9c349]/40 resize-none"
            />
            <p className={`text-[10px] mt-1 ${form.meta_description.length > 160 ? "text-amber-400/70" : "text-white/20"}`}>
              {form.meta_description.length}/160 characters
            </p>
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-[10px] text-white/30 uppercase tracking-widest mb-1.5">
            Content
          </label>
          <p className="text-[10px] text-white/20 mb-2">
            Use <code className="text-[#e9c349]/60"># Heading</code> for section titles,{" "}
            <code className="text-[#e9c349]/60">## Subheading</code> for sub-sections,{" "}
            <code className="text-[#e9c349]/60">- item</code> for bullet lists.
            Separate paragraphs with a blank line.
          </p>
          <textarea
            rows={24}
            placeholder={`Write your post here...\n\nSeparate paragraphs with a blank line.\n\n# Use this for section headings\n\n## Use this for sub-headings\n\n- Bullet point one\n- Bullet point two`}
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder-white/15 focus:outline-none focus:border-[#e9c349]/40 resize-y font-mono leading-relaxed"
          />
          <p className="text-[10px] text-white/20 mt-1">{form.content.length} characters</p>
        </div>

        {/* Bottom Save */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-5 py-2.5 bg-white/5 text-white/60 text-sm rounded-lg hover:bg-white/10 transition disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-5 py-2.5 bg-[#e9c349] text-[#0e1a13] text-sm font-semibold rounded-lg hover:bg-[#e9c349]/90 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : form.published ? "Update" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
