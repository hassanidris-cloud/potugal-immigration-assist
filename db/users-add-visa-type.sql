-- Store visa type chosen at signup; only admin can change it later.
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS visa_type TEXT;

COMMENT ON COLUMN public.users.visa_type IS 'Visa type chosen at signup; dashboard/checklist customized for this. Only admin can change.';
