/*
# AMPLOFY Campus Marketplace Redesign Schema

## Overview
Transforms AMPLOFY into a two-sided campus marketplace where both Students and Student-Founded Startups
can list products and professional services, and anyone on campus can purchase or hire.

## 1. Profiles Table Alterations
- account_type ('student', 'startup', 'buyer')
- college, department, year
- is_verified boolean
- contact_whatsapp, contact_email, contact_instagram, show_contact

## 2. New Startups & Startup Members Tables
- startups (id, owner_id, name, slug, logo_url, cover_url, tagline, description, category, website, social_links, contact preferences, is_verified, rating)
- startup_members (startup_id, profile_id, role)

## 3. New Listings & Service Packages Tables
- listings (type: product|service, owner_type: profile|startup, startup_id, category, status, price_type, base_price, delivery_days, images, rating)
- service_packages (listing_id, tier: basic|standard|premium, title, price, delivery_days, revisions, features jsonb)

## 4. Orders, Quotes, Order Notes, and Reviews
- orders (listing_id, package_id, buyer_id, seller_id, startup_id, status: inquiry -> quote_sent -> accepted -> in_progress -> delivered -> completed -> reviewed, amount, inquiry_message)
- quotes (listing_id, buyer_id, seller_id, message, amount, status)
- order_notes (order_id, author_id, body, attachment_url) - simple chronological notes, no chat
- reviews (order_id, listing_id, reviewer_id, reviewee_id, rating, comment)

## 5. Storage Buckets
- listing-images, logos, deliverables

## 6. Row Level Security
- Live listings publicly readable
- Orders, quotes, order notes accessible only by buyer and seller
*/

-- ============ 1. PROFILES UPDATE ============
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'account_type') THEN
    ALTER TABLE profiles ADD COLUMN account_type text NOT NULL DEFAULT 'student' CHECK (account_type IN ('student', 'startup', 'buyer'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'college') THEN
    ALTER TABLE profiles ADD COLUMN college text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'department') THEN
    ALTER TABLE profiles ADD COLUMN department text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'year') THEN
    ALTER TABLE profiles ADD COLUMN year text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_verified') THEN
    ALTER TABLE profiles ADD COLUMN is_verified boolean NOT NULL DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'contact_whatsapp') THEN
    ALTER TABLE profiles ADD COLUMN contact_whatsapp text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'contact_email') THEN
    ALTER TABLE profiles ADD COLUMN contact_email text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'contact_instagram') THEN
    ALTER TABLE profiles ADD COLUMN contact_instagram text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'show_contact') THEN
    ALTER TABLE profiles ADD COLUMN show_contact boolean NOT NULL DEFAULT true;
  END IF;
END $$;

-- ============ 2. STARTUPS & STARTUP MEMBERS ============
CREATE TABLE IF NOT EXISTS startups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo_url text NOT NULL DEFAULT '',
  cover_url text NOT NULL DEFAULT '',
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Development',
  college text NOT NULL DEFAULT '',
  team_size integer NOT NULL DEFAULT 1,
  website text,
  social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  contact_whatsapp text,
  contact_email text,
  contact_instagram text,
  show_contact boolean NOT NULL DEFAULT true,
  is_verified boolean NOT NULL DEFAULT false,
  rating numeric(2,1) NOT NULL DEFAULT 5.0,
  review_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_startups_owner ON startups(owner_id);
CREATE INDEX IF NOT EXISTS idx_startups_slug ON startups(slug);
CREATE INDEX IF NOT EXISTS idx_startups_category ON startups(category);

ALTER TABLE startups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "startups_select_all" ON startups;
CREATE POLICY "startups_select_all"
  ON startups FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "startups_insert_owner" ON startups;
CREATE POLICY "startups_insert_owner"
  ON startups FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "startups_update_owner" ON startups;
CREATE POLICY "startups_update_owner"
  ON startups FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "startups_delete_owner" ON startups;
CREATE POLICY "startups_delete_owner"
  ON startups FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- Startup Members
CREATE TABLE IF NOT EXISTS startup_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'Co-founder',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(startup_id, profile_id)
);

ALTER TABLE startup_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "startup_members_select_all" ON startup_members;
CREATE POLICY "startup_members_select_all"
  ON startup_members FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "startup_members_manage_owner" ON startup_members;
CREATE POLICY "startup_members_manage_owner"
  ON startup_members FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM startups WHERE id = startup_members.startup_id AND owner_id = auth.uid()));

-- ============ 3. LISTINGS (Products & Services) ============
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'product' CHECK (type IN ('product', 'service')),
  owner_type text NOT NULL DEFAULT 'profile' CHECK (owner_type IN ('profile', 'startup')),
  startup_id uuid REFERENCES startups(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Other',
  condition text DEFAULT 'New',
  status text NOT NULL DEFAULT 'live' CHECK (status IN ('draft', 'live', 'featured', 'paused', 'sold')),
  price_type text NOT NULL DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'hourly', 'starting_at')),
  base_price numeric(10,2) NOT NULL DEFAULT 0,
  delivery_days integer DEFAULT 1,
  images text[] NOT NULL DEFAULT '{}',
  location text NOT NULL DEFAULT 'On Campus',
  campus text NOT NULL DEFAULT '',
  rating numeric(2,1) NOT NULL DEFAULT 5.0,
  review_count integer NOT NULL DEFAULT 0,
  views integer NOT NULL DEFAULT 0,
  accept_custom_quotes boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_listings_seller ON listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_startup ON listings(startup_id);
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_created ON listings(created_at DESC);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "listings_select_public" ON listings;
CREATE POLICY "listings_select_public"
  ON listings FOR SELECT TO authenticated, anon
  USING (status IN ('live', 'featured') OR seller_id = auth.uid());

DROP POLICY IF EXISTS "listings_insert_owner" ON listings;
CREATE POLICY "listings_insert_owner"
  ON listings FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "listings_update_owner" ON listings;
CREATE POLICY "listings_update_owner"
  ON listings FOR UPDATE TO authenticated USING (auth.uid() = seller_id) WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "listings_delete_owner" ON listings;
CREATE POLICY "listings_delete_owner"
  ON listings FOR DELETE TO authenticated USING (auth.uid() = seller_id);

-- ============ 4. SERVICE PACKAGES ============
CREATE TABLE IF NOT EXISTS service_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  tier text NOT NULL CHECK (tier IN ('basic', 'standard', 'premium')),
  title text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  delivery_days integer NOT NULL DEFAULT 1,
  revisions integer NOT NULL DEFAULT 1,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_packages_listing ON service_packages(listing_id);

ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_packages_select_all" ON service_packages;
CREATE POLICY "service_packages_select_all"
  ON service_packages FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "service_packages_manage_owner" ON service_packages;
CREATE POLICY "service_packages_manage_owner"
  ON service_packages FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM listings WHERE id = service_packages.listing_id AND seller_id = auth.uid()));

-- ============ 5. ORDERS & PIPELINE ============
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  package_id uuid REFERENCES service_packages(id) ON DELETE SET NULL,
  buyer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  startup_id uuid REFERENCES startups(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'inquiry' CHECK (status IN ('inquiry', 'quote_sent', 'accepted', 'in_progress', 'delivered', 'completed', 'reviewed', 'cancelled')),
  amount numeric(10,2) NOT NULL DEFAULT 0,
  inquiry_message text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_select_participants" ON orders;
CREATE POLICY "orders_select_participants"
  ON orders FOR SELECT TO authenticated
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

DROP POLICY IF EXISTS "orders_insert_buyer" ON orders;
CREATE POLICY "orders_insert_buyer"
  ON orders FOR INSERT TO authenticated
  WITH CHECK (buyer_id = auth.uid());

DROP POLICY IF EXISTS "orders_update_participants" ON orders;
CREATE POLICY "orders_update_participants"
  ON orders FOR UPDATE TO authenticated
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- ============ 6. QUOTES ============
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL DEFAULT '',
  amount numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quotes_buyer ON quotes(buyer_id);
CREATE INDEX IF NOT EXISTS idx_quotes_seller ON quotes(seller_id);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quotes_select_participants" ON quotes;
CREATE POLICY "quotes_select_participants"
  ON quotes FOR SELECT TO authenticated
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

DROP POLICY IF EXISTS "quotes_insert_participants" ON quotes;
CREATE POLICY "quotes_insert_participants"
  ON quotes FOR INSERT TO authenticated
  WITH CHECK (buyer_id = auth.uid() OR seller_id = auth.uid());

DROP POLICY IF EXISTS "quotes_update_participants" ON quotes;
CREATE POLICY "quotes_update_participants"
  ON quotes FOR UPDATE TO authenticated
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- ============ 7. ORDER NOTES (Order Timeline, no chat) ============
CREATE TABLE IF NOT EXISTS order_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body text NOT NULL,
  attachment_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notes_order ON order_notes(order_id);

ALTER TABLE order_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "order_notes_select_participants" ON order_notes;
CREATE POLICY "order_notes_select_participants"
  ON order_notes FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM orders WHERE id = order_notes.order_id AND (buyer_id = auth.uid() OR seller_id = auth.uid())));

DROP POLICY IF EXISTS "order_notes_insert_participants" ON order_notes;
CREATE POLICY "order_notes_insert_participants"
  ON order_notes FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (SELECT 1 FROM orders WHERE id = order_notes.order_id AND (buyer_id = auth.uid() OR seller_id = auth.uid()))
  );

-- ============ 8. REVIEWS ============
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  listing_id uuid REFERENCES listings(id) ON DELETE SET NULL,
  reviewer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_listing ON reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_select_all" ON reviews;
CREATE POLICY "reviews_select_all"
  ON reviews FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "reviews_insert_reviewer" ON reviews;
CREATE POLICY "reviews_insert_reviewer"
  ON reviews FOR INSERT TO authenticated WITH CHECK (reviewer_id = auth.uid());

-- ============ 9. STORAGE BUCKETS ============
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('deliverables', 'deliverables', false)
ON CONFLICT (id) DO NOTHING;

-- Public read for logos
DROP POLICY IF EXISTS "logos_read_public" ON storage.objects;
CREATE POLICY "logos_read_public"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'logos');

-- Upload for logos
DROP POLICY IF EXISTS "logos_upload_own" ON storage.objects;
CREATE POLICY "logos_upload_own"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'logos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Deliverables: only order participants can access
DROP POLICY IF EXISTS "deliverables_access" ON storage.objects;
CREATE POLICY "deliverables_access"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'deliverables');
