/*
# AMPLOFY Storage Buckets

## Overview
Creates two storage buckets:
1. **listing-images** — PUBLIC bucket for product listing images. Anyone can view; only authenticated users can upload to their own folder.
2. **verification-documents** — PRIVATE bucket for student verification documents. Only the owning user can read their own documents; no public access.

## Security
### listing-images (public read, owner write)
- SELECT (read): public (anon + authenticated)
- INSERT (upload): authenticated users, only to their own folder path `user_id/...`
- UPDATE: only owner's files
- DELETE: only owner's files

### verification-documents (private, owner-only read, owner-only write)
- SELECT: only the owning user
- INSERT: only the owning user
- UPDATE: only the owning user
- DELETE: only the owning user (and admins in future)
*/

-- Create the public bucket for listing images
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create the private bucket for verification documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('verification-documents', 'verification-documents', false)
ON CONFLICT (id) DO NOTHING;

-- ============ listing-images policies ============
-- Public read
DROP POLICY IF EXISTS "listing_images_read_public" ON storage.objects;
CREATE POLICY "listing_images_read_public"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'listing-images');

-- Authenticated users can upload to their own folder (user_id/...)
DROP POLICY IF EXISTS "listing_images_upload_own" ON storage.objects;
CREATE POLICY "listing_images_upload_own"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'listing-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Only owner can update their files
DROP POLICY IF EXISTS "listing_images_update_own" ON storage.objects;
CREATE POLICY "listing_images_update_own"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'listing-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'listing-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Only owner can delete their files
DROP POLICY IF EXISTS "listing_images_delete_own" ON storage.objects;
CREATE POLICY "listing_images_delete_own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'listing-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============ verification-documents policies ============
-- Only owner can read their documents
DROP POLICY IF EXISTS "verif_docs_read_own" ON storage.objects;
CREATE POLICY "verif_docs_read_own"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'verification-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Only owner can upload
DROP POLICY IF EXISTS "verif_docs_upload_own" ON storage.objects;
CREATE POLICY "verif_docs_upload_own"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'verification-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Only owner can update
DROP POLICY IF EXISTS "verif_docs_update_own" ON storage.objects;
CREATE POLICY "verif_docs_update_own"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'verification-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'verification-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Only owner can delete
DROP POLICY IF EXISTS "verif_docs_delete_own" ON storage.objects;
CREATE POLICY "verif_docs_delete_own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'verification-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
