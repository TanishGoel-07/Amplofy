/*
# AMPLOFY Schema Part 2 — Messaging, Social, Community, Notifications

## Overview
Creates tables for conversations, messages, follows, favourites, posts, comments, likes, notifications, blocked users, reports, reviews, and verification requests.

## New Tables
1. conversations  2. messages  3. follows  4. favourite_products  5. favourite_sellers
6. posts  7. post_likes  8. comments  9. saved_posts  10. notifications
11. blocked_users  12. reports  13. reviews  14. verification_requests

## Security
- RLS on all tables with owner-scoped policies
- Conversations: both participants can access
- Social graph (follows, post_likes, comments) publicly readable
- Notifications, favourites, saved_posts, blocked_users: owner-scoped only
- Reports: owner can INSERT + SELECT own
- Reviews: publicly readable, reviewer owns their review
- Verification requests: owner-scoped only (sensitive)
*/

-- ============ CONVERSATIONS ============
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant1_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  participant2_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_title text,
  product_image text,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conv_p1 ON conversations(participant1_id);
CREATE INDEX IF NOT EXISTS idx_conv_p2 ON conversations(participant2_id);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "conv_select_participants" ON conversations;
CREATE POLICY "conv_select_participants"
  ON conversations FOR SELECT TO authenticated
  USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);

DROP POLICY IF EXISTS "conv_insert_participant" ON conversations;
CREATE POLICY "conv_insert_participant"
  ON conversations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = participant1_id OR auth.uid() = participant2_id);

DROP POLICY IF EXISTS "conv_update_participant" ON conversations;
CREATE POLICY "conv_update_participant"
  ON conversations FOR UPDATE TO authenticated
  USING (auth.uid() = participant1_id OR auth.uid() = participant2_id)
  WITH CHECK (auth.uid() = participant1_id OR auth.uid() = participant2_id);

-- ============ MESSAGES ============
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  text text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_msg_conv ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_msg_created ON messages(created_at DESC);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "msg_select_participants" ON messages;
CREATE POLICY "msg_select_participants"
  ON messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "msg_insert_sender" ON messages;
CREATE POLICY "msg_insert_sender"
  ON messages FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "msg_update_participant" ON messages;
CREATE POLICY "msg_update_participant"
  ON messages FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid())
    )
  );

-- ============ FOLLOWS ============
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  followee_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(follower_id, followee_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_followee ON follows(followee_id);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "follows_select_all" ON follows;
CREATE POLICY "follows_select_all"
  ON follows FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "follows_insert_own" ON follows;
CREATE POLICY "follows_insert_own"
  ON follows FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "follows_delete_own" ON follows;
CREATE POLICY "follows_delete_own"
  ON follows FOR DELETE TO authenticated USING (auth.uid() = follower_id);

-- ============ FAVOURITE PRODUCTS ============
CREATE TABLE IF NOT EXISTS favourite_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_favprod_user ON favourite_products(user_id);

ALTER TABLE favourite_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "favprod_select_own" ON favourite_products;
CREATE POLICY "favprod_select_own"
  ON favourite_products FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "favprod_insert_own" ON favourite_products;
CREATE POLICY "favprod_insert_own"
  ON favourite_products FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "favprod_delete_own" ON favourite_products;
CREATE POLICY "favprod_delete_own"
  ON favourite_products FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ FAVOURITE SELLERS ============
CREATE TABLE IF NOT EXISTS favourite_sellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, seller_id)
);

CREATE INDEX IF NOT EXISTS idxfavsell_user ON favourite_sellers(user_id);

ALTER TABLE favourite_sellers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "favsell_select_own" ON favourite_sellers;
CREATE POLICY "favsell_select_own"
  ON favourite_sellers FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "favsell_insert_own" ON favourite_sellers;
CREATE POLICY "favsell_insert_own"
  ON favourite_sellers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "favsell_delete_own" ON favourite_sellers;
CREATE POLICY "favsell_delete_own"
  ON favourite_sellers FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ POSTS ============
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  image text NOT NULL DEFAULT '',
  caption text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'product',
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  likes_count integer NOT NULL DEFAULT 0,
  comments_count integer NOT NULL DEFAULT 0,
  shares integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "posts_select_all" ON posts;
CREATE POLICY "posts_select_all"
  ON posts FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "posts_insert_own" ON posts;
CREATE POLICY "posts_insert_own"
  ON posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "posts_update_own" ON posts;
CREATE POLICY "posts_update_own"
  ON posts FOR UPDATE TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "posts_delete_own" ON posts;
CREATE POLICY "posts_delete_own"
  ON posts FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- ============ POST LIKES ============
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_postlikes_post ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_postlikes_user ON post_likes(user_id);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "postlikes_select_all" ON post_likes;
CREATE POLICY "postlikes_select_all"
  ON post_likes FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "postlikes_insert_own" ON post_likes;
CREATE POLICY "postlikes_insert_own"
  ON post_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "postlikes_delete_own" ON post_likes;
CREATE POLICY "postlikes_delete_own"
  ON post_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ COMMENTS ============
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(created_at DESC);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "comments_select_all" ON comments;
CREATE POLICY "comments_select_all"
  ON comments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "comments_insert_own" ON comments;
CREATE POLICY "comments_insert_own"
  ON comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "comments_delete_own" ON comments;
CREATE POLICY "comments_delete_own"
  ON comments FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- ============ SAVED POSTS ============
CREATE TABLE IF NOT EXISTS saved_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_savedposts_user ON saved_posts(user_id);

ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "savedposts_select_own" ON saved_posts;
CREATE POLICY "savedposts_select_own"
  ON saved_posts FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "savedposts_insert_own" ON saved_posts;
CREATE POLICY "savedposts_insert_own"
  ON saved_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "savedposts_delete_own" ON saved_posts;
CREATE POLICY "savedposts_delete_own"
  ON saved_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ NOTIFICATIONS ============
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  actor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  link text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifs_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifs_unread ON notifications(user_id) WHERE NOT read;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifs_select_own" ON notifications;
CREATE POLICY "notifs_select_own"
  ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifs_insert_own" ON notifications;
CREATE POLICY "notifs_insert_own"
  ON notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifs_update_own" ON notifications;
CREATE POLICY "notifs_update_own"
  ON notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifs_delete_own" ON notifications;
CREATE POLICY "notifs_delete_own"
  ON notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ BLOCKED USERS ============
CREATE TABLE IF NOT EXISTS blocked_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(blocker_id, blocked_id)
);

CREATE INDEX IF NOT EXISTS idx_blocks_blocker ON blocked_users(blocker_id);

ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blocks_select_own" ON blocked_users;
CREATE POLICY "blocks_select_own"
  ON blocked_users FOR SELECT TO authenticated USING (auth.uid() = blocker_id);

DROP POLICY IF EXISTS "blocks_insert_own" ON blocked_users;
CREATE POLICY "blocks_insert_own"
  ON blocked_users FOR INSERT TO authenticated WITH CHECK (auth.uid() = blocker_id);

DROP POLICY IF EXISTS "blocks_delete_own" ON blocked_users;
CREATE POLICY "blocks_delete_own"
  ON blocked_users FOR DELETE TO authenticated USING (auth.uid() = blocker_id);

-- ============ REPORTS ============
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  target_id text NOT NULL,
  target_name text NOT NULL DEFAULT '',
  reason text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'report-received',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON reports(reporter_id);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reports_select_own" ON reports;
CREATE POLICY "reports_select_own"
  ON reports FOR SELECT TO authenticated USING (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "reports_insert_own" ON reports;
CREATE POLICY "reports_insert_own"
  ON reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);

-- ============ REVIEWS ============
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL DEFAULT '',
  verified_transaction boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON reviews(reviewer_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_select_all" ON reviews;
CREATE POLICY "reviews_select_all"
  ON reviews FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "reviews_insert_own" ON reviews;
CREATE POLICY "reviews_insert_own"
  ON reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = reviewer_id);

DROP POLICY IF EXISTS "reviews_delete_own" ON reviews;
CREATE POLICY "reviews_delete_own"
  ON reviews FOR DELETE TO authenticated USING (auth.uid() = reviewer_id);

-- ============ VERIFICATION REQUESTS ============
CREATE TABLE IF NOT EXISTS verification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  student_type text NOT NULL DEFAULT 'college',
  campus text NOT NULL DEFAULT '',
  document_path text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_verif_user ON verification_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_verif_status ON verification_requests(status);

ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "verif_select_own" ON verification_requests;
CREATE POLICY "verif_select_own"
  ON verification_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "verif_insert_own" ON verification_requests;
CREATE POLICY "verif_insert_own"
  ON verification_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
