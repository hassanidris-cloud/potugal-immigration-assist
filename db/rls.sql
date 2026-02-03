-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_checklist ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (is_admin());

-- Cases policies
CREATE POLICY "Users can view own cases" ON public.cases
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Users can create own cases" ON public.cases
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update any case" ON public.cases
  FOR UPDATE USING (is_admin());

-- Documents policies
CREATE POLICY "Users can view documents in own cases" ON public.documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = documents.case_id
      AND (cases.user_id = auth.uid() OR is_admin())
    )
  );

CREATE POLICY "Users can upload documents to own cases" ON public.documents
  FOR INSERT WITH CHECK (
    (uploaded_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = case_id AND cases.user_id = auth.uid()
    )) OR is_admin()
  );

CREATE POLICY "Admins can insert documents" ON public.documents
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update documents" ON public.documents
  FOR UPDATE USING (is_admin());

-- Comments policies
CREATE POLICY "Users can view comments on accessible documents" ON public.comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.documents
      JOIN public.cases ON documents.case_id = cases.id
      WHERE documents.id = comments.document_id
      AND (cases.user_id = auth.uid() OR is_admin())
    )
  );

CREATE POLICY "Users can create comments on accessible documents" ON public.comments
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.documents
      JOIN public.cases ON documents.case_id = cases.id
      WHERE documents.id = document_id
      AND (cases.user_id = auth.uid() OR is_admin())
    )
  );

-- Checklist templates policies (admin only for write, all can read)
CREATE POLICY "Anyone can view checklist templates" ON public.checklist_templates
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage checklist templates" ON public.checklist_templates
  FOR ALL USING (is_admin());

-- Case checklist policies
CREATE POLICY "Users can view checklist in own cases" ON public.case_checklist
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = case_checklist.case_id
      AND (cases.user_id = auth.uid() OR is_admin())
    )
  );

CREATE POLICY "Users can update checklist in own cases" ON public.case_checklist
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.cases
      WHERE cases.id = case_checklist.case_id
      AND cases.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all checklists" ON public.case_checklist
  FOR ALL USING (is_admin());
