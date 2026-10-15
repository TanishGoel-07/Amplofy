/*
# Fix security advisor warnings

1. Revoke EXECUTE on handle_new_user() from anon and authenticated — it should only be called by the trigger, not via REST RPC.
2. Add search_path to set_updated_at() to fix mutable search_path warning.
*/

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
