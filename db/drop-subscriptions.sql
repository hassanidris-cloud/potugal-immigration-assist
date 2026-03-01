-- Remove subscriptions table (payment/package is now arranged via contact after signup)
-- Run this in Supabase Dashboard → SQL Editor after backing up if needed.

DROP TABLE IF EXISTS public.subscriptions;
