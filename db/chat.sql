-- Specialist–client chat: one thread per case
CREATE TABLE IF NOT EXISTS public.case_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_case_messages_case_id ON public.case_messages(case_id);
CREATE INDEX IF NOT EXISTS idx_case_messages_created_at ON public.case_messages(created_at);

-- RLS
ALTER TABLE public.case_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies so this script can be re-run safely
DROP POLICY IF EXISTS "Users can view messages in own case" ON public.case_messages;
DROP POLICY IF EXISTS "Users can send messages in own case" ON public.case_messages;
DROP POLICY IF EXISTS "Admins can view all case messages" ON public.case_messages;
DROP POLICY IF EXISTS "Admins can send messages to any case" ON public.case_messages;
DROP POLICY IF EXISTS "Users can view senders in own case messages" ON public.users;

-- Client: can read/write messages only for their own case
CREATE POLICY "Users can view messages in own case" ON public.case_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = case_messages.case_id AND cases.user_id = auth.uid()
    ) OR is_admin()
  );

CREATE POLICY "Users can send messages in own case" ON public.case_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = case_id AND cases.user_id = auth.uid()
    )
  );

-- Specialist (admin): can read/write messages for any case
CREATE POLICY "Admins can view all case messages" ON public.case_messages
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can send messages to any case" ON public.case_messages
  FOR INSERT WITH CHECK (is_admin());

-- Allow users to see sender names/roles for messages in their own case (so chat labels work)
CREATE POLICY "Users can view senders in own case messages" ON public.users
  FOR SELECT USING (
    auth.uid() = id
    OR is_admin()
    OR EXISTS (
      SELECT 1 FROM public.case_messages cm
      JOIN public.cases c ON c.id = cm.case_id AND c.user_id = auth.uid()
      WHERE cm.sender_id = users.id
    )
  );

-- Enable Supabase Realtime for this table (run in SQL Editor if using realtime)
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.case_messages;
