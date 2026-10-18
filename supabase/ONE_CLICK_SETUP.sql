-- ============================================================================
-- AMPLOFY: COMPLETE ONE-CLICK SUPABASE DATABASE SETUP
-- Sets up all tables, storage buckets, RLS policies, and campus seed data.
-- Run this in Supabase SQL Editor (Ctrl + Enter)
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  username TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  avatar TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  campus TEXT NOT NULL DEFAULT '',
  college TEXT DEFAULT '',
  department TEXT DEFAULT '',
  year TEXT DEFAULT '',
  verified BOOLEAN NOT NULL DEFAULT false,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verification_status TEXT NOT NULL DEFAULT 'verified',
  account_type TEXT NOT NULL DEFAULT 'student' CHECK (account_type IN ('student', 'startup', 'buyer')),
  role TEXT NOT NULL DEFAULT 'buyer',
  course TEXT,
  year_of_study TEXT,
  interests TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  contact_whatsapp TEXT,
  contact_email TEXT,
  contact_instagram TEXT,
  show_contact BOOLEAN NOT NULL DEFAULT true,
  follower_count INTEGER NOT NULL DEFAULT 0,
  following_count INTEGER NOT NULL DEFAULT 0,
  listing_count INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(3,2) NOT NULL DEFAULT 5.0,
  review_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Safely allow standalone or auth IDs for demo profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- ============================================================================
-- 2. STARTUPS & STARTUP MEMBERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT NOT NULL DEFAULT '',
  cover_url TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Other',
  college TEXT NOT NULL DEFAULT '',
  team_size INTEGER NOT NULL DEFAULT 1,
  website TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  contact_whatsapp TEXT,
  contact_email TEXT,
  contact_instagram TEXT,
  show_contact BOOLEAN NOT NULL DEFAULT true,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  rating NUMERIC(3,2) NOT NULL DEFAULT 5.0,
  review_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.startup_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT,
  avatar_url TEXT,
  bio TEXT,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. LISTINGS (Products & Services)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_type TEXT NOT NULL DEFAULT 'student' CHECK (seller_type IN ('student', 'startup')),
  startup_id UUID REFERENCES public.startups(id) ON DELETE CASCADE,
  owner_type TEXT NOT NULL DEFAULT 'personal' CHECK (owner_type IN ('personal', 'startup')),
  type TEXT NOT NULL CHECK (type IN ('product', 'service')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  base_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  condition TEXT CHECK (condition IN ('New', 'Like New', 'Good', 'Fair', 'Pre-Owned', 'Digital', 'N/A')),
  delivery_days INTEGER DEFAULT 1,
  accepts_quotes BOOLEAN NOT NULL DEFAULT false,
  images TEXT[] DEFAULT '{}',
  location TEXT,
  campus TEXT,
  distance_miles NUMERIC(4,1) DEFAULT 0.5,
  status TEXT NOT NULL DEFAULT 'live' CHECK (status IN ('draft', 'pending_review', 'live', 'featured', 'paused', 'rejected', 'removed')),
  views INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(3,2) NOT NULL DEFAULT 5.0,
  review_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 4. SERVICE PACKAGES (3-Tier Packages)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.service_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('basic', 'standard', 'premium')),
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  delivery_days INTEGER NOT NULL DEFAULT 1,
  revisions INTEGER NOT NULL DEFAULT 1,
  description TEXT NOT NULL DEFAULT '',
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. ORDERS & QUOTES PIPELINE (7 Stages)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  package_id UUID REFERENCES public.service_packages(id) ON DELETE SET NULL,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  startup_id UUID REFERENCES public.startups(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('product', 'service', 'custom_quote')),
  status TEXT NOT NULL DEFAULT 'inquiry' CHECK (status IN (
    'inquiry', 'quote_sent', 'accepted', 'in_progress', 'delivered', 'completed', 'reviewed', 'cancelled'
  )),
  package_tier TEXT,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  requirements TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  startup_id UUID REFERENCES public.startups(id) ON DELETE SET NULL,
  scope_description TEXT NOT NULL,
  deliverables TEXT[] DEFAULT '{}',
  estimated_days INTEGER NOT NULL DEFAULT 3,
  quoted_amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- ============================================================================
-- 6. ORDER NOTES & DELIVERABLES (Chronological Pipeline)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.order_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT '',
  author_avatar TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  attachment_url TEXT,
  attachment_name TEXT,
  stage_transition TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 7. REVIEWS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL DEFAULT '',
  reviewer_avatar TEXT NOT NULL DEFAULT '',
  reviewee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 8. STARTUP "LOOKING FOR" SYSTEM
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.startup_looking_for (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'co-founder', 'designer-dev', 'marketing', 'beta-testers',
    'first-customers', 'product-feedback', 'startup-collab', 'other'
  )),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  skills_needed TEXT[] DEFAULT '{}',
  compensation_type TEXT NOT NULL CHECK (compensation_type IN (
    'equity', 'paid', 'stipend', 'revenue-share', 'free-product', 'college-credit', 'unpaid-collab'
  )),
  compensation_details TEXT,
  time_commitment TEXT NOT NULL,
  location_type TEXT NOT NULL DEFAULT 'hybrid' CHECK (location_type IN ('on-campus', 'remote', 'hybrid')),
  campus TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'filled', 'paused')),
  response_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.looking_for_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.startup_looking_for(id) ON DELETE CASCADE,
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_whatsapp TEXT,
  applicant_instagram TEXT,
  applicant_college TEXT,
  applicant_major TEXT,
  role_or_pitch TEXT NOT NULL,
  portfolio_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'connected', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 9. ENABLE RLS & CREATE POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_looking_for ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.looking_for_responses ENABLE ROW LEVEL SECURITY;

-- Public read policies for marketplace transparency
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profiles self insert" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Profiles self update" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Public startups read" ON public.startups FOR SELECT USING (true);
CREATE POLICY "Public startup_members read" ON public.startup_members FOR SELECT USING (true);
CREATE POLICY "Startups insert" ON public.startups FOR INSERT WITH CHECK (true);
CREATE POLICY "Startups update" ON public.startups FOR UPDATE USING (true);

CREATE POLICY "Public listings read" ON public.listings FOR SELECT USING (true);
CREATE POLICY "Listings insert" ON public.listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Listings update" ON public.listings FOR UPDATE USING (true);
CREATE POLICY "Listings delete" ON public.listings FOR DELETE USING (true);

CREATE POLICY "Public service_packages read" ON public.service_packages FOR SELECT USING (true);
CREATE POLICY "Service packages insert" ON public.service_packages FOR INSERT WITH CHECK (true);

CREATE POLICY "Public orders read" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Orders insert" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders update" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Public quotes read" ON public.quotes FOR SELECT USING (true);
CREATE POLICY "Quotes insert" ON public.quotes FOR INSERT WITH CHECK (true);

CREATE POLICY "Public order_notes read" ON public.order_notes FOR SELECT USING (true);
CREATE POLICY "Order notes insert" ON public.order_notes FOR INSERT WITH CHECK (true);

CREATE POLICY "Public reviews read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Reviews insert" ON public.reviews FOR INSERT WITH CHECK (true);

CREATE POLICY "Public looking_for read" ON public.startup_looking_for FOR SELECT USING (true);
CREATE POLICY "Looking for insert" ON public.startup_looking_for FOR INSERT WITH CHECK (true);
CREATE POLICY "Looking for update" ON public.startup_looking_for FOR UPDATE USING (true);
CREATE POLICY "Looking for delete" ON public.startup_looking_for FOR DELETE USING (true);

CREATE POLICY "Public responses read" ON public.looking_for_responses FOR SELECT USING (true);
CREATE POLICY "Responses insert" ON public.looking_for_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Responses update" ON public.looking_for_responses FOR UPDATE USING (true);

-- ============================================================================
-- 10. STORAGE BUCKETS SETUP
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('listing-images', 'listing-images', true),
  ('startup-assets', 'startup-assets', true),
  ('deliverables', 'deliverables', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public storage read" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Authenticated storage insert" ON storage.objects FOR INSERT WITH CHECK (true);

-- ============================================================================
-- 11. SEED CAMPUS DEMO DATA
-- ============================================================================
DO $$
DECLARE
  s1 uuid := '11111111-1111-4111-a111-111111111111';
  s2 uuid := '22222222-2222-4222-a222-222222222222';
  s3 uuid := '33333333-3333-4333-a333-333333333333';
  s4 uuid := '44444444-4444-4444-a444-444444444444';
  s5 uuid := '55555555-5555-4555-a555-555555555555';
  s6 uuid := '66666666-6666-4666-a666-666666666666';
  s7 uuid := '77777777-7777-4777-a777-777777777777';

  st1 uuid := 'b1111111-1111-4111-b111-111111111111';
  st2 uuid := 'b2222222-2222-4222-b222-222222222222';
  st3 uuid := 'b3333333-3333-4333-b333-333333333333';
  st4 uuid := 'b4444444-4444-4444-b444-444444444444';
  st7 uuid := 'b7777777-7777-4777-b777-777777777777';
BEGIN
  -- Seed Students
  INSERT INTO public.profiles (id, name, username, email, avatar, bio, location, campus, college, department, year, is_verified, verified, verification_status, account_type, contact_whatsapp, contact_email, contact_instagram, show_contact, rating, review_count)
  VALUES
  (s1, 'Alex Johnson', 'alexj', 'alex.j@campus.edu', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300', 'Senior Math & CS major. Passionate calculus tutor and peer mentor.', 'North Quad', 'Main Campus', 'Stanford University', 'Mathematics', 'Senior (Year 4)', true, true, 'verified', 'student', '+1 555-0191', 'alex.j@campus.edu', 'alexj_math', true, 4.9, 28),
  (s2, 'Maya Chen', 'mayachen', 'maya.c@campus.edu', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300', 'Fine Arts Junior. Campus event photographer, portraits and club shoots.', 'Arts District', 'West Campus', 'UC Berkeley', 'Fine Arts', 'Junior (Year 3)', true, true, 'verified', 'student', '+1 555-0192', 'maya.chen@campus.edu', 'mayachen.photos', true, 5.0, 34),
  (s3, 'David Wu', 'davidwu', 'david.w@campus.edu', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300', 'CS Sophomore. Fullstack developer building web apps & student MVPs.', 'Tech Hub', 'Main Campus', 'MIT', 'Computer Science', 'Sophomore (Year 2)', true, true, 'verified', 'startup', '+1 555-0193', 'david@nexustech.io', 'davidwu_dev', true, 4.8, 19),
  (s4, 'Ryan Cooper', 'ryancooper', 'ryan.c@campus.edu', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300', 'Business Freshman with a spacious truck. Stress-free dorm moves and logistics.', 'South Hall', 'East Campus', 'UT Austin', 'Business Administration', 'Freshman (Year 1)', true, true, 'verified', 'student', '+1 555-0194', 'ryan.c@campus.edu', 'ryancoop_moves', true, 4.7, 15),
  (s5, 'Sophia Lane', 'sophialane', 'sophia.l@campus.edu', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300', 'Fashion & Apparel Senior. Ethical streetwear designer and brand founder.', 'SoHo Studio', 'Manhattan', 'Parsons / NYU', 'Fashion Design', 'Senior (Year 4)', true, true, 'verified', 'startup', '+1 555-0195', 'collab@threadcraft.app', 'sophialane_apparel', true, 5.0, 42),
  (s7, 'Sarah Mitchell', 'sarahm', 'sarah.m@campus.edu', 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=300', 'Design Dept Year 3. UI/UX designer and branding consultant for student startups.', 'Design Studios', 'Central Campus', 'RISD / Brown', 'Industrial Design', 'Junior (Year 3)', true, true, 'verified', 'startup', '+1 555-0197', 'sarah@pulsedesign.co', 'sarahmitchell_ux', true, 4.9, 39)
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    college = EXCLUDED.college;

  -- Seed Startups
  INSERT INTO public.startups (id, owner_id, name, slug, logo_url, cover_url, tagline, description, category, college, team_size, website, contact_whatsapp, contact_email, contact_instagram, show_contact, is_verified, rating, review_count)
  VALUES
  (st1, s3, 'TechNexus Labs', 'technexus-labs', 'https://images.pexels.com/photos/256514/pexels-photo-256514.jpeg?auto=compress&cs=tinysrgb&w=200', 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Fullstack MVPs and web applications built by MIT CS students.', 'We build high-performance mobile apps, SaaS web platforms, and automated tools for university organizations and campus ventures.', 'Development', 'MIT', 4, 'https://technexus.dev', '+1 555-0193', 'contact@technexus.dev', 'technexus_labs', true, true, 4.9, 24),
  (st2, s7, 'PulseDesign Studio', 'pulsedesign-studio', 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=200', 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Strategic brand identities, pitch decks, and Figma prototypes for founders.', 'An award-winning student design agency specializing in pitch deck presentations, mobile app UI/UX, and visual identities.', 'Design', 'RISD / Brown', 3, 'https://pulsedesign.co', '+1 555-0197', 'hello@pulsedesign.co', 'pulsedesign_co', true, true, 5.0, 38),
  (st4, s4, 'DormMove Express', 'dormmove-express', 'https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=200', 'https://images.pexels.com/photos/4506249/pexels-photo-4506249.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Affordable, reliable moving & summer storage for campus residents.', 'Equipped with transport vans and heavy dollies. We load, haul, store, and unpack dorm rooms seamlessly.', 'Labor', 'UT Austin', 6, 'https://dormmove.co', '+1 555-0194', 'help@dormmove.co', 'dormmove_express', true, true, 4.8, 45),
  (st7, s5, 'ThreadCraft Campus', 'threadcraft-campus', 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=200', 'https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Sustainable collegiate streetwear and custom student-designed drops.', 'Student-founded ethical apparel brand crafting limited heavyweight drops, custom campus club merch, and streetwear.', 'Fashion', 'Parsons / NYU', 2, 'https://threadcraft.app', '+1 555-0195', 'collab@threadcraft.app', 'threadcraft_campus', true, true, 4.9, 29)
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline;

  -- Seed Looking For Requests
  INSERT INTO public.startup_looking_for (id, startup_id, type, title, description, skills_needed, compensation_type, compensation_details, time_commitment, location_type, campus, status, response_count)
  VALUES
  ('a1111111-0000-0000-0000-000000000001', st7, 'designer-dev', 'Looking for a Streetwear & Graphic Apparel Designer for Fall Capsule', 'We are a student-run sustainable streetwear label on campus. We need a creative student designer skilled in typography, screenprint vector art, and tech packs.', ARRAY['Figma', 'Illustrator', 'Streetwear Fashion', 'Tech Packs', 'Typography'], 'revenue-share', '12% profit share per collection piece sold + free custom wardrobe', '5-8 hrs/week', 'hybrid', 'Union Square', 'open', 3),
  ('a1111111-0000-0000-0000-000000000002', st1, 'co-founder', 'Seeking Technical Co-Founder (AI / Python & Next.js) for Student GPA Copilot', 'Building an AI study companion that ingests canvas course syllabi. We need an entrepreneurial student engineer to co-lead system architecture.', ARRAY['Python', 'Next.js', 'FastAPI', 'LangChain / LLMs', 'PostgreSQL'], 'equity', '15-20% Founder Equity Pool', '10-15 hrs/week', 'hybrid', 'MIT Stata Center', 'open', 5),
  ('a1111111-0000-0000-0000-000000000003', st4, 'marketing', 'Looking for 4 Campus Marketing & TikTok Growth Collaborators', 'Help us scale dorm move-in bookings. Create viral packing TikToks/Reels and manage student ambassador referral program.', ARRAY['TikTok / Reels', 'Campus Marketing', 'Community Outreach'], 'paid', '$20/hour + $15 per booking referral commission', '4-6 hrs/week', 'on-campus', 'UT Austin Campus', 'open', 4)
  ON CONFLICT (id) DO NOTHING;

END $$;
