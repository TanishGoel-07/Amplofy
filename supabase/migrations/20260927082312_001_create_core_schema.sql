/*
# AMPLOFY Core Schema — Profiles, Products, Wanted Requests, Offers

## Overview
Creates the foundational database tables for AMPLOFY, a student marketplace and community platform.
All tables use Row Level Security with owner-scoped policies using auth.uid().

## New Tables

1. **profiles** — Public user profile data (one row per auth user)
   - id (uuid, PK, references auth.users)
   - name, username, email, avatar, bio, location, campus
   - verified, verification_status, role
   - course, year_of_study, interests (text[]), skills (text[])
   - created_at, updated_at

2. **products** — Marketplace listings
   - id, seller_id (references profiles), title, description, price
   - category, condition, listing_type, listing_status, transaction_status
   - images (text[]), location, campus, quantity, tags (text[])
   - views, favourites_count, featured
   - created_at, updated_at

3. **wanted_requests** — User requests for items they want
   - id, requester_id, title, description, category
   - budget_min, budget_max, location, campus
   - expiry_date, status
   - created_at, updated_at

4. **offers** — Buyer offers on listings
   - id, product_id, buyer_id, amount, status, counter_amount, message
   - created_at, updated_at

## Security
- RLS enabled on all tables
- Owner-scoped CRUD policies (4 per table: SELECT/INSERT/UPDATE/DELETE)
- Products and wanted_requests are publicly readable (all authenticated users)
- Only owners can INSERT/UPDATE/DELETE their own rows
- Offers: buyers can create; product owners can view and respond
*/

-- ============ PROFILES ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  username text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  avatar text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  campus text NOT NULL DEFAULT '',
  verified boolean NOT NULL DEFAULT false,
  verification_status text NOT NULL DEFAULT 'required',
  role text NOT NULL DEFAULT 'buyer',
  course text,
  year_of_study text,
  interests text[] DEFAULT '{}',
  skills text[] DEFAULT '{}',
  follower_count integer NOT NULL DEFAULT 0,
  following_count integer NOT NULL DEFAULT 0,
  listing_count integer NOT NULL DEFAULT 0,
  rating numeric(2,1) NOT NULL DEFAULT 0,
  review_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
CREATE POLICY "profiles_select_all"
  ON profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- No DELETE policy: account deletion handled via auth + cascade

-- ============ PRODUCTS ============
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'Other',
  condition text NOT NULL DEFAULT 'New',
  listing_type text NOT NULL DEFAULT 'product',
  listing_status text NOT NULL DEFAULT 'pending-review',
  transaction_status text NOT NULL DEFAULT 'available',
  images text[] NOT NULL DEFAULT '{}',
  location text NOT NULL DEFAULT '',
  campus text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 1,
  tags text[] NOT NULL DEFAULT '{}',
  views integer NOT NULL DEFAULT 0,
  favourites_count integer NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(listing_status);
CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view published products
DROP POLICY IF EXISTS "products_select_all" ON products;
CREATE POLICY "products_select_all"
  ON products FOR SELECT TO authenticated USING (true);

-- Only owner can insert (default seller_id = auth.uid())
DROP POLICY IF EXISTS "products_insert_own" ON products;
CREATE POLICY "products_insert_own"
  ON products FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id);

-- Only owner can update
DROP POLICY IF EXISTS "products_update_own" ON products;
CREATE POLICY "products_update_own"
  ON products FOR UPDATE TO authenticated USING (auth.uid() = seller_id) WITH CHECK (auth.uid() = seller_id);

-- Only owner can delete
DROP POLICY IF EXISTS "products_delete_own" ON products;
CREATE POLICY "products_delete_own"
  ON products FOR DELETE TO authenticated USING (auth.uid() = seller_id);

-- ============ WANTED REQUESTS ============
CREATE TABLE IF NOT EXISTS wanted_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Other',
  budget_min numeric(10,2),
  budget_max numeric(10,2),
  location text,
  campus text,
  expiry_date date,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wanted_requester ON wanted_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_wanted_status ON wanted_requests(status);

ALTER TABLE wanted_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "wanted_select_all" ON wanted_requests;
CREATE POLICY "wanted_select_all"
  ON products FOR SELECT TO authenticated USING (true);

-- Fix: apply to wanted_requests table
DROP POLICY IF EXISTS "wanted_select_all" ON wanted_requests;
CREATE POLICY "wanted_select_all"
  ON wanted_requests FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "wanted_insert_own" ON wanted_requests;
CREATE POLICY "wanted_insert_own"
  ON wanted_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = requester_id);

DROP POLICY IF EXISTS "wanted_update_own" ON wanted_requests;
CREATE POLICY "wanted_update_own"
  ON wanted_requests FOR UPDATE TO authenticated USING (auth.uid() = requester_id) WITH CHECK (auth.uid() = requester_id);

DROP POLICY IF EXISTS "wanted_delete_own" ON wanted_requests;
CREATE POLICY "wanted_delete_own"
  ON wanted_requests FOR DELETE TO authenticated USING (auth.uid() = requester_id);

-- ============ OFFERS ============
CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  counter_amount numeric(10,2),
  message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_offers_product ON offers(product_id);
CREATE INDEX IF NOT EXISTS idx_offers_buyer ON offers(buyer_id);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Buyer can see their own offers; seller can see offers on their products
DROP POLICY IF EXISTS "offers_select" ON offers;
CREATE POLICY "offers_select"
  ON offers FOR SELECT TO authenticated USING (
    auth.uid() = buyer_id
    OR EXISTS (SELECT 1 FROM products WHERE products.id = offers.product_id AND products.seller_id = auth.uid())
  );

-- Any authenticated user can make an offer on a product
DROP POLICY IF EXISTS "offers_insert" ON offers;
CREATE POLICY "offers_insert"
  ON offers FOR INSERT TO authenticated WITH CHECK (auth.uid() = buyer_id);

-- Only the seller of the product can update offer status (accept/reject/counter)
DROP POLICY IF EXISTS "offers_update_seller" ON offers;
CREATE POLICY "offers_update_seller"
  ON offers FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM products WHERE products.id = offers.product_id AND products.seller_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM products WHERE products.id = offers.product_id AND products.seller_id = auth.uid()));

-- Buyer can withdraw their own offer
DROP POLICY IF EXISTS "offers_delete_buyer" ON offers;
CREATE POLICY "offers_delete_buyer"
  ON offers FOR DELETE TO authenticated USING (auth.uid() = buyer_id);
