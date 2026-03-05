-- Reviews table: only signed-in users can write a review
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved/public reviews (for now: all reviews are public)
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

-- Only authenticated users can insert their own review
CREATE POLICY "Authenticated users can create own review" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update or delete only their own review (optional: one review per user)
CREATE POLICY "Users can update own review" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own review" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);
