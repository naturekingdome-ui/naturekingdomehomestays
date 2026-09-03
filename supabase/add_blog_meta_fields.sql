-- Run this in your Supabase SQL editor.
-- Adds dedicated SEO meta fields to blog_posts so the SERP title/description
-- can differ from the on-page H1 (title) and the listing excerpt.
--
-- Both columns are nullable. When empty, the site falls back to:
--   meta_title       -> title
--   meta_description -> excerpt

alter table blog_posts
  add column if not exists meta_title text,
  add column if not exists meta_description text;

comment on column blog_posts.meta_title is
  'SEO <title> / OG title. Falls back to title when null. Aim for <= 60 chars.';
comment on column blog_posts.meta_description is
  'SEO meta description / OG description. Falls back to excerpt when null. Aim for ~150-160 chars.';
